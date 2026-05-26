// app/dashboard/internships/my-applications/EmptyApplications.tsx
'use client';

import { ClipboardList, Award, Clock, CheckCircle, Briefcase, FileText } from 'lucide-react';

interface EmptyApplicationsProps {
  type: 'all' | 'pending' | 'accepted' | 'rejected' | 'completed' | 'certificate' | 'active';
}

export function EmptyApplications({ type }: EmptyApplicationsProps) {
  const getContent = () => {
    switch (type) {
      case 'all':
        return {
          icon: ClipboardList,
          title: 'No Applications Found',
          description: "You haven't applied for any internships yet. Start exploring and apply to kickstart your career!",
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'No Pending Applications',
          description: "You don't have any pending applications. All your applications have been reviewed or you haven't applied yet.",
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          title: 'No Accepted Applications',
          description: "You haven't received any acceptances yet. Keep applying and stay positive!",
        };
      case 'rejected':
        return {
          icon: FileText,
          title: 'No Rejected Applications',
          description: "Good news! None of your applications have been rejected so far.",
        };
      case 'completed':
        return {
          icon: Award,
          title: 'No Completed Internships',
          description: "You haven't completed any internships yet. Start your journey today!",
        };
      case 'certificate':
        return {
          icon: Award,
          title: 'No Certificates Available',
          description: "Complete internships to unlock and download your certificates.",
        };
      case 'active':
        return {
          icon: Briefcase,
          title: 'No Active Internships',
          description: "You don't have any active internships right now. Apply to get started!",
        };
      default:
        return {
          icon: ClipboardList,
          title: 'No Applications Found',
          description: "You haven't applied for any internships yet.",
        };
    }
  };

  const { icon: Icon, title, description } = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );
}