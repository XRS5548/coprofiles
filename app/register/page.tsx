"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      })

      if (response.ok) {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        })

        router.push(loginResponse.ok ? "/dashboard" : "/login")
      } else {
        const data = await response.json()
        setError(data.message || data.error || "Registration failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground px-4 py-8">
      {/* Background watermark */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute left-1/2 top-10 h-px w-[90vw] -translate-x-1/2 bg-foreground/30" />
        <div className="absolute -left-16 bottom-24 h-72 w-72 border-2 border-foreground/20" />
        <div className="absolute -right-20 top-20 h-80 w-80 border-2 border-foreground/10" />
        <div className="absolute inset-x-0 top-1/3 text-center text-[18vw] font-bold uppercase leading-none tracking-tighter text-foreground/[0.03]">
          CO-PROFILES
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col">
        <Link href="/" className="w-fit text-2xl font-bold tracking-tighter text-foreground">
          CO-PROFILES
        </Link>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Apply Now
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold uppercase leading-[0.95] tracking-tighter text-foreground md:text-7xl">
              Build Your Profile
            </h1>
            <p className="mt-6 max-w-xl font-serif text-lg leading-7 text-muted-foreground">
              Create your account to apply for internships, showcase your work, and start your hiring journey with CO-PROFILES.
            </p>
          </section>

          <section className="border-2 border-foreground bg-background p-8">
            <div className="mb-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Register</p>
              <h2 className="mt-2 font-serif text-3xl font-bold uppercase tracking-tighter text-foreground">Sign Up</h2>
            </div>

            {error && (
              <div className="mb-5 border-2 border-foreground bg-foreground p-3">
                <p className="text-center font-mono text-xs tracking-widest text-background">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-foreground bg-background py-3 pl-10 pr-4 font-serif text-foreground outline-none transition-colors duration-100 placeholder:text-muted-foreground/50 focus:bg-foreground focus:text-background"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-foreground bg-background py-3 pl-10 pr-4 font-serif text-foreground outline-none transition-colors duration-100 placeholder:text-muted-foreground/50 focus:bg-foreground focus:text-background"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-2 border-foreground bg-background py-3 pl-10 pr-12 font-serif text-foreground outline-none transition-colors duration-100 placeholder:text-muted-foreground/50 focus:bg-foreground focus:text-background"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-100 hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full border-2 border-foreground bg-background py-3 pl-10 pr-4 font-serif text-foreground outline-none transition-colors duration-100 placeholder:text-muted-foreground/50 focus:bg-foreground focus:text-background"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-background transition-colors duration-100 hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Sign Up"}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-100 group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center font-serif text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-mono text-xs uppercase tracking-widest text-foreground underline transition-colors duration-100 hover:text-muted-foreground">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
