"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TextProps {
    text: string;
    className?: string;
    size?: string; // 👈 NEW — allows text size override (e.g., "text-3xl")
}

export default function TextBorderAnimation({
                                                text = "Programming",
                                                className,
                                                size = "text-5xl", // 👈 default size
                                            }: TextProps) {
    const [isHoveredIn, setIsHoveredIn] = useState(false);
    const [isHoveredOut, setIsHoveredOut] = useState(false);

    const handleHover = () => setIsHoveredIn(true);

    const handleHoverExit = () => {
        setIsHoveredIn(false);
        setIsHoveredOut(true);
    };

    useEffect(() => {
        if (isHoveredOut) {
            const timer = setTimeout(() => setIsHoveredOut(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isHoveredOut]);

    return (
        <div onMouseEnter={handleHover} onMouseLeave={handleHoverExit} className="overflow-hidden">
      <span className={cn(size, "font-bold text-foreground", className)}>
        {text}
      </span>

            <div className="relative mt-1 h-1 w-full">
                <div
                    className={cn(
                        "absolute left-0 top-0 h-full w-full bg-yellow-500 transition-transform duration-300",
                        isHoveredIn ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                    )}
                />
                <div
                    className={cn(
                        "absolute left-0 top-0 h-full w-full bg-yellow-500 transition-transform duration-300 opacity-0",
                        isHoveredOut && "translate-x-full opacity-100"
                    )}
                />
            </div>
        </div>
    );
}

