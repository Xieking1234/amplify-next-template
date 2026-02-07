// components/DesignStatsPanel.tsx
import React from 'react';
import Image from 'next/image';
import { CurrencyDollarIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/solid';

const stats = [
    {
        color: 'bg-teal-500',
        percentage: '94%',
        text: 'of all first impressions on a website are design-related.',
        Icon: "/handshake.png", // string → image
    },
    {
        color: 'bg-orange-500',
        percentage: '73%',
        text: 'of companies invest in design to differentiate their brand from the competition.',
        Icon: CurrencyDollarIcon, // component
    },
    {
        color: 'bg-pink-500',
        percentage: '62%',
        text: 'of companies that invested in responsive design saw an increase in sales.',
        Icon: ChartBarIcon,
    },
    {
        color: 'bg-blue-500',
        percentage: '46%',
        text: 'of consumers judge the credibility of a website from its visual appeal & aesthetics.',
        Icon: StarIcon,
    },
];

const DesignStatsPanel = () => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {stats.map(({ color, percentage, text, Icon }, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center justify-center text-center rounded-xl shadow-lg p-6 text-white ${color}`}
                >
                    {typeof Icon === "string" ? (
                        <Image
                            src={Icon}
                            alt="Stat icon"
                            width={50}
                            height={50}
                            className="mb-4"
                        />
                    ) : (
                        <Icon className="h-10 w-10 mb-4" />
                    )}

                    <div className="text-4xl font-bold mb-2">{percentage}</div>
                    <p className="text-sm">{text}</p>
                </div>
            ))}
        </section>
    );
};

export default DesignStatsPanel;


