import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

// Simple client initialization
const client = generateClient<Schema>({ authMode: "apiKey" });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { answers } = body;

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return Response.json({ error: "API Key missing" }, { status: 500 });
        }

        // 1. Fetch raw data from Amplify
        const { data: allRecords } = await client.models.Employment.list();

        if (!allRecords || allRecords.length === 0) {
            return Response.json({ error: "No data found" }, { status: 404 });
        }

        // 2. Map data for AI context (keeping it small)
        const uniContext = allRecords.map(u => ({
            id: u.id,
            name: u.uniName,
            course: u.uniCourse,
            work: u.employment?.workOnly,
            study: u.employment?.studyOnly,
        }));

        const prompt = `
You are a professional student consultant. Find the best university match.
Student Goal: ${answers.priority?.label}
Setting: ${answers.environment?.label}

Database:
${JSON.stringify(uniContext.slice(0, 20))} 

Return ONLY a JSON object: {"id": "MATCH_ID", "score": 98, "insight": "Summary and 3 points"}

Rules:
No bold text. No special characters like ** or |. 
Use ➡️ for summary. 
Use emojis for these 3 numbered points: 1. Match 🏆 2. Strategy 🎯 3. Future 🚀.
        `;

        // 3. Groq Call
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const json = await groqRes.json();
        const aiResponse = JSON.parse(json.choices[0].message.content);

        // 4. Find the matching record
        const winningUni = allRecords.find(u => u.id === aiResponse.id);

        return Response.json({
            ...winningUni,
            score: aiResponse.score,
            reason: aiResponse.insight
        });

    } catch (err: any) {
        console.error("Match Error:", err);
        return Response.json({ error: "Internal error" }, { status: 500 });
    }
}