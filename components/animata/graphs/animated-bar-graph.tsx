"use client"
import { motion } from "framer-motion";

export default function AnimatedBarGraph({ data }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <div className="space-y-4">
                {data.map((item, index) => {
                    const barWidth = (item.value / maxValue) * 100;

                    return (
                        <div key={index}>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium">{item.label}</span>
                                <span className="text-gray-600">{item.value}</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-blue-500 rounded"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

