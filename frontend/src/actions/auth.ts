'use server'

import { fetchFromAPI } from "@/lib/api"
import { signAccessToken, signRefreshToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
})

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").trim()
  const password = (formData.get("password") as string || "").trim()

  const validation = loginSchema.safeParse({ email, password })
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    const data = await fetchFromAPI('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!data.user) {
      return { error: "Invalid credentials" }
    }

    const user = data.user
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee?.id
    }

    const accessToken = await signAccessToken(payload)
    const refreshToken = await signRefreshToken(payload)

    const cookieStore = await cookies()
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: 'lax',
      maxAge: 15 * 60
    })
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    })

  } catch (err) {
    if ((err as any).message === "NEXT_REDIRECT") throw err
    console.error("Login Error:", err)
    return { error: "Authentication failed. Please try again." }
  }

  redirect("/dashboard")
}

export async function logout() {
  console.log("Logging out...")
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")
  redirect("/login")
}