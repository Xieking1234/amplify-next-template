import animate from "tailwindcss-animate";

export default {
    content: ["./app/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                foreground: "hsl(var(--foreground))",
            },
            transitionTimingFunction: {
                slow: "cubic-bezier(.405, 0, .025, 1)",
                "minor-spring": "cubic-bezier(0.18,0.89,0.82,1.04)",
            },
        },
    },
    plugins: [animate],
};


