'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const leaveSchema = z.object({
  type: z.enum(["CASUAL", "SICK", "PAID", "UNPAID"]),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(5),
})

export async function applyLeave(prevState: any, formData: FormData) {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  const data = {
    type: formData.get("type"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    reason: formData.get("reason"),
  }

  const validation = leaveSchema.safeParse(data)
  if (!validation.success) {
    return { error: "Invalid leave details. Check dates and reason." }
  }

  try {
    await fetchFromAPI('/leaves', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-ID': session.userId 
      },
      body: JSON.stringify(validation.data)
    })
  } catch (error: any) {
    console.error("Leave Application Error:", error)
    return { error: error.message || "Failed to apply for leave" }
  }

  revalidatePath("/dashboard/leaves")
  redirect("/dashboard/leaves")
}

export async function updateLeaveStatus(leaveId: string, status: "APPROVED" | "REJECTED") {
  const session = await getSession() as any
  if (!session || session.role !== 'ADMIN') return { error: "Unauthorized" }

  try {
    await fetchFromAPI(`/leaves/${leaveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    
    revalidatePath("/dashboard/leaves")
    return { success: `Leave ${status.toLowerCase()}` }
  } catch (e: any) {
    return { error: e.message || "Failed to update leave status" }
  }
}
