// components/dashboard/internships/EmptyApplications.tsx
'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyApplicationsProps {
  type?: 'all' | 'certificate';
}

export function EmptyApplications({ type = 'all' }: EmptyApplicationsProps) {
  const messages = {
    all: {
      title: "No applications found",
      description: "You haven't applied for any internships yet",
      buttonText: "Browse Internships",
      buttonLink: "/dashboard/internships"
    },
    certificate: {
      title: "No certificates available",
      description: "Complete internships to unlock your certificates",
      buttonText: "View Applications",
      buttonLink: "/dashboard/internships/my-applications"
    }
  };

  const message = messages[type];

  return (
    <Card className="p-12 text-center">
      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600">{message.title}</h3>
      <p className="text-gray-400 mt-1">{message.description}</p>
      <Button className="mt-4" onClick={() => window.location.href = message.buttonLink}>
        {message.buttonText}
      </Button>
    </Card>
  );
}