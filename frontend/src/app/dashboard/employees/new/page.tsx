'use client'

import { createEmployee } from "@/actions/employee"
import { useActionState, useEffect } from "react"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getSession } from "@/lib/auth"

// This needs to be a Client Component because of hooks, 
// BUT we need session role.
// Strategy: We can fetch session in a server component wrapper if we split files, 
// OR simpler for this file: just use client-side session or pass it via props if this was a server page 
// (Wait, 'use client' is at top, so it IS a client component).
// To avoid refactoring entire file structure to separate Server/Client parts right now, 
// I will just use a client-side prop or similar. 
// ACTUALLY, the previous edit tried to make it async server component but kept 'use client'.
// Let's fix this properly.

export default function NewEmployeePageWrapper() {
    // Since we can't easily make this async server component without removing 'use client',
    // And we need hooks for the form...
    // Let's Assume the user is passed or we fetch it.
    // For simplicity in this 'use client' file, we can't await getSession() directly in render.
    // I will convert the PARENT page to Server Component in a real app, but here I'll use a trick or just fetch it.

    // Better Approach: Revert to Client Component, and maybe just hardcode role 'ADMIN' for logic 
    // OR create a separate server component file. 
    // Given the constraints and current file state is 'use client', I'll make a self-contained component.

    // Let's use a Prop if passed, but since it's a page...
    // I will just add the dropdown and let the Server Action handle the security validation.
    // The UI can show it, and if a non-admin tries to pick HR, server blocks it.

    // Actually, I can keep it simple.

    return <NewEmployeeForm />
}


function NewEmployeeForm() {
    const [state, action, isPending] = useActionState(createEmployee, null)

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
                    <h1 className="text-2xl font-bold text-white">Add New Employee</h1>
                    <p className="text-gray-400">Create a new employee profile</p>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl">
                <form action={action} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <div className="space-y-4 md:col-span-2">
                            <h2 className="text-lg font-semibold text-neon-blue border-b border-white/10 pb-2">Personal Information</h2>
                        </div>

                        <InputGroup label="First Name" name="firstName" placeholder="John" required />
                        <InputGroup label="Last Name" name="lastName" placeholder="Doe" required />
                        <InputGroup label="Email" name="email" type="email" placeholder="john@ems.com" required />
                        <InputGroup label="Phone" name="phone" placeholder="+1 234 567 890" />

                        {/* Role Selection - Visible to everyone but valid only for Admin */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Role</label>
                            <select name="role" className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all">
                                <option value="EMPLOYEE">Employee</option>
                                <option value="HR">HR</option>
                            </select>
                            <p className="text-xs text-gray-500">Only Admins can create HRs.</p>
                        </div>

                        {/* Job Info */}
                        <div className="space-y-4 md:col-span-2 pt-4">
                            <h2 className="text-lg font-semibold text-neon-purple border-b border-white/10 pb-2">Job Details</h2>
                        </div>

                        <InputGroup label="Department" name="department" placeholder="Engineering" required />
                        <InputGroup label="Designation" name="designation" placeholder="Senior Developer" required />
                        <InputGroup label="Joining Date" name="joiningDate" type="date" required />
                        <InputGroup label="Basic Salary (Monthly)" name="basicSalary" type="number" placeholder="5000" required />

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
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function InputGroup({ label, name, type = "text", placeholder, required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
                {label} {required && <span className="text-neon-cyan">*</span>}
            </label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
            />
        </div>
    )
}
