// app/manager/internships/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Save, Calendar, Clock, 
  AlertCircle, CheckCircle, Building2
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  role: string;
}

export default function CreateInternshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    content: "",
    duration: "",
    lastApplyDate: "",
    isLive: false,
    autoCancel: false,
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
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.companyId) newErrors.companyId = "Please select a company";
    if (formData.duration && (parseInt(formData.duration) < 1 || parseInt(formData.duration) > 52)) {
      newErrors.duration = "Duration must be between 1 and 52 weeks";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/manager/internships/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          companyId: parseInt(formData.companyId),
          duration: formData.duration ? parseInt(formData.duration) : null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/manager/internships");
      } else {
        setErrors({ submit: data.error || "Failed to create internship" });
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
              href="/manager/internships"
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create Internship
              </h1>
              <p className="text-gray-400 mt-1">Post a new internship position</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none"
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

          {/* Basic Info */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Internship Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Frontend Developer Intern"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description / Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  placeholder="Describe the internship, requirements, responsibilities, benefits..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-y"
                />
              </div>
            </div>
          </div>

          {/* Duration & Dates */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Duration & Dates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (weeks)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="12"
                    min="1"
                    max="52"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
                {errors.duration && (
                  <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Apply Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    value={formData.lastApplyDate}
                    onChange={(e) => setFormData({ ...formData, lastApplyDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLive}
                  onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-gray-300">Publish immediately (make it live)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoCancel}
                  onChange={(e) => setFormData({ ...formData, autoCancel: e.target.checked })}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-gray-300">Auto-cancel after deadline</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/manager/internships"
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Creating..." : "Create Internship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}