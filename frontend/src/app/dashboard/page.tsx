import { getSession } from "@/lib/auth"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import Link from "next/link"
import { Users, Clock, Calendar, CheckCircle } from "lucide-react"

import { getDashboardStats, getPayrollChartData, getAttendanceChartData } from "@/actions/dashboard"

export default async function DashboardPage() {
    const session = await getSession() as any
    const userRole = session?.role || "EMPLOYEE"
    const stats = await getDashboardStats()

    if (userRole === 'ADMIN') {
        const payrollData = await getPayrollChartData()
        const attendanceData = await getAttendanceChartData()

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Admin Overview
                    </h1>
                    <p className="text-gray-400">System performance and dynamic statistics.</p>
                </div>
                <AdminDashboard stats={stats} payrollData={payrollData} attendanceData={attendanceData} />
            </div>
        )
    }

    // Employee & HR View (Personal Stats)
    const attendanceStatus = stats?.attendance?.status || "Mark Attendance"
    const checkInTime = stats?.attendance?.checkIn || "--:--"
    const leaveBalance = stats?.leave?.balance ?? "--"; // 0 is a valid number

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="text-neon-cyan">{session?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-gray-400">Here is what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Attendance"
                    value={attendanceStatus}
                    trend={checkInTime}
                    icon={CheckCircle}
                    color="neon-blue"
                />
                <StatsCard
                    title="Leave Balance"
                    value={`${leaveBalance} Days`}
                    trend="Available"
                    icon={Calendar}
                    color="neon-purple"
                />
            </div>

            <div className="glass-card p-6 rounded-3xl">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <Link href="/dashboard/leaves" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-colors">Apply Leave</Link>
                    <Link href="/dashboard/payroll" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 transition-colors">View Payslips</Link>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, trend, icon: Icon, color }: any) {
    return (
        <div className="glass-card relative overflow-hidden rounded-3xl p-6 transition-all hover:translate-y-[-4px]">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-${color}/10 blur-xl`}></div>
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`rounded-xl bg-${color}/20 p-3 text-${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400">{trend}</span>
            </div>
        </div>
    )
}
