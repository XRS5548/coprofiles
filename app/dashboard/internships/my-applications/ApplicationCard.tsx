// components/dashboard/internships/ApplicationCard.tsx
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
  const appliedDate = new Date(application.appliedAt).toLocaleDateString();
  const lastApplyDate = application.lastApplyDate 
    ? new Date(application.lastApplyDate).toLocaleDateString() 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Section - Company Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-14 w-14">
                {application.companyLogo ? (
                  <AvatarImage src={application.companyLogo} alt={application.companyName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                    {application.companyName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-xl">{application.internshipTitle}</h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {application.companyName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Applied: {appliedDate}
                  </span>
                  {application.certificateUnlocked && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Award className="h-3 w-3" />
                      Certificate Ready
                    </span>
                  )}
                  {!application.internshipActive && (
                    <Badge variant="secondary" className="text-xs">
                      Closed
                    </Badge>
                  )}
                  {lastApplyDate && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Calendar className="h-3 w-3" />
                      Deadline: {lastApplyDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex flex-col items-end gap-2">
              <Badge className={application.internshipActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {application.internshipActive ? 'Active' : 'Closed'}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => onViewDetails(application)}
            >
              <Eye className="h-3 w-3" />
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.location.href = `/dashboard/internships/${application.internshipId}`}
            >
              <ExternalLink className="h-3 w-3" />
              View Internship
            </Button>
            {application.certificateUnlocked && (
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => window.location.href = `/dashboard/certificate/${application.id}`}
              >
                <FileCheck className="h-3 w-3" />
                Get My Certificate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}