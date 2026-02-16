import { NextRequest, NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
// Import your amplify_outputs if needed for server-side config
// import outputs from "@/amplify_outputs.json";

const client = generateClient<Schema>({ authMode: "apiKey" });

export async function POST(req: NextRequest) {
    try {
        const { answers } = await req.json();

        // 1. Fetch real data from Amplify
        const { data: allUnis } = await client.models.Employment.list();

        // 2. Prepare the prompt for the AI
        // We send a subset of data to stay within token limits
        const uniContext = allUnis.map(u => ({
            id: u.id,
            name: u.uniName,
            course: u.uniCourse,
            employment: u.employment?.workOnly,
            unemployment: u.employment?.unemployment,
            study: u.employment?.studyOnly
        }));

        const prompt = `
            Act as a University Career Consultant. 
            User Preferences: ${JSON.stringify(answers)}
            Available University Data: ${JSON.stringify(uniContext)}

            Based on the user's goal (e.g., high salary vs further study), identify the TOP 3 matches.
            Return ONLY a JSON object with this structure:
            {
                "topMatch": { "id": "...", "reason": "...", "score": 98 },
                "alternatives": [{ "id": "...", "score": 92 }, { "id": "...", "score": 88 }]
            }
        `;

        // 3. Call your AI Model (e.g., OpenAI or Bedrock)
        // This is a placeholder for your AI call logic
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const result = await aiResponse.json();
        const recommendation = JSON.parse(result.choices[0].message.content);

        // 4. Enrich recommendation with full DB data
        const enrichedTopMatch = {
            ...allUnis.find(u => u.id === recommendation.topMatch.id),
            reason: recommendation.topMatch.reason,
            score: recommendation.topMatch.score
        };

        return NextResponse.json(enrichedTopMatch);
    } catch (error) {
        console.error("Match Error:", error);
        return NextResponse.json({ error: "Failed to match" }, { status: 500 });
    }
}