import { getNotifications, markAllAsRead } from "@/actions/notification"
import { Bell, CheckCheck, Clock } from "lucide-react"
import { MarkAllReadButton } from "./MarkAllReadButton"

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const notifications = await getNotifications()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400">Stay updated with latest alerts ({notifications.filter((n: any) => !n.isRead).length} unread)</p>
                </div>

                <MarkAllReadButton />
            </div>

            <div className="glass-card overflow-hidden rounded-3xl p-6 space-y-4">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                        <div className="bg-white/5 p-4 rounded-full mb-4">
                            <Bell size={32} className="opacity-50" />
                        </div>
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {notifications.map((n: any) => (
                            <div
                                key={n.id}
                                className={`relative flex gap-4 p-4 rounded-2xl border transition-all ${n.isRead ? 'bg-white/5 border-white/5 opacity-75' : 'bg-gradient-to-r from-white/10 to-transparent border-neon-blue/30'}`}
                            >
                                <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.isRead ? 'bg-gray-500' : 'bg-neon-blue shadow-[0_0_8px_var(--neon-blue)]'}`} />

                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${n.isRead ? 'text-gray-300' : 'text-white'}`}>{n.title}</h3>
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} />
                                            {new Date(n.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{n.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
