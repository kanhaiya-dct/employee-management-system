'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export async function changePassword(prevState: any, formData: FormData) {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  const validation = passwordSchema.safeParse({ currentPassword, newPassword })
  if (!validation.success) return { error: "Password must be at least 6 characters" }

  try {
    const result = await fetchFromAPI('/settings/password', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-ID': session.userId 
      },
      body: JSON.stringify({ currentPassword, newPassword })
    })

    return { success: result.success || "Password updated successfully" }
  } catch (e: any) {
    return { error: e.message || "Failed to update password" }
  }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  const phone = formData.get("phone") as string

  try {
    await fetchFromAPI('/settings/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-ID': session.userId 
      },
      body: JSON.stringify({ phone })
    })
    
    revalidatePath("/dashboard/settings")
    return { success: "Profile updated successfully" }
  } catch (e: any) {
    return { error: e.message || "Failed to update profile" }
  }
}
