import { NextResponse } from 'next/server';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { db, admin } from '@/lib/firebaseAdmin';
import {
    TripItinerary,
    TripPlannerForm,
    TripPlannerResponse,
    TravelItem
} from '@/types';

export const runtime = 'nodejs';

const COLLECTION_LIMIT = 10;
// Gemini configuration
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
const PLANNER_CACHE_TTL = Number(process.env.PLANNER_CACHE_TTL_MS ?? 1000 * 60 * 5);
const MODEL_ITEMS_LIMIT = Number(process.env.MODEL_ITEMS_LIMIT ?? 3);

type TransportCollections = 'flights' | 'trains' | 'buses';

const requiredFields: Array<keyof TripPlannerForm> = [
    'origin',
    'destination',
    'startDate',
    'endDate',
    'budget',
    'travelers',
    'travelGroup',
    'travelStyle'
];

const ensureNumber = (value: unknown) => {
    const parsed = typeof value === 'string' ? Number(value) : value;
    return typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : null;
};

const sanitizeString = (value: unknown) =>
    typeof value === 'string' ? value.trim() : '';

const validatePayload = (payload: Partial<TripPlannerForm>) => {
    const errors: string[] = [];

    requiredFields.forEach((field) => {
        if (
            payload[field] === undefined ||
            payload[field] === null ||
            (typeof payload[field] === 'string' &&
                sanitizeString(payload[field]).length === 0)
        ) {
            errors.push(`Missing field: ${field}`);
        }
    });

    if (payload.budget !== undefined && ensureNumber(payload.budget) === null) {
        errors.push('Budget must be a number');
    }

    if (payload.travelers !== undefined && ensureNumber(payload.travelers) === null) {
        errors.push('Travelers must be a number');
    }

    return errors;
};

const fetchCollection = async (
    collectionName: TransportCollections | 'hotels',
    filters: Array<{ field: 'from' | 'to'; value?: string }>,
    limit = COLLECTION_LIMIT
) => {
    if (!db) {
        return [];
    }
    try {
        let ref: admin.firestore.Query<admin.firestore.DocumentData> = db.collection(collectionName);

        filters.forEach(({ field, value }) => {
            if (value) {
                ref = ref.where(field, '==', value);
            }
        });

        const snapshot = await ref.limit(limit).get();
        if (!snapshot.empty) {
            return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>) => {
                const d = doc.data() as TravelItem;
                return { ...d, id: doc.id };
            });
        }

        const fallbackSnapshot = await db
            .collection(collectionName)
            .limit(limit)
            .get();
        return fallbackSnapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>) => {
            const d = doc.data() as TravelItem;
            return { ...d, id: doc.id };
        });
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
};

const rankOptions = (items: TravelItem[]) =>
    [...items].sort((a, b) => {
        const priceDiff = (a.price ?? Infinity) - (b.price ?? Infinity);
        if (priceDiff !== 0) return priceDiff;
        return (b.rating ?? 0) - (a.rating ?? 0);
    });

const compactForModel = (items: TravelItem[], limit = MODEL_ITEMS_LIMIT) =>
    rankOptions(items)
        .slice(0, limit)
        .map(
            ({ id, title, subtitle, price, rating, details, from, to }) => ({
                id,
                title,
                subtitle,
                price,
                rating,
                from,
                to,
                highlights: details?.slice(0, 2) ?? []
            })
        );

const buildModelInventory = (selections: {
    flights: TravelItem[];
    trains: TravelItem[];
    buses: TravelItem[];
    hotels: TravelItem[];
}) => ({
    flights: compactForModel(selections.flights),
    trains: compactForModel(selections.trains),
    buses: compactForModel(selections.buses),
    hotels: compactForModel(selections.hotels)
});

type PlannerCacheEntry = {
    expiresAt: number;
    response: TripPlannerResponse;
};

const plannerCache = new Map<string, PlannerCacheEntry>();

const buildCacheKey = (
    form: TripPlannerForm,
    selections: { flights: TravelItem[]; trains: TravelItem[]; buses: TravelItem[]; hotels: TravelItem[] }
) =>
    JSON.stringify({
        origin: form.origin,
        destination: form.destination,
        dates: [form.startDate, form.endDate],
        budget: form.budget,
        travelers: form.travelers,
        travelGroup: form.travelGroup,
        travelStyle: form.travelStyle,
        interests: form.interests.slice().sort(),
        inventory: {
            flights: selections.flights.map((item) => item.id),
            trains: selections.trains.map((item) => item.id),
            buses: selections.buses.map((item) => item.id),
            hotels: selections.hotels.map((item) => item.id)
        }
    });

