"use client"
import { useAuthenticator } from "@aws-amplify/ui-react";
import { LayoutDashboard, LogOut, Scale, BrainCircuit, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedBackground from "@/components/animata/background/animated-background";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { signOut, authStatus } = useAuthenticator((context) => [
        context.authStatus,
    ]);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home", icon: Home, color: "text-blue-400" },
        { href: "/rankings", label: "Compare", icon: Scale, color: "text-yellow-400" },
        { href: "/matchmaker", label: "AI Matchmaker", icon: BrainCircuit, color: "text-purple-400" },
    ];

    return (
        <>
            {/* ⭐ Top Navigation Bar */}
            {authStatus === "authenticated" && (
                <header className="fixed top-6 left-0 right-0 z-[100] px-4">
                    <nav className="max-w-fit mx-auto flex items-center gap-1 p-1.5 bg-white/10 backdrop-blur-[20px] border border-white/30 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)]">

                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest
                                        ${isActive
                                        ? "bg-white/40 text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:bg-white/20 hover:text-gray-900"
                                    }`}
                                >
                                    <link.icon className={`w-4 h-4 ${isActive ? link.color : "text-gray-400"}`} />
                                    <span className="hidden sm:inline">{link.label}</span>
                                </Link>
                            );
                        })}

                        <div className="w-[1px] h-4 bg-white/30 mx-2" />

                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-red-500/70 hover:bg-red-500/10 transition-all uppercase tracking-widest"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">SignOut</span>
                        </button>
                    </nav>
                </header>
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