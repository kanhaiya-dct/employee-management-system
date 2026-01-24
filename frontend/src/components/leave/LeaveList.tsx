'use client'

import { useActionState, useState } from 'react'
import { applyLeave } from '@/actions/leave'
import { motion } from 'framer-motion'
import { Loader2, Plus, Calendar } from 'lucide-react'

export default function LeavesPage({ leaves }: { leaves: any[] }) {
    const [showForm, setShowForm] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Leaves</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-colors"
                >
                    <Plus size={18} /> Apply Leave
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-3xl border border-neon-purple/20"
                >
                    <LeaveForm />
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leaves.map((leave) => (
                    <div key={leave.id} className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${leave.status === 'APPROVED' ? 'bg-green-500' : leave.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>

                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{leave.type}</span>
                            <span className={`text-xs px-2 py-1 rounded-lg ${leave.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : leave.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {leave.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-white mb-3">
                            <Calendar size={16} className="text-neon-cyan" />
                            <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                            <span className="text-gray-600">→</span>
                            <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-2">{leave.reason}</p>
                    </div>
                ))}

                {leaves.length === 0 && !showForm && (
                    <p className="col-span-full text-center text-gray-500 py-10">No leave history found.</p>
                )}
            </div>
        </div>
    )
}

function LeaveForm() {
    const [state, action, isPending] = useActionState(applyLeave, null)

    return (
        <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Leave Type</label>
                    <select name="type" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none">
                        <option value="CASUAL">Casual Leave</option>
                        <option value="SICK">Sick Leave</option>
                        <option value="PAID">Paid Leave</option>
                        <option value="UNPAID">Unpaid Leave</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Reason</label>
                    <input name="reason" placeholder="Brief reason..." required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Start Date</label>
                    <input name="startDate" type="date" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">End Date</label>
                    <input name="endDate" type="date" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-neon-purple outline-none" />
                </div>
            </div>

            {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

            <div className="flex justify-end pt-2">
                <button
                    disabled={isPending}
                    className="px-6 py-2 rounded-xl bg-neon-purple text-white font-medium hover:bg-neon-purple/90 disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending && <Loader2 className="animate-spin h-4 w-4" />}
                    Submit Application
                </button>
            </div>
        </form>
    )
}
