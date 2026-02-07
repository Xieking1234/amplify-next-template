"use client";

type WorkButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};

export default function WorkButton({ onClick, disabled }: WorkButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group relative overflow-hidden rounded-full bg-purple-950 px-14 py-4 text-lg transition-all disabled:opacity-50"
        >
            <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
            <span className="font-semibold text-purple-200">
        {disabled ? "Generating..." : "Generate AI Insight"}
      </span>
        </button>
    );
}