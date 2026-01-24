'use client'

import { MoreHorizontal, Mail, Phone, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteEmployee } from "@/actions/employees"
import { toast } from "sonner"

export default function EmployeeList({ employees }: { employees: any[] }) {
    const router = useRouter()

    return (
        <div className="glass-card overflow-hidden rounded-3xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase text-gray-300">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Employee</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold hidden md:table-cell">Contact</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Joined</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {employees.map((emp: any) => (
                            <tr key={emp.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue p-[2px]">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random`}
                                                alt="Avatar"
                                                className="h-full w-full rounded-full object-cover border-2 border-black"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{emp.firstName} {emp.lastName}</div>
                                            <div className="text-xs text-gray-500">{emp.department}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="scrim-bg rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-white border border-white/10">
                                        {emp.designation}
                                    </span>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Mail size={12} className="text-gray-500" />
                                            <span>{emp.user?.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Phone size={12} className="text-gray-500" />
                                            <span>{emp.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    {new Date(emp.joiningDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${emp.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${emp.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                        {emp.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/dashboard/employees/${emp.id}/edit`} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-neon-cyan transition-colors" title="Edit">
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
                                                    const res = await deleteEmployee(emp.id)
                                                    if (res.error) toast.error(res.error)
                                                    else toast.success(res.success)
                                                }
                                            }}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {employees.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
