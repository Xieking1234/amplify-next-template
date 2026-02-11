"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function SearchDropdown() {
    const router = useRouter();   // ✅ VALID — inside component

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Schema["Employment"]["type"][]>([]);
    const [allData, setAllData] = useState<Schema["Employment"]["type"][]>([]);

    useEffect(() => {
        async function fetchData() {
            const { data } = await client.models.Employment.list();
            setAllData(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const filtered = allData.filter((item) =>
            `${item.uniName} ${item.uniCourse} ${item.mode}`
                .toLowerCase()
                .includes(query.toLowerCase())
        );

        setResults(filtered);
    }, [query, allData]);

    return (
        <div className="w-full max-w-lg mx-auto mt-10 relative">
            <input
                type="text"
                placeholder="Search university or course..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
        w-full p-3
        bg-white text-black
        border border-gray-300
        rounded-lg shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500
    "

            />

            {results.length > 0 && (
                <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push(`/employment/${item.id}`)}
                            className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                        >
                            <span className="font-medium">{item.uniName}</span>
                            <span className="text-gray-600">{item.uniCourse}</span>
                            <span className="text-gray-600">{item.mode}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

