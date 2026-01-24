import { getSession } from "@/lib/auth"
import { fetchFromAPI } from "@/lib/api"
import ProfileSettings from "@/components/settings/ProfileSettings"
import SecuritySettings from "@/components/settings/SecuritySettings"

export default async function SettingsPage() {
    const session = await getSession() as any
    if (!session) return <p>Unauthorized</p>

    try {
        const user = await fetchFromAPI('/auth/me', {
            headers: { 'X-User-ID': session.userId }
        })

        if (!user) return <p>User not found</p>

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Manage your profile and security.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProfileSettings user={user} />
                    <SecuritySettings />
                </div>
            </div>
        )
    } catch (error) {
        return <p className="text-white">Error loading settings</p>
    }
}
