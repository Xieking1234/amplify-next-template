export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] z-0">

            {/* Blob 1 */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/40 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />

            {/* Blob 2 */}
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />

            {/* Blob 3 */}
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />

        </div>
    );
}

