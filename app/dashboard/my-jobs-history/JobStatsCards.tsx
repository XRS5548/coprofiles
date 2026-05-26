// components/dashboard/jobs/JobStatsCards.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, TrendingUp, Users, Building2, Clock, CheckCircle, XCircle, Award, Calendar, Star } from 'lucide-react';
import type { JobApplicationStats } from '@/types/career';

interface JobStatsCardsProps {
  stats: JobApplicationStats;
}

export function JobStatsCards({ stats }: JobStatsCardsProps) {
  const statCards = [
    { title: 'Total Applications', value: stats.total, icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { title: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { title: 'Companies', value: stats.companies, icon: Building2, color: 'bg-purple-100 text-purple-600' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Reviewing', value: stats.reviewing, icon: Users, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'bg-pink-100 text-pink-600' },
    { title: 'Interview', value: stats.interview, icon: Calendar, color: 'bg-orange-100 text-orange-600' },
    { title: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-600' },
    { title: 'Hired', value: stats.hired, icon: Award, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-1.5 ${stat.color}`}>
                <stat.icon className="h-3 w-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}