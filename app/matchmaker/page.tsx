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
    CheckCircle2
} from "lucide-react";

// Types based on your Amplify Schema
type MatchResult = {
    id: string;
    uniName: string;
    uniCourse: string;
    reason: string;
    score: number;
    employment?: {
        workOnly: string;
        studyOnly: string;
    };
};

const STEPS = [
    {
        id: "priority",
        question: "What is your primary goal after graduation?",
        sub: "This helps the AI weight employment stats vs. further study potential.",
        options: [
            { label: "High Salary & Work", icon: Wallet, value: "workOnly", desc: "Focus on immediate employment rates" },
            { label: "Research & Masters", icon: BookOpen, value: "studyOnly", desc: "Focus on further study transitions" },
            { label: "Career Flexibility", icon: Briefcase, value: "balanced", desc: "A mix of work and continued learning" },
        ]
    },
    {
        id: "environment",
        question: "Which setting fits your lifestyle?",
        sub: "Location data helps us narrow down regional powerhouses.",
        options: [
            { label: "Global Tech Hubs", icon: Target, value: "urban", desc: "London, Manchester, Birmingham" },
            { label: "Specialist Campus", icon: CheckCircle2, value: "campus", desc: "Research-led dedicated sites" },
        ]
    }
];

export default function AIMatchmakerPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<MatchResult | null>(null);

    const handleSelect = async (stepId: string, value: any) => {
        const updatedAnswers = { ...answers, [stepId]: value };
        setAnswers(updatedAnswers);

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await getAIMatch(updatedAnswers);
        }
    };

    const getAIMatch = async (finalAnswers: any) => {
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
            <div className="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center overflow-hidden">

                {/* Background Glows */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

                {/* Header */}
                <header className="text-center mb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Sparkles className="w-4 h-4" /> AI Matchmaker Engine
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Perfect Fit</span>
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto font-medium">
                        Our AI analyzes thousands of employment data points to match you with a university based on your specific career DNA.
                    </p>
                </header>

                <div className="w-full max-w-3xl relative z-10">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="quiz"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative"
                            >
                                {/* Progress Indicator */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
                                    {STEPS.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-2 w-12 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/10'}`}
                                        />
                                    ))}
                                </div>

                                {isCalculating ? (
                                    <div className="py-20 flex flex-col items-center justify-center">
                                        <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-6" />
                                        <h2 className="text-2xl font-bold text-white animate-pulse">Consulting the Database...</h2>
                                        <p className="text-gray-500 mt-2">Weighting outcomes for {answers.priority?.label}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h2 className="text-3xl font-bold text-white mb-2">{STEPS[currentStep].question}</h2>
                                            <p className="text-gray-400 text-sm font-medium">{STEPS[currentStep].sub}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {STEPS[currentStep].options.map((option) => (
                                                <button
                                                    key={option.label}
                                                    onClick={() => handleSelect(STEPS[currentStep].id, option)}
                                                    className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="p-4 rounded-2xl bg-white/5 text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl">
                                                            <option.icon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white">{option.label}</div>
                                                            <div className="text-xs text-gray-500 group-hover:text-gray-400 font-medium">{option.desc}</div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>

                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="mt-10 flex items-center gap-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
                                            >
                                                <Undo2 className="w-4 h-4" /> Go Back
                                            </button>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            /* RESULTS ENGINE VIEW */
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                                    <Sparkles className="absolute -right-6 -top-6 w-56 h-56 opacity-10 rotate-12" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                                                Match Probability: {result.score}%
                                            </div>
                                            <Trophy className="w-8 h-8 text-yellow-400" />
                                        </div>

                                        <h3 className="text-5xl font-black mb-2 tracking-tighter leading-tight">{result.uniName}</h3>
                                        <div className="flex items-center gap-2 text-purple-100 font-bold mb-8">
                                            <MapPin className="w-4 h-4" /> {result.uniCourse}
                                        </div>

                                        <div className="p-6 bg-black/20 rounded-[2rem] border border-white/10 mb-10">
                                            <h4 className="text-[10px] font-black uppercase text-purple-200 mb-2 tracking-widest flex items-center gap-2">
                                                <Target className="w-3 h-3" /> AI Analysis
                                            </h4>
                                            <p className="text-white text-lg font-medium leading-relaxed italic">
                                                "{result.reason}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                                <div className="text-[10px] font-bold text-purple-200 uppercase mb-1">Employment</div>
                                                <div className="text-2xl font-black">{result.employment?.workOnly}</div>
                                            </div>
                                            <div className="bg-white/10 rounded-2xl p-4 text-center">
                                                <div className="text-[10px] font-bold text-purple-200 uppercase mb-1">Study Ratio</div>
                                                <div className="text-2xl font-black">{result.employment?.studyOnly}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4">
                                            <Link
                                                href={`/employment/${result.id}`}
                                                className="flex-1 py-5 bg-white text-purple-600 rounded-2xl font-black text-center hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                Full Intelligence Report <ExternalLink className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={resetQuiz}
                                                className="px-8 py-5 border border-white/30 rounded-2xl font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                            >
                                                <RefreshCcw className="w-4 h-4" /> Retake
                                            </button>
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