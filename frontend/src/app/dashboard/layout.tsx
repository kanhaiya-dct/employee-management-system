import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession() as any

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar userRole={session.role} />

            <div className="flex-1 flex flex-col ml-0 md:ml-0 transition-all duration-300">
                {/* Sidebar is fixed, so we might need padding-left or just rely on the Sidebar component handling its positioning relative to this. 
             But Sidebar is fixed. So this div needs margin-left equal to sidebar width.
             Sidebar w-64 = 16rem = 256px.
          */}
                <main className="flex-1 pl-64">
                    <Topbar userName={session.email.split('@')[0]} />
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
