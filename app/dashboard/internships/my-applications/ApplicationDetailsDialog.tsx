// components/dashboard/internships/ApplicationDetailsDialog.tsx
'use client';

import { Calendar, Award, Building, Clock, FileCheck, ExternalLink, CheckCircle, AlertCircle, Mail, Bell, User, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Application } from '@/types/internship';

interface ApplicationDetailsDialogProps {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailsDialog({ application, open, onOpenChange }: ApplicationDetailsDialogProps) {
  if (!application) return null;

  const appliedDate = new Date(application.appliedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const appliedTime = new Date(application.appliedDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const lastApplyDate = application.lastApplyDate 
    ? new Date(application.lastApplyDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Calculate days remaining for deadline
  const getDaysRemaining = () => {
    if (!application.lastApplyDate) return null;
    const today = new Date();
    const deadline = new Date(application.lastApplyDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" min-w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-gray-900">
        {/* Header with Gradient */}
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative p-6 pb-4">
            <div className="flex items-start gap-5">
              <Avatar className="h-16 w-16 ring-4 ring-indigo-100 dark:ring-indigo-950 shadow-lg">
                {application.companyLogo ? (
                  <AvatarImage src={application.companyLogo} alt={application.companyName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                    {application.companyName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  {application.internshipTitle}
                </DialogTitle>
                <DialogDescription className="text-base flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{application.companyName}</span>
                </DialogDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={application.internshipActive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}>
                    {application.internshipActive ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      'Closed'
                    )}
                  </Badge>
                  {application.certificateUnlocked && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <Award className="h-3 w-3 mr-1" />
                      Certificate Available
                    </Badge>
                  )}
                  {daysRemaining && daysRemaining > 0 && daysRemaining <= 7 && application.internshipActive && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {daysRemaining} days remaining
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="dark:bg-gray-800" />

        <div className="p-6 space-y-6">
          {/* Application Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Application ID</p>
                    <p className="text-lg font-bold mt-1 dark:text-gray-200">#{application.id}</p>
                  </div>
                  <FileCheck className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Applied On</p>
                    <p className="text-sm font-semibold mt-1 dark:text-gray-200">{appliedDate}</p>
                    <p className="text-xs text-gray-400">{appliedTime}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Certificate Status</p>
                    <p className="text-sm font-semibold mt-1 dark:text-gray-200">
                      {application.certificateUnlocked ? 'Unlocked' : 'Not Available'}
                    </p>
                  </div>
                  <Award className={`h-8 w-8 ${application.certificateUnlocked ? 'text-green-500' : 'text-gray-400'} opacity-50`} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-orange-500 dark:bg-gray-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Internship Status</p>
                    <p className="text-sm font-semibold mt-1 dark:text-gray-200">
                      {application.internshipActive ? 'Accepting' : 'Closed'}
                    </p>
                  </div>
                  <Briefcase className={`h-8 w-8 ${application.internshipActive ? 'text-green-500' : 'text-gray-400'} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Timeline */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-200">
              <Clock className="h-5 w-5 text-indigo-500" />
              Application Timeline
            </h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-6">
                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 flex items-center justify-center ring-4 ring-white dark:ring-gray-900">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">Application Submitted</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{appliedDate} at {appliedTime}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Your application has been successfully submitted to {application.companyName}</p>
                    </div>
                  </div>
                </div>
                
                {application.certificateUnlocked && (
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-4 ring-white dark:ring-gray-900">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Certificate Unlocked</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Congratulations! You can now download your certificate</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deadline Information */}
          {lastApplyDate && (
            <Card className={`${application.internshipActive ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Calendar className={`h-5 w-5 ${application.internshipActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${application.internshipActive ? 'text-blue-800 dark:text-blue-400' : 'text-gray-700 dark:text-gray-400'}`}>
                      Application Deadline
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Last Date to Apply: <span className="font-medium">{lastApplyDate}</span>
                    </p>
                    {daysRemaining && daysRemaining > 0 && application.internshipActive && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-blue-700 dark:text-blue-400">Time remaining</span>
                          <span className="text-blue-700 dark:text-blue-400 font-medium">{daysRemaining} days</span>
                        </div>
                        <Progress 
                          value={(daysRemaining / 30) * 100} 
                          className="h-2 bg-blue-200 dark:bg-blue-900"
                        />
                      </div>
                    )}
                    {!application.internshipActive && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        This internship has closed for applications
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          {application.internshipActive && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">Next Steps</h4>
                    <ul className="text-sm space-y-2 text-purple-700 dark:text-purple-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Keep checking your email for updates from the company</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Complete any pending tasks or assessments if applicable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Once the internship is completed, your certificate will be automatically unlocked</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Bell className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Enable notifications to stay updated about your application status</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
            variant="outline" 
            onClick={() => window.location.href = `/dashboard/internships/${application.internshipId}`}
            className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            View Full Internship
          </Button>
          {application.certificateUnlocked && (
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-200 dark:shadow-green-950/50"
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