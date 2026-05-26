// components/dashboard/jobs/EmptyJobsState.tsx
'use client';

import { Briefcase, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyJobsStateProps {
  searchTerm: string;
  statusFilter: string;
}

export function EmptyJobsState({ searchTerm, statusFilter }: EmptyJobsStateProps) {
  const hasFilters = searchTerm !== '' || statusFilter !== 'all';
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <Briefcase className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasFilters ? 'No matching applications found' : 'No applications yet'}
      </h3>
      <p className="text-sm text-gray-500 max-w-md">
        {hasFilters 
          ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
          : 'You haven\'t applied for any jobs yet. Start exploring career opportunities!'}
      </p>
      {hasFilters && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}