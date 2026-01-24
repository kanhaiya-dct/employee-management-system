"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type CalendarProps = React.HTMLAttributes<HTMLDivElement>

function Calendar({ className, ...props }: CalendarProps) {
    return (
        <div className={`p-4 glass-card rounded-xl ${className}`} {...props}>
            <div className="flex justify-between items-center mb-4 text-white">
                <span>Mock Calendar</span>
                <div className="flex gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4" />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-400">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                        {i + 1}
                    </div>
                ))}
            </div>
        </div>
    )
}

Calendar.displayName = "Calendar"

export { Calendar }
