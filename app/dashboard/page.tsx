// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    FolderGit2, Briefcase, Award, TrendingUp,
    LogOut, Bell, ChevronRight, Code, Star
} from "lucide-react";
import Link from "next/link";

interface UserStats {
    totalProjects: number;
    totalInternshipApplications: number;
    totalCareerApplications: number;
    totalApplications: number;
}

export default function UserDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const profileRes = await fetch("/api/user/profile", { credentials: "include" });
            const profileData = await profileRes.json();
            if (profileRes.ok) {
                setUserName(profileData.user?.name || "User");
            }

            const dashboardRes = await fetch("/api/user/dashboard", { credentials: "include" });
            const dashboardData = await dashboardRes.json();
            if (dashboardRes.ok) {
                setStats(dashboardData.stats);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Code className="w-8 h-8 text-blue-500" />
                            <div>
                                <h1 className="text-xl font-bold">Dashboard</h1>
                                <p className="text-sm text-gray-400">Welcome back, {userName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                                <Bell className="w-5 h-5 text-gray-400" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<FolderGit2 className="w-6 h-6" />}
                        label="Projects"
                        value={stats?.totalProjects || 0}
                        color="blue"
                    />
                    <StatCard
                        icon={<Briefcase className="w-6 h-6" />}
                        label="Internship Apps"
                        value={stats?.totalInternshipApplications || 0}
                        color="green"
                    />
                    <StatCard
                        icon={<Briefcase className="w-6 h-6" />}
                        label="Career Apps"
                        value={stats?.totalCareerApplications || 0}
                        color="purple"
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6" />}
                        label="Total Apps"
                        value={stats?.totalApplications || 0}
                        color="orange"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <QuickActionCard
                        title="My Projects"
                        description="View and manage your projects"
                        icon={<FolderGit2 className="w-5 h-5" />}
                        href="/projects"
                        color="blue"
                    />
                    <QuickActionCard
                        title="Browse Internships"
                        description="Find your next opportunity"
                        icon={<Briefcase className="w-5 h-5" />}
                        href="/internships"
                        color="green"
                    />
                    <QuickActionCard
                        title="My Applications"
                        description="Track your applications"
                        icon={<Award className="w-5 h-5" />}
                        href="/applications"
                        color="purple"
                    />
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <ActivityItem
                            icon={<Briefcase className="w-4 h-4" />}
                            title="Applied for Internship"
                            description="Frontend Developer Intern at Tech Corp"
                            time="2 days ago"
                            color="blue"
                        />
                        <ActivityItem
                            icon={<FolderGit2 className="w-4 h-4" />}
                            title="Created New Project"
                            description="E-commerce App - A full-stack application"
                            time="5 days ago"
                            color="green"
                        />
                        <ActivityItem
                            icon={<Star className="w-4 h-4" />}
                            title="Certificate Earned"
                            description="React Development Internship Certificate"
                            time="1 week ago"
                            color="yellow"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reuse StatCard, QuickActionCard, ActivityItem components from above
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: "blue" | "green" | "purple" | "orange" }) {
    const colors = {
        blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
        green: "from-green-500/20 to-green-600/20 border-green-500/30",
        purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
        orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-4`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400">{icon}</div>
                <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
        </div>
    );
}

function QuickActionCard({ title, description, icon, href, color }: any) {
    return (
        <Link href={href}>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-blue-500/50 p-4 transition cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
                        {icon}
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </Link>
    );
}

function ActivityItem({ icon, title, description, time, color }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 bg-${color}-500/20 rounded-lg mt-1`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    );
}