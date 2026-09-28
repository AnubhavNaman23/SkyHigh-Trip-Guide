import { db } from './firebaseAdmin';
import { TravelItem } from '@/types';

type CategoryFilters = {
    from?: string;
    to?: string;
    car?: string;
};

const normalizeLocation = (value?: string) => {
    if (!value) return undefined;
    return value
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const normalizeTerm = (value?: string) => {
    if (!value) return undefined;
    return String(value).trim().toLowerCase();
};

// Fetch data for a specific category with pagination and optional filters
export const getCategoryData = async (
    category: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: CategoryFilters
): Promise<{ data: TravelItem[], total: number }> => {
    if (!db) {
        console.warn(`[SkyHigh] Firestore not available — returning empty ${category} data.`);
        return { data: [], total: 0 };
    }
    // TypeScript narrowing: db is guaranteed non-null from this point
    const firestore = db;
    try {
        console.log(`Fetching ${category} from Firestore (Server-Side) - Page ${page}, Limit ${limit}...`);

        const normalizedFilters: CategoryFilters = {
            from: normalizeLocation(filters?.from),
            to: normalizeLocation(filters?.to),
            car: normalizeTerm(filters?.car)
        };

        const compareFilters = {
            from: normalizedFilters.from?.toLowerCase(),
            to: normalizedFilters.to?.toLowerCase(),
            car: normalizedFilters.car
        };

        const matchValue = (val?: unknown) => {
            if (val === null || val === undefined) return undefined;
            return String(val).trim().toLowerCase();
        };

        const filterInMemory = async (reason?: unknown) => {
            if (reason) {
                console.warn('Filtered query failed, falling back to in-memory filter:', (reason as Error)?.message || reason);
            }

            console.log('Normalized filters:', normalizedFilters, 'Compare filters:', compareFilters);

            const fallbackLimit = 1000;
            const fallbackSnapshot = await firestore.collection(category).limit(fallbackLimit).get();
            const allDocs = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as FirebaseFirestore.DocumentData) } as TravelItem));

            const filtered = allDocs.filter(doc => {
                const docFrom = matchValue((doc as unknown as TravelItem).from);
                const docTo = matchValue((doc as unknown as TravelItem).to);
                const subtitleValue = matchValue((doc as unknown as TravelItem).subtitle);
                const subtitleCity = subtitleValue?.split(',')[0]?.trim();
                const titleValue = matchValue((doc as unknown as TravelItem).title);
                const detailsValue = Array.isArray((doc as unknown as TravelItem).details) ? (doc as unknown as TravelItem).details.join(' ').toLowerCase() : '';

                if (compareFilters.from) {
                    const matchesFrom = docFrom === compareFilters.from;
                    const matchesTitleFrom = !!titleValue && titleValue.includes(compareFilters.from);
                    const matchesSubtitleFrom = !!subtitleValue && (subtitleValue.includes(compareFilters.from) || subtitleCity === compareFilters.from);
                    if (!matchesFrom && !matchesTitleFrom && !matchesSubtitleFrom) return false;
                }

                if (compareFilters.to) {
                    const matchesTo = docTo === compareFilters.to;
                    const matchesSubtitle = !!subtitleValue && (subtitleValue.includes(compareFilters.to) || subtitleCity === compareFilters.to);
                    if (!matchesTo && !matchesSubtitle) return false;
                }

                if (compareFilters.car) {
                    const carTerm = compareFilters.car;
                    const matchesTitle = !!titleValue && titleValue.includes(carTerm);
                    const matchesDetails = !!detailsValue && detailsValue.includes(carTerm);
                    const matchesSubtitle = !!subtitleValue && subtitleValue.includes(carTerm);
                    if (!matchesTitle && !matchesDetails && !matchesSubtitle) return false;
                }

                return true;
            });

            const total = filtered.length;
            const start = (page - 1) * limit;
            const paged = filtered.slice(start, start + limit);

            return { data: paged, total };
        };

        const needsLocationFallback = category === 'hotels' && !!compareFilters.to;
        const needsCarFallback = category === 'cabs' && !!compareFilters.car;

        if (needsLocationFallback || needsCarFallback) {
            return filterInMemory();
        }

        let baseQuery: FirebaseFirestore.Query = firestore.collection(category);

        if (normalizedFilters.from) {
            baseQuery = baseQuery.where('from', '==', normalizedFilters.from);
        }

        if (normalizedFilters.to) {
            baseQuery = baseQuery.where('to', '==', normalizedFilters.to);
        }

        // Try server-side count + paginated query first. If Firestore rejects
        // (e.g., missing composite index), fall back to fetching a broader set
        // and filter in-memory.
        try {
            const countSnapshot = await baseQuery.count().get();
            const total = countSnapshot.data().count ?? 0;

            const offset = (page - 1) * limit;
            let paginatedQuery = baseQuery;

            if (offset > 0) {
                paginatedQuery = paginatedQuery.offset(offset);
            }

            paginatedQuery = paginatedQuery.limit(limit);

            const snapshot = await paginatedQuery.get();

            const data: TravelItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TravelItem));

            return { data, total };
        } catch (qErr) {
            return filterInMemory(qErr);
        }
    } catch (error) {
        console.error(`Error fetching ${category} from Firestore:`, error);
        return { data: [], total: 0 };
    }
};

// Get all data (all categories) - fetching first 100 items per category
export const getAllData = async () => {
    const [flights, hotels, trains, buses, cabs] = await Promise.all([
        getCategoryData('flights', 1, 100),
        getCategoryData('hotels', 1, 100),
        getCategoryData('trains', 1, 100),
        getCategoryData('buses', 1, 100),
        getCategoryData('cabs', 1, 100),
    ]);

    return {
        flights: flights.data,
        hotels: hotels.data,
        trains: trains.data,
        buses: buses.data,
        cabs: cabs.data,
    };
};

// Get limited data for home page
export const getHomeData = async () => {
    const [flights, hotels] = await Promise.all([
        getCategoryData('flights', 1, 4),
        getCategoryData('hotels', 1, 4),
    ]);

    return {
        flights: flights.data,
        hotels: hotels.data,
    };
};

// Get a single item by ID and type
export const getItemById = async (
    category: string,
    id: string
): Promise<TravelItem | null> => {
    if (!db) {
        console.warn(`[SkyHigh] Firestore not available — cannot fetch ${category}/${id}.`);
        return null;
    }
    const firestore = db;
    try {
        console.log(`Fetching item ${id} from ${category} (Server-Side)...`);
        const docSnap = await firestore.collection(category).doc(id).get();

        if (docSnap.exists) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as TravelItem;
        } else {
            console.warn(`Item ${id} not found in ${category}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching item ${id} from ${category}:`, error);
        return null;
    }
};
