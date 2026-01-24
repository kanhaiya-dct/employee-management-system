'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-center">
            <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-neon-purple/20 blur-[128px]"></div>
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-neon-blue/20 blur-[128px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 glass-card max-w-lg rounded-3xl p-10 backdrop-blur-xl border border-white/10"
            >
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-red-500/10 p-4">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>
                </div>

                <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
                <h2 className="mb-4 text-2xl font-semibold text-gray-200">Page Not Found</h2>
                <p className="mb-8 text-gray-400">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-3 font-semibold text-white shadow-lg shadow-neon-blue/20 transition-all hover:scale-[1.02] hover:shadow-neon-purple/40"
                >
                    <Home size={18} />
                    <span>Back to Home</span>
                </Link>
            </motion.div>
        </div>
    )
}
