'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import NotificationDropdown from './NotificationDropdown'

export default function Topbar({ userName }: { userName: string }) {
    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-30 ml-64 flex h-16 items-center justify-between border-b border-white/10 bg-black/40 px-6 backdrop-blur-xl"
        >
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue"
                    />
                </div>

                <NotificationDropdown />

                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[1px]">
                        <div className="h-full w-full rounded-full bg-black/90 flex items-center justify-center text-xs font-bold text-white uppercase">
                            {userName.substring(0, 2)}
                        </div>
                    </div>
                    <span className="hidden text-sm font-medium text-white md:block">{userName}</span>
                </div>
            </div>
        </motion.header>
    )
}
