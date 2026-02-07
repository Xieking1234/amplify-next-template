"use client";

import { useState } from "react";
import WorkButton from "@/components/animata/button/work-button";

type GenerateInsightProps = {
    universityId: string;
    courseId: string;
};

export default function GenerateInsight({ universityId, courseId }: GenerateInsightProps) {
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setInsight("");
        try {
            const res = await fetch(
                `http://localhost:4000/employment/${universityId}/course/${courseId}/insight`,
                { method: "POST" }
            );

            if (!res.ok) throw new Error("Failed to generate insight");

            const data = await res.json();
            setInsight(data.insight);
        } catch (err) {
            console.error(err);
            setInsight("Error generating insight. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <WorkButton onClick={handleGenerate} disabled={loading} />
            {insight && (
                <div className="mt-4 max-w-xl p-4 bg-gray-50 rounded shadow text-gray-900 text-center">
                    {insight}
                </div>
            )}
        </div>
    );
}
