// app/manager/careers/[id]/applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Users, Search, Download, 
  Mail, Phone, ChevronLeft, ChevronRight,
  Briefcase, DollarSign, Star
} from "lucide-react";

interface Application {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userProfileImg: string;
}

interface Career {
  id: number;
  name: string;
  position: string;
  salary: number;
  tierScore: number;
}

export default function CareerApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [career, setCareer] = useState<Career | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
  }, [params.id, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manager/careers/${params.id}/applications`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCareer(data.career);
        setApplications(data.applications || []);
        setTotalPages(Math.ceil((data.totalApplications || data.applications?.length) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportApplications = () => {
    const csvData = applications.map(app => ({
      Name: app.userName,
      Email: app.userEmail,
      Phone: app.userPhone || "N/A"
    }));
    
    const csv = [Object.keys(csvData[0] || {}), ...csvData.map(row => Object.values(row))];
    const csvContent = csv.map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${career?.name}_applications.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSalary = (salary: number) => {
    if (!salary) return "Not specified";
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
    return `₹${salary.toLocaleString()}`;
  };

  const filteredApplications = applications.filter(app => 
    app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/manager/careers"
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Applications
                </h1>
                <p className="text-gray-400 mt-1">
                  {career?.name} {career?.position && `- ${career.position}`}
                </p>
              </div>
            </div>
            <button
              onClick={exportApplications}
              disabled={applications.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Career Summary */}
      {career && (
        <div className="container mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-800 p-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{career.name}</span>
              </div>
              {career.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">{formatSalary(career.salary)}</span>
                </div>
              )}
              {career.tierScore && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">Tier {career.tierScore}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">{applications.length} Applicants</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search applicants by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
            />
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : paginatedApplications.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No applications yet</h3>
            <p className="text-gray-400">No one has applied to this position yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedApplications.map((application) => (
                <div key={application.id} className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-green-500/30 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {application.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{application.userName}</h3>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Mail className="w-4 h-4" />
                            {application.userEmail}
                          </div>
                          {application.userPhone && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Phone className="w-4 h-4" />
                              {application.userPhone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.open(`/user/${application.userId}`, "_blank")}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}