// app/manager/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Building2, Briefcase, Users, TrendingUp, 
    Plus, Eye, Edit, Trash2, Calendar, 
    DollarSign, Star, Activity, LogOut,
    ChevronRight, Bell, Search, Filter
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
    companiesCount: number;
    totalInternships: number;
    totalCareers: number;
    totalApplications: number;
    activeInternships: number;
    recentInternships: any[];
}

interface Company {
    id: number;
    name: string;
    role: string;
    permission: string;
}

interface Internship {
    id: number;
    title: string;
    applicationsCount?: number;
    isLive?: boolean;
}

interface ActivityItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
    color: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: "blue" | "green" | "purple" | "orange" | "pink";
}

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: "blue" | "green" | "purple" | "orange";
}

export default function ManagerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch dashboard stats
            const statsRes = await fetch("/api/manager/dashboard", {
                credentials: "include"
            });
            const statsData = await statsRes.json();
            if (statsRes.ok) {
                setStats(statsData);
            }

            // Fetch user companies
            const companiesRes = await fetch("/api/manager/companies", {
                credentials: "include"
            });
            const companiesData = await companiesRes.json();
            if (companiesRes.ok) {
                setCompanies(companiesData.companies || []);
            }

            // Fetch user profile
            const profileRes = await fetch("/api/user/profile", {
                credentials: "include"
            });
            const profileData = await profileRes.json();
            if (profileRes.ok) {
                setUserName(profileData.user?.name || "Manager");
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
                            <Building2 className="w-8 h-8 text-blue-500" />
                            <div>
                                <h1 className="text-xl font-bold">Manager Dashboard</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={<Building2 className="w-6 h-6" />}
                        label="Companies"
                        value={stats?.companiesCount || 0}
                        color="blue"
                    />
                    <StatCard
                        icon={<Briefcase className="w-6 h-6" />}
                        label="Internships"
                        value={stats?.totalInternships || 0}
                        color="green"
                    />
                    <StatCard
                        icon={<Briefcase className="w-6 h-6" />}
                        label="Careers"
                        value={stats?.totalCareers || 0}
                        color="purple"
                    />
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        label="Applications"
                        value={stats?.totalApplications || 0}
                        color="orange"
                    />
                    <StatCard
                        icon={<Activity className="w-6 h-6" />}
                        label="Active"
                        value={stats?.activeInternships || 0}
                        color="pink"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <QuickActionCard
                        title="Create Internship"
                        description="Post a new internship position"
                        icon={<Briefcase className="w-5 h-5" />}
                        href="/manager/internships/create"
                        color="blue"
                    />
                    <QuickActionCard
                        title="Create Career"
                        description="Post a new job opening"
                        icon={<Briefcase className="w-5 h-5" />}
                        href="/manager/careers/create"
                        color="green"
                    />
                    <QuickActionCard
                        title="Manage Companies"
                        description="View and manage your companies"
                        icon={<Building2 className="w-5 h-5" />}
                        href="/manager/companies"
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Internships */}
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Recent Internships</h2>
                            <Link href="/manager/internships" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                View all <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats?.recentInternships?.map((internship: Internship) => (
                                <div key={internship.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{internship.title}</p>
                                        <p className="text-sm text-gray-400">
                                            {internship.applicationsCount || 0} applications
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {internship.isLive ? (
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Live</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">Draft</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentInternships || stats.recentInternships.length === 0) && (
                                <p className="text-gray-400 text-center py-4">No internships yet</p>
                            )}
                        </div>
                    </div>

                    {/* My Companies */}
                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">My Companies</h2>
                            <Link href="/manager/companies/create" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                Add new <Plus className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {companies.map((company) => (
                                <div key={company.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{company.name}</p>
                                        <p className="text-sm text-gray-400">
                                            Role: {company.role} • Permission: {company.permission === "f" ? "Full" : company.permission === "c" ? "Create" : "View"}
                                        </p>
                                    </div>
                                    <Link href={`/manager/companies/${company.id}`} className="p-2 hover:bg-gray-700 rounded-lg transition">
                                        <Eye className="w-4 h-4 text-gray-400" />
                                    </Link>
                                </div>
                            ))}
                            {companies.length === 0 && (
                                <p className="text-gray-400 text-center py-4">No companies yet. Create your first company!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <ActivityItem
                            icon={<Users className="w-4 h-4" />}
                            title="New Application"
                            description="John Doe applied for Frontend Internship"
                            time="2 hours ago"
                            color="blue"
                        />
                        <ActivityItem
                            icon={<Briefcase className="w-4 h-4" />}
                            title="Internship Posted"
                            description="Backend Developer Internship created"
                            time="1 day ago"
                            color="green"
                        />
                        <ActivityItem
                            icon={<Building2 className="w-4 h-4" />}
                            title="Company Updated"
                            description="Tech Corp profile was updated"
                            time="2 days ago"
                            color="purple"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: StatCardProps) {
    const colors = {
        blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
        green: "from-green-500/20 to-green-600/20 border-green-500/30",
        purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
        orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
        pink: "from-pink-500/20 to-pink-600/20 border-pink-500/30"
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

// Quick Action Card Component
function QuickActionCard({ title, description, icon, href, color }: QuickActionCardProps) {
    const colors = {
        blue: "hover:border-blue-500/50",
        green: "hover:border-green-500/50",
        purple: "hover:border-purple-500/50",
        orange: "hover:border-orange-500/50"
    };

    const colorClasses = {
        blue: "bg-blue-500/20",
        green: "bg-green-500/20",
        purple: "bg-purple-500/20",
        orange: "bg-orange-500/20"
    };

    return (
        <Link href={href}>
            <div className={`bg-gray-900/50 rounded-xl border border-gray-800 ${colors[color]} p-4 transition cursor-pointer`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${colorClasses[color]} rounded-lg`}>
                        {icon}
                    </div>
                    <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </Link>
    );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time, color }: ActivityItemProps) {
    const colorClasses = {
        blue: "bg-blue-500/20",
        green: "bg-green-500/20",
        purple: "bg-purple-500/20",
        orange: "bg-orange-500/20",
        pink: "bg-pink-500/20"
    };

    return (
        <div className="flex items-start gap-3">
            <div className={`p-2 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} rounded-lg mt-1`}>
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