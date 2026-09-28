import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API Key key missing");
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const systemPrompt = `You are Orbit, a helpful and enthusiastic AI travel assistant. 
      Your goal is to help users plan their trips by asking genuine, thoughtful questions to understand their preferences, budget, and interests.
      
      Guidelines:
      - Be natural, conversational, and friendly.
      - Don't just list places; try to understand the "vibe" the user is looking for.
      - Ask one or two clarifying questions at a time to narrow down options (e.g., "Are you looking for a relaxing beach vacation or an adventurous mountain trek?", "What kind of budget do you have in mind?").
      - Consider constraints like time, budget, and travel companions.
      - Keep your responses concise but helpful.
      - Use emojis sparingly but effectively to add personality. 🪐
      
      Current Context: The user is asking for help planning a trip.`;

        // Transform messages to Gemini format if needed, or primarily use the last message with context.
        // Simple approach: Feed history as context.

        const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
            systemInstruction: systemPrompt,
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastMessage);

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
