
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { tripContext, day, userPrompt } = await req.json();

        if (!tripContext || !day || !userPrompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const prompt = `
            You are an expert travel planner.
            The user is unsatisfied with a specific day in their itinerary and wants to replan it.
            
            Trip Context:
            - Destination: ${tripContext.destination}
            - Travelers: ${tripContext.travelers}
            - Original Itinerary Overview: ${tripContext.overview}

            Current Day Plan (Day ${day.day}):
            - Title: ${day.title}
            - Summary: ${day.summary}
            - Activities: ${day.activities.join(', ')}

            User Request: "${userPrompt}"

            Please regenerate this specific day's plan (Day ${day.day}) based on the user's request.
            Keep the format consistent.
            
            Return ONLY a valid JSON object with the following structure:
            {
                "day": "${day.day}",
                "title": "New Day Title",
                "summary": "New detailed summary...",
                "activities": ["Activity 1", "Activity 2", "Activity 3"],
                "dining": ["Restaurant 1", "Restaurant 2"]
            }
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // simple extraction
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const newDayPlan = JSON.parse(jsonStr);

        return NextResponse.json({ newDayPlan });

    } catch (error) {
        console.error('AI Replan Error:', error);
        return NextResponse.json({ error: 'Failed to replan day' }, { status: 500 });
    }
}
