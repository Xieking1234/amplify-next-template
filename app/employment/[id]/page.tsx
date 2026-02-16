"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect, useState, useRef } from "react";
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
    const [loading, setLoading] = useState(true); // ⭐ Added main loading state

    const insightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchRecord() {
            try {
                const { data } = await client.models.Employment.get({ id });
                setRecord(data);
            } catch (error) {
                console.error("Error fetching record:", error);
            } finally {
                setLoading(false); // ⭐ Stop loading whether successful or not
            }
        }
        if (id) fetchRecord();
    }, [id]);

    useEffect(() => {
        if (insight && insightRef.current) {
            insightRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [insight]);

    // ⭐ NEW: Refined Loading Animation (Matches Leaderboard)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="animate-pulse font-medium tracking-wide">Retrieving Institution Data...</p>
                </div>
            </div>
        );
    }

    if (!record || !record.employment) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                    No employment data found for this selection.
                </div>
            </div>
        );
    }

    const toNumber = (value?: string | null) =>
        value ? Number(value.replace("%", "")) : 0;

    const uni = record.uniName;
    const course = record.uniCourse;
    const employment = record.employment;

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
                    disabled={loadingInsight}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50
                               text-white rounded-xl transition-all shadow-lg shadow-blue-500/20
                               font-semibold tracking-wide flex items-center gap-2"
                >
                    {loadingInsight ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                        </>
                    ) : "Generate AI Insight"}
                </button>
            </div>

            {/* ⭐ AI Insight Output */}
            {insight && (
                <div
                    ref={insightRef}
                    className="mt-12 mx-auto max-w-3xl p-8
                                rounded-2xl shadow-2xl mb-32 text-white
                                backdrop-blur-2xl
                                border border-white/10
                                bg-gradient-to-br from-white/10 to-white/5
                                animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                    <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" />
                        AI Analysis
                    </h2>
                    <p className="leading-relaxed text-gray-200 whitespace-pre-line font-medium">
                        {insight}
                    </p>
                </div>
            )}
        </PageWrapper>
    );
}