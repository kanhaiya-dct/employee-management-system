import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import AttendanceWidget from "@/components/attendance/AttendanceWidget"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default async function AttendancePage() {
    const session = await getSession() as any

    try {
        // Fetch attendance data from API
        const today = new Date().toISOString().split('T')[0]
        const attendanceData = await fetchFromAPI(`/attendance?date=${today}`, {
            headers: { 'X-User-ID': session.userId }
        })

        const recentAttendance = await fetchFromAPI('/attendance?limit=10', {
            headers: { 'X-User-ID': session.userId }
        })

        const todayAttendance = attendanceData.find((att: any) =>
            new Date(att.date).toDateString() === new Date().toDateString()
        )

        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Attendance</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Action Widget */}
                    <div className="md:col-span-1">
                        <AttendanceWidget todayAttendance={todayAttendance} />
                    </div>

                    {/* Recent History */}
                    <div className="md:col-span-2 glass-card rounded-3xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent History</h3>
                        <div className="space-y-3">
                            {recentAttendance.map((att: any) => (
                                <div key={att.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${att.status === 'PRESENT' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {att.status === 'PRESENT' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{new Date(att.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500">{att.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <Clock size={14} />
                                            {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            <span> - </span>
                                            {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {recentAttendance.length === 0 && (
                                <p className="text-center text-gray-500 py-4">No attendance history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Error Loading Attendance</h2>
                <p className="text-gray-400">Unable to fetch attendance data.</p>
            </div>
        )
    }
}
