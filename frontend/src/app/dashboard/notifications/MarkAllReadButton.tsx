'use client'

import { markAllAsRead } from "@/actions/notification"
import { CheckCheck, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function MarkAllReadButton() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleMarkAll = async () => {
        setIsPending(true)
        const res = await markAllAsRead()
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.success)
            router.refresh()
        }
        setIsPending(false)
    }

    return (
        <button
            onClick={handleMarkAll}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCheck size={16} />}
            <span>Mark all read</span>
        </button>
    )
}
