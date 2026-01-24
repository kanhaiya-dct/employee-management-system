export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div>
                <div className="h-10 w-64 bg-white/5 rounded-xl mb-2"></div>
                <div className="h-5 w-48 bg-white/5 rounded-xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card h-32 rounded-3xl p-6 bg-white/5 border border-white/5"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card h-80 rounded-3xl p-6 bg-white/5"></div>
                <div className="glass-card h-80 rounded-3xl p-6 bg-white/5"></div>
            </div>
        </div>
    )
}
