"use client";

import { cn } from "@/lib/utils";

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
    image: string;
    title: string;
    description: string;
    subtitle?: string;
    rotate?: "x" | "y";
    backBg?: string;
    url?: string; // NEW
}

export default function FlipCard({
                                     image,
                                     title,
                                     description,
                                     subtitle,
                                     rotate = "y",
                                     backBg = "rgba(23, 37, 84, 0.8)",
                                     url,
                                     className,
                                     ...props
                                 }: FlipCardProps) {
    const rotationClass = {
        x: [
            "group-hover:[transform:rotateX(180deg)]",
            "[transform:rotateX(180deg)]",
        ],
        y: [
            "group-hover:[transform:rotateY(180deg)]",
            "[transform:rotateY(180deg)]",
        ],
    };

    const [frontRotate, backRotate] = rotationClass[rotate];

    const handleClick = () => {
        if (url) {
            window.open(url, "_blank");
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group h-58 w-58 [perspective:1000px]",
                url && "cursor-pointer",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "relative h-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d]",
                    frontRotate
                )}
            >
                {/* Front */}
                <div className="absolute h-full w-full [backface-visibility:hidden]">
                    <img
                        src={image}
                        alt="image"
                        className="h-full w-full rounded-2xl object-cover shadow-2xl shadow-white/40"
                    />
                    {title && (
                        <div className="absolute bottom-4 left-4 text-xl font-bold text-white">
                            {title}
                        </div>
                    )}
                </div>

                {/* Back */}
                <div
                    className={cn(
                        "absolute h-full w-full rounded-2xl p-4 text-slate-200 shadow-2xl shadow-white/40 [backface-visibility:hidden]",
                        backRotate
                    )}
                    style={{ background: backBg }}
                >
                    <div className="flex min-h-full flex-col gap-2 ">
                        {subtitle && (
                            <h1 className="text-lg font-bold text-white">{subtitle}</h1>
                        )}
                        <p className="mt-1 border-t border-t-gray-200 py-4 text-base font-medium leading-normal text-gray-100">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

