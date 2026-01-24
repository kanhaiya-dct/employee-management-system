import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import LeaveList from "@/components/leave/LeaveList"
import LeaveApprovalDashboard from "@/components/leave/LeaveApprovalDashboard"

export default async function LeavesPageWrapper() {
    const session = await getSession() as any
    const userRole = session?.role || "EMPLOYEE"

    try {
        // Admin View
        if (userRole === 'ADMIN') {
            const pendingLeaves = await fetchFromAPI('/leaves?status=PENDING')
            return <LeaveApprovalDashboard pendingLeaves={pendingLeaves} />
        }

        // Employee View
        const leaves = await fetchFromAPI('/leaves', {
            headers: { 'X-User-ID': session.userId }
        })

        return <LeaveList leaves={leaves} />
    } catch (error) {
        return <div className="text-white p-8">Error loading leaves data</div>
    }
}
