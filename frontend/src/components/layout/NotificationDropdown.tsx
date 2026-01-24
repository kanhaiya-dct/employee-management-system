'use client'

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getNotifications, markAsRead } from '@/actions/notification'

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Poll or fetch on mount
    const fetchNotifications = async () => {
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Optional: Poll every 30s
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => !n.isRead).length

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        await markAsRead(id)
    }

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
                className="relative rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all outline-none"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon-purple shadow-[0_0_8px_var(--neon-purple)] animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 z-50 glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
                                <h3 className="font-semibold text-white">Notifications</h3>
                                <span className="text-xs text-gray-500">{unreadCount} unread</span>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-xs text-gray-500">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <p className="p-4 text-center text-gray-500 text-sm">No notifications</p>
                                ) : (
                                    notifications.slice(0, 5).map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!n.isRead ? 'bg-neon-purple/5' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-medium ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                                                <span className="text-xs text-gray-600">
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-2 bg-black/40 border-t border-white/5 text-center">
                                <Link
                                    href="/dashboard/notifications"
                                    className="text-xs text-neon-blue hover:text-neon-cyan transition-colors block w-full py-1"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View All
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
