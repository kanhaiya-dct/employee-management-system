'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function deleteEmployee(employeeId: string) {
  const session = await getSession() as any
  if (!session || (session.role !== 'ADMIN' && session.role !== 'HR')) {
    return { error: "Unauthorized" }
  }

  try {
    await fetchFromAPI(`/employees/${employeeId}`, {
      method: 'DELETE'
    })

    revalidatePath("/dashboard/employees")
    return { success: "Employee deleted successfully" }
  } catch (e: any) {
    console.error(e)
    return { error: e.message || "Failed to delete employee" }
  }
}
