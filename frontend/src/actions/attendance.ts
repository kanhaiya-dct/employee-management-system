'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function markAttendance(prevState: any, formData: FormData) {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  const action = formData.get("action") as "CHECK_IN" | "CHECK_OUT"
  
  try {
    const result = await fetchFromAPI('/attendance/mark', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-ID': session.userId 
      },
      body: JSON.stringify({ action })
    })
    
    revalidatePath("/dashboard")
    return { success: result.success || "Attendance marked successfully" }
  } catch (error: any) {
    console.error("Attendance Error:", error)
    return { error: error.message || "Failed to mark attendance" }
  }
}
