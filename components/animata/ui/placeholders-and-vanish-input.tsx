"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    placeholders: string[];
    inputValue: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    setInputValue: (value: string) => void;
    animating: boolean;
    currentPlaceholder: number;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    inputRef: React.RefObject<HTMLInputElement>;
};

export function PlaceholdersAndVanishInput({
                                               placeholders,
                                               inputValue,
                                               onChange,
                                               onSubmit,
                                               setInputValue,
                                               animating,
                                               currentPlaceholder,
                                               handleKeyDown,
                                               canvasRef,
                                               inputRef,
                                           }: Props) {
    const [hydrated, setHydrated] = useState(false);

    // Prevent SSR mismatch by delaying animations until after hydration
    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "w-full relative max-w-3xl mx-auto h-12 rounded-full overflow-hidden",
                "bg-white dark:bg-zinc-800 shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1),0_1px_0_rgba(25,28,33,0.02),0_0_0_1px_rgba(25,28,33,0.08)]",
                inputValue && "bg-gray-50"
            )}
        >
            {/* Canvas animation (client-only) */}
            {hydrated && (
                <canvas
                    ref={canvasRef}
                    className={cn(
                        "absolute pointer-events-none transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left",
                        "filter invert dark:invert-0 pr-20",
                        animating ? "opacity-100" : "opacity-0"
                    )}
                />
            )}

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                    if (!animating) {
                        setInputValue(e.target.value);
                        onChange && onChange(e);
                    }
                }}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full h-full bg-transparent border-none rounded-full",
                    "text-sm sm:text-base pl-4 sm:pl-10 pr-20",
                    "focus:outline-none focus:ring-0",
                    "text-black dark:text-white",
                    hydrated && animating && "text-transparent"
                )}
            />

            {/* Submit button */}
            <button
                disabled={!hydrated || !inputValue}
                type="submit"
                className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full",
                    "transition flex items-center justify-center",
                    hydrated
                        ? "bg-black dark:bg-zinc-900 disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                        : "bg-gray-200"
                )}
            >
                {hydrated && (
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300 h-4 w-4"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <motion.path
                            d="M5 12l14 0"
                            initial={{ strokeDasharray: "50%", strokeDashoffset: "50%" }}
                            animate={{ strokeDashoffset: inputValue ? 0 : "50%" }}
                            transition={{ duration: 0.3, ease: "linear" }}
                        />
                        <path d="M13 18l6 -6" />
                        <path d="M13 6l6 6" />
                    </motion.svg>
                )}
            </button>

            {/* Placeholder text */}
            <div className="absolute inset-0 flex items-center pointer-events-none rounded-full">
                <AnimatePresence mode="wait">
                    {!inputValue && hydrated && (
                        <motion.p
                            key={`placeholder-${currentPlaceholder}`}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -15, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "linear" }}
                            className="pl-4 sm:pl-12 text-sm sm:text-base text-neutral-500 dark:text-zinc-500 truncate"
                        >
                            {placeholders[currentPlaceholder]}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}

