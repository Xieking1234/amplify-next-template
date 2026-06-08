"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import {
    LogOut,
    Scale,
    BrainCircuit,
    Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedBackground from "@/components/animata/background/animated-background";

import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";

export default function LayoutContent({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
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
            {/* 🌊 NAVBAR */}
            {authStatus === "authenticated" && (
                <header className="fixed top-6 left-0 right-0 z-[100] px-4">
                    <MagneticNavbar
                        navLinks={navLinks}
                        pathname={pathname}
                        signOut={signOut}
                    />
                </header>
            )}

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10">
                <AnimatedBackground />
            </div>

            {/* PAGE CONTENT */}
            <main className="relative z-10 min-h-screen">
                {children}
            </main>
        </>
    );
}

/* ---------------- MAGNETIC NAVBAR ---------------- */

function MagneticNavbar({
                            navLinks,
                            pathname,
                            signOut,
                        }: any) {
    const mouseX = useMotionValue(Infinity);

    return (
        <nav
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="
                            max-w-fit mx-auto flex items-center gap-2
                            px-3 py-2
                            rounded-2xl
                            bg-black/95
                            border border-white/10
                            shadow-2xl
                        "
        >
            {navLinks.map((link: any) => (
                <MagneticItem
                    key={link.href}
                    link={link}
                    mouseX={mouseX}
                    active={pathname === link.href}
                />
            ))}

            {/* divider */}
            <div className="w-[1px] h-5 bg-white/30 mx-2" />

            {/* sign out */}
            <button
                onClick={() => signOut()}
                className="
                    flex items-center gap-2 px-4 py-2
                    rounded-full text-xs font-bold
                    text-red-400/80 hover:bg-red-500/10
                    transition-all uppercase tracking-widest
                "
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">SignOut</span>
            </button>
        </nav>
    );
}

/* ---------------- MAGNETIC WAVE ITEM ---------------- */

function MagneticItem({ link, mouseX, active }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const Icon = link.icon;

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() || {
            x: 0,
            width: 0,
        };
        return val - (bounds.x + bounds.width / 2);
    });

    /* ⚡ FAST WAVE (no heavy math) */
    const wave = useTransform(distance, (d: number) => {
        const max = 180;
        const t = 1 - Math.min(Math.abs(d) / max, 1);

        // lighter curve = faster response
        return t * t;
    });

    /* BIG but SNAPPY */
    const size = useTransform(wave, [0, 1], [40, 72]);
    const y = useTransform(wave, [0, 1], [0, -8]);

    /* ⚡ LIGHT SPRINGS (KEY FIX) */
    const springSize = useSpring(size, {
        stiffness: 260,   // 🔥 higher = faster
        damping: 18,      // lower = less lag
        mass: 0.6,        // lighter feel
    });

    const springY = useSpring(y, {
        stiffness: 260,
        damping: 18,
        mass: 0.6,
    });

    return (
        <Link href={link.href}>
            <motion.div
                ref={ref}
                style={{
                    width: springSize,
                    height: springSize,
                    y: springY,
                }}
                className={`
                    relative flex items-center justify-center
                    rounded-full border
                    transition-colors duration-100
                    ${
                    active
                        ? "bg-white/30 border-white/40"
                        : "bg-white/10 border-white/20 hover:bg-white/20"
                }
                `}
            >
                <Icon
                    className={`w-4 h-4 ${
                        active ? link.color : "text-gray-300"
                    }`}
                />
            </motion.div>
        </Link>
    );
}