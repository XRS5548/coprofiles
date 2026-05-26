// app/dashboard/internships/my-applications/ApplicationStats.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Award, Clock, CheckCircle, FileText } from 'lucide-react';

interface ApplicationStatsProps {
  total: number;
  certificateAvailable: number;
  activeInternships: number;
  pending: number;
  accepted: number;
  completed: number;
}

export function ApplicationStats({ 
  total, 
  certificateAvailable, 
  activeInternships, 
  pending, 
  accepted, 
  completed 
}: ApplicationStatsProps) {
  const stats = [
    { title: 'Total Applications', value: total, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { title: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Accepted', value: accepted, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Completed', value: completed, icon: Award, color: 'bg-purple-100 text-purple-600' },
    { title: 'Certificates', value: certificateAvailable, icon: Award, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Active', value: activeInternships, icon: Briefcase, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}