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
     <main className="relative min-h-screen overflow-hidden bg-black">
       <div className="absolute inset-0 bg-gradient-to-b from-[#CD7F32]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-1/3 text-center text-[18vw] font-black uppercase tracking-tight text-[#CD7F32]/5 pointer-events-none select-none">
        CO-PROFILES
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6">
        <Link href="/" className="w-fit pt-8 text-3xl font-serif font-bold tracking-wide text-[#CD7F32]" >
          CO-PROFILES
        </Link>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] py-12">
          <section>
            <span className="mb-4 block text-xs uppercase tracking-[0.35em] text-[#CD7F32]"> 
              APPLY NOW
            </span>
             <h1 className="max-w-3xl font-serif text-5xl font-bold leading-none tracking-tight text-[#CD7F32] md:text-7xl"> Build Your Profile </h1>
             <p className="mt-8 max-w-xl text-lg leading-8 text-white/80"> Create your account to apply for internships, showcase your work, and begin your professional journey with CO-PROFILES. </p>
          </section>

          <section className="rounded-2xl border border-[#CD7F32]/20 bg-[#0A0A0A] p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(205,127,50,0.08)]">
            <div className="mb-8">
               <span className="text-xs uppercase tracking-[0.35em] text-[#CD7F32]"> REGISTER </span> 
               <h2 className="mt-2 font-serif text-4xl font-bold text-[#CD7F32]"> Sign Up </h2>
            </div>  

            {error && (
              <div className="mb-6 rounded-lg border border-[#CD7F32]/30 bg-[#CD7F32]/10 p-4"> <p className="text-center text-sm
               text-[#CD7F32]"> </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label  className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/70">
                  Full Name
                </label>
                <div className="relative">
                  <User  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CD7F32]/70" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-white/20 bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none focus:border-gold transition-colors duration-300 font-sans"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className="w-full border border-white/20 bg-transparent py-3 pl-10 pr-12 text-white placeholder:text-white/20 outline-none focus:border-[#CD7F32] transition-colors duration-300 font-sans"
      placeholder="Password"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors duration-300"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

<div>
  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40 font-sans">
    Confirm Password
  </label>

  <div className="relative">
    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

    <input
      type={showPassword ? "text" : "password"}
      value={formData.confirmPassword}
      onChange={(e) =>
        setFormData({
          ...formData,
          confirmPassword: e.target.value,
        })
      }
      className="w-full border border-white/20 bg-transparent py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none focus:border-[#CD7F32] transition-colors duration-300 font-sans"
      placeholder="Confirm password"
      required
    />
  </div>
</div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 bg-white px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-luxury-bg transition-colors duration-300 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Sign Up"}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/40 font-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
