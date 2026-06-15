"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        const userResponse = await fetch("/api/user/profile")
        const userData = await userResponse.json()
        router.push(userData.user?.roleType === "manager" ? "/manager/dashboard" : "/dashboard")
      } else {
        const data = await response.json()
        setError(data.message || data.error || "Login failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-luxury-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-1/3 text-center text-[18vw] font-bold uppercase leading-none tracking-tighter text-white/[0.02] pointer-events-none select-none">
        CO-PROFILES
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6">
        <Link href="/" className="w-fit pt-8 text-2xl font-bold tracking-tight text-white font-serif">
          CO-PROFILES
        </Link>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] py-12">
          <section>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans mb-4 block">
              Student Access
            </span>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl">
              Welcome Back
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/40 font-sans">
              Sign in to continue building your profile, tracking applications, and moving closer to your next opportunity.
            </p>
          </section>

          <section className="border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
            <div className="mb-8">
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-sans">Login</span>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tighter text-white">Sign In</h2>
            </div>

            {error && (
              <div className="mb-5 border border-gold/30 bg-gold/10 p-3">
                <p className="text-center text-xs tracking-widest text-gold font-sans">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-white/20 bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors duration-300 font-sans"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40 font-sans">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-white/20 bg-transparent py-3 pl-10 pr-12 text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors duration-300 font-sans"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors duration-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-white px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-luxury-bg transition-colors duration-300 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/40 font-sans">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors duration-300">
                Sign up
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
