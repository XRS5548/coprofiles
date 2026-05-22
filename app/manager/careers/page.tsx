// app/manager/careers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, Plus, Eye, Edit, Trash2, Search, 
  Filter, Calendar, Users, DollarSign, Star,
  ChevronLeft, ChevronRight, AlertCircle, TrendingUp
} from "lucide-react";

interface Career {
  id: number;
  name: string;
  position: string;
  salary: number;
  tierScore: number;
  content: string;
  companyId: number;
  companyName: string;
  applicationsCount: number;
}

export default function ManagerCareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [stats, setStats] = useState({
    totalCareers: 0,
    totalApplications: 0,
    avgSalary: 0,
    avgTierScore: 0
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCareers();
    fetchStats();
  }, [currentPage, sortBy]);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manager/careers?page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCareers(data.careers || []);
        setTotalPages(Math.ceil((data.total || data.careers?.length) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/manager/careers/stats", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setStats({
          totalCareers: data.totalCareers || 0,
          totalApplications: data.totalApplications || 0,
          avgSalary: data.averageSalary || 0,
          avgTierScore: data.averageTierScore || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCareer) return;
    
    try {
      const response = await fetch(`/api/manager/careers/${selectedCareer.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (response.ok) {
        setShowDeleteModal(false);
        fetchCareers();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting career:", error);
    }
  };

  const formatSalary = (salary: number) => {
    if (!salary) return "Not specified";
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
    return `₹${salary.toLocaleString()}`;
  };

  const filteredCareers = careers.filter(career => 
    career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Career Management
              </h1>
              <p className="text-gray-400 mt-1">Manage job openings across your companies</p>
            </div>
            <Link
              href="/manager/careers/create"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create Career
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
            <div className="flex items-center justify-between">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.totalCareers}</div>
            <div className="text-sm text-gray-400">Total Careers</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.totalApplications}</div>
            <div className="text-sm text-gray-400">Total Applications</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{formatSalary(stats.avgSalary)}</div>
            <div className="text-sm text-gray-400">Average Salary</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
            <div className="flex items-center justify-between">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.avgTierScore || 0}</div>
            <div className="text-sm text-gray-400">Avg Tier Score</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4">
        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search careers by title, position or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary_high">Highest Salary</option>
              <option value="salary_low">Lowest Salary</option>
              <option value="applications">Most Applications</option>
              <option value="tier_score">Highest Tier Score</option>
            </select>
          </div>
        </div>

        {/* Careers Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No careers found</h3>
            <p className="text-gray-400 mb-4">Create your first career posting to get started</p>
            <Link
              href="/manager/careers/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create Career
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-700">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Position</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Company</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Salary</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Tier Score</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Applications</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCareers.map((career) => (
                      <tr key={career.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{career.name}</p>
                            {career.position && (
                              <p className="text-sm text-gray-400">{career.position}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{career.companyName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-medium">
                            {formatSalary(career.salary)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{career.tierScore || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/manager/careers/${career.id}/applications`)}
                            className="flex items-center gap-1 text-green-400 hover:text-green-300"
                          >
                            <Users className="w-4 h-4" />
                            {career.applicationsCount || 0}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/manager/careers/${career.id}/edit`}
                              className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedCareer(career);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
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
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCareer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Delete Career</h2>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete <span className="font-semibold">"{selectedCareer.name}"</span>?
            </p>
            <p className="text-sm text-red-400 mb-6">
              This action cannot be undone. All applications will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}