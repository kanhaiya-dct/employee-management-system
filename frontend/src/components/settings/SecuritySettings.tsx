'use client'

import { useActionState, useEffect } from "react"
import { changePassword } from "@/actions/settings"
import { Lock, Shield, Loader2 } from 'lucide-react'
import { toast } from "sonner"

export default function SecuritySettings() {
    const [state, action, isPending] = useActionState(changePassword, null)

    useEffect(() => {
        if (state?.success) toast.success(state.success)
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield size={20} className="text-neon-purple" /> Security
            </h3>

            <form action={action} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Current Password</label>
                    <div className="relative">
                        <input name="currentPassword" type="password" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-neon-purple/50 transition-colors" />
                        <Lock size={16} className="absolute right-4 top-3.5 text-gray-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">New Password</label>
                    <div className="relative">
                        <input name="newPassword" type="password" required minLength={6} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-neon-purple/50 transition-colors" />
                        <Lock size={16} className="absolute right-4 top-3.5 text-gray-500" />
                    </div>
                </div>

                <button disabled={isPending} className="w-full py-3 rounded-xl bg-neon-purple text-white font-semibold hover:bg-neon-purple/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                    {isPending && <Loader2 className="animate-spin" size={18} />}
                    Update Password
                </button>
            </form>
        </div>
    )
}

