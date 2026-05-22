// components/dashboard/internships/ApplicationStats.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';

interface ApplicationStatsProps {
  total: number;
  certificateAvailable: number;
  activeInternships: number;
}

export function ApplicationStats({ total, certificateAvailable, activeInternships }: ApplicationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold mt-1">{total}</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow bg-green-50/50">
        <CardContent className="p-4">
          <p className="text-sm text-green-600">Certificates Available</p>
          <p className="text-2xl font-bold mt-1 text-green-700">{certificateAvailable}</p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow bg-blue-50/50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-600">Active Internships</p>
          <p className="text-2xl font-bold mt-1 text-blue-700">{activeInternships}</p>
        </CardContent>
      </Card>
    </div>
  );
}