import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import PayrollGenerator from "@/components/payroll/PayrollGenerator"
import SearchInput from "@/components/shared/SearchInput"
import Pagination from "@/components/shared/Pagination"
import PayslipDownloadButton from "@/components/payroll/PayslipDownloadButton"
import { approvePayroll } from "@/actions/payroll"

export default async function PayrollPage(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const pageSize = 10;

    const session = await getSession() as any
    const isEmployee = session.role === 'EMPLOYEE'

    // Fetch payroll data from API
    const payrollData = await fetchFromAPI(`/payroll?query=${query}&page=${currentPage}&pageSize=${pageSize}`, {
        headers: { 'X-User-ID': session.userId }
    })

    const payrolls = payrollData.payrolls || []
    const totalCount = payrollData.total || payrolls.length
    const totalPages = Math.ceil(totalCount / pageSize)

    // Fetch employees for dropdown if admin
    const employees = !isEmployee ? await fetchFromAPI('/employees') : []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Payroll</h1>
                    <p className="text-gray-400">Total Records: {totalCount}</p>
                </div>
            </div>

            {!isEmployee && (
                <div className="space-y-6">
                    <PayrollGenerator employees={employees} />
                    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-2 backdrop-blur-md">
                        <SearchInput placeholder="Search payroll by employee or status..." />
                    </div>
                </div>
            )}

            {/* List */}
            <div className="glass-card rounded-3xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-xs uppercase text-gray-300">
                        <tr>
                            <th className="px-6 py-4">Month</th>
                            {!isEmployee && <th className="px-6 py-4">Employee</th>}
                            <th className="px-6 py-4">Basic</th>
                            <th className="px-6 py-4">Net Salary</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Payslip</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payrolls.map((pay: any) => (
                            <tr key={pay.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 text-white font-medium">
                                    {new Date(pay.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </td>
                                {!isEmployee && (
                                    <td className="px-6 py-4">
                                        {pay.employee?.firstName} {pay.employee?.lastName}
                                    </td>
                                )}
                                <td className="px-6 py-4">${pay.basicSalary}</td>
                                <td className="px-6 py-4 text-neon-cyan font-bold">${pay.netSalary?.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${pay.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {pay.status}
                                    </span>
                                    {pay.status === 'PENDING' && !isEmployee && session.role === 'ADMIN' && (
                                        <form action={async () => {
                                            "use server"
                                            await approvePayroll(pay.id)
                                        }} className="inline-block ml-2">
                                            <button className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded hover:bg-neon-cyan/30 transition-colors">
                                                Approve
                                            </button>
                                        </form>
                                    )}
                                </td>
                                <td className="text-right px-6 py-4">
                                    <PayslipDownloadButton payroll={pay} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {payrolls.length === 0 && <p className="p-8 text-center text-gray-500">No payroll records found.</p>}
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
