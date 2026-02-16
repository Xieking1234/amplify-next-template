"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import Link from "next/link";
import {
    Search, ArrowUpDown, ChevronDown, Trophy,
    ExternalLink, X, Scale, Crown, RotateCcw,
    Download, Loader2, Sparkles
} from "lucide-react";
import { toPng } from 'html-to-image';

const client = generateClient<Schema>({ authMode: "apiKey" });

const toNumber = (value?: string | null) =>
    value ? Number(value.replace("%", "")) : 0;

export default function RankingsPage() {
    const [records, setRecords] = useState<Schema["Employment"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    // AI & Filter States
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("All Courses");
    const [sortOrder, setSortOrder] = useState<"high-low" | "low-high">("high-low");
    const [isCourseOpen, setIsCourseOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showCompareOverlay, setShowCompareOverlay] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const downloadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchAll() {
            try {
                const { data } = await client.models.Employment.list();
                setRecords(data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        }
        fetchAll();
    }, []);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsCourseOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const resetFilters = () => {
        setSearchQuery("");
        setCourseFilter("All Courses");
        setSortOrder("high-low");
    };

    const isFilterActive = searchQuery !== "" || courseFilter !== "All Courses" || sortOrder !== "high-low";

    const uniqueCourses = useMemo(() => {
        const courses = records.map((r) => r.uniCourse).filter(Boolean) as string[];
        return ["All Courses", ...Array.from(new Set(courses))];
    }, [records]);

    const processedRecords = useMemo(() => {
        let result = records.filter((uni) => {
            const searchStr = searchQuery.toLowerCase();
            const matchesSearch = uni.uniName?.toLowerCase().includes(searchStr) || uni.uniCourse?.toLowerCase().includes(searchStr);
            const matchesCourse = courseFilter === "All Courses" || uni.uniCourse === courseFilter;
            return matchesSearch && matchesCourse;
        });
        return result.sort((a, b) => {
            const rateA = toNumber(a.employment?.workOnly);
            const rateB = toNumber(b.employment?.workOnly);
            return sortOrder === "high-low" ? rateB - rateA : rateA - rateB;
        });
    }, [records, searchQuery, courseFilter, sortOrder]);

    const selectedRecords = useMemo(() => records.filter(r => selectedIds.includes(r.id)), [records, selectedIds]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const getStatColor = (val: number, arr: number[], inverted = false) => {
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        if (max === min) return "text-white";
        if (inverted) return val === min ? "text-green-400" : (val === max ? "text-red-400" : "text-gray-500");
        return val === max ? "text-green-400" : (val === min ? "text-red-400" : "text-gray-500");
    };

    const winnerId = useMemo(() => {
        if (selectedRecords.length < 2) return null;
        const scores: Record<string, number> = {};
        selectedIds.forEach(id => scores[id] = 0);
        selectedRecords.forEach(r => {
            scores[r.id] += toNumber(r.employment?.workOnly) * 2;
            scores[r.id] -= toNumber(r.employment?.unemployment) * 1.5;
        });
        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    }, [selectedRecords, selectedIds]);

    const generateAIComparison = async () => {
        setIsGenerating(true);
        try {
            const comparisonData = selectedRecords.map(r => ({
                name: r.uniName,
                employment: r.employment?.workOnly,
                unemployment: r.employment?.unemployment
            }));
            const response = await fetch("/api/insight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "comparison", data: comparisonData }),
            });
            const data = await response.json();
            setAiInsight(data.insight);
        } catch (error) { setAiInsight("Error generating analysis."); } finally { setIsGenerating(false); }
    };

    const downloadImage = async () => {
        if (!downloadRef.current) return;

        try {
            // 1. Capture the full dimensions of the content, even the scrollable parts
            const width = downloadRef.current.scrollWidth;
            const height = downloadRef.current.scrollHeight;

            const dataUrl = await toPng(downloadRef.current, {
                cacheBust: true,
                backgroundColor: '#030712',
                // 2. Force the canvas to the full size of the content
                width: width,
                height: height,
                style: {
                    // 3. Reset any temporary styles that might interfere during capture
                    overflow: 'visible',
                    width: `${width}px`,
                    height: `${height}px`,
                }
            });

            const link = document.createElement('a');
            link.download = `Comparison-Report.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image:', err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

    return (
        <PageWrapper>
            <div className="mt-20 px-4 max-w-6xl mx-auto mb-32 relative">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">
                        <Trophy className="w-3 h-3" /> National Rankings
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">University Leaderboard</h1>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between z-30 relative">
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {/* Course Filter */}
                        <div className="relative flex-1 md:flex-none" ref={dropdownRef}>
                            <button onClick={() => setIsCourseOpen(!isCourseOpen)} className="w-full md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white flex items-center justify-between text-sm hover:bg-white/10 transition-all">
                                <span className="truncate">{courseFilter}</span>
                                <ChevronDown className={`h-4 w-4 text-blue-400 transition-transform ${isCourseOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isCourseOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                                    {uniqueCourses.map((c) => (
                                        <button key={c} onClick={() => { setCourseFilter(c); setIsCourseOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${courseFilter === c ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:bg-white/5'}`}>{c}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Updated Sort Button with Text Toggle */}
                        <button
                            onClick={() => setSortOrder(sortOrder === "high-low" ? "low-high" : "high-low")}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white flex items-center gap-2 text-sm hover:bg-white/10 whitespace-nowrap min-w-[160px] justify-center"
                        >
                            <ArrowUpDown className="h-4 w-4 text-blue-400" />
                            <span>{sortOrder === "high-low" ? "Higher to Lower" : "Lower to Higher"}</span>
                        </button>

                        {isFilterActive && <button onClick={resetFilters} className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"><RotateCcw className="h-4 w-4" /></button>}
                    </div>
                </div>

                {/* Main Table */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-white/5 text-blue-300 uppercase text-[10px] tracking-[0.2em] font-bold">
                            <th className="p-6 w-12 text-center text-white">Select</th>
                            <th className="p-6">Institution</th>
                            <th className="p-6">Subject</th>
                            <th className="p-6 text-center text-white">Outcome</th>
                            <th className="p-6">View</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-200">
                        {processedRecords.map((uni) => (
                            <tr
                                key={uni.id}
                                onClick={() => toggleSelection(uni.id)}
                                className={`border-t border-white/5 cursor-pointer transition-all ${selectedIds.includes(uni.id) ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
                            >
                                <td className="p-6 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(uni.id)}
                                        onChange={(e) => { e.stopPropagation(); toggleSelection(uni.id); }}
                                        className="accent-blue-500"
                                    />
                                </td>
                                <td className="p-6 font-bold">{uni.uniName}</td>
                                <td className="p-6 text-sm text-gray-400">{uni.uniCourse}</td>
                                <td className="p-6 text-center text-blue-400 font-bold">{uni.employment?.workOnly}</td>
                                <td className="p-6" onClick={(e) => e.stopPropagation()}>
                                    <Link href={`/employment/${uni.id}`} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-600 transition-colors inline-block">
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Floating Selection Bar */}
                {selectedIds.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-2xl animate-in slide-in-from-bottom-10">
                        <div className="bg-gray-900/95 backdrop-blur-2xl border border-blue-500/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4 pl-2 text-white">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold text-sm">{selectedIds.length}</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Active nodes for analysis</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedIds([])} className="px-4 py-2 text-xs font-bold text-gray-400">Clear</button>
                                <button disabled={selectedIds.length < 2} onClick={() => setShowCompareOverlay(true)} className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-xl flex items-center gap-2 transition-all disabled:opacity-30">
                                    <Scale className="w-4 h-4" /> Compare
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Overlay */}
                {showCompareOverlay && (
                    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
                        <div className="bg-gray-950 border border-white/20 w-full max-w-6xl rounded-3xl flex flex-col overflow-hidden max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase tracking-tighter"><Scale className="text-blue-500" /> Comparison Lab</h2>
                                <div className="flex items-center gap-3">
                                    <button onClick={generateAIComparison} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50">
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        {aiInsight ? "Regenerate Analysis" : "AI Insight"}
                                    </button>
                                    <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"><Download className="w-4 h-4" /> Export Report</button>
                                    <button onClick={() => { setShowCompareOverlay(false); setAiInsight(null); }} className="p-2 text-white hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
                                </div>
                            </div>

                            <div ref={downloadRef} className="flex-1 overflow-x-auto p-12 bg-gray-950 custom-scrollbar">
                                {aiInsight && (
                                    <div className="mb-10 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-100 text-sm leading-relaxed animate-in slide-in-from-top-4">
                                        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                            <Sparkles className="w-3 h-3" /> Predictive Competitive Breakdown
                                        </div>
                                        {aiInsight}
                                    </div>
                                )}

                                <div className="grid grid-cols-[220px_repeat(auto-fit,minmax(220px,1fr))] gap-8 min-w-max">
                                    <div className="space-y-12 text-gray-500 font-bold uppercase text-[9px] tracking-[0.3em] pt-32">
                                        <div className="h-12 flex items-center border-b border-white/5">Employment Rate</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Unemployment</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Further Study</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Work & Study</div>
                                    </div>

                                    {selectedRecords.map(uni => {
                                        const stats = { emp: toNumber(uni.employment?.workOnly), unemp: toNumber(uni.employment?.unemployment) };
                                        const all = { emp: selectedRecords.map(r => toNumber(r.employment?.workOnly)), unemp: selectedRecords.map(r => toNumber(r.employment?.unemployment)) };
                                        return (
                                            <div key={uni.id} className="text-center space-y-12 min-w-[220px]">
                                                <div className="h-28 flex flex-col justify-end items-center">
                                                    {winnerId === uni.id && <div className="mb-4 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-[9px] font-black uppercase"><Crown className="w-3 h-3" /> Statistical Winner</div>}
                                                    <div className="font-bold text-white text-lg truncate w-full px-2">{uni.uniName}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase truncate w-full">{uni.uniCourse}</div>
                                                </div>
                                                <div className={`h-12 text-4xl font-black ${getStatColor(stats.emp, all.emp)}`}>{uni.employment?.workOnly}</div>
                                                <div className={`h-12 text-4xl font-black ${getStatColor(stats.unemp, all.unemp, true)}`}>{uni.employment?.unemployment}</div>
                                                <div className="h-12 text-4xl font-black text-gray-600 italic">{uni.employment?.studyOnly}</div>
                                                <div className="h-12 text-4xl font-black text-gray-600 italic">{uni.employment?.workAndStudy}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}