"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
    id: string;
    course: string;
    mode: string;
};

type University = {
    Id: string;
    university: string;
    courses: Course[];
};

export default function UniversityCourseSearch() {
    const router = useRouter();

    const [universities, setUniversities] = useState<University[]>([]);
    const [uniQuery, setUniQuery] = useState("");
    const [courseQuery, setCourseQuery] = useState("");
    const [selectedUni, setSelectedUni] = useState<University | null>(null);

    // Fetch universities on mount
    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await fetch("http://localhost:4000/employment");
                const data = await res.json();

                // Ensure we only set an array
                if (Array.isArray(data)) setUniversities(data);
                else setUniversities([]);
            } catch (err) {
                console.error("Failed to fetch universities:", err);
                setUniversities([]);
            }
        };

        fetchUniversities();
    }, []);

    // Filtered universities based on input
    const filteredUniversities = Array.isArray(universities)
        ? universities.filter((u) =>
            u.university.toLowerCase().includes(uniQuery.toLowerCase())
        )
        : [];

    // Filtered courses based on input
    const filteredCourses =
        selectedUni?.courses.filter((c) =>
            c.course.toLowerCase().includes(courseQuery.toLowerCase())
        ) || [];

    return (
        <div className="w-full max-w-md mx-auto space-y-4">
            {/* UNIVERSITY SEARCH */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search university..."
                    value={uniQuery}
                    onChange={(e) => {
                        setUniQuery(e.target.value);
                        setSelectedUni(null);
                        setCourseQuery("");
                    }}
                    className="w-full rounded-md border px-4 py-2 focus:outline-none bg-white shadow"
                />

                {uniQuery && !selectedUni && filteredUniversities.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow">
                        {filteredUniversities.map((uni) => (
                            <div
                                key={uni.Id}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedUni(uni);
                                    setUniQuery(uni.university);
                                }}
                            >
                                {uni.university}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* COURSE SEARCH (only after university selected) */}
            {selectedUni && (
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search course..."
                        value={courseQuery}
                        onChange={(e) => setCourseQuery(e.target.value)}
                        className="w-full rounded-md border px-4 py-2 focus:outline-none bg-white shadow"
                    />

                    {courseQuery && (
                        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow">
                            {filteredCourses.length === 0 ? (
                                <p className="px-4 py-2 text-sm text-gray-500">No courses found</p>
                            ) : (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                        onClick={() =>
                                            router.push(
                                                `/employment/${selectedUni.Id}/course/${course.id}`
                                            )
                                        }
                                    >
                                        {course.course}{" "}
                                        <span className="text-sm text-gray-500">({course.mode})</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

