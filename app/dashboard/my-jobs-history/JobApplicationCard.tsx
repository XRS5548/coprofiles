// components/dashboard/jobs/JobApplicationCard.tsx
'use client';

import { motion } from 'framer-motion';
import { Building, Briefcase, DollarSign, Clock, Eye, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { JobApplication } from '@/types/career';

interface JobApplicationCardProps {
  application: JobApplication;
  index: number;
  onViewDetails: (application: JobApplication) => void;
  formatDate: (timestamp: number) => string;
  formatSalary: (salary: number | null) => string;
}

export function JobApplicationCard({ 
  application, 
  index, 
  onViewDetails, 
  formatDate, 
  formatSalary 
}: JobApplicationCardProps) {
  const appliedDate = new Date(application.appliedAt);
  const isValidDate = !isNaN(appliedDate.getTime());

  return (
    <motion.div
      key={application.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-14 w-14">
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
                  <h3 className="font-semibold text-xl">{application.careerName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{application.companyName}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm">
                  {application.position && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Briefcase className="h-3 w-3" />
                      <span>{application.position}</span>
                    </div>
                  )}
                  {application.salary && (
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatSalary(application.salary)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-blue-100 text-blue-700">
                <Clock className="h-3 w-3 mr-1" />
                Applied 
              </Badge>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>Application #{application.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t">
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
              onClick={() => window.location.href = `/dashboard/careers?job=${application.careerId}`}
            >
              <ExternalLink className="h-3 w-3" />
              View Job Posting
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}