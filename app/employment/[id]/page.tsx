"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

import TextBorderAnimation from "@/components/animata/text/text-border-animation";
import UnderlineHoverText from "@/components/animata/text/underline-hover-text";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import CalorieCounter from "@/components/animata/graphs/calorie-counter";

Amplify.configure(outputs);

const client = generateClient<Schema>({
    authMode: "apiKey",
});

export default function EmploymentPage() {
    const params = useParams();
    const idParam = params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    const [record, setRecord] = useState<Schema["Employment"]["type"] | null>(null);
    const [insight, setInsight] = useState<string | null>(null);
    const [loadingInsight, setLoadingInsight] = useState(false);

    useEffect(() => {
        async function fetchRecord() {
            const { data } = await client.models.Employment.get({ id });
            setRecord(data);
        }
        fetchRecord();
    }, [id]);

    if (!record) return <div className="p-10">Loading...</div>;
    if (!record.employment) return <div className="p-10">No employment data found</div>;

    const toNumber = (value?: string | null) =>
        value ? Number(value.replace("%", "")) : 0;

    const uni = record.uniName;
    const course = record.uniCourse;
    const employment = record.employment;

    // ⭐ NEW: Generate AI Insight
    async function generateInsight() {
        setLoadingInsight(true);
        setInsight(null);

        const res = await fetch("/api/insight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uni,
                course,
                employment,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setInsight("Error: " + (data.error || "Unknown error"));
            setLoadingInsight(false);
            return;
        }

        setInsight(data.insight);

        setLoadingInsight(false);
    }

    return (
        <PageWrapper>
            <div className="flex justify-center mt-20">
                <UnderlineHoverText text={uni ?? ""} />
            </div>

            <div className="flex justify-center mt-20">
                <TextBorderAnimation
                    text={course ?? ""}
                    size="text-3xl"
                    className="text-white"
                />
            </div>

            <div className="flex justify-center gap-10 mt-20">
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(employment.workOnly)}
                    image="/uni-Photoroom.png"
                    statDescription="Employment Rate"
                    description="Graduates who are Employed"
                />
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(employment.workAndStudy)}
                    image="/uni-Photoroom.png"
                    statDescription="Internship Rate"
                    description="Graduates employed and pursuing higher studies"
                />
            </div>

            <div className="flex justify-center gap-10 mt-20">
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(employment.studyOnly)}
                    image="/uni-Photoroom.png"
                    statDescription="Higher Study"
                    description="Graduates pursuing higher studies"
                />
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(employment.unemployment)}
                    image="/uni-Photoroom.png"
                    statDescription="Unemployment Rate"
                    description="Graduates who are Unemployed"
                />
            </div>

            {/* ⭐ AI Insight Button */}
            <div className="flex justify-center mt-16">
                <button
                    onClick={generateInsight}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Generate AI Insight
                </button>
            </div>

            {/* ⭐ Loading State */}
            {loadingInsight && (
                <p className="mt-10 text-center text-gray-300">Generating insight...</p>
            )}

            {/* ⭐ AI Insight Output */}
            {insight && (
                <div className="mt-10 mx-auto max-w-3xl p-6 bg-gray-900 text-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">AI Insight</h2>
                    <p className="leading-relaxed whitespace-pre-line">{insight}</p>
                </div>
            )}
        </PageWrapper>
    );
}
