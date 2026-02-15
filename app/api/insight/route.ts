

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { uni, course, employment } = body;

        // ✅ USE THIS:
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("Environment variable GROQ_API_KEY is not set");
            return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        // ... rest of your fetch logic

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
dont use characters like | -  ** - ** and dont show many calculations.
u can use bullet points to define a heading.
dont make headings like 1. **Employment Landscape** instsed just use 1.and not the **.
again dont make it like **Friendly Summary** dont use ** in any case, for summary use ➡️.
u can also use emoji for every heading or point.
instead of - ** u can use numbered points like 1. 2. and so on.
u can write longer insights to properly explain the stats.
stay and act like a very professional consultant for students.
Provide a clear, friendly summary for a prospective student.
        `;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "groq/compound",
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
