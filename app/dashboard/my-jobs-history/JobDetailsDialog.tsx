// components/dashboard/jobs/JobDetailsDialog.tsx
'use client';

import { Building, CheckCircle, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { JobApplication } from '@/types/career';

interface JobDetailsDialogProps {
  application: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatSalary: (salary: number | null) => string;
}

export function JobDetailsDialog({ application, open, onOpenChange, formatSalary }: JobDetailsDialogProps) {
  if (!application) return null;

  const appliedDate = new Date(application.appliedAt);
  const isValidDate = !isNaN(appliedDate.getTime());
  const formattedDate = isValidDate 
    ? appliedDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Date not available';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
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
            <div>
              <DialogTitle className="text-2xl">{application.careerName}</DialogTitle>
              <DialogDescription className="text-base">
                {application.companyName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
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
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Application Status
            </h4>
            <p className="text-sm text-gray-700">
              Your application has been submitted successfully. The company will review your profile 
              and contact you if you're shortlisted for an interview.
            </p>
          </div>

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