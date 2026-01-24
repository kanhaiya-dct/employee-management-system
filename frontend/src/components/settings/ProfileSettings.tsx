'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateProfile } from "@/actions/settings"
import { User, Phone, Mail, Building, Edit2, Check, X, Loader2 } from 'lucide-react'
import { toast } from "sonner"

export default function ProfileSettings({ user }: any) {
    return (
        <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <User size={20} className="text-neon-cyan" /> Profile Information
            </h3>

            <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl space-y-1">
                    <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Full Name</label>
                    <p className="text-white text-lg font-medium">{user.employee?.firstName} {user.employee?.lastName}</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl space-y-1">
                    <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-2">
                        <Mail size={12} /> Email Address
                    </label>
                    <p className="text-white text-lg font-medium">{user.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl space-y-1">
                        <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider flex items-center gap-2">
                            <Building size={12} /> Department
                        </label>
                        <p className="text-white font-medium">{user.employee?.department || 'N/A'}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl space-y-1">
                        <label className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Designation</label>
                        <p className="text-white font-medium">{user.employee?.designation || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <button disabled className="w-full py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors text-sm font-medium cursor-not-allowed">
                Edit Profile (Contact Admin)
            </button>
        </div>
    )
}
