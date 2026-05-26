// components/dashboard/jobs/JobDetailsDialog.tsx
'use client';

import { 
  Building, 
  CheckCircle, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  XCircle, 
  Clock, 
  Users,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { JobApplication, CareerApplicationStatus } from '@/types/career';

interface JobDetailsDialogProps {
  application: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatSalary: (salary: number | null) => string;
  formatDate: (timestamp: number) => string;
}

export function JobDetailsDialog({ 
  application, 
  open, 
  onOpenChange, 
  formatSalary,
  formatDate 
}: JobDetailsDialogProps) {
  if (!application) return null;

  const appliedDate = new Date(application.appliedAt);
  const isValidDate = !isNaN(appliedDate.getTime());
  
  const getStatusConfig = (status: CareerApplicationStatus) => {
    const configs: Record<CareerApplicationStatus, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending Review' },
      reviewing: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Users, label: 'Under Review' },
      shortlisted: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Award, label: 'Shortlisted' },
      interview: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Calendar, label: 'Interview Scheduled' },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Rejected' },
      hired: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Award, label: 'Hired' },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  const getStatusMessage = () => {
    switch (application.status) {
      case 'pending':
        return 'Your application has been submitted successfully. The company will review your profile.';
      case 'reviewing':
        return 'Your application is currently being reviewed by the hiring team.';
      case 'shortlisted':
        return 'Congratulations! You have been shortlisted for this position. The company will contact you soon.';
      case 'interview':
        return `Your interview has been scheduled. Please check the date and prepare accordingly.${application.feedback ? `\n\nAdditional Notes: ${application.feedback}` : ''}`;
      case 'accepted':
        return 'Great news! Your application has been accepted. An offer letter will be sent to you shortly.';
      case 'rejected':
        return `We appreciate your interest. Unfortunately, your application was not selected this time.${application.feedback ? `\n\nFeedback: ${application.feedback}` : ''}`;
      case 'hired':
        return 'Congratulations on your new job! Welcome to the team.';
      default:
        return 'Your application has been submitted successfully.';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              {application.companyLogo ? (
                <AvatarImage src={application.companyLogo} alt={application.companyName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                  {application.companyName?.charAt(0) || 'C'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{application.careerName}</DialogTitle>
              <DialogDescription className="text-base">
                {application.companyName}
              </DialogDescription>
              <div className="mt-2">
                <Badge className={`${statusConfig.color} border px-2 py-1`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Position</p>
              <p className="font-medium">{application.position || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="font-medium text-green-600">
                {formatSalary(application.salary)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Application ID</p>
              <p className="font-medium">#{application.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Office ID</p>
              <p className="font-medium">{application.officeId || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="font-medium">{formatDate(application.appliedAt)}</p>
            </div>
            {application.salaryOffered && (
              <div>
                <p className="text-xs text-gray-500">Salary Offered</p>
                <p className="font-medium text-green-600">{formatSalary(application.salaryOffered)}</p>
              </div>
            )}
          </div>

          {/* Interview Date if scheduled */}
          {application.interviewDate && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-purple-700">
                <Calendar className="h-4 w-4" />
                Interview Scheduled
              </h4>
              <p className="text-sm text-purple-700">
                {new Date(application.interviewDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          {/* Joining Date if accepted/hired */}
          {application.joiningDate && (application.status === 'accepted' || application.status === 'hired') && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-700">
                <Calendar className="h-4 w-4" />
                Joining Date
              </h4>
              <p className="text-sm text-green-700">
                {new Date(application.joiningDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Offer Letter Link */}
          {application.offerLetterUrl && (
            <div className="bg-blue-50 rounded-lg p-4">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(application.offerLetterUrl!, '_blank')}
              >
                <Download className="h-4 w-4" />
                Download Offer Letter
              </Button>
            </div>
          )}

          {/* Status Message */}
          <div className={`rounded-lg p-4 ${
            application.status === 'rejected' ? 'bg-red-50' :
            application.status === 'accepted' || application.status === 'hired' ? 'bg-green-50' :
            'bg-blue-50'
          }`}>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${
                application.status === 'rejected' ? 'text-red-600' :
                application.status === 'accepted' || application.status === 'hired' ? 'text-green-600' :
                'text-blue-600'
              }`} />
              Application Status
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {getStatusMessage()}
            </p>
          </div>

          {/* Cover Letter if exists */}
          {application.coverLetter && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Cover Letter
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Resume Link if exists */}
          {application.resumeUrl && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(application.resumeUrl!, '_blank')}
              >
                <FileText className="h-4 w-4" />
                View Resume
              </Button>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              About {application.companyName}
            </h4>
            <p className="text-sm text-gray-600">
              Application submitted on {isValidDate ? appliedDate.toLocaleDateString() : 'recently'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            className="flex-1"
            onClick={() => window.location.href = `/dashboard/careers?job=${application.careerId}`}
          >
            View Job Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}