'use client'

import { useActionState, useEffect } from 'react'
import { markAttendance } from '@/actions/attendance'
import { motion } from 'framer-motion'
import { Loader2, Fingerprint, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export default function AttendanceWidget({ todayAttendance }: { todayAttendance: any }) {
    const [state, action, isPending] = useActionState(markAttendance, null)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
        if (state?.success) toast.success(state.success)
    }, [state])

    const isCheckedIn = !!todayAttendance
    const isCheckedOut = !!todayAttendance?.checkOut

    return (
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-white/5 to-white/0">
            <h3 className="text-xl font-bold text-white mb-4">Attendance</h3>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    {/* Animated Pulse Ring */}
                    {!isCheckedOut && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`absolute inset-0 rounded-full ${isCheckedIn ? 'bg-red-500/30' : 'bg-neon-cyan/30'} blur-md`}
                        />
                    )}

                    <div className={`h-24 w-24 rounded-full flex items-center justify-center border-4 ${isCheckedIn ? (isCheckedOut ? 'border-gray-500 bg-gray-500/10' : 'border-red-500 bg-red-500/10') : 'border-neon-cyan bg-neon-cyan/10'}`}>
                        <Fingerprint size={48} className={isCheckedIn ? (isCheckedOut ? 'text-gray-500' : 'text-red-500') : 'text-neon-cyan'} />
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        {isCheckedOut
                            ? "Shift Completed"
                            : isCheckedIn
                                ? "Currently Working"
                                : "Not Checked In"}
                    </p>
                    {isCheckedIn && (
                        <p className="text-white font-mono text-lg mt-1">
                            In: {new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>

                <form action={action} className="w-full">
                    {!isCheckedIn ? (
                        <input type="hidden" name="action" value="CHECK_IN" />
                    ) : (
                        <input type="hidden" name="action" value="CHECK_OUT" />
                    )}

                    <button
                        disabled={isPending || isCheckedOut}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${isCheckedOut
                            ? 'bg-gray-700 cursor-not-allowed opacity-50'
                            : isCheckedIn
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/20'
                                : 'bg-gradient-to-r from-neon-cyan to-neon-blue shadow-neon-blue/20'
                            }`}
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : isCheckedOut ? (
                            "Good Job!"
                        ) : isCheckedIn ? (
                            <>
                                <LogOut size={18} /> Check Out
                            </>
                        ) : (
                            "Check In"
                        )}
                    </button>

                    {state?.error && <p className="text-red-400 text-xs text-center mt-2">{state.error}</p>}
                    {state?.success && <p className="text-green-400 text-xs text-center mt-2">{state.success}</p>}
                </form>
            </div>
        </div>
    )
}
