"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseDropdown({ universityId }: { universityId: string }) {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch(`http://localhost:4000/employment/${universityId}`, {
                cache: "no-store",
            });

            const data = await res.json();
            setCourses(data.courses || []);
            setLoading(false);
        }

        load();
    }, [universityId]);

    if (loading) {
        return <div className="text-white mt-10">Loading courses…</div>;
    }

    return (
        <select
            className="p-3 rounded bg-gray-800 text-white mt-10"
            onChange={(e) => {
                const courseId = e.target.value;
                if (courseId !== "") {
                    router.push(`/employmentInfo/${universityId}/course/${courseId}`);
                }
            }}
        >
            <option value="">Select a course</option>

            {courses.map((course) => (
                <option key={course.id} value={course.id}>
                    {course.course}
                </option>
            ))}
        </select>
    );
}
