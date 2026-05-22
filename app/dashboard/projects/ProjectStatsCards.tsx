// components/dashboard/projects/ProjectStatsCards.tsx
'use client';

import { FolderOpen, Globe, Lock, Mail as Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectStatsCardsProps {
  stats: {
    total: number;
    public: number;
    private: number;
    withGithub: number;
  };
}

export function ProjectStatsCards({ stats }: ProjectStatsCardsProps) {
  const statsConfig = [
    { label: "Total Projects", value: stats.total, icon: FolderOpen, color: "blue" },
    { label: "Public", value: stats.public, icon: Globe, color: "green" },
    { label: "Private", value: stats.private, icon: Lock, color: "purple" },
    { label: "GitHub Linked", value: stats.withGithub, icon: Github, color: "orange" },
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