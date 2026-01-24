'use server'

import { fetchFromAPI } from "@/lib/api"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getNotifications() {
  const session = await getSession() as any
  if (!session) return []

  try {
    const notifications = await fetchFromAPI('/notifications', {
      headers: { 'X-User-ID': session.userId }
    })
    return notifications
  } catch (error) {
    console.error("Fetch Notifications Error:", error)
    return []
  }
}

export async function markAsRead(id: string) {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  try {
    await fetchFromAPI(`/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'X-User-ID': session.userId }
    })
    revalidatePath("/dashboard/notifications")
    return { success: "Marked as read" }
  } catch (error: any) {
    return { error: error.message || "Failed to update notification" }
  }
}

export async function markAllAsRead() {
  const session = await getSession() as any
  if (!session) return { error: "Unauthorized" }

  try {
    await fetchFromAPI('/notifications/read-all', {
      method: 'PUT',
      headers: { 'X-User-ID': session.userId }
    })
    revalidatePath("/dashboard/notifications")
    return { success: "All marked as read" }
  } catch (error: any) {
    return { error: error.message || "Failed to update notifications" }
  }
}
