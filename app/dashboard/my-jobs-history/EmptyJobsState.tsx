// components/dashboard/jobs/EmptyJobsState.tsx
'use client';

import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyJobsStateProps {
  searchTerm?: string;
}

export function EmptyJobsState({ searchTerm = '' }: EmptyJobsStateProps) {
  const isSearchEmpty = searchTerm === '';
  
  return (
    <Card className="p-12 text-center">
      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600">No applications found</h3>
      <p className="text-gray-400 mt-1">
        {!isSearchEmpty ? 'Try adjusting your search' : "You haven't applied for any jobs yet"}
      </p>
      {isSearchEmpty && (
        <Button className="mt-4" onClick={() => window.location.href = '/dashboard/careers'}>
          Browse Jobs
        </Button>
      )}
    </Card>
  );
}