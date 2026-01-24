'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function generatePayroll(prevState: any, formData: FormData) {
  const session = await getSession() as any
  if (!session || (session.role !== 'ADMIN' && session.role !== 'HR')) return { error: "Unauthorized" }

  const employeeId = formData.get("employeeId") as string
  const monthStr = formData.get("month") as string

  if (!employeeId || !monthStr) return { error: "Missing required fields" }
  
  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(monthStr)) {
    return { error: "Invalid month format. Use YYYY-MM" };
  }

  try {
    const result = await fetchFromAPI('/payroll/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, month: monthStr })
    })
    
    revalidatePath("/dashboard/payroll")
    return { success: result.success }
  } catch (error: any) {
    console.error("Payroll Error:", error)
    return { error: error.message || "Failed to generate payroll" }
  }
}

export async function approvePayroll(payrollId: string) {
  const session = await getSession() as any
  if (!session || session.role !== 'ADMIN') return { error: "Unauthorized" }

  try {
    await fetchFromAPI(`/payroll/${payrollId}/approve`, {
      method: 'PUT'
    })
    
    revalidatePath("/dashboard/payroll")
    return { success: "Payroll approved and marked as PAID" }
  } catch (e: any) {
    return { error: e.message || "Failed to approve payroll" }
  }
}
