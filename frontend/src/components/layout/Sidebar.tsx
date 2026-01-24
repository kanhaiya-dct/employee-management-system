'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    Banknote,
    Settings,
    LogOut,
    Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { href: '/dashboard/employees', label: 'Employees', icon: Users, roles: ['ADMIN', 'HR'] },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CalendarCheck, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { href: '/dashboard/leaves', label: 'Leaves', icon: CalendarDays, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { href: '/dashboard/payroll', label: 'Payroll', icon: Banknote, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
]

export default function Sidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname()

    // Filter links based on role
    const filteredLinks = links.filter(link => link.roles.includes(userRole))

    return (
        <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl"
        >
            <div className="flex h-16 items-center justify-center border-b border-white/10">
                <h1 className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-2xl font-bold text-transparent">
                    EMS
                </h1>
            </div>

            <nav className="space-y-2 p-4">
                {filteredLinks.map((link) => {
                    const isActive = pathname === link.href

                    return (
                        <Link key={link.href} href={link.href}>
                            <div
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                                    isActive
                                        ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white shadow-lg shadow-neon-blue/10 border border-white/5"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <link.icon className={cn("h-5 w-5", isActive ? "text-neon-cyan" : "text-gray-500 group-hover:text-neon-cyan")} />
                                <span className="font-medium">{link.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 h-full w-1 bg-neon-cyan rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>



            <div className="absolute bottom-4 w-full px-4">
                <button
                    onClick={() => logout()}
                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="h-5 w-5 group-hover:text-red-500" />
                    <span className="font-medium group-hover:text-red-500">Logout</span>
                </button>
            </div>
        </motion.aside>
    )
}
