'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Calendar, User } from 'lucide-react'

// This would ideally be a Server Component fetching data + Client Component for actions
// For simplicity in this demo, I'll mock the data or assuming it's passed as props.

export default function LeaveApprovalDashboard({ pendingLeaves }: { pendingLeaves: any[] }) {
    // In real app, use server actions to approve/reject
    // const [state, approveAction] = useActionState(approveLeave, null)

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Pending Requests</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingLeaves.map((leave) => (
                    <div key={leave.id} className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group hover:border-neon-blue/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-lg font-bold">
                                {leave.employee?.firstName?.[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">{leave.employee?.firstName} {leave.employee?.lastName}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="uppercase tracking-wider text-neon-cyan">{leave.type}</span>
                                    <span>•</span>
                                    <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{leave.reason}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <ActionButtons leaveId={leave.id} />
                        </div>
                    </div>
                ))}

                {pendingLeaves.length === 0 && (
                    <p className="text-gray-500 py-4">No pending leave requests.</p>
                )}
            </div>
        </div>
    )
}

function ActionButtons({ leaveId }: { leaveId: string }) {
    const [isPending, setIsPending] = useState(false)

    const handleAction = async (status: "APPROVED" | "REJECTED") => {
        setIsPending(true)
        try {
            const { updateLeaveStatus } = await import("@/actions/leave")
            const res = await updateLeaveStatus(leaveId, status)
            if (res?.success) toast.success(res.success)
            if (res?.error) toast.error(res.error)
        } catch (e) {
            toast.error("An error occurred")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <>
            <button
                onClick={() => handleAction("APPROVED")}
                disabled={isPending}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
                <Check size={18} /> <span className="sm:hidden">Approve</span>
            </button>
            <button
                onClick={() => handleAction("REJECTED")}
                disabled={isPending}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
                <X size={18} /> <span className="sm:hidden">Reject</span>
            </button>
        </>
    )
}

import { toast } from "sonner"
