import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { uni, course, employment } = body;

        // Load Groq API key from Secrets Manager
        const secrets = new SecretsManagerClient({});
        const secret = await secrets.send(
            new GetSecretValueCommand({ SecretId: "deepseek-api-key" })
        );

        if (!secret.SecretString) {
            throw new Error("SecretString is undefined");
        }

        // Parse secret (supports any JSON shape)
        let apiKey: string | undefined;
        try {
            const parsed = JSON.parse(secret.SecretString);
            const firstKey = Object.keys(parsed)[0];
            apiKey = parsed[firstKey];
        } catch {
            apiKey = secret.SecretString;
        }

        if (!apiKey) {
            throw new Error("Could not extract Groq API key");
        }

        const prompt = `
Generate insights about graduate outcomes.

University: ${uni}
Course: ${course}

Employment Data:
- Work Only: ${employment.workOnly}
- Work and Study: ${employment.workAndStudy}
- Study Only: ${employment.studyOnly}
- Unemployment: ${employment.unemployment}
- Response Rate: ${employment.responseRate}

Provide a clear, friendly summary for a prospective student.
    `;

        // Call Groq's OpenAI-compatible API
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const json = await groqRes.json();

        if (!groqRes.ok) {
            console.error("Groq error:", json);
            throw new Error(json.error?.message || "Groq request failed");
        }

        return Response.json({
            insight: json.choices[0].message.content
        });

    } catch (err: any) {
        console.error("Insight API error:", err);
        return Response.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
