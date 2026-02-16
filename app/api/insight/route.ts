export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Destructure all possible fields
        const { uni, course, employment, type, data } = body;

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("Environment variable GROQ_API_KEY is not set");
            return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        let prompt = "";

        // ⭐ CHECK IF THIS IS A COMPARISON REQUEST
        if (type === "comparison" && Array.isArray(data)) {
            const uniList = data.map((u: any, i: number) =>
                `${i + 1}. ${u.name} (${u.course}): Work: ${u.employment}, Unemployment: ${u.unemployment}`
            ).join("\n");

            prompt = `
You are a highly professional student consultant. Compare these universities:
${uniList}

➡️ Summary: Analyze which university provides the best career start.
1. Comparative Advantage 📊
2. Risk Assessment ⚠️
3. Final Verdict 🏆

Rules:
No characters like | - or **. 
No bold text at all. 
Use numbered points 1. 2. 
Use emojis for headings.
Use ➡️ for the summary.
            `;
        } else {
            // ⭐ STANDARD SINGLE UNIVERSITY LOGIC
            // Added ?. safety to prevent the 'workOnly' undefined crash
            prompt = `
Generate insights about graduate outcomes.

University: ${uni}
Course: ${course}

Employment Data:
- Work Only: ${employment?.workOnly || "N/A"}
- Work and Study: ${employment?.workAndStudy || "N/A"}
- Study Only: ${employment?.studyOnly || "N/A"}
- Unemployment: ${employment?.unemployment || "N/A"}
- Response Rate: ${employment?.responseRate || "N/A"}

➡️ Summary: Provide a clear, friendly summary for a prospective student.
1. Employment Landscape 🏢
2. Academic Progression 📚
3. Market Competitiveness 📈

Rules:
Dont use characters like | -  ** - ** and dont show many calculations.
Dont make headings like 1. **Heading**. Just use 1. Heading.
Dont use ** in any case. For summary use ➡️.
Use emoji for every heading.
Use numbered points like 1. 2.
Stay and act like a very professional consultant for students.
            `;
        }

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Or your preferred Groq model
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