'use client'

import { useActionState, useEffect } from "react"
import { loginAction } from "@/actions/auth"
import { motion } from "framer-motion"
import { toast } from 'sonner'
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [state, action, isPending] = useActionState(loginAction, null)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <div className="flex h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card w-full max-w-md rounded-3xl p-8"
            >
                <div className="mb-8 text-center">
                    <h1 className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-4xl font-bold text-transparent">
                        EMS
                    </h1>
                    <p className="mt-2 text-gray-400">Gen-Z Employee Management</p>
                </div>

                <form action={action} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 backdrop-blur-md focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
                            placeholder="admin@ems.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 backdrop-blur-md focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">
                            {state.error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple p-3 font-semibold text-white shadow-lg shadow-neon-blue/20 transition-all hover:scale-[1.02] hover:shadow-neon-purple/40 disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
                    >
                        {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
