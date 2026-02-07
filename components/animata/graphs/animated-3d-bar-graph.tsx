"use client"
import { motion } from "framer-motion";

export default function Animated3DBarGraph({ data }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <div className="space-y-6">
                {data.map((item, index) => {
                    const barWidth = (item.value / maxValue) * 100;

                    return (
                        <div key={index}>
                            <div className="flex justify-between mb-1">
                                <span className="text-white font-medium">{item.label}</span>
                                <span className="text-white">{item.value}</span>
                            </div>

                            <div className="relative h-10 perspective-500">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded relative transform-gpu"
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Top face */}
                                    <div
                                        className="absolute top-0 left-0 w-full h-3 bg-blue-400 rounded"
                                        style={{
                                            transform: "translateZ(10px) rotateX(90deg)",
                                        }}
                                    />

                                    {/* Side face */}
                                    <div
                                        className="absolute top-0 right-0 h-full w-3 bg-blue-600 rounded"
                                        style={{
                                            transform: "translateZ(10px) rotateY(90deg)",
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
