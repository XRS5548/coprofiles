// app/api-docs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Copy, Check, Play, Code, Server, Users, Building2, Briefcase, FolderGit2, Key, LayoutDashboard, Search, ExternalLink } from "lucide-react";

export default function ApiDocs() {
    const [copied, setCopied] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["auth", "user", "companies", "projects", "internships", "careers"]));
    const [activeTab, setActiveTab] = useState<string>("overview");

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Code className="w-8 h-8 text-blue-500" />
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    API Documentation
                                </h1>
                                <p className="text-sm text-gray-400">Complete REST API Reference</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-400">API Ready</span>
                            </div>
                            <button 
                                onClick={() => window.open("https://coprofiles.sqrock.cloud", "_blank")}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition flex items-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Base URL: coprofiles.sqrock.cloud
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-80 flex-shrink-0">
                        <div className="sticky top-20">
                            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
                                <div className="space-y-2">
                                    <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                                    <SidebarItem icon={<Key className="w-4 h-4" />} label="Authentication" active={activeTab === "auth"} onClick={() => setActiveTab("auth")} />
                                    <SidebarItem icon={<Users className="w-4 h-4" />} label="User Management" active={activeTab === "user"} onClick={() => setActiveTab("user")} />
                                    <SidebarItem icon={<Building2 className="w-4 h-4" />} label="Companies" active={activeTab === "companies"} onClick={() => setActiveTab("companies")} />
                                    <SidebarItem icon={<FolderGit2 className="w-4 h-4" />} label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
                                    <SidebarItem icon={<Briefcase className="w-4 h-4" />} label="Internships" active={activeTab === "internships"} onClick={() => setActiveTab("internships")} />
                                    <SidebarItem icon={<Briefcase className="w-4 h-4" />} label="Careers" active={activeTab === "careers"} onClick={() => setActiveTab("careers")} />
                                    <SidebarItem icon={<Server className="w-4 h-4" />} label="Manager APIs" active={activeTab === "manager"} onClick={() => setActiveTab("manager")} />
                                    <SidebarItem icon={<Search className="w-4 h-4" />} label="Search" active={activeTab === "search"} onClick={() => setActiveTab("search")} />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {activeTab === "overview" && <OverviewTab />}
                        {activeTab === "auth" && <AuthTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "user" && <UserTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "companies" && <CompaniesTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "projects" && <ProjectsTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "internships" && <InternshipsTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "careers" && <CareersTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "manager" && <ManagerTab copyToClipboard={copyToClipboard} copied={copied} />}
                        {activeTab === "search" && <SearchTab copyToClipboard={copyToClipboard} copied={copied} />}
                    </main>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                active ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500" : "hover:bg-gray-800 text-gray-300"
            }`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    );
}

function OverviewTab() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-8">
                <h2 className="text-3xl font-bold mb-4">Welcome to the API</h2>
                <p className="text-gray-300 text-lg mb-6">
                    RESTful API for managing internships, careers, projects, and company operations.
                    Built with Next.js, Drizzle ORM, and PostgreSQL.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-blue-400">45+</div>
                        <div className="text-sm text-gray-400">API Endpoints</div>
                    </div>
                    <div className="bg-black/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-green-400">JWT</div>
                        <div className="text-sm text-gray-400">Authentication</div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4">Base URL</h3>
                <div className="bg-black rounded-lg p-3 border border-gray-700">
                    <code className="text-green-400">http://localhost:3000/api</code>
                </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4">Authentication</h3>
                <p className="text-gray-300 mb-3">Most endpoints require JWT token authentication.</p>
                <div className="bg-black rounded-lg p-3 border border-gray-700">
                    <code className="text-yellow-400">Cookie: token=eyJhbGciOiJIUzI1NiIs...</code>
                </div>
                <p className="text-sm text-gray-400 mt-3">Token is automatically set after login/register.</p>
            </div>

            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4">Response Format</h3>
                <pre className="bg-black rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}`}
                    </code>
                </pre>
            </div>
        </div>
    );
}

function AuthTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Authentication APIs</h2>
            
            <ApiCard
                method="POST"
                endpoint="/auth/register"
                description="Register a new user account"
                code={`fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "securepassword"
  })
})`}
                response={`{
  "message": "User registered successfully"
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="register"
            />

            <ApiCard
                method="POST"
                endpoint="/auth/login"
                description="Login to your account"
                code={`fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword"
  })
})`}
                response={`{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="login"
            />

            <ApiCard
                method="POST"
                endpoint="/auth/logout"
                description="Logout from your account"
                code={`fetch("/api/auth/logout", {
  method: "POST",
  credentials: "include"
})`}
                response={`{
  "message": "Logged out successfully"
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="logout"
            />
        </div>
    );
}

function UserTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management APIs</h2>
            
            <ApiCard
                method="GET"
                endpoint="/user/profile"
                description="Get current user profile"
                code={`fetch("/api/user/profile", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roleType": "user",
    "phoneNo": "+1234567890",
    "description": "Software Developer",
    "profileImgUrl": "https://...",
    "verified": true
  }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="profile"
            />

            <ApiCard
                method="PUT"
                endpoint="/user/profile"
                description="Update user profile"
                code={`fetch("/api/user/profile", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "John Updated",
    phoneNo: "+9876543210",
    description: "Senior Developer"
  })
})`}
                response={`{
  "message": "Profile updated successfully",
  "user": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="update-profile"
            />

            <ApiCard
                method="GET"
                endpoint="/user/:id"
                description="Get public user profile by ID"
                code={`fetch("/api/user/1", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "user": {
    "id": 1,
    "name": "John Doe",
    "description": "Software Developer",
    "profileImgUrl": "https://..."
  },
  "projects": [...],
  "companies": [...]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="user-id"
            />

            <ApiCard
                method="GET"
                endpoint="/user/dashboard"
                description="Get user dashboard stats"
                code={`fetch("/api/user/dashboard", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "stats": {
    "totalProjects": 5,
    "totalInternshipApplications": 3,
    "totalCareerApplications": 2,
    "totalApplications": 5
  },
  "recentProjects": [...]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="dashboard"
            />
        </div>
    );
}

function CompaniesTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Company APIs</h2>
            
            <ApiCard
                method="GET"
                endpoint="/companies"
                description="Get all companies (with pagination & filters)"
                code={`fetch("/api/companies?page=1&limit=10&category=Technology", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "companies": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="companies-list"
            />

            <ApiCard
                method="GET"
                endpoint="/companies/:id"
                description="Get company details by ID"
                code={`fetch("/api/companies/1", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "id": 1,
  "name": "Tech Corp",
  "description": "Leading tech company",
  "verified": true,
  "stats": {
    "internshipsCount": 5,
    "careersCount": 3,
    "teamSize": 12
  },
  "team": [...]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="company-detail"
            />

            <ApiCard
                method="POST"
                endpoint="/companies"
                description="Create new company (Manager only)"
                code={`fetch("/api/companies", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "Startup Inc",
    description: "Innovative solutions",
    category: "Technology",
    logoUrl: "https://..."
  })
})`}
                response={`{
  "message": "Company created successfully",
  "company": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="create-company"
            />

            <ApiCard
                method="PUT"
                endpoint="/companies/:id"
                description="Update company (Manager with permission)"
                code={`fetch("/api/companies/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    description: "Updated description",
    category: "AI"
  })
})`}
                response={`{
  "message": "Company updated successfully",
  "company": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="update-company"
            />

            <ApiCard
                method="DELETE"
                endpoint="/companies/:id"
                description="Delete company (Founder/CEO only)"
                code={`fetch("/api/companies/1", {
  method: "DELETE",
  credentials: "include"
})`}
                response={`{
  "message": "Company deleted successfully"
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="delete-company"
            />
        </div>
    );
}

function ProjectsTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project APIs</h2>
            
            <ApiCard
                method="GET"
                endpoint="/user/projects"
                description="Get all my projects"
                code={`fetch("/api/user/projects", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "projects": [...],
  "total": 5
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="my-projects"
            />

            <ApiCard
                method="GET"
                endpoint="/user/projects/public"
                description="Get public projects feed"
                code={`fetch("/api/user/projects/public?page=1&limit=10")
  .then(res => res.json())`}
                response={`{
  "projects": [...],
  "pagination": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="public-projects"
            />

            <ApiCard
                method="POST"
                endpoint="/user/projects/create"
                description="Create new project"
                code={`fetch("/api/user/projects/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "E-commerce App",
    description: "Full-stack e-commerce",
    githubId: "username/repo",
    isPublic: true
  })
})`}
                response={`{
  "message": "Project created successfully",
  "project": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="create-project"
            />

            <ApiCard
                method="PUT"
                endpoint="/user/projects/:id"
                description="Update project"
                code={`fetch("/api/user/projects/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    description: "Updated description",
    isPublic: false
  })
})`}
                response={`{
  "message": "Project updated successfully",
  "project": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="update-project"
            />

            <ApiCard
                method="POST"
                endpoint="/user/projects/:id/add-post"
                description="Add post/update to project"
                code={`fetch("/api/user/projects/1/add-post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    url: "https://blog.com/update-1"
  })
})`}
                response={`{
  "message": "Post added successfully",
  "posts": [...]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="add-post"
            />
        </div>
    );
}

function InternshipsTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Internship APIs</h2>
            
            <ApiCard
                method="POST"
                endpoint="/user/internships/:id/apply"
                description="Apply for an internship"
                code={`fetch("/api/user/internships/1/apply", {
  method: "POST",
  credentials: "include"
})`}
                response={`{
  "message": "Applied successfully",
  "application": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="apply-internship"
            />

            <ApiCard
                method="GET"
                endpoint="/user/internships/applications"
                description="Get my internship applications"
                code={`fetch("/api/user/internships/applications", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "applications": [
    {
      "id": 1,
      "internshipTitle": "Frontend Intern",
      "companyName": "Tech Corp",
      "certificateUnlocked": false
    }
  ]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="my-internships"
            />

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">📝 Note</h4>
                <p className="text-sm text-gray-300">Manager internship APIs are available in the Manager APIs section.</p>
            </div>
        </div>
    );
}

function CareersTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Career APIs</h2>
            
            <ApiCard
                method="POST"
                endpoint="/user/careers/:id/apply"
                description="Apply for a career position"
                code={`fetch("/api/user/careers/1/apply", {
  method: "POST",
  credentials: "include"
})`}
                response={`{
  "message": "Applied successfully",
  "application": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="apply-career"
            />

            <ApiCard
                method="GET"
                endpoint="/user/careers/applications"
                description="Get my career applications"
                code={`fetch("/api/user/careers/applications", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "applications": [
    {
      "id": 1,
      "careerName": "Senior Developer",
      "position": "Backend",
      "salary": 1500000
    }
  ]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="my-careers"
            />
        </div>
    );
}

function ManagerTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manager APIs</h2>
            <p className="text-gray-400">⚠️ All manager APIs require <span className="text-yellow-400">roleType: "manager"</span></p>
            
            <ApiCard
                method="GET"
                endpoint="/manager/dashboard"
                description="Get manager dashboard stats"
                code={`fetch("/api/manager/dashboard", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "companiesCount": 2,
  "totalInternships": 8,
  "totalCareers": 4,
  "totalApplications": 25,
  "activeInternships": 5
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="manager-dashboard"
            />

            <ApiCard
                method="GET"
                endpoint="/manager/companys"
                description="Get my managed companies"
                code={`fetch("/api/manager/companys", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "companies": [
    {
      "id": 1,
      "name": "Tech Corp",
      "role": "Founder",
      "permission": "f"
    }
  ]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="manager-companies"
            />

            <ApiCard
                method="GET"
                endpoint="/manager/internships"
                description="Get all internships from my companies"
                code={`fetch("/api/manager/internships", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "internships": [
    {
      "id": 1,
      "title": "Frontend Intern",
      "companyName": "Tech Corp",
      "applicationsCount": 12
    }
  ]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="manager-internships"
            />

            <ApiCard
                method="POST"
                endpoint="/manager/internships/create"
                description="Create new internship"
                code={`fetch("/api/manager/internships/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    title: "React Developer Intern",
    companyId: 1,
    content: "Looking for React experts...",
    duration: 12,
    lastApplyDate: "2024-12-31",
    isLive: true
  })
})`}
                response={`{
  "message": "Internship created successfully",
  "internship": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="create-internship"
            />

            <ApiCard
                method="GET"
                endpoint="/manager/careers"
                description="Get all careers from my companies"
                code={`fetch("/api/manager/careers", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "careers": [
    {
      "id": 1,
      "name": "Senior Developer",
      "companyName": "Tech Corp",
      "applicationsCount": 8
    }
  ]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="manager-careers"
            />

            <ApiCard
                method="POST"
                endpoint="/manager/careers/create"
                description="Create new career position"
                code={`fetch("/api/manager/careers/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "Senior Software Engineer",
    position: "Backend Developer",
    companyId: 1,
    salary: 2000000,
    content: "Looking for experienced Node.js dev..."
  })
})`}
                response={`{
  "message": "Career created successfully",
  "career": { ... }
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="create-career"
            />

            <ApiCard
                method="GET"
                endpoint="/manager/internships/:id/applications"
                description="Get all applications for an internship"
                code={`fetch("/api/manager/internships/1/applications", {
  credentials: "include"
}).then(res => res.json())`}
                response={`{
  "internship": { "id": 1, "title": "Frontend Intern" },
  "totalApplications": 12,
  "applications": [...]
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="internship-applications"
            />

            <ApiCard
                method="PUT"
                endpoint="/manager/internships/:id/applications/:appId/certificate"
                description="Unlock certificate for applicant"
                code={`fetch("/api/manager/internships/1/applications/5/certificate", {
  method: "PUT",
  credentials: "include"
})`}
                response={`{
  "message": "Certificate unlocked successfully"
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="unlock-certificate"
            />
        </div>
    );
}

function SearchTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Search API</h2>
            
            <ApiCard
                method="GET"
                endpoint="/search"
                description="Global search across companies, internships, careers, and projects"
                code={`fetch("/api/search?q=developer&type=all")
  .then(res => res.json())`}
                response={`{
  "query": "developer",
  "results": {
    "companies": [...],
    "internships": [...],
    "careers": [...],
    "projects": [...]
  },
  "total": 15
}`}
                copyToClipboard={copyToClipboard}
                copied={copied}
                id="search"
            />

            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold mb-3">Search Parameters</h3>
                <div className="space-y-2 text-sm">
                    <div><code className="text-blue-400">q</code> - Search query (required, min 2 chars)</div>
                    <div><code className="text-blue-400">type</code> - Filter by type: companies, internships, careers, projects, all</div>
                </div>
            </div>
        </div>
    );
}

function ApiCard({ method, endpoint, description, code, response, copyToClipboard, copied, id }: { 
    method: string; endpoint: string; description: string; code: string; response: string; 
    copyToClipboard: (text: string, id: string) => void; copied: string | null; id: string;
}) {
    const getMethodColor = () => {
        switch(method) {
            case "GET": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "POST": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "PUT": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-gray-500/20 text-gray-400";
        }
    };

    return (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="border-b border-gray-800 p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-mono border ${getMethodColor()}`}>
                        {method}
                    </span>
                    <code className="text-gray-200 font-mono">{endpoint}</code>
                </div>
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-sm"
                >
                    {copied === id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied === id ? "Copied!" : "Copy Code"}
                </button>
            </div>
            <div className="p-4">
                <p className="text-gray-300 text-sm mb-4">{description}</p>
                
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold">Request Example</span>
                        </div>
                        <pre className="bg-black rounded-lg p-3 overflow-x-auto">
                            <code className="text-xs text-gray-300">{code}</code>
                        </pre>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Play className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold">Response Example</span>
                        </div>
                        <pre className="bg-black rounded-lg p-3 overflow-x-auto">
                            <code className="text-xs text-gray-300">{response}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}