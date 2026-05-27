// components/dashboard/internships/ApplicationCard.tsx - Perfect Dark/Light Theme

'use client';

import { motion } from 'framer-motion';
import { Calendar, Eye, ExternalLink, Award, Building, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Application } from '@/types/internship';

interface ApplicationCardProps {
  application: Application;
  index: number;
  onViewDetails: (application: Application) => void;
}

export function ApplicationCard({ application, index, onViewDetails }: ApplicationCardProps) {
  const appliedDate = application.appliedDate 
    ? new Date(application.appliedDate).toLocaleDateString() 
    : 'Date not available';
    
  const lastApplyDate = application.lastApplyDate 
    ? new Date(application.lastApplyDate).toLocaleDateString() 
    : null;

  const getStatusBadge = () => {
    switch (application.status) {
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400', 
          text: 'Pending Review' 
        };
      case 'accepted':
        return { 
          color: 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400', 
          text: 'Accepted' 
        };
      case 'rejected':
        return { 
          color: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400', 
          text: 'Rejected' 
        };
      case 'completed':
        return { 
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400', 
          text: 'Completed' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', 
          text: 'Unknown' 
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 dark:bg-gray-900/90 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Section - Company Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-14 w-14 ring-2 ring-indigo-100 dark:ring-indigo-900/50">
                {application.companyLogo ? (
                  <AvatarImage src={application.companyLogo} alt={application.companyName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                    {application.companyName?.charAt(0) || 'C'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                    {application.internshipTitle}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 text-sm">
                    <Building className="h-3.5 w-3.5" />
                    {application.companyName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Applied: {appliedDate}
                  </span>
                  {application.rollNo && (
                    <span className="flex items-center gap-1.5">
                      Roll No: {application.rollNo}
                    </span>
                  )}
                  {application.certificateUnlocked && (
                    <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <Award className="h-3.5 w-3.5" />
                      Certificate Available
                    </span>
                  )}
                  {lastApplyDate && (
                    <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Deadline: {lastApplyDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - Status Badges */}
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${statusBadge.color} border-none px-3 py-1 text-sm font-medium`}>
                {statusBadge.text}
              </Badge>
              {application.examDate && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                >
                  📅 Exam: {new Date(application.examDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => onViewDetails(application)}
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={() => window.location.href = `/dashboard/internships/${application.internshipId}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Internship
            </Button>
            {application.certificateUnlocked && (
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-sm"
                onClick={() => window.location.href = '/dashboard/certificates'}
              >
                <FileCheck className="h-3.5 w-3.5" />
                View Certificates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}