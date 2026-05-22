// app/manager/internships/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Briefcase, Plus, Eye, Edit, Trash2, Search, 
  Filter, Calendar, Users, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, AlertCircle
} from "lucide-react";

interface Internship {
  id: number;
  title: string;
  active: boolean;
  isLive: boolean;
  lastApplyDate: string;
  duration: number;
  createdAt: string;
  companyId: number;
  companyName: string;
  applicationsCount: number;
}

export default function ManagerInternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchInternships();
  }, [currentPage, filterStatus]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/manager/internships?page=${currentPage}&limit=${itemsPerPage}&status=${filterStatus}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setInternships(data.internships || []);
        setTotalPages(Math.ceil((data.total || data.internships?.length) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedInternship) return;
    
    try {
      const response = await fetch(`/api/manager/internships/${selectedInternship.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (response.ok) {
        setShowDeleteModal(false);
        fetchInternships();
      }
    } catch (error) {
      console.error("Error deleting internship:", error);
    }
  };

  const toggleStatus = async (id: number, currentLive: boolean) => {
    try {
      const response = await fetch(`/api/manager/internships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isLive: !currentLive }),
      });
      
      if (response.ok) {
        fetchInternships();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredInternships = internships.filter(internship => 
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Internship Management
              </h1>
              <p className="text-gray-400 mt-1">Manage your company internships</p>
            </div>
            <Link
              href="/manager/internships/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create Internship
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Internships Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No internships found</h3>
            <p className="text-gray-400 mb-4">Create your first internship to get started</p>
            <Link
              href="/manager/internships/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create Internship
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Title</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Company</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Applications</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Deadline</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInternships.map((internship) => (
                    <tr key={internship.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{internship.title}</p>
                          <p className="text-sm text-gray-400">{internship.duration} weeks</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{internship.companyName}</span>
                      </td>
                      <td className="px-6 py-4">
                        {internship.isLive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                            <XCircle className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/manager/internships/${internship.id}/applications`)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                        >
                          <Users className="w-4 h-4" />
                          {internship.applicationsCount}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {internship.lastApplyDate ? new Date(internship.lastApplyDate).toLocaleDateString() : "No deadline"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(internship.id, internship.isLive)}
                            className={`p-1.5 rounded-lg transition ${
                              internship.isLive 
                                ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                                : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                            }`}
                            title={internship.isLive ? "Take Down" : "Publish"}
                          >
                            {internship.isLive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/manager/internships/${internship.id}/edit`}
                            className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedInternship(internship);
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
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInternship && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Delete Internship</h2>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete <span className="font-semibold">"{selectedInternship.title}"</span>?
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