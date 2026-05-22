// components/dashboard/jobs/JobStatsCards.tsx
'use client';

import { Briefcase, Calendar, Building, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface JobStatsCardsProps {
  stats: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    companies: number;
  };
}

export function JobStatsCards({ stats }: JobStatsCardsProps) {
  const statsConfig = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: Briefcase,
      color: "blue",
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      icon: Calendar,
      color: "green",
    },
    {
      label: "Companies Applied",
      value: stats.companies,
      icon: Building,
      color: "purple",
    },
    {
      label: "Last Month",
      value: stats.lastMonth,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const valueColors = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    orange: "text-orange-700",
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} p-2`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${valueColors[stat.color as keyof typeof valueColors]}`}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}