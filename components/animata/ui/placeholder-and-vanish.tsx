"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";

// Backend response type
type EmploymentItem = {
    Id: string;
    university: string;
    courses: {
        id: string;
        course: string;
        mode: string;
        foundation: number;
        employment: {
            population: number | null;
            responses: number | null;
            responseRate: number | null;
            workOnly: number | null;
            workAndStudy: number | null;
            studyOnly: number | null;
            unemployed: number | null;
            sample: number | null;
        };
    }[];
};

// Dropdown option type (UNIVERSITY ONLY)
type Option = {
    key: string;
    universityId: string;
    label: string;
};

export function PlaceholdersAndVanishInputDemo() {
    const router = useRouter();

    const [value, setValue] = useState("");
    const [options, setOptions] = useState<Option[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [animating, setAnimating] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const placeholders = [
        "What's your favourite university?",
        "Type any UK university",
        "If you had to choose one university, which would it be?",
        "Which university stands out the most in your opinion?",
        "Check the average package of any university graduate",
    ];

    // Placeholder animation
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimating(true);

            setTimeout(() => {
                setCurrentPlaceholder((prev) =>
                    prev === placeholders.length - 1 ? 0 : prev + 1
                );
                setAnimating(false);
            }, 300);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    // Fetch universities as user types
    useEffect(() => {
        const fetchData = async () => {
            if (!value.trim()) {
                setOptions([]);
                return;
            }

            try {
                const res = await axios.get("http://localhost:4000/employment");

                // Extract only universities
                const formatted: Option[] = (res.data as EmploymentItem[]).map(
                    (item) => ({
                        key: item.Id,
                        universityId: item.Id,
                        label: item.university,
                    })
                );

                const filtered = formatted.filter((opt) =>
                    opt.label.toLowerCase().includes(value.toLowerCase())
                );

                setOptions(filtered);
                setShowDropdown(true);
            } catch (err) {
                console.error("Axios error:", err);
            }
        };

        const delay = setTimeout(fetchData, 250);
        return () => clearTimeout(delay);
    }, [value]);

    // When user selects a university
    const handleSelect = (opt: Option) => {
        setValue(opt.label);
        setShowDropdown(false);

        // Go to university page (course selection happens there)
        router.push(`/employmentInfo/${opt.universityId}`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="h-[40rem] flex flex-col justify-center items-center px-4 relative">
            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
                Check the average employment rate of graduates from any university
            </h2>

            <div className="relative w-[500px]">
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    inputValue={value}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    setInputValue={setValue}
                    animating={animating}
                    currentPlaceholder={currentPlaceholder}
                    handleKeyDown={() => {}}
                    canvasRef={canvasRef}
                    inputRef={inputRef}
                />

                {showDropdown && options.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto border border-gray-200">
                        {options.map((opt) => (
                            <div
                                key={opt.key}
                                onClick={() => handleSelect(opt)}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-blue-900"
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}






