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

// Types matching your simple Amplify + Groq response
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
        question: "Define your primary objective",
        sub: "We'll align your choice with specific institutional strengths.",
        options: [
            { label: "Immediate Employment", icon: Wallet, value: "workOnly", desc: "Focus on high job placement rates" },
            { label: "Academic Research", icon: BookOpen, value: "studyOnly", desc: "Focus on postgraduate progression" },
            { label: "Professional Growth", icon: Briefcase, value: "balanced", desc: "A mix of industry and learning" },
        ]
    },
    {
        id: "environment",
        question: "Select your preferred hub",
        sub: "Regional clusters often dictate industry networking depth.",
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
            setResult(data);
        } catch (error) {
            console.error("Match error:", error);
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
            <div className="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center relative">

                {/* Visual Depth Background */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

                <div className="w-full max-w-2xl relative z-10">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="quiz-flow"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                            >
                                {isCalculating ? (
                                    <div className="py-24 flex flex-col items-center justify-center text-center">
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full" />
                                            <Loader2 className="w-14 h-14 text-blue-500 animate-spin relative z-10" />
                                        </div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-2">Analyzing Data</h2>
                                        <p className="text-gray-500 text-sm font-medium">Groq AI is cross-referencing your goals with the database...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-12">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="h-1 w-12 rounded-full bg-blue-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Step {currentStep + 1} of {STEPS.length}</span>
                                            </div>
                                            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{STEPS[currentStep].question}</h2>
                                            <p className="text-gray-500 text-sm font-medium">{STEPS[currentStep].sub}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {STEPS[currentStep].options.map((option) => (
                                                <button
                                                    key={option.label}
                                                    onClick={() => handleSelect(STEPS[currentStep].id, option)}
                                                    className="group flex items-center justify-between p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/[0.02] transition-all"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-4 rounded-2xl bg-white/[0.03] text-gray-500 group-hover:text-blue-400 transition-colors">
                                                            <option.icon className="w-6 h-6" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-lg font-bold text-white group-hover:text-blue-50 transition-colors">{option.label}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{option.desc}</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-800 group-hover:text-blue-500 transition-all" />
                                                </button>
                                            ))}
                                        </div>

                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="mt-10 flex items-center gap-2 text-gray-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                                            >
                                                <Undo2 className="w-4 h-4" /> Go Back
                                            </button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            /* THE RESULT PAGE */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 w-full"
                            >
                                <div className="bg-[#050505] border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                        <Fingerprint size={200} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                                Optimal Match: {result.score}%
                                            </div>
                                            <Stars className="text-yellow-500 w-4 h-4 animate-pulse" />
                                        </div>

                                        <h3 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter leading-[0.9]">
                                            {result.uniName}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-12">
                                            <MapPin className="w-4 h-4 text-blue-500" /> {result.uniCourse}
                                        </div>

                                        {/* AI Analysis Container */}
                                        <div className="p-8 bg-blue-500/[0.03] border border-blue-500/10 rounded-[2.5rem] mb-12 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                            <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                                <Sparkles size={14} /> AI Consultant Insight
                                            </div>
                                            {result.reason}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-12">
                                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 text-center">
                                                <div className="text-[10px] font-bold text-gray-600 uppercase mb-2 tracking-widest">Employment</div>
                                                <div className="text-3xl font-black text-white">{result.employment?.workOnly || "N/A"}</div>
                                            </div>
                                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 text-center">
                                                <div className="text-[10px] font-bold text-gray-600 uppercase mb-2 tracking-widest">Unemployment</div>
                                                <div className="text-3xl font-black text-red-500/80">{result.employment?.unemployment || "N/A"}</div>
                                            </div>
                                        </div>

                                        {/* Button Grid */}
                                        <div className="flex flex-col gap-4">
                                            {/* Primary Navigation */}
                                            <Link
                                                href={`/employment/${result.id}`}
                                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-center hover:bg-blue-500 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                            >
                                                Intelligence Report <ExternalLink className="w-4 h-4" />
                                            </Link>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Check More Button */}
                                                <Link
                                                    href={`/employment/${result.id}`}
                                                    className="flex-1 py-5 bg-white/[0.05] border border-white/10 text-white rounded-2xl font-black hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.1em]"
                                                >
                                                    <Search className="w-4 h-4 text-blue-400" /> Check More
                                                </Link>

                                                {/* Restart Button */}
                                                <button
                                                    onClick={resetQuiz}
                                                    className="flex-1 py-5 bg-white/[0.02] border border-white/5 text-gray-500 rounded-2xl font-black hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-[0.1em]"
                                                >
                                                    <RefreshCcw className="w-4 h-4" /> New Search
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