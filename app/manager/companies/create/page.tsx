// app/manager/companies/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, Upload, AlertCircle } from "lucide-react";

export default function CreateCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    logoUrl: ""
  });

  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Consulting",
    "Media",
    "Real Estate",
    "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Company name is required");
      setLoading(false);
      return;
    }

    try {
      // Correct API endpoint - /api/manager/companies/create (POST)
      const response = await fetch("/api/manager/companies/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies for auth
        body: JSON.stringify({
          name: formData.name,
          category: formData.category || null,
          description: formData.description || null,
          logoUrl: formData.logoUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to companies list
        router.push("/manager/companys");
      } else {
        setError(data.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      setError("Network error. Please try again.");
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
              href="/manager/companys"
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create New Company
              </h1>
              <p className="text-gray-400 mt-1">Fill in the details to create your company</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Company Name */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Enter company name"
            />
          </div>

          {/* Category */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Logo URL */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="https://example.com/logo.png"
            />
            {formData.logoUrl && (
              <div className="mt-3">
                <img 
                  src={formData.logoUrl} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg border border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-y"
              placeholder="Tell us about your company..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/manager/companys"
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
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="w-5 h-5" />
                  Create Company
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}