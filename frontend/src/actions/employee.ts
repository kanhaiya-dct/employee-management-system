'use server'

import { fetchFromAPI } from "@/lib/api"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const employeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(2),
  designation: z.string().min(2),
  joiningDate: z.string(),
  basicSalary: z.coerce.number().min(0),
})

export async function createEmployee(prevState: any, formData: FormData) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    department: formData.get("department") as string,
    designation: formData.get("designation") as string,
    joiningDate: formData.get("joiningDate") as string,
    basicSalary: formData.get("basicSalary") as string,
    role: formData.get("role") as string
  }

  const validation = employeeSchema.safeParse(data)
  if (!validation.success) {
    return { error: "Invalid input data. Please check all fields." }
  }

  try {
    await fetchFromAPI('/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (error: any) {
    console.error("Create Employee Error:", error)
    return { error: error.message || "Failed to create employee." }
  }

  revalidatePath("/dashboard/employees")
  redirect("/dashboard/employees")
}

export async function updateEmployee(prevState: any, formData: FormData) {
  const id = formData.get("id") as string
  
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    department: formData.get("department") as string,
    designation: formData.get("designation") as string,
    joiningDate: formData.get("joiningDate") as string,
    basicSalary: formData.get("basicSalary") as string,
    role: formData.get("role") as string
  }

  const validation = employeeSchema.safeParse(data)
  if (!validation.success) {
    return { error: "Invalid input data" }
  }

  try {
    await fetchFromAPI(`/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  } catch (error: any) {
    console.error("Update Employee Error:", error)
    return { error: error.message || "Failed to update employee." }
  }

  revalidatePath("/dashboard/employees")
  redirect("/dashboard/employees")
}
