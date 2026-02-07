"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SwapTextProps extends React.ComponentPropsWithoutRef<"div"> {
    initialText: string;
    finalText: string;
    supportsHover?: boolean;
    textClassName?: string;
    initialTextClassName?: string;
    finalTextClassName?: string;
    disableClick?: boolean;
}

export default function SwapText({
                                     initialText,
                                     finalText,
                                     className,
                                     supportsHover = true,
                                     textClassName,
                                     initialTextClassName,
                                     finalTextClassName,
                                     disableClick,
                                     ...props
                                 }: SwapTextProps) {
    const [active, setActive] = useState(false);

    // Shared transition classes
    const transitionBase = "block transition-all duration-1000 ease-slow";

    // Ensures container height stays stable
    const placeholder = finalText.length > initialText.length ? finalText : initialText;

    const handleToggle = () => {
        if (!disableClick) setActive((prev) => !prev);
    };

    return (
        <div
            {...props}
            className={cn("relative overflow-hidden text-foreground", className)}
        >
            <div
                className={cn(
                    "group cursor-pointer select-none text-7xl font-bold text-white",
                    textClassName
                )}
                onClick={handleToggle}
                role="button"
                aria-pressed={active}
            >
                {/* INITIAL TEXT */}
                <span
                    className={cn(
                        transitionBase,
                        "flex flex-col",
                        initialTextClassName,
                        {
                            "-translate-y-full": active,
                            "group-hover:-translate-y-full": supportsHover,
                        }
                    )}
                >
          {initialText}
                    <span className="invisible h-0">{placeholder}</span>
        </span>

                {/* FINAL TEXT */}
                <span
                    className={cn(
                        transitionBase,
                        "absolute top-full",
                        finalTextClassName,
                        {
                            "-translate-y-full": active,
                            "group-hover:-translate-y-full": supportsHover,
                        }
                    )}
                >
          {finalText}
        </span>
            </div>
        </div>
    );
}

