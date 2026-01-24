'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"

export async function getDashboardStats() {
  const session = await getSession() as any
  if (!session) return null

  try {
    const stats = await fetchFromAPI('/dashboard/stats', {
      headers: { 'X-User-ID': session.userId }
    })
    return stats
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return null
  }
}

export async function getPayrollChartData() {
  try {
    const data = await fetchFromAPI('/dashboard/payroll-chart')
    return data
  } catch (error) {
    console.error("Payroll chart error:", error)
    return []
  }
}

export async function getAttendanceChartData() {
  try {
    const data = await fetchFromAPI('/dashboard/attendance-chart')
    return data
  } catch (error) {
    console.error("Attendance chart error:", error)
    return []
  }
}
