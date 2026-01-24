import { getSession } from "@/lib/auth"
import Link from "next/link"
import { ArrowRight, CheckCircle, Zap, Shield, Users } from "lucide-react"

export default async function LandingPage() {
  const session = await getSession()
  const isLoggedIn = !!session

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-neon-purple selection:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple"></div>
            <span className="text-xl font-bold tracking-tight">EMS<span className="text-neon-cyan">.io</span></span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 font-medium hover:bg-white/20 transition-all"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-6 py-2 font-medium shadow-lg shadow-neon-blue/20 hover:scale-105 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-neon-purple/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 right-20 h-[300px] w-[300px] rounded-full bg-neon-cyan/20 blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            The Future of <br className="hidden sm:block" />
            <span className="text-white">Workforce Management</span>
          </h1>
          <p className="mb-10 text-xl text-gray-400 sm:text-2xl max-w-2xl mx-auto">
            Streamline attendance, payroll, and team performance with a Gen-Z ready platform designed for speed and style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 font-bold text-black hover:bg-gray-200 transition-all"
              >
                Launch Dashboard <Zap size={18} className="fill-black" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 font-bold text-black hover:bg-gray-200 transition-all"
              >
                Get Started <ArrowRight size={18} />
              </Link>
            )}
            <button className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 font-medium hover:bg-white/10 transition-all">
              View Demo
            </button>
          </div>
        </div>

        {/* Hero Image Mockup */}
        <div className="mx-auto mt-20 max-w-6xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
          <div className="overflow-hidden rounded-xl bg-black">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Dashboard Preview" className="h-full w-full object-cover opacity-80" />
            {/* In a real app, I'd put a screenshot of the actual dashboard here */}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need</h2>
            <p className="mt-4 text-gray-400">Everything you need to manage your team, minus the headache.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Employee Profiles"
              desc="Manage details, roles, and history in one secure place."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Smart Attendance"
              desc="Geofenced check-ins and automated late detection."
            />
            <FeatureCard
              icon={Shield}
              title="Payroll & Security"
              desc="Automated salary calculation with role-based access control."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-center text-sm text-gray-500">
        <p>© 2026 EMS Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-neon-purple/50 transition-all">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-purple/20 text-neon-purple group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  )
}
