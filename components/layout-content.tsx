"use client"
import {useAuthenticator} from "@aws-amplify/ui-react";
import {useEffect, useRef, useState} from "react";
import {ChevronDown, LayoutDashboard, LogOut, Trophy} from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/animata/background/animated-background";


export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { signOut, user, authStatus } = useAuthenticator((context) => [
        context.user,
        context.authStatus,
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* ⭐ Dropdown Navigation: Only visible if authenticated */}
            {authStatus === "authenticated" && (
                <div className="fixed top-5 right-5 z-[100]" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20
                       text-white rounded-full hover:bg-white/20 transition-all text-sm font-medium shadow-lg"
                    >
                        <span>Account</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900/90 backdrop-blur-xl border border-white/20
                            rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">

                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                Home
                            </Link>

                            <Link
                                href="/rankings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors"
                            >
                                <Trophy className="w-4 h-4 text-yellow-400" />
                                Leaderboard
                            </Link>

                            <hr className="my-2 border-white/10" />

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    signOut();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="fixed inset-0 -z-10">
                <AnimatedBackground />
            </div>

            <main className="relative z-10 min-h-screen">
                {children}
            </main>
        </>
    );
}