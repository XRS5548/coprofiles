// components/dashboard/jobs/JobDetailsDialog.tsx - Complete with Dark/Light Theme

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
  AlertCircle,
  TrendingUp,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    const configs: Record<CareerApplicationStatus, { color: string; darkColor: string; icon: any; label: string; bgColor: string; darkBgColor: string }> = {
      pending: { 
        color: 'text-yellow-700', darkColor: 'dark:text-yellow-400',
        bgColor: 'bg-yellow-50', darkBgColor: 'dark:bg-yellow-950/30',
        icon: Clock, 
        label: 'Pending Review' 
      },
      reviewing: { 
        color: 'text-blue-700', darkColor: 'dark:text-blue-400',
        bgColor: 'bg-blue-50', darkBgColor: 'dark:bg-blue-950/30',
        icon: Users, 
        label: 'Under Review' 
      },
      shortlisted: { 
        color: 'text-purple-700', darkColor: 'dark:text-purple-400',
        bgColor: 'bg-purple-50', darkBgColor: 'dark:bg-purple-950/30',
        icon: Award, 
        label: 'Shortlisted' 
      },
      interview: { 
        color: 'text-indigo-700', darkColor: 'dark:text-indigo-400',
        bgColor: 'bg-indigo-50', darkBgColor: 'dark:bg-indigo-950/30',
        icon: Calendar, 
        label: 'Interview Scheduled' 
      },
      accepted: { 
        color: 'text-green-700', darkColor: 'dark:text-green-400',
        bgColor: 'bg-green-50', darkBgColor: 'dark:bg-green-950/30',
        icon: CheckCircle, 
        label: 'Accepted' 
      },
      rejected: { 
        color: 'text-red-700', darkColor: 'dark:text-red-400',
        bgColor: 'bg-red-50', darkBgColor: 'dark:bg-red-950/30',
        icon: XCircle, 
        label: 'Rejected' 
      },
      hired: { 
        color: 'text-emerald-700', darkColor: 'dark:text-emerald-400',
        bgColor: 'bg-emerald-50', darkBgColor: 'dark:bg-emerald-950/30',
        icon: Award, 
        label: 'Hired' 
      },
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
      <DialogContent className=" min-w-[50vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-gray-900">
        {/* Header with Gradient Background */}
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative p-6 pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-indigo-100 dark:ring-indigo-950 shadow-lg">
                {application.companyLogo ? (
                  <AvatarImage src={application.companyLogo} alt={application.companyName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                    {application.companyName?.charAt(0) || 'C'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  {application.careerName}
                </DialogTitle>
                <DialogDescription className="text-base flex items-center gap-1 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{application.companyName}</span>
                </DialogDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.darkBgColor} ${statusConfig.color} ${statusConfig.darkColor} border-none`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                  {application.salaryOffered && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-none">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Offer Extended
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div className="p-6 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Position</p>
              <p className="font-medium text-sm dark:text-gray-300">{application.position || 'Not specified'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Salary Range</p>
              <p className="font-medium text-sm text-green-600 dark:text-green-400">{formatSalary(application.salary)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Application ID</p>
              <p className="font-medium text-sm dark:text-gray-300">#{application.id}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Office ID</p>
              <p className="font-medium text-sm dark:text-gray-300">{application.officeId || 'Not assigned'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Applied On</p>
              <p className="font-medium text-sm dark:text-gray-300">{formatDate(application.appliedAt)}</p>
            </div>
            {application.salaryOffered && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Salary Offered</p>
                <p className="font-medium text-sm text-emerald-700 dark:text-emerald-400">{formatSalary(application.salaryOffered)}</p>
              </div>
            )}
          </div>

          {/* Interview Date if scheduled */}
          {application.interviewDate && (
            <div className={`rounded-lg p-4 border ${statusConfig.bgColor} ${statusConfig.darkBgColor} border-purple-200 dark:border-purple-800`}>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <Calendar className="h-4 w-4" />
                Interview Scheduled
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
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
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                <Calendar className="h-4 w-4" />
                Joining Date
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
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
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
              <Button 
                variant="outline" 
                className="w-full gap-2 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50"
                onClick={() => window.open(application.offerLetterUrl!, '_blank')}
              >
                <Download className="h-4 w-4" />
                Download Offer Letter
              </Button>
            </div>
          )}

          {/* Status Message */}
          <div className={`rounded-lg p-4 border ${
            application.status === 'rejected' ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' :
            application.status === 'accepted' || application.status === 'hired' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' :
            'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
          }`}>
            <h4 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${
              application.status === 'rejected' ? 'text-red-700 dark:text-red-400' :
              application.status === 'accepted' || application.status === 'hired' ? 'text-green-700 dark:text-green-400' :
              'text-blue-700 dark:text-blue-400'
            }`}>
              <CheckCircle className="h-4 w-4" />
              Application Status
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {getStatusMessage()}
            </p>
          </div>

          {/* Cover Letter if exists */}
          {application.coverLetter && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText className="h-4 w-4" />
                Cover Letter
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {application.coverLetter}
              </p>
            </div>
          )}

          {/* Resume Link if exists */}
          {application.resumeUrl && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <Button 
                variant="outline" 
                className="w-full gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => window.open(application.resumeUrl!, '_blank')}
              >
                <FileText className="h-4 w-4" />
                View Resume
              </Button>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Building className="h-4 w-4" />
              About {application.companyName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Application submitted on {isValidDate ? appliedDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'recently'}
            </p>
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <DialogFooter className="p-6 pt-4 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="sm:order-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Close
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            onClick={() => window.location.href = `/dashboard/careers?job=${application.careerId}`}
          >
            View Job Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}