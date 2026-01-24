'use client'

import { updateEmployee } from "@/actions/employee"
import { useActionState, useEffect } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EditEmployeeForm({ employee }: { employee: any }) {
    const [state, action, isPending] = useActionState(updateEmployee, null)

    useEffect(() => {
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/employees" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Employee</h1>
                    <p className="text-gray-400">Update employee profile</p>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl">
                <form action={action} className="space-y-8">
                    <input type="hidden" name="id" value={employee.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <div className="space-y-4 md:col-span-2">
                            <h2 className="text-lg font-semibold text-neon-blue border-b border-white/10 pb-2">Personal Information</h2>
                        </div>

                        <InputGroup label="First Name" name="firstName" defaultValue={employee.firstName} required />
                        <InputGroup label="Last Name" name="lastName" defaultValue={employee.lastName} required />
                        <InputGroup label="Email" name="email" type="email" defaultValue={employee.user.email} required />
                        <InputGroup label="Phone" name="phone" defaultValue={employee.phone} />

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Role</label>
                            <select
                                name="role"
                                defaultValue={employee.user.role}
                                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="HR">HR</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        {/* Job Info */}
                        <div className="space-y-4 md:col-span-2 pt-4">
                            <h2 className="text-lg font-semibold text-neon-purple border-b border-white/10 pb-2">Job Details</h2>
                        </div>

                        <InputGroup label="Department" name="department" defaultValue={employee.department} required />
                        <InputGroup label="Designation" name="designation" defaultValue={employee.designation} required />
                        <InputGroup
                            label="Joining Date"
                            name="joiningDate"
                            type="date"
                            defaultValue={employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : ''}
                            required
                        />
                        <InputGroup label="Basic Salary (Monthly)" name="basicSalary" type="number" defaultValue={employee.basicSalary} required />

                    </div>

                    {state?.error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center">
                            {state.error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard/employees" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium shadow-lg shadow-neon-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isPending && <Loader2 className="animate-spin h-5 w-5" />}
                            Update Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function InputGroup({ label, name, type = "text", defaultValue, required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
                {label} {required && <span className="text-neon-cyan">*</span>}
            </label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
            />
        </div>
    )
}
