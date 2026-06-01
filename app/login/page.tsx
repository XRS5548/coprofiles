// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                const userResponse = await fetch("/api/user/profile");
                const userData = await userResponse.json();

                if (userData.user?.roleType === "manager") {
                    router.push("/manager/dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setError(data.message || data.error || "Login failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#09090B] px-4 py-8 text-[#FAFAFA]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-10 h-px w-[90vw] -translate-x-1/2 bg-[#DFE104]/30" />
                <div className="absolute -left-16 top-24 h-72 w-72 border border-[#3F3F46]/60" />
                <div className="absolute -right-20 bottom-16 h-80 w-80 border border-[#DFE104]/20" />
                <div className="absolute inset-x-0 top-1/3 text-center text-[18vw] font-bold uppercase leading-none tracking-tighter text-[#FAFAFA]/[0.025]">
                    CO-PROFILES
                </div>
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col">
                <Link href="/" className="w-fit text-2xl font-bold tracking-tighter text-[#FAFAFA]">
                    CO-PROFILES
                </Link>

                <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
                    <section>
                        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[#DFE104]">
                            Student Access
                        </p>
                        <h1 className="max-w-3xl text-5xl font-bold uppercase leading-[0.95] tracking-tighter text-[#FAFAFA] md:text-7xl">
                            Welcome Back
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-7 text-[#A1A1AA] md:text-lg">
                            Sign in to continue building your profile, tracking applications, and moving closer to your next opportunity.
                        </p>
                    </section>

                    <section className="border border-[#3F3F46] bg-[#09090B]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8">
                        <div className="mb-8">
                            <p className="text-sm font-medium uppercase tracking-wide text-[#A1A1AA]">
                                Login
                            </p>
                            <h2 className="mt-2 text-3xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
                                Sign In
                            </h2>
                        </div>

                        {error && (
                            <div className="mb-5 border border-red-500/30 bg-red-500/10 p-3">
                                <p className="text-center text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-[#A1A1AA]">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#71717A]" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-[#3F3F46] bg-[#18181B] py-3 pl-10 pr-4 text-[#FAFAFA] outline-none transition placeholder:text-[#71717A] focus:border-[#DFE104]"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-[#A1A1AA]">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#71717A]" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full border border-[#3F3F46] bg-[#18181B] py-3 pl-10 pr-12 text-[#FAFAFA] outline-none transition placeholder:text-[#71717A] focus:border-[#DFE104]"
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] transition hover:text-[#DFE104]"
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 bg-[#DFE104] px-6 py-3 font-bold uppercase tracking-wide text-black transition hover:bg-[#DFE104]/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                                {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-[#A1A1AA]">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-medium text-[#DFE104] transition hover:text-[#FAFAFA]">
                                Sign up
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
