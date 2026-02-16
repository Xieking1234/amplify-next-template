"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import Link from "next/link";
import {
    Sparkles,
    ArrowRight,
    Undo2,
    Wallet,
    BookOpen,
    Briefcase,
    Target,
    Loader2,
    Trophy,
    MapPin,
    ExternalLink,
    RefreshCcw,
    Fingerprint,
    Compass,
    Stars,
    Search
} from "lucide-react";

type MatchResult = {
    id: string;
    uniName: string;
    uniCourse: string;
    reason: string;
    score: number;
    employment?: {
        workOnly: string;
        studyOnly: string;
        unemployment: string;
    };
};

const STEPS = [
    {
        id: "priority",
        question: "Define your objective",
        sub: "We'll align your choice with specific institutional strengths.",
        options: [
            { label: "Immediate Employment", icon: Wallet, value: "workOnly", desc: "Focus on job placement rates" },
            { label: "Academic Research", icon: BookOpen, value: "studyOnly", desc: "Focus on postgraduate progression" },
            { label: "Professional Growth", icon: Briefcase, value: "balanced", desc: "A mix of industry and learning" },
        ]
    },
    {
        id: "environment",
        question: "Select your hub",
        sub: "Regional clusters often dictate networking depth.",
        options: [
            { label: "Urban Tech Centers", icon: Target, value: "urban", desc: "Metropolitan networking hubs" },
            { label: "Dedicated Campuses", icon: Compass, value: "campus", desc: "Focused research environments" },
        ]
    }
];

export default function MatchmakerPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);

    const handleSelect = async (stepId: string, option: any) => {
        const updatedAnswers = { ...answers, [stepId]: option };
        setAnswers(updatedAnswers);
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            generateMatch(updatedAnswers);
        }
    };

    const generateMatch = async (finalAnswers: any) => {
        setIsCalculating(true);
        try {
            const response = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: finalAnswers }),
            });
            const data = await response.json();

            if (data.error) {
                console.error("Match Error:", data.error);
                return;
            }

            setResult(data);
        } catch (error) {
            console.error("Connection error:", error);
        } finally {
            setIsCalculating(false);
        }
    };

    const resetQuiz = () => {
        setResult(null);
        setCurrentStep(0);
        setAnswers({});
    };

    return (
        <PageWrapper>
            <div className="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center relative overflow-hidden">

                {/* Mirror Aesthetic Background Orbs */}
                <div className="fixed top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 blur-[100px] rounded-full -z-10" />
                <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/20 blur-[100px] rounded-full -z-10" />

                <div className="w-full max-w-2xl relative z-10">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="bg-white/10 border border-white/40 backdrop-blur-[40px] rounded-[3rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
                            >
                                {isCalculating ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center">
                                        <Loader2 className="w-12 h-12 text-blue-500/50 animate-spin mb-6" />
                                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-[0.3em]">Processing</h2>
                                        <p className="text-gray-400 text-[10px] mt-2 font-medium">Consulting Groq AI Intelligence...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-12">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-[2px] w-6 bg-blue-400/50" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/60">Module {currentStep + 1}</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{STEPS[currentStep].question}</h2>
                                            <p className="text-gray-500 text-sm font-medium">{STEPS[currentStep].sub}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {STEPS[currentStep].options.map((option) => (
                                                <button
                                                    key={option.label}
                                                    onClick={() => handleSelect(STEPS[currentStep].id, option)}
                                                    className="group flex items-center justify-between p-5 rounded-2xl bg-white/20 border border-white/40 hover:border-white/80 hover:bg-white/40 transition-all shadow-sm"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-xl bg-white/40 text-blue-500 shadow-sm border border-white/50">
                                                            <option.icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-base font-bold text-gray-800">{option.label}</div>
                                                            <div className="text-[11px] text-gray-400 font-medium">{option.desc}</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all" />
                                                </button>
                                            ))}
                                        </div>

                                        {currentStep > 0 && (
                                            <button onClick={() => setCurrentStep(currentStep - 1)} className="mt-8 flex items-center gap-2 text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest transition-all">
                                                <Undo2 className="w-3 h-3" /> Back
                                            </button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            /* THE MIRROR RESULT PAGE */
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-full">
                                <div className="bg-white/10 border border-white/50 backdrop-blur-[50px] rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="px-3 py-1 rounded-full bg-white/30 border border-white/50 text-blue-600 text-[9px] font-black uppercase tracking-widest">
                                                Match Probability: {result.score}%
                                            </div>
                                            <Stars className="text-blue-400/40 w-4 h-4" />
                                        </div>

                                        <h3 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter leading-none">{result.uniName}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-12">
                                            <MapPin className="w-4 h-4 text-blue-400/60" /> {result.uniCourse}
                                        </div>

                                        {/* Transparent Insight Box */}
                                        <div className="p-8 bg-white/10 border border-white/30 rounded-[2.5rem] mb-12 text-gray-600 leading-relaxed text-sm whitespace-pre-wrap font-medium ring-1 ring-white/20 shadow-inner">
                                            <div className="flex items-center gap-2 text-blue-600/70 font-black text-[10px] uppercase tracking-widest mb-4">
                                                <Sparkles size={14} /> AI Analysis
                                            </div>
                                            {result.reason}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-12">
                                            <div className="bg-white/20 rounded-3xl p-6 border border-white/40 text-center shadow-sm backdrop-blur-md">
                                                <div className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">Employment</div>
                                                <div className="text-3xl font-black text-gray-800">{result.employment?.workOnly || "N/A"}</div>
                                            </div>
                                            <div className="bg-white/20 rounded-3xl p-6 border border-white/40 text-center shadow-sm backdrop-blur-md">
                                                <div className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">Postgrad</div>
                                                <div className="text-3xl font-black text-blue-500/60">{result.employment?.studyOnly || "N/A"}</div>
                                            </div>
                                        </div>

                                        {/* Light Mirror Actions */}
                                        <div className="flex flex-col gap-3">
                                            <Link
                                                href={`/employment/${result.id}`}
                                                className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-black text-center hover:bg-blue-600 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-200"
                                            >
                                                Intelligence Report <ExternalLink className="w-4 h-4" />
                                            </Link>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Link
                                                    href={`/employment/${result.id}`}
                                                    className="flex-1 py-4 bg-white/30 border border-white/50 text-gray-700 rounded-[2rem] font-black hover:bg-white/50 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.1em]"
                                                >
                                                    <Search className="w-3 h-3 text-blue-400" /> Check More
                                                </Link>

                                                <button
                                                    onClick={resetQuiz}
                                                    className="flex-1 py-4 bg-white/10 border border-white/20 text-gray-400 rounded-[2rem] font-black hover:bg-red-50/50 hover:text-red-400 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.1em]"
                                                >
                                                    <RefreshCcw className="w-3 h-3" /> New Search
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
}