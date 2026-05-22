// app/(dashboard)/manager/companies/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Briefcase, 
  GraduationCap,
  Edit,
  Plus,
  Mail,
  Calendar,
  MapPin
} from "lucide-react";

export default function CompanyDetails() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState({
    internshipsCount: 0,
    careersCount: 0,
    teamSize: 0
  });
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [params.id]);

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch(`/api/manager/companies/${params.id}`);
      const data = await response.json();
      setCompany(data);
      setStats(data.stats);
      setTeam(data.team || []);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Company not found</h3>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/manager/companies" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          Back to Companies
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-16 w-16 object-cover rounded-lg" />
            ) : (
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 size={32} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">{company.category}</p>
            </div>
          </div>
          <Link
            href={`/manager/companies/${params.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Edit size={20} />
            Edit Company
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Internships</p>
              <p className="text-2xl font-bold text-gray-900">{stats.internshipsCount}</p>
            </div>
            <Briefcase size={32} className="text-blue-500" />
          </div>
          <Link href={`/manager/internships?company=${params.id}`} className="text-blue-600 text-sm mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Careers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.careersCount}</p>
            </div>
            <GraduationCap size={32} className="text-green-500" />
          </div>
          <Link href={`/manager/careers?company=${params.id}`} className="text-blue-600 text-sm mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Team Size</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamSize}</p>
            </div>
            <Users size={32} className="text-purple-500" />
          </div>
          <Link href={`/manager/companies/${params.id}/members`} className="text-blue-600 text-sm mt-2 inline-block">
            View all →
          </Link>
        </div>
      </div>

      {/* Company Description */}
      {company.description && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">About Company</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{company.description}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/manager/internships/create?company=${params.id}`}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Plus size={24} className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Create Internship</p>
              <p className="text-sm text-gray-600">Post a new internship position</p>
            </div>
          </Link>
          <Link
            href={`/manager/careers/create?company=${params.id}`}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <Plus size={24} className="text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Create Career</p>
              <p className="text-sm text-gray-600">Post a new full-time position</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Team Members Preview */}
      {team.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <Link href={`/manager/companies/${params.id}/members`} className="text-blue-600 text-sm">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {team.slice(0, 5).map((member: any) => (
              <div key={member.userId} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                {member.userImg ? (
                  <img src={member.userImg} alt={member.userName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.userName}</p>
                  <p className="text-sm text-gray-600">{member.userRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}