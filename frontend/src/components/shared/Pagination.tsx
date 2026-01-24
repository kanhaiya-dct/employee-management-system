'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const currentPage = Number(searchParams.get("page")) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        replace(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => createPageURL(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => createPageURL(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">
                        Showing page <span className="font-medium text-white">{currentPage}</span> of{" "}
                        <span className="font-medium text-white">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => createPageURL(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {/* Simple Pagination Logic: Show current page */}
                        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 bg-neon-blue/20 focus:z-20 focus:outline-offset-0">
                            {currentPage}
                        </button>

                        <button
                            onClick={() => createPageURL(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
