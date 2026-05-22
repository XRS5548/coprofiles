// app/manager/careers/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, DollarSign, Star, Briefcase } from "lucide-react";

export default function EditCareerPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    content: "",
    salary: "",
    tierScore: "",
    tierListId: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCareer();
  }, [params.id]);

  const fetchCareer = async () => {
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          name: data.career.name || "",
          position: data.career.position || "",
          content: data.career.content || "",
          salary: data.career.salary?.toString() || "",
          tierScore: data.career.tierScore?.toString() || "",
          tierListId: data.career.tierListId?.toString() || ""
        });
      }
    } catch (error) {
      console.error("Error fetching career:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Job title is required";
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

    setSaving(true);
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          position: formData.position || null,
          content: formData.content || null,
          salary: formData.salary ? parseInt(formData.salary) : null,
          tierScore: formData.tierScore ? parseInt(formData.tierScore) : null,
          tierListId: formData.tierListId ? parseInt(formData.tierListId) : null,
        }),
      });

      if (response.ok) {
        router.push("/manager/careers");
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || "Failed to update career" });
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/manager/careers" className="p-2 hover:bg-gray-800 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Career</h1>
              <p className="text-gray-400 mt-1">Update job opening details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position / Specialization
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white resize-y"
                />
              </div>

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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                    />
                  </div>
                  {errors.salary && <p className="text-red-400 text-sm mt-1">{errors.salary}</p>}
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
                      min="0"
                      max="100"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                    />
                  </div>
                  {errors.tierScore && <p className="text-red-400 text-sm mt-1">{errors.tierScore}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/manager/careers" className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}