"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import Link from "next/link";
import {
    Search, ArrowUpDown, ChevronDown, Trophy,
    ExternalLink, X, BarChart, CheckCircle2,
    RotateCcw, Download, Scale, Crown, Sparkles, Loader2
} from "lucide-react";
import { toPng } from 'html-to-image';

const client = generateClient<Schema>({ authMode: "apiKey" });

const toNumber = (value?: string | null) =>
    value ? Number(value.replace("%", "")) : 0;

export default function RankingsPage() {
    const [records, setRecords] = useState<Schema["Employment"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    // AI States
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter & UI States
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
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    const resetFilters = () => {
        setSearchQuery("");
        setCourseFilter("All Courses");
        setSortOrder("high-low");
    };

    const isFilterActive = searchQuery !== "" || courseFilter !== "All Courses" || sortOrder !== "high-low";

    const selectedRecords = useMemo(() =>
            records.filter(r => selectedIds.includes(r.id)),
        [records, selectedIds]);

    // ⭐ AI Insight Function
    const generateAIComparison = async () => {
        setIsGenerating(true);
        try {
            const comparisonData = selectedRecords.map(r => ({
                name: r.uniName,
                course: r.uniCourse,
                employment: r.employment?.workOnly,
                unemployment: r.employment?.unemployment,
                furtherStudy: r.employment?.studyOnly
            }));

            const response = await fetch("/api/insight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "comparison",
                    data: comparisonData
                }),
            });
            const data = await response.json();
            setAiInsight(data.insight);
        } catch (error) {
            setAiInsight("Failed to generate comparative analysis. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadImage = async () => {
        if (downloadRef.current === null) return;
        try {
            const node = downloadRef.current;
            const dataUrl = await toPng(node, {
                cacheBust: true,
                backgroundColor: '#030712',
                width: node.scrollWidth,
                height: node.scrollHeight,
                style: { padding: '40px', overflow: 'visible', width: `${node.scrollWidth}px`, maxWidth: 'none' }
            });
            const link = document.createElement('a');
            link.download = `Comparison-Report.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) { console.error(err); }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const winnerId = useMemo(() => {
        if (selectedRecords.length < 2) return null;
        const scores: Record<string, number> = {};
        selectedIds.forEach(id => scores[id] = 0);
        const metrics = {
            emp: selectedRecords.map(r => toNumber(r.employment?.workOnly)),
            unemp: selectedRecords.map(r => toNumber(r.employment?.unemployment)),
            study: selectedRecords.map(r => toNumber(r.employment?.studyOnly)),
            intern: selectedRecords.map(r => toNumber(r.employment?.workAndStudy))
        };
        const bests = {
            emp: Math.max(...metrics.emp), unemp: Math.min(...metrics.unemp),
            study: Math.max(...metrics.study), intern: Math.max(...metrics.intern)
        };
        selectedRecords.forEach(r => {
            if (toNumber(r.employment?.workOnly) === bests.emp) scores[r.id] += 1.5;
            if (toNumber(r.employment?.unemployment) === bests.unemp) scores[r.id] += 1;
            if (toNumber(r.employment?.studyOnly) === bests.study) scores[r.id] += 1;
            if (toNumber(r.employment?.workAndStudy) === bests.intern) scores[r.id] += 1;
        });
        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    }, [selectedRecords, selectedIds]);

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

    const uniqueCourses = useMemo(() => {
        const courses = records.map((r) => r.uniCourse).filter(Boolean) as string[];
        return ["All Courses", ...Array.from(new Set(courses))];
    }, [records]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>;

    return (
        <PageWrapper>
            <div className="mt-20 px-4 max-w-6xl mx-auto mb-32 relative">
                {/* Header & Filters (Kept from previous version) */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">
                        <Trophy className="w-3 h-3" /> National Rankings
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">University Leaderboard</h1>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between z-30 relative">
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/40" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSortOrder(sortOrder === "high-low" ? "low-high" : "high-low")} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white flex items-center gap-2 text-sm">
                            <ArrowUpDown className="h-4 w-4 text-blue-400" /> {sortOrder === "high-low" ? "High to Low" : "Low to High"}
                        </button>
                        {isFilterActive && (
                            <button onClick={resetFilters} className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2 text-sm transition-all"><RotateCcw className="h-4 w-4" /> Reset</button>
                        )}
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
                            <tr key={uni.id} className={`border-t border-white/5 transition-all ${selectedIds.includes(uni.id) ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}>
                                <td className="p-6 text-center"><input type="checkbox" checked={selectedIds.includes(uni.id)} onChange={() => toggleSelection(uni.id)} className="w-4 h-4 accent-blue-500 cursor-pointer" /></td>
                                <td className="p-6 font-bold">{uni.uniName}</td>
                                <td className="p-6 text-sm text-gray-400">{uni.uniCourse}</td>
                                <td className="p-6 text-center text-blue-400 font-bold">{uni.employment?.workOnly}</td>
                                <td className="p-6"><Link href={`/employment/${uni.id}`} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-600 inline-block"><ExternalLink className="w-4 h-4" /></Link></td>
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
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold">{selectedIds.length}</span>
                                <span className="text-sm font-medium uppercase tracking-tighter">Selected for comparison</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedIds([])} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase">Clear</button>
                                <button disabled={selectedIds.length < 2} onClick={() => setShowCompareOverlay(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-sm font-bold rounded-xl flex items-center gap-2">
                                    <Scale className="w-4 h-4" /> Compare Now
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
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><Scale className="text-blue-500" /> Comparative Analysis</h2>
                                <div className="flex items-center gap-3">
                                    {/* AI Insight Button */}
                                    <button
                                        onClick={generateAIComparison}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        {aiInsight ? "Regenerate Analysis" : "AI Insight"}
                                    </button>
                                    <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"><Download className="w-4 h-4" /> Download</button>
                                    <button onClick={() => { setShowCompareOverlay(false); setAiInsight(null); }} className="p-2 hover:bg-white/10 rounded-full text-white"><X className="w-6 h-6" /></button>
                                </div>
                            </div>

                            <div ref={downloadRef} className="flex-1 overflow-x-auto p-12 bg-gray-950 custom-scrollbar">
                                {/* AI Insight Box */}
                                {aiInsight && (
                                    <div className="mb-10 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-100 text-sm leading-relaxed animate-in slide-in-from-top-4">
                                        <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                                            <Sparkles className="w-3 h-3" /> AI Competitive Breakdown
                                        </div>
                                        {aiInsight}
                                    </div>
                                )}

                                <div className="grid grid-cols-[220px_repeat(auto-fit,minmax(220px,1fr))] gap-8 min-w-max">
                                    {/* Labels */}
                                    <div className="space-y-12 text-gray-500 font-bold uppercase text-[10px] tracking-widest pt-32">
                                        <div className="h-12 flex items-center border-b border-white/5">Employment Rate</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Unemployment</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Further Study</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Internship Rate</div>
                                    </div>

                                    {/* Data */}
                                    {selectedRecords.map(uni => {
                                        const stats = { emp: toNumber(uni.employment?.workOnly), unemp: toNumber(uni.employment?.unemployment), study: toNumber(uni.employment?.studyOnly), intern: toNumber(uni.employment?.workAndStudy) };
                                        const all = { emp: selectedRecords.map(r => toNumber(r.employment?.workOnly)), unemp: selectedRecords.map(r => toNumber(r.employment?.unemployment)), study: selectedRecords.map(r => toNumber(r.employment?.studyOnly)), intern: selectedRecords.map(r => toNumber(r.employment?.workAndStudy)) };

                                        const getColor = (val: number, arr: number[], inverted = false) => {
                                            const max = Math.max(...arr); const min = Math.min(...arr);
                                            if (max === min) return "text-white";
                                            if (inverted) return val === min ? "text-green-400" : (val === max ? "text-red-400" : "text-gray-500");
                                            return val === max ? "text-green-400" : (val === min ? "text-red-400" : "text-gray-500");
                                        };

                                        return (
                                            <div key={uni.id} className="text-center space-y-12 relative pb-8 min-w-[220px]">
                                                <div className="h-28 flex flex-col justify-end items-center">
                                                    {winnerId === uni.id && <div className="mb-4 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse"><Crown className="w-3 h-3 fill-yellow-400/20" /> Best Outcome</div>}
                                                    <div className="font-bold text-white text-lg leading-tight truncate w-full">{uni.uniName}</div>
                                                    <div className="text-[10px] text-gray-500 mt-1 uppercase truncate w-full">{uni.uniCourse}</div>
                                                </div>
                                                <div className={`h-12 text-4xl font-black ${getColor(stats.emp, all.emp)} transition-colors`}>{uni.employment?.workOnly}</div>
                                                <div className={`h-12 text-4xl font-black ${getColor(stats.unemp, all.unemp, true)} transition-colors`}>{uni.employment?.unemployment}</div>
                                                <div className={`h-12 text-4xl font-black ${getColor(stats.study, all.study)} transition-colors`}>{uni.employment?.studyOnly}</div>
                                                <div className={`h-12 text-4xl font-black ${getColor(stats.intern, all.intern)} transition-colors`}>{uni.employment?.workAndStudy}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-20 border-t border-white/5 pt-8 text-center text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold italic">
                                    Generated by University Rankings Portal • {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}