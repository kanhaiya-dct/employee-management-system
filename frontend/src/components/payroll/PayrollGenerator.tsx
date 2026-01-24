'use client'

import { useActionState, useEffect } from 'react'
import { generatePayroll } from '@/actions/payroll'
import { Loader2, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function PayrollGenerator({ employees }: { employees: any[] }) {
    const [state, action, isPending] = useActionState(generatePayroll, null)

    useEffect(() => {
        if (state?.success) toast.success(state.success)
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <div className="glass-card p-6 rounded-3xl mb-8 border border-neon-blue/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="text-neon-blue" size={20} /> Generate Payroll
            </h3>

            <form action={action} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                    <label className="text-sm text-gray-400">Select Employee</label>
                    <select name="employeeId" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none">
                        {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department})</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 space-y-2 w-full">
                    <label className="text-sm text-gray-400">Select Month</label>
                    <input type="month" name="month" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none" />
                </div>

                <button
                    disabled={isPending}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-neon-blue text-white font-semibold hover:bg-neon-blue/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isPending && <Loader2 className="animate-spin" size={18} />}
                    Generate
                </button>
            </form>

            {state?.success && <p className="text-green-400 text-sm mt-3">{state.success}</p>}
            {state?.error && <p className="text-red-400 text-sm mt-3">{state.error}</p>}
        </div>
    )
}
