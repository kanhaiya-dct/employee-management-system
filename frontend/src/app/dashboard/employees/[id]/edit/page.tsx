import { fetchFromAPI } from "@/lib/api"
import { notFound } from "next/navigation"
import EditEmployeeForm from "./EditEmployeeForm"

export default async function EditEmployeePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    try {
        const employee = await fetchFromAPI(`/employees/${id}`)

        if (!employee) {
            notFound()
        }

        return (
            <EditEmployeeForm employee={employee} />
        )
    } catch (error) {
        notFound()
    }
}