const stripJsonFence = (value: string) =>
    value.replace(/```json/gi, '').replace(/```/g, '').trim();

const safeJsonParse = (value: string) => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const getTripLength = (start: string, end: string) => {
    try {
        const diff =
            differenceInCalendarDays(parseISO(end), parseISO(start)) + 1;
        if (!Number.isFinite(diff) || diff <= 0) {
            return 3;
        }
        return Math.min(6, Math.max(3, diff));
    } catch {
        return 3;
    }
};

const buildFallbackItinerary = (
    form: TripPlannerForm,
    hotels: TravelItem[]
): TripItinerary => {
    const length = getTripLength(form.startDate, form.endDate);
    const activitiesPool =
        form.interests.length > 0
            ? form.interests
            : ['Local culture', 'Food crawl', 'Hidden gems'];

    const dailyPlan = Array.from({ length }, (_, index) => {
        const dayNumber = index + 1;
        return {
            day: `Day ${dayNumber}`,
            title: `Discover ${form.destination}`,
            summary: `Mix of ${activitiesPool[index % activitiesPool.length]} experiences with time to recharge.`,
            activities: [
                `Morning: ${activitiesPool[index % activitiesPool.length]} exploration`,
                `Afternoon: Free time / guided tour`,
                'Evening: Sunset spot + local dinner'
            ],
            dining: [
                `Try a signature dish inspired by ${form.destination}`,
                'Bookable tasting menu or casual cafe'
            ]
        };
    });

    return {
        overview: `Curated ${length}-day ${form.travelStyle} trip for ${form.travelers} traveler(s) going from ${form.origin} to ${form.destination}.`,
        budgetBreakdown: {
            transport: Math.round(form.budget * 0.35),
            stays: Math.round(form.budget * 0.4),
            experiences: Math.round(form.budget * 0.25)
        },
        tips: [
            `Reserve ${hotels[0]?.title ?? 'your preferred stay'
            } at least 2 weeks ahead for better rates.`,
            'Keep e-tickets synced in one wallet for seamless boarding.',
            'Use off-peak slots for popular sights to avoid long queues.'
        ],
        dailyPlan
    };
};

