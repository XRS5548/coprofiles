// app/manager/careers/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Save, Building2, DollarSign, 
  Star, AlertCircle, Briefcase, TrendingUp
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  role: string;
}

export default function CreateCareerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    companyId: "",
    content: "",
    salary: "",
    tierScore: "",
    tierListId: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/manager/companies", {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCompanies(data.companies || []);
        if (data.companies?.length === 1) {
          setFormData(prev => ({ ...prev, companyId: data.companies[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Job title is required";
    if (!formData.companyId) newErrors.companyId = "Please select a company";
    if (formData.salary && (parseInt(formData.salary) < 0)) {
      newErrors.salary = "Salary must be a positive number";
    }
    if (formData.tierScore && (parseInt(formData.tierScore) < 0 || parseInt(formData.tierScore) > 100)) {
      newErrors.tierScore = "Tier score must be between 0 and 100";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/manager/careers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          position: formData.position || null,
          companyId: parseInt(formData.companyId),
          content: formData.content || null,
          salary: formData.salary ? parseInt(formData.salary) : null,
          tierScore: formData.tierScore ? parseInt(formData.tierScore) : null,
          tierListId: formData.tierListId ? parseInt(formData.tierListId) : null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/manager/careers");
      } else {
        setErrors({ submit: data.error || "Failed to create career" });
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/manager/careers"
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Create Career Opening
              </h1>
              <p className="text-gray-400 mt-1">Post a new job position</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Company Selection */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white appearance-none"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.companyId && (
              <p className="text-red-400 text-sm mt-1">{errors.companyId}</p>
            )}
          </div>

          {/* Job Details */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position / Specialization
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Backend Developer, Frontend Lead"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  placeholder="Describe the role, responsibilities, requirements, benefits..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white resize-y"
                />
              </div>
            </div>
          </div>

          {/* Compensation & Scoring */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Compensation & Scoring</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Annual Salary (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g., 1500000"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter amount in INR</p>
                {errors.salary && (
                  <p className="text-red-400 text-sm mt-1">{errors.salary}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tier Score (0-100)
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.tierScore}
                    onChange={(e) => setFormData({ ...formData, tierScore: e.target.value })}
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Higher score = Better ranking</p>
                {errors.tierScore && (
                  <p className="text-red-400 text-sm mt-1">{errors.tierScore}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href="/manager/careers"
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Creating..." : "Create Career"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}