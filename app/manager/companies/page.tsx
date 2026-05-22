// app/(dashboard)/manager/companies/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

export default function ManagerCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/manager/companies");
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId: number, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Company deleted successfully");
        fetchCompanies(); // Refresh list
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Companies</h1>
          <p className="text-gray-600 mt-1">Manage all your companies and their operations</p>
        </div>
        <Link
          href="/manager/companies/create"
          className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Create Company
        </Link>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <div className="text-center py-12 bg-black -50 rounded-lg">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first company.</p>
          <div className="mt-6">
            <Link
              href="/manager/companies/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Company
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company: any) => (
            <div key={company.id} className="bg-black rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
              {/* Company Logo */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 size={48} className="text-black opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {company.verified ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-yellow-500" />
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {company.role} • {company.permission === "f" ? "Full Access" : company.permission === "c" ? "Create Access" : "View Only"}
                </p>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>Team</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>Internships</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap size={14} />
                    <span>Careers</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/manager/companies/${company.id}`}
                    className="flex-1 bg-black -100 hover:bg-black -200 text-gray-700 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-1 transition"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                  <Link
                    href={`/manager/companies/${company.id}/edit`}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-1 transition"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(company.id, company.name)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm flex items-center justify-center gap-1 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}