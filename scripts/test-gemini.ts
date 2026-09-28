import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config({ path: '.env' });

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Testing gemini-2.5-flash-lite...");
        try {
            const modelFlashLite = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            const resultFlashLite = await modelFlashLite.generateContent("Hello");
            console.log("gemini-2.5-flash-lite works:", resultFlashLite.response.text());
        } catch (e: unknown) { console.log("gemini-2.5-flash-lite failed:", (e as Error).message.split('[')[0]); }

        console.log("Testing gemini-2.5-flash-lite-001...");
        try {
            const modelFlashLite001 = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-001" });
            const resultFlashLite001 = await modelFlashLite001.generateContent("Hello");
            console.log("gemini-2.5-flash-lite-001 works:", resultFlashLite001.response.text());
        } catch (e: unknown) { console.log("gemini-2.5-flash-lite-001 failed:", (e as Error).message.split('[')[0]); }

    } catch (error: unknown) {
        console.error("Error:", (error as Error).message);
    }
}

listModels();
