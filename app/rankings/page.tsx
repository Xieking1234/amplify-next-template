"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, ChevronDown, Trophy, ExternalLink, X, BarChart, CheckCircle2, RotateCcw } from "lucide-react";

const client = generateClient<Schema>({ authMode: "apiKey" });

const toNumber = (value?: string | null) =>
    value ? Number(value.replace("%", "")) : 0;

export default function RankingsPage() {
    const [records, setRecords] = useState<Schema["Employment"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & UI States
    const [searchQuery, setSearchQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("All Courses");
    const [sortOrder, setSortOrder] = useState<"high-low" | "low-high">("high-low");
    const [isCourseOpen, setIsCourseOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showCompareOverlay, setShowCompareOverlay] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // ⭐ Reset Logic
    const resetFilters = () => {
        setSearchQuery("");
        setCourseFilter("All Courses");
        setSortOrder("high-low");
    };

    const isFilterActive = searchQuery !== "" || courseFilter !== "All Courses" || sortOrder !== "high-low";

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectedRecords = useMemo(() =>
            records.filter(r => selectedIds.includes(r.id)),
        [records, selectedIds]);

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
            emp: Math.max(...metrics.emp),
            unemp: Math.min(...metrics.unemp),
            study: Math.max(...metrics.study),
            intern: Math.max(...metrics.intern)
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-white animate-pulse font-medium">Analysing UK Database...</p>
            </div>
        </div>
    );

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
                        <input
                            type="text"
                            placeholder="Search university..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsCourseOpen(!isCourseOpen)} className="px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white flex items-center justify-between gap-2 text-sm min-w-[220px]">
                                <span className="truncate">{courseFilter}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${isCourseOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isCourseOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                    {uniqueCourses.map(c => (
                                        <button key={c} onClick={() => { setCourseFilter(c); setIsCourseOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">{c}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSortOrder(sortOrder === "high-low" ? "low-high" : "high-low")} className="px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white flex items-center gap-2 text-sm">
                            <ArrowUpDown className="h-4 w-4 text-blue-400" /> {sortOrder === "high-low" ? "High to Low" : "Low to High"}
                        </button>

                        {/* ⭐ Reset Button */}
                        {isFilterActive && (
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 flex items-center gap-2 text-sm transition-all animate-in fade-in zoom-in duration-200"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Table */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-white/5 text-blue-300 uppercase text-[10px] tracking-[0.2em] font-bold">
                            <th className="p-6 w-12 text-center">Select</th>
                            <th className="p-6">Institution</th>
                            <th className="p-6">Subject</th>
                            <th className="p-6 text-center">Outcome</th>
                            <th className="p-6">View</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-200">
                        {processedRecords.map((uni) => (
                            <tr key={uni.id} className={`border-t border-white/5 transition-all ${selectedIds.includes(uni.id) ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}>
                                <td className="p-6 text-center">
                                    <input type="checkbox" checked={selectedIds.includes(uni.id)} onChange={() => toggleSelection(uni.id)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
                                </td>
                                <td className="p-6 font-bold">{uni.uniName}</td>
                                <td className="p-6 text-sm text-gray-400">{uni.uniCourse}</td>
                                <td className="p-6 text-center text-blue-400 font-bold">{uni.employment?.workOnly}</td>
                                <td className="p-6">
                                    <Link href={`/employment/${uni.id}`} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-600 transition-all inline-block"><ExternalLink className="w-4 h-4" /></Link>
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
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-bold">{selectedIds.length}</span>
                                <span className="text-sm font-medium">Ready to compare</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedIds([])} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-tighter">Reset</button>
                                <button disabled={selectedIds.length < 2} onClick={() => setShowCompareOverlay(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">Compare Now</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Overlay */}
                {showCompareOverlay && (
                    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
                        <div className="bg-gray-900 border border-white/20 w-full max-w-5xl rounded-3xl flex flex-col overflow-hidden max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                    <BarChart className="text-blue-500" /> Comparative Analysis
                                </h2>
                                <button onClick={() => setShowCompareOverlay(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-all"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="flex-1 overflow-x-auto p-10 custom-scrollbar">
                                <div className="grid grid-cols-[220px_repeat(auto-fit,minmax(200px,1fr))] gap-8 min-w-[800px]">
                                    <div className="space-y-12 text-gray-500 font-bold uppercase text-[10px] tracking-widest pt-32">
                                        <div className="h-12 flex items-center border-b border-white/5">Employment Rate</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Unemployment</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Further Study</div>
                                        <div className="h-12 flex items-center border-b border-white/5">Internship Rate</div>
                                    </div>
                                    {selectedRecords.map(uni => {
                                        const stats = {
                                            emp: toNumber(uni.employment?.workOnly),
                                            unemp: toNumber(uni.employment?.unemployment),
                                            study: toNumber(uni.employment?.studyOnly),
                                            intern: toNumber(uni.employment?.workAndStudy)
                                        };

                                        const all = {
                                            emp: selectedRecords.map(r => toNumber(r.employment?.workOnly)),
                                            unemp: selectedRecords.map(r => toNumber(r.employment?.unemployment)),
                                            study: selectedRecords.map(r => toNumber(r.employment?.studyOnly)),
                                            intern: selectedRecords.map(r => toNumber(r.employment?.workAndStudy))
                                        };

                                        const getColor = (val: number, arr: number[], inverted = false) => {
                                            const best = inverted ? Math.min(...arr) : Math.max(...arr);
                                            const worst = inverted ? Math.max(...arr) : Math.min(...arr);
                                            if (val === best) return "text-green-400";
                                            if (val === worst) return "text-red-400";
                                            return "text-gray-500";
                                        };

                                        return (
                                            <div key={uni.id} className="text-center space-y-12 relative pb-8">
                                                <div className="h-28 flex flex-col justify-end items-center">
                                                    {winnerId === uni.id && (
                                                        <div className="mb-4 flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter animate-bounce">
                                                            <CheckCircle2 className="w-3 h-3" /> Best Outcome
                                                        </div>
                                                    )}
                                                    <div className="font-bold text-white text-lg leading-tight truncate w-full">{uni.uniName}</div>
                                                    <div className="text-[10px] text-gray-500 mt-1 uppercase truncate w-full">{uni.uniCourse}</div>
                                                </div>
                                                <div className={`h-12 text-3xl font-black ${getColor(stats.emp, all.emp)} transition-colors`}>{uni.employment?.workOnly}</div>
                                                <div className={`h-12 text-3xl font-black ${getColor(stats.unemp, all.unemp, true)} transition-colors`}>{uni.employment?.unemployment}</div>
                                                <div className={`h-12 text-3xl font-black ${getColor(stats.study, all.study)} transition-colors`}>{uni.employment?.studyOnly}</div>
                                                <div className={`h-12 text-3xl font-black ${getColor(stats.intern, all.intern)} transition-colors`}>{uni.employment?.workAndStudy}</div>
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