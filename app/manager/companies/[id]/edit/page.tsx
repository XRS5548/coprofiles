// app/(dashboard)/manager/companies/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditCompany() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    logoUrl: ""
  });

  useEffect(() => {
    fetchCompany();
  }, [params.id]);

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/manager/companies/${params.id}`);
      const data = await response.json();
      setFormData({
        name: data.name || "",
        category: data.category || "",
        description: data.description || "",
        logoUrl: data.logoUrl || ""
      });
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/companies/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Company updated successfully!");
        router.push(`/manager/companies/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/manager/companies/${params.id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          Back to Company
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Company</h1>
        <p className="text-gray-600 mt-1">Update your company information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-black rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
          <input
            type="url"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/manager/companies/${params.id}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}