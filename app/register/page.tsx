// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Auto login after registration
                const loginResponse = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (loginResponse.ok) {
                    router.push("/dashboard");
                } else {
                    router.push("/login");
                }
            } else {
                setError(data.message || data.error || "Registration failed");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            
            {/* Register Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-400 mt-2">Join our community today</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}