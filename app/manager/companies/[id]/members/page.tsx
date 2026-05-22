// app/(dashboard)/manager/companies/[id]/members/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Crown, Shield, User } from "lucide-react";

export default function CompanyMembers() {
  const params = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [params.id]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/manager/companies/${params.id}/members`);
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Founder":
      case "CEO":
        return <Crown size={18} className="text-yellow-600" />;
      case "CTO":
      case "Manager":
        return <Shield size={18} className="text-blue-600" />;
      default:
        return <User size={18} className="text-gray-600" />;
    }
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case "f":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Full Access</span>;
      case "c":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Create Access</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">View Only</span>;
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
      <div className="mb-6">
        <Link href={`/manager/companies/${params.id}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          Back to Company
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-600 mt-1">Manage your team and their permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member: any) => (
              <tr key={member.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {member.profileImgUrl ? (
                      <img src={member.profileImgUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-500" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <span className="text-sm text-gray-900">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPermissionBadge(member.permission)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">Edit Role</button>
                  <button className="text-red-600 hover:text-red-800">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}