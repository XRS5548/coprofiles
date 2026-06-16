 // components/dashboard/internships/ApplicationCard.tsx

'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Eye,
  ExternalLink,
  Award,
  Building,
  FileCheck,
} from 'lucide-react';
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

export function ApplicationCard({
  application,
  index,
  onViewDetails,
}: ApplicationCardProps) {
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
          color:
            'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
          text: 'Pending Review',
        };

      case 'accepted':
        return {
          color:
            'bg-green-500/15 text-green-400 border border-green-500/30',
          text: 'Accepted',
        };

      case 'rejected':
        return {
          color:
            'bg-red-500/15 text-red-400 border border-red-500/30',
          text: 'Rejected',
        };

      case 'completed':
        return {
          color:
            'bg-blue-500/15 text-blue-400 border border-blue-500/30',
          text: 'Completed',
        };

      default:
        return {
          color:
            'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30',
          text: 'Unknown',
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
      <Card className="group relative overflow-hidden border border-yellow-500/20 bg-black/60 backdrop-blur-xl hover:border-yellow-500/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-14 w-14 ring-2 ring-yellow-500/30">
                {application.companyLogo ? (
                  <AvatarImage
                    src={application.companyLogo}
                    alt={application.companyName}
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-black font-bold text-lg">
                    {application.companyName?.charAt(0) || 'C'}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="space-y-2">
                <div>
                  <h3 className="font-bold text-xl text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {application.internshipTitle}
                  </h3>

                  <p className="text-gray-400 flex items-center gap-1 text-sm">
                    <Building className="h-3.5 w-3.5" />
                    {application.companyName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-yellow-400" />
                    Applied: {appliedDate}
                  </span>

                  {application.rollNo && (
                    <span className="flex items-center gap-1.5">
                      Roll No: {application.rollNo}
                    </span>
                  )}

                  {application.certificateUnlocked && (
                    <span className="flex items-center gap-1.5 text-green-400">
                      <Award className="h-3.5 w-3.5" />
                      Certificate Available
                    </span>
                  )}

                  {lastApplyDate && (
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <Calendar className="h-3.5 w-3.5" />
                      Deadline: {lastApplyDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end gap-2">
              <Badge
                className={`${statusBadge.color} px-3 py-1 text-sm font-medium`}
              >
                {statusBadge.text}
              </Badge>

              {application.examDate && (
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-500/20 text-yellow-300 bg-yellow-500/5"
                >
                  📅 Exam:{' '}
                  {new Date(application.examDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-yellow-500/10">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-yellow-500/30 text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/15 hover:border-yellow-500"
              onClick={() => onViewDetails(application)}
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-yellow-500/40"
              onClick={() =>
                (window.location.href = `/dashboard/internships/${application.id}`)
              }
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Internship
            </Button>

            {application.certificateUnlocked && (
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:from-yellow-300 hover:to-amber-400 shadow-lg shadow-yellow-500/20"
                onClick={() =>
                  (window.location.href = '/dashboard/certificates')
                }
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