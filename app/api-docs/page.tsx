"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, Check, Code, Server, Users, Building2, Briefcase, FolderGit2, Key, LayoutDashboard, Search, ExternalLink } from "lucide-react"

export default function ApiDocs() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("overview")

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-foreground bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-foreground" />
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                  API Documentation
                </h1>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Complete REST API Reference</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-3 py-1 border-2 border-foreground">
                <div className="w-2 h-2 bg-foreground" />
                <span className="font-mono text-xs text-foreground uppercase tracking-widest">API Ready</span>
              </div>
              <button
                onClick={() => window.open("https://coprofiles.sqrock.cloud", "_blank")}
                className="px-4 py-1 border-2 border-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-100 flex items-center gap-2"
              >
                <ExternalLink className="w-3 h-3" />
                Base URL: coprofiles.sqrock.cloud
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="border-2 border-foreground p-4">
                <div className="space-y-1">
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
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-100 ${
        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="border-2 border-foreground p-8">
        <h2 className="font-serif text-3xl font-bold tracking-tight mb-4">Welcome to the API</h2>
        <p className="font-serif text-lg text-muted-foreground mb-6">
          RESTful API for managing internships, careers, projects, and company operations.
          Built with Next.js, Drizzle ORM, and PostgreSQL.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-foreground p-4">
            <div className="font-serif text-3xl font-bold text-foreground">45+</div>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">API Endpoints</div>
          </div>
          <div className="border-2 border-foreground p-4">
            <div className="font-serif text-3xl font-bold text-foreground">JWT</div>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Authentication</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-foreground p-6">
        <h3 className="font-serif text-xl font-bold mb-4">Base URL</h3>
        <div className="border-2 border-foreground bg-muted p-3">
          <code className="font-mono text-sm text-foreground">http://localhost:3000/api</code>
        </div>
      </div>

      <div className="border-2 border-foreground p-6">
        <h3 className="font-serif text-xl font-bold mb-4">Authentication</h3>
        <p className="font-serif text-muted-foreground mb-3">Most endpoints require JWT token authentication.</p>
        <div className="border-2 border-foreground bg-muted p-3">
          <code className="font-mono text-sm text-foreground">Cookie: token=eyJhbGciOiJIUzI1NiIs...</code>
        </div>
        <p className="font-serif text-sm text-muted-foreground mt-3">Token is automatically set after login/register.</p>
      </div>

      <div className="border-2 border-foreground p-6">
        <h3 className="font-serif text-xl font-bold mb-4">Response Format</h3>
        <pre className="border-2 border-foreground bg-muted p-4 overflow-x-auto">
          <code className="text-sm text-foreground">
{`{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}`}
          </code>
        </pre>
      </div>
    </div>
  )
}

function AuthTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Authentication APIs</h2>
      <ApiCard method="POST" endpoint="/auth/register" description="Register a new user account"
        code={`fetch("/api/auth/register", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    name: "John Doe",\n    email: "john@example.com",\n    password: "securepassword"\n  })\n})`}
        response={`{\n  "message": "User registered successfully"\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="register" />
      <ApiCard method="POST" endpoint="/auth/login" description="Login to your account"
        code={`fetch("/api/auth/login", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    email: "john@example.com",\n    password: "securepassword"\n  })\n})`}
        response={`{\n  "message": "Login successful",\n  "token": "eyJhbGciOiJIUzI1NiIs..."\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="login" />
      <ApiCard method="POST" endpoint="/auth/logout" description="Logout from your account"
        code={`fetch("/api/auth/logout", {\n  method: "POST",\n  credentials: "include"\n})`}
        response={`{\n  "message": "Logged out successfully"\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="logout" />
    </div>
  )
}

function UserTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">User Management APIs</h2>
      <ApiCard method="GET" endpoint="/user/profile" description="Get current user profile"
        code={`fetch("/api/user/profile", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "email": "john@example.com",\n    "roleType": "user",\n    "phoneNo": "+1234567890",\n    "description": "Software Developer",\n    "profileImgUrl": "https://...",\n    "verified": true\n  }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="profile" />
      <ApiCard method="PUT" endpoint="/user/profile" description="Update user profile"
        code={`fetch("/api/user/profile", {\n  method: "PUT",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    name: "John Updated",\n    phoneNo: "+9876543210",\n    description: "Senior Developer"\n  })\n})`}
        response={`{\n  "message": "Profile updated successfully",\n  "user": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="update-profile" />
      <ApiCard method="GET" endpoint="/user/:id" description="Get public user profile by ID"
        code={`fetch("/api/user/1", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "user": {\n    "id": 1,\n    "name": "John Doe",\n    "description": "Software Developer",\n    "profileImgUrl": "https://..."\n  },\n  "projects": [...],\n  "companies": [...]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="user-id" />
      <ApiCard method="GET" endpoint="/user/dashboard" description="Get user dashboard stats"
        code={`fetch("/api/user/dashboard", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "stats": {\n    "totalProjects": 5,\n    "totalInternshipApplications": 3,\n    "totalCareerApplications": 2,\n    "totalApplications": 5\n  },\n  "recentProjects": [...]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="dashboard" />
    </div>
  )
}

function CompaniesTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Company APIs</h2>
      <ApiCard method="GET" endpoint="/companies" description="Get all companies (with pagination & filters)"
        code={`fetch("/api/companies?page=1&limit=10&category=Technology", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "companies": [...],\n  "pagination": {\n    "page": 1,\n    "limit": 10,\n    "total": 50,\n    "totalPages": 5\n  }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="companies-list" />
      <ApiCard method="GET" endpoint="/companies/:id" description="Get company details by ID"
        code={`fetch("/api/companies/1", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "id": 1,\n  "name": "Tech Corp",\n  "description": "Leading tech company",\n  "verified": true,\n  "stats": {\n    "internshipsCount": 5,\n    "careersCount": 3,\n    "teamSize": 12\n  },\n  "team": [...]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="company-detail" />
      <ApiCard method="POST" endpoint="/companies" description="Create new company (Manager only)"
        code={`fetch("/api/companies", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    name: "Startup Inc",\n    description: "Innovative solutions",\n    category: "Technology",\n    logoUrl: "https://..."\n  })\n})`}
        response={`{\n  "message": "Company created successfully",\n  "company": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="create-company" />
      <ApiCard method="PUT" endpoint="/companies/:id" description="Update company (Manager with permission)"
        code={`fetch("/api/companies/1", {\n  method: "PUT",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    description: "Updated description",\n    category: "AI"\n  })\n})`}
        response={`{\n  "message": "Company updated successfully",\n  "company": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="update-company" />
      <ApiCard method="DELETE" endpoint="/companies/:id" description="Delete company (Founder/CEO only)"
        code={`fetch("/api/companies/1", {\n  method: "DELETE",\n  credentials: "include"\n})`}
        response={`{\n  "message": "Company deleted successfully"\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="delete-company" />
    </div>
  )
}

function ProjectsTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Project APIs</h2>
      <ApiCard method="GET" endpoint="/user/projects" description="Get all my projects"
        code={`fetch("/api/user/projects", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "projects": [...],\n  "total": 5\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="my-projects" />
      <ApiCard method="GET" endpoint="/user/projects/public" description="Get public projects feed"
        code={`fetch("/api/user/projects/public?page=1&limit=10")\n  .then(res => res.json())`}
        response={`{\n  "projects": [...],\n  "pagination": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="public-projects" />
      <ApiCard method="POST" endpoint="/user/projects/create" description="Create new project"
        code={`fetch("/api/user/projects/create", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    name: "E-commerce App",\n    description: "Full-stack e-commerce",\n    githubId: "username/repo",\n    isPublic: true\n  })\n})`}
        response={`{\n  "message": "Project created successfully",\n  "project": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="create-project" />
      <ApiCard method="PUT" endpoint="/user/projects/:id" description="Update project"
        code={`fetch("/api/user/projects/1", {\n  method: "PUT",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    description: "Updated description",\n    isPublic: false\n  })\n})`}
        response={`{\n  "message": "Project updated successfully",\n  "project": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="update-project" />
      <ApiCard method="POST" endpoint="/user/projects/:id/add-post" description="Add post/update to project"
        code={`fetch("/api/user/projects/1/add-post", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    url: "https://blog.com/update-1"\n  })\n})`}
        response={`{\n  "message": "Post added successfully",\n  "posts": [...]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="add-post" />
    </div>
  )
}

function InternshipsTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Internship APIs</h2>
      <ApiCard method="POST" endpoint="/user/internships/:id/apply" description="Apply for an internship"
        code={`fetch("/api/user/internships/1/apply", {\n  method: "POST",\n  credentials: "include"\n})`}
        response={`{\n  "message": "Applied successfully",\n  "application": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="apply-internship" />
      <ApiCard method="GET" endpoint="/user/internships/applications" description="Get my internship applications"
        code={`fetch("/api/user/internships/applications", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "applications": [\n    {\n      "id": 1,\n      "internshipTitle": "Frontend Intern",\n      "companyName": "Tech Corp",\n      "certificateUnlocked": false\n    }\n  ]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="my-internships" />
      <div className="border-2 border-foreground bg-muted p-4">
        <h4 className="font-mono text-xs uppercase tracking-widest text-foreground mb-2">Note</h4>
        <p className="font-serif text-sm text-muted-foreground">Manager internship APIs are available in the Manager APIs section.</p>
      </div>
    </div>
  )
}

function CareersTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Career APIs</h2>
      <ApiCard method="POST" endpoint="/user/careers/:id/apply" description="Apply for a career position"
        code={`fetch("/api/user/careers/1/apply", {\n  method: "POST",\n  credentials: "include"\n})`}
        response={`{\n  "message": "Applied successfully",\n  "application": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="apply-career" />
      <ApiCard method="GET" endpoint="/user/careers/applications" description="Get my career applications"
        code={`fetch("/api/user/careers/applications", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "applications": [\n    {\n      "id": 1,\n      "careerName": "Senior Developer",\n      "position": "Backend",\n      "salary": 1500000\n    }\n  ]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="my-careers" />
    </div>
  )
}

function ManagerTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Manager APIs</h2>
      <p className="font-serif text-muted-foreground">All manager APIs require <span className="font-mono text-xs uppercase tracking-widest text-foreground bg-muted px-1">roleType: &quot;manager&quot;</span></p>
      <ApiCard method="GET" endpoint="/manager/dashboard" description="Get manager dashboard stats"
        code={`fetch("/api/manager/dashboard", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "companiesCount": 2,\n  "totalInternships": 8,\n  "totalCareers": 4,\n  "totalApplications": 25,\n  "activeInternships": 5\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="manager-dashboard" />
      <ApiCard method="GET" endpoint="/manager/companys" description="Get my managed companies"
        code={`fetch("/api/manager/companys", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "companies": [\n    {\n      "id": 1,\n      "name": "Tech Corp",\n      "role": "Founder",\n      "permission": "f"\n    }\n  ]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="manager-companies" />
      <ApiCard method="GET" endpoint="/manager/internships" description="Get all internships from my companies"
        code={`fetch("/api/manager/internships", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "internships": [\n    {\n      "id": 1,\n      "title": "Frontend Intern",\n      "companyName": "Tech Corp",\n      "applicationsCount": 12\n    }\n  ]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="manager-internships" />
      <ApiCard method="POST" endpoint="/manager/internships/create" description="Create new internship"
        code={`fetch("/api/manager/internships/create", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    title: "React Developer Intern",\n    companyId: 1,\n    content: "Looking for React experts...",\n    duration: 12,\n    lastApplyDate: "2024-12-31",\n    isLive: true\n  })\n})`}
        response={`{\n  "message": "Internship created successfully",\n  "internship": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="create-internship" />
      <ApiCard method="GET" endpoint="/manager/careers" description="Get all careers from my companies"
        code={`fetch("/api/manager/careers", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "careers": [\n    {\n      "id": 1,\n      "name": "Senior Developer",\n      "companyName": "Tech Corp",\n      "applicationsCount": 8\n    }\n  ]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="manager-careers" />
      <ApiCard method="POST" endpoint="/manager/careers/create" description="Create new career position"
        code={`fetch("/api/manager/careers/create", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  credentials: "include",\n  body: JSON.stringify({\n    name: "Senior Software Engineer",\n    position: "Backend Developer",\n    companyId: 1,\n    salary: 2000000,\n    content: "Looking for experienced Node.js dev..."\n  })\n})`}
        response={`{\n  "message": "Career created successfully",\n  "career": { ... }\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="create-career" />
      <ApiCard method="GET" endpoint="/manager/internships/:id/applications" description="Get all applications for an internship"
        code={`fetch("/api/manager/internships/1/applications", {\n  credentials: "include"\n}).then(res => res.json())`}
        response={`{\n  "internship": { "id": 1, "title": "Frontend Intern" },\n  "totalApplications": 12,\n  "applications": [...]\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="internship-applications" />
      <ApiCard method="PUT" endpoint="/manager/internships/:id/applications/:appId/certificate" description="Unlock certificate for applicant"
        code={`fetch("/api/manager/internships/1/applications/5/certificate", {\n  method: "PUT",\n  credentials: "include"\n})`}
        response={`{\n  "message": "Certificate unlocked successfully"\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="unlock-certificate" />
    </div>
  )
}

function SearchTab({ copyToClipboard, copied }: { copyToClipboard: (text: string, id: string) => void; copied: string | null }) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-bold tracking-tight">Search API</h2>
      <ApiCard method="GET" endpoint="/search" description="Global search across companies, internships, careers, and projects"
        code={`fetch("/api/search?q=developer&type=all")\n  .then(res => res.json())`}
        response={`{\n  "query": "developer",\n  "results": {\n    "companies": [...],\n    "internships": [...],\n    "careers": [...],\n    "projects": [...]\n  },\n  "total": 15\n}`}
        copyToClipboard={copyToClipboard} copied={copied} id="search" />
      <div className="border-2 border-foreground p-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground mb-3">Search Parameters</h3>
        <div className="space-y-2 font-serif text-sm text-muted-foreground">
          <div><code className="font-mono text-xs text-foreground bg-muted px-1">q</code> - Search query (required, min 2 chars)</div>
          <div><code className="font-mono text-xs text-foreground bg-muted px-1">type</code> - Filter by type: companies, internships, careers, projects, all</div>
        </div>
      </div>
    </div>
  )
}

function ApiCard({ method, endpoint, description, code, response, copyToClipboard, copied, id }: {
  method: string; endpoint: string; description: string; code: string; response: string;
  copyToClipboard: (text: string, id: string) => void; copied: string | null; id: string;
}) {
  const methodStyles: Record<string, string> = {
    GET: "border-foreground bg-background text-foreground",
    POST: "border-foreground bg-foreground text-background",
    PUT: "border-foreground bg-background text-foreground",
    DELETE: "border-foreground bg-foreground text-background",
  }

  return (
    <div className="border-2 border-foreground">
      <div className="border-b-2 border-foreground p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 font-mono text-xs font-bold uppercase tracking-widest border-2 ${methodStyles[method] || "border-foreground bg-background text-foreground"}`}>
            {method}
          </span>
          <code className="font-mono text-sm text-foreground">{endpoint}</code>
        </div>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-2 px-3 py-1 border-2 border-foreground font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-100"
        >
          {copied === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied === id ? "Copied!" : "Copy Code"}
        </button>
      </div>
      <div className="p-4">
        <p className="font-serif text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-foreground" />
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">Request Example</span>
            </div>
            <pre className="border-2 border-foreground bg-muted p-3 overflow-x-auto">
              <code className="font-mono text-xs text-foreground">{code}</code>
            </pre>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">Response Example</span>
            </div>
            <pre className="border-2 border-foreground bg-muted p-3 overflow-x-auto">
              <code className="font-mono text-xs text-foreground">{response}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
