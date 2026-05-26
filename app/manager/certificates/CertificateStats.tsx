// components/manager/certificates/CertificateStats.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Award, CheckCircle, Clock, XCircle } from 'lucide-react';

interface CertificateStatsProps {
  stats: {
    total: number;
    active: number;
    underReview: number;
    bounced: number;
  };
}

export function CertificateStats({ stats }: CertificateStatsProps) {
  const statsCards = [
    { title: 'Total Certificates', value: stats.total, color: 'bg-blue-100 text-blue-600', icon: Award },
    { title: 'Active', value: stats.active, color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { title: 'Under Review', value: stats.underReview, color: 'bg-yellow-100 text-yellow-600', icon: Clock },
    { title: 'Bounced', value: stats.bounced, color: 'bg-red-100 text-red-600', icon: XCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsCards.map((stat, index) => (
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