const buildAiItinerary = async (
    form: TripPlannerForm,
    selections: {
        flights: TravelItem[];
        trains: TravelItem[];
        buses: TravelItem[];
        hotels: TravelItem[];
    }
): Promise<TripItinerary> => {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API Key missing, using fallback.');
        return buildFallbackItinerary(form, selections.hotels);
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const systemPrompt = `You are SkyHigh AI, a premium travel planning concierge. Craft concise, personalized travel plans and respond only in valid JSON with the schema:
{
  "overview": "string",
  "budgetBreakdown": { "transport": number, "stays": number, "experiences": number },
  "tips": ["string", "..."],
  "dailyPlan": [
    {
      "day": "Day 1",
      "title": "string",
      "summary": "string",
      "activities": ["string", "..."],
      "dining": ["string", "..."]
    }
  ]
}`;

        const userPrompt = `
Trip request:
- From: ${form.origin}
- To: ${form.destination}
- Dates: ${form.startDate} → ${form.endDate}
- Travelers: ${form.travelers} (${form.travelGroup})
- Style: ${form.travelStyle}
- Budget: ₹${form.budget}
- Interests: ${form.interests.join(', ') || 'general highlights'}

Transport / stay options to consider (top picks already sorted for you):
${JSON.stringify(buildModelInventory(selections))}

Deliver a JSON plan (no commentary) referencing the strongest options.`;

        const result = await model.generateContent([
            systemPrompt,
            userPrompt
        ]);

        const responseText = result.response.text();
        const content = stripJsonFence(responseText);

        const parsed = safeJsonParse(content);
        if (parsed?.dailyPlan) {
            return parsed as TripItinerary;
        }

        throw new Error('Invalid itinerary shape from Gemini');
    } catch (error) {
        console.error('AI itinerary generation failed:', error);
        return buildFallbackItinerary(form, selections.hotels);
    }
};

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<TripPlannerForm>;
        const errors = validatePayload(body);
        if (errors.length > 0) {
            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const form: TripPlannerForm = {
            origin: sanitizeString(body.origin),
            destination: sanitizeString(body.destination),
            startDate: sanitizeString(body.startDate),
            endDate: sanitizeString(body.endDate),
            budget: ensureNumber(body.budget) ?? 0,
            travelers: ensureNumber(body.travelers) ?? 1,
            travelGroup: body.travelGroup ?? 'friends',
            travelStyle: body.travelStyle ?? 'balanced',
            interests: Array.isArray(body.interests)
                ? body.interests
                    .map((interest) => sanitizeString(interest))
                    .filter(Boolean)
                : []
        };

        const [flights, trains, buses, hotels] = await Promise.all([
            fetchCollection('flights', [
                { field: 'from', value: form.origin },
                { field: 'to', value: form.destination }
            ]),
            fetchCollection('trains', [
                { field: 'from', value: form.origin },
                { field: 'to', value: form.destination }
            ]),
            fetchCollection('buses', [
                { field: 'from', value: form.origin },
                { field: 'to', value: form.destination }
            ]),
            fetchCollection('hotels', [{ field: 'to', value: form.destination }])
        ]);

        const inventory = { flights, trains, buses, hotels };
        console.log(`[AI-TRIP] Fetched inventory: Flights=${flights.length}, Trains=${trains.length}, Buses=${buses.length}, Hotels=${hotels.length}`);
        const tripDays = getTripLength(form.startDate, form.endDate);
        const nights = Math.max(1, tripDays - 1);

        // Budget allocations - same as fallback; we use these to filter inventory
        const transportBudget = Math.round(form.budget * 0.35);
        const staysBudget = Math.round(form.budget * 0.4);
        // budget allocation for experiences kept for possible future use
        // experiences allocation intentionally omitted from active filtering

        const perPersonTransportBudget = Math.max(0, Math.floor(transportBudget / Math.max(1, form.travelers)));
        const perNightHotelBudget = Math.max(0, Math.floor(staysBudget / Math.max(1, nights)));

        // Filter / rank inventory so cheaper options are preferred while keeping fallback
        const filterByBudgetOrFallback = (items: TravelItem[]) => {
            // Return all items sorted by price/rating (cheapest first). 
            // We previously filtered strictly by budget, but this hid valid upgrade options from the user.
            // The AI still only sees the top few (cheapest) due to buildModelInventory limits.
            return rankOptions(items);
        };

        const flightsFiltered = filterByBudgetOrFallback(inventory.flights);
        const trainsFiltered = filterByBudgetOrFallback(inventory.trains);
        const busesFiltered = filterByBudgetOrFallback(inventory.buses);
        const hotelsFiltered = filterByBudgetOrFallback(inventory.hotels);
        console.log(`[AI-TRIP] Filtered Hotels: ${hotelsFiltered.length} (Budget per night: ${perNightHotelBudget})`);
        const cacheKey = buildCacheKey(form, inventory);
        const cached = plannerCache.get(cacheKey);
        const now = Date.now();

        if (cached && cached.expiresAt > now) {
            return NextResponse.json(cached.response, { status: 200, headers: { 'x-trip-cache': 'hit' } });
        }

        const itinerary = await buildAiItinerary(form, { flights: flightsFiltered, trains: trainsFiltered, buses: busesFiltered, hotels: hotelsFiltered });

        // Estimate cheapest combination to check budget
        const cheapestTransport = [flightsFiltered, trainsFiltered, busesFiltered]
            .flat()
            .reduce((acc, cur) => (acc == null || (cur.price ?? Infinity) < (acc.price ?? Infinity) ? cur : acc), null as TravelItem | null);
        const cheapestHotel = hotelsFiltered.reduce((acc, cur) => (acc == null || (cur.price ?? Infinity) < (acc.price ?? Infinity) ? cur : acc), null as TravelItem | null);
        const minTransportCost = (cheapestTransport?.price ?? 0) * form.travelers;
        const minHotelCost = (cheapestHotel?.price ?? 0) * nights;
        const estimatedTotal = minTransportCost + minHotelCost;
        const overBudget = estimatedTotal > form.budget;

        const response: TripPlannerResponse = {
            itinerary,
            transportOptions: {
                flights: flightsFiltered,
                trains: trainsFiltered,
                buses: busesFiltered
            },
            hotelOptions: hotelsFiltered,
            budgetSummary: {
                overBudget,
                estimatedTotal,
                budget: form.budget,
                suggestedTransportId: cheapestTransport?.id,
                suggestedHotelId: cheapestHotel?.id
            }
        };

        plannerCache.set(cacheKey, {
            expiresAt: now + PLANNER_CACHE_TTL,
            response
        });

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('AI trip planner failed:', error);
        return NextResponse.json(
            { error: 'Unable to generate trip at the moment' },
            { status: 500 }
        );
    }
}
