// components/dashboard/internships/ApplicationDetailsDialog.tsx
'use client';

import { Calendar, Award, Building, Clock, FileCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Application } from '@/types/internship';

interface ApplicationDetailsDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailsDialog({ application, open, onOpenChange }: ApplicationDetailsDialogProps) {
  if (!application) return null;

  const appliedDate = new Date(application.appliedDate).toLocaleDateString();
  const appliedTime = new Date(application.appliedDate).toLocaleTimeString();
  const lastApplyDate = application.lastApplyDate 
    ? new Date(application.lastApplyDate).toLocaleDateString() 
    : null;

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
                  {application.companyName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{application.internshipTitle}</DialogTitle>
              <DialogDescription className="text-base flex items-center gap-1">
                <Building className="h-3 w-3" />
                {application.companyName}
              </DialogDescription>
              <div className="flex gap-2 mt-2">
                <Badge className={application.internshipActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {application.internshipActive ? 'Active' : 'Closed'}
                </Badge>
                {application.certificateUnlocked && (
                  <Badge className="bg-green-100 text-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Certificate Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Applied On</p>
              <p className="font-medium text-sm">{appliedDate}</p>
              <p className="text-xs text-gray-400">{appliedTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Application ID</p>
              <p className="font-medium text-sm">#{application.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Certificate Status</p>
              <p className="font-medium text-sm flex items-center gap-1">
                {application.certificateUnlocked ? (
                  <>
                    <FileCheck className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">Available for download</span>
                  </>
                ) : (
                  <span className="text-gray-500">Not yet available</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Internship Status</p>
              <p className="font-medium text-sm">
                {application.internshipActive ? 'Active - Accepting Applications' : 'Closed'}
              </p>
            </div>
          </div>

          {/* Application Timeline */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Application Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-xs text-gray-500">{appliedDate} at {appliedTime}</p>
                </div>
              </div>
              
              {application.certificateUnlocked && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Certificate Unlocked</p>
                    <p className="text-xs text-gray-500">You can now download your certificate</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deadline Information */}
          {lastApplyDate && (
            <Card className={application.internshipActive ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}>
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Application Deadline
                </h4>
                <p className="text-sm">
                  Last Date to Apply: <span className="font-medium">{lastApplyDate}</span>
                </p>
                {!application.internshipActive && (
                  <p className="text-xs text-red-600 mt-2">
                    This internship has closed for applications
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {application.internshipActive && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
                <ul className="text-sm space-y-1 text-purple-700">
                  <li>• Keep checking your email for updates</li>
                  <li>• Complete any pending tasks if applicable</li>
                  <li>• Once the internship is completed, your certificate will be available</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = `/dashboard/internships/${application.internshipId}`}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Internship
          </Button>
          {application.certificateUnlocked && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = `/dashboard/certificate/${application.id}`}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}