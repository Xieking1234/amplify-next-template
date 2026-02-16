"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, ChevronDown, Trophy, ExternalLink } from "lucide-react";

const client = generateClient<Schema>({ authMode: "apiKey" });

export default function RankingsPage() {
    const [records, setRecords] = useState<Schema["Employment"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort States
    const [searchQuery, setSearchQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("All Courses");
    const [sortOrder, setSortOrder] = useState<"high-low" | "low-high">("high-low");

    // UI States
    const [isCourseOpen, setIsCourseOpen] = useState(false);
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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsCourseOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // ⭐ Logic: Get unique courses for filter
    const uniqueCourses = useMemo(() => {
        const courses = records.map((r) => r.uniCourse).filter(Boolean) as string[];
        return ["All Courses", ...Array.from(new Set(courses))];
    }, [records]);

    // ⭐ Logic: Combined Filter & Sort
    const processedRecords = useMemo(() => {
        let result = records.filter((uni) => {
            const searchStr = searchQuery.toLowerCase();
            const matchesSearch =
                uni.uniName?.toLowerCase().includes(searchStr) ||
                uni.uniCourse?.toLowerCase().includes(searchStr);
            const matchesCourse =
                courseFilter === "All Courses" || uni.uniCourse === courseFilter;
            return matchesSearch && matchesCourse;
        });

        return result.sort((a, b) => {
            const rateA = Number(a.employment?.workOnly?.replace("%", "")) || 0;
            const rateB = Number(b.employment?.workOnly?.replace("%", "")) || 0;
            return sortOrder === "high-low" ? rateB - rateA : rateA - rateB;
        });
    }, [records, searchQuery, courseFilter, sortOrder]);

    const isFilterActive = searchQuery !== "" || courseFilter !== "All Courses" || sortOrder !== "high-low";

    const resetFilters = () => {
        setSearchQuery("");
        setCourseFilter("All Courses");
        setSortOrder("high-low");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="animate-pulse font-medium">Analysing UK Database...</p>
            </div>
        </div>
    );

    return (
        <PageWrapper>
            <div className="mt-20 px-4 max-w-6xl mx-auto mb-32">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 uppercase tracking-widest">
                        <Trophy className="w-3 h-3" />
                        National Rankings
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">University Leaderboard</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Explore and compare employment outcomes across institutions based on latest HESA graduation data.
                    </p>
                </div>

                {/* ⭐ Control Bar */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between z-30 relative">
                        {/* Search */}
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
                            {/* Custom Course Dropdown */}
                            <div className="relative w-full md:w-64" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsCourseOpen(!isCourseOpen)}
                                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Filter className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                        <span className="truncate text-sm">{courseFilter}</span>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isCourseOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isCourseOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-gray-900/95 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                                        {uniqueCourses.map((course) => (
                                            <button
                                                key={course}
                                                onClick={() => {
                                                    setCourseFilter(course);
                                                    setIsCourseOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                    courseFilter === course ? "text-blue-400 bg-white/10" : "text-gray-300 hover:bg-white/5"
                                                }`}
                                            >
                                                {course}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sort Toggle */}
                            <button
                                onClick={() => setSortOrder(sortOrder === "high-low" ? "low-high" : "high-low")}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all whitespace-nowrap"
                            >
                                <ArrowUpDown className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium">
                                    {sortOrder === "high-low" ? "High to Low" : "Low to High"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {isFilterActive && (
                        <div className="flex justify-end animate-in fade-in slide-in-from-top-1 duration-300">
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20"
                            >
                                <span className="w-3 h-3 flex items-center justify-center bg-blue-500/20 rounded-full text-[8px]">✕</span>
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* --- Main Table --- */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-white/5 text-blue-300 uppercase text-[10px] tracking-[0.2em] font-bold">
                            <th className="p-6">Rank</th>
                            <th className="p-6">Institution</th>
                            <th className="p-6">Subject</th>
                            <th className="p-6 text-center">Outcome</th>
                            <th className="p-6">View</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-200">
                        {processedRecords.length > 0 ? (
                            processedRecords.map((uni, index) => (
                                <tr key={uni.id} className="border-t border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-mono text-blue-400/80">
                                        #{index + 1}
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-white group-hover:text-blue-300 transition-colors">{uni.uniName}</div>
                                        <div className="text-[10px] text-gray-500 uppercase mt-1">UK University</div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm text-gray-400">{uni.uniCourse}</span>
                                    </td>
                                    <td className="p-6 text-center min-w-[200px]">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                <span>Employment</span>
                                                <span className="text-blue-400">{uni.employment?.workOnly}</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                                                    style={{ width: uni.employment?.workOnly || '0%' }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <Link
                                            href={`/employment/${uni.id}`}
                                            className="p-2.5 bg-white/5 hover:bg-blue-600 border border-white/10 text-white rounded-xl transition-all inline-flex items-center justify-center group"
                                        >
                                            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <Search className="w-8 h-8" />
                                        <p className="text-sm italic">No data matching your current filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageWrapper>
    );
}