// app/manager/internships/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function EditInternshipPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    duration: "",
    lastApplyDate: "",
    isLive: false,
    autoCancel: false,
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInternship();
  }, [params.id]);

  const fetchInternship = async () => {
    try {
      const response = await fetch(`/api/manager/internships/${params.id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          title: data.internship.title || "",
          content: data.internship.content || "",
          duration: data.internship.duration?.toString() || "",
          lastApplyDate: data.internship.lastApplyDate?.split("T")[0] || "",
          isLive: data.internship.isLive || false,
          autoCancel: data.internship.autoCancel || false,
          active: data.internship.active !== undefined ? data.internship.active : true,
        });
      }
    } catch (error) {
      console.error("Error fetching internship:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/manager/internships/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          lastApplyDate: formData.lastApplyDate || null,
        }),
      });

      if (response.ok) {
        router.push("/manager/internships");
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || "Failed to update internship" });
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/manager/internships" className="p-2 hover:bg-gray-800 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Internship</h1>
              <p className="text-gray-400 mt-1">Update internship details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form fields as create page */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (weeks)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Apply Date</label>
                  <input
                    type="date"
                    value={formData.lastApplyDate}
                    onChange={(e) => setFormData({ ...formData, lastApplyDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isLive}
                    onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-gray-300">Published (Live)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-gray-300">Active (Accepting Applications)</span>
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
          </div>

          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link href="/manager/internships" className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition disabled:opacity-50"
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