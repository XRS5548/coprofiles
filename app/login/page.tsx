"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const userResponse = await fetch("/api/user/profile")
        const userData = await userResponse.json()

        router.push(
          userData.user?.roleType === "manager"
            ? "/manager/dashboard"
            : "/dashboard"
        )
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
    <main className="relative min-h-screen overflow-hidden bg-black">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />

      {/* Watermark */}
      <div className="absolute inset-x-0 top-1/3 text-center text-[18vw] font-black uppercase tracking-tight text-[#CD7F32]/5 select-none pointer-events-none">
        CO-PROFILES
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6">

        {/* Logo */}

        <Link
          href="/"
          className="pt-8 w-fit text-3xl font-serif font-bold tracking-wide text-[#CD7F32]"
        >
          CO-PROFILES
        </Link>

        <div className="grid flex-1 items-center gap-16 py-12 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left Section */}

          <section>

            <span className="mb-4 block text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
              STUDENT ACCESS
            </span>

            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-none tracking-tight text-[#CD7F32] md:text-7xl">
              Welcome Back
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-white/80">
              Sign in to continue building your profile, tracking applications,
              and unlocking new opportunities with CO-PROFILES.
            </p>

          </section>

          {/* Right Card */}

          <section className="rounded-2xl border border-[#CD7F32]/20 bg-[#0A0A0A] p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(205,127,50,0.08)]">

            <div className="mb-8">

              <span className="text-xs uppercase tracking-[0.35em] text-[#CD7F32]">
                LOGIN
              </span>

              <h2 className="mt-2 font-serif text-4xl font-bold text-[#CD7F32]">
                Sign In
              </h2>

            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-[#CD7F32]/30 bg-[#CD7F32]/10 p-4">
                <p className="text-center text-sm text-[#CD7F32]">
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/70">
                  Email Address
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CD7F32]/70" />

                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CD7F32]/20 bg-[#111111] py-3 pl-11 pr-4 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#CD7F32] focus:ring-2 focus:ring-[#CD7F32]/20"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/70">
                  Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CD7F32]/70" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CD7F32]/20 bg-[#111111] py-3 pl-11 pr-12 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-[#CD7F32] focus:ring-2 focus:ring-[#CD7F32]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CD7F32]/70 transition hover:text-[#CD7F32]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#CD7F32] px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:bg-[#D89247] hover:shadow-[0_0_20px_rgba(205,127,50,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                )}
              </button>

            </form>

            {/* Footer */}

            <p className="mt-8 text-center text-sm text-white/70">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#CD7F32] transition hover:text-[#D89247]"
              >
                Sign Up
              </Link>
            </p>

          </section>

        </div>
      </div>
    </main>
  )
}

