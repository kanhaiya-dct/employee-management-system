import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { Plus } from "lucide-react"
import Link from "next/link"
import EmployeeList from "@/components/employees/EmployeeList"
import SearchInput from "@/components/shared/SearchInput"
import Pagination from "@/components/shared/Pagination"

export default async function EmployeesPage(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = 10;

    const session = await getSession() as any

    // Fetch Data from API
    const employees = await fetchFromAPI(`/employees?query=${query}&page=${currentPage}&pageSize=${pageSize}`)
    const totalCount = employees.length // API should return total count
    const totalPages = Math.ceil(totalCount / pageSize)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Employees</h1>
                    <p className="text-gray-400">Manage your team members ({totalCount})</p>
                </div>

                <Link
                    href="/dashboard/employees/new"
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 font-medium text-white shadow-lg shadow-neon-blue/20 transition-all hover:scale-[1.02]"
                >
                    <Plus size={18} />
                    <span>Add Employee</span>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-2 backdrop-blur-md">
                <SearchInput placeholder="Search by name, email, or role..." />
            </div>

            {/* Table */}
            <EmployeeList employees={employees} />

            {/* Pagination */}
            <div className="mt-4">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
