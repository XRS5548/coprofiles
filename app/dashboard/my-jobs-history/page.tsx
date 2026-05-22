// app/dashboard/my-jobs-history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { JobStatsCards } from './JobStatsCards';
import { JobSearchFilters } from './JobSearchFilters';
import { JobApplicationCard } from './JobApplicationCard';
import { EmptyJobsState } from './EmptyJobsState';
import { JobDetailsDialog } from './JobDetailsDialog';
import type { JobApplication, JobApplicationStats } from '@/types/career';

export default function MyJobsHistoryPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/user/careers/applications', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json();
        const apiApplications: JobApplication[] = data.applications || [];
        
        // Fix the appliedAt timestamp (convert from seconds to milliseconds if needed)
        const fixedApplications = apiApplications.map(app => ({
          ...app,
          appliedAt: app.appliedAt < 10000000000 ? app.appliedAt * 1000 : app.appliedAt
        }));
        
        setApplications(fixedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load job applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Calculate stats
  const getMonthYear = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth()}`;
  };

  const currentMonthYear = getMonthYear(Date.now());
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthYear = getMonthYear(lastMonthDate.getTime());

  const stats: JobApplicationStats = {
    total: applications.length,
    thisMonth: applications.filter(app => getMonthYear(app.appliedAt) === currentMonthYear).length,
    lastMonth: applications.filter(app => getMonthYear(app.appliedAt) === lastMonthYear).length,
    companies: new Set(applications.map(app => app.companyName)).size,
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = 
        app.careerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.position && app.position.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.appliedAt - a.appliedAt;
      } else if (sortBy === 'oldest') {
        return a.appliedAt - b.appliedAt;
      } else if (sortBy === 'company') {
        return a.companyName.localeCompare(b.companyName);
      } else if (sortBy === 'position') {
        return (a.position || '').localeCompare(b.position || '');
      }
      return 0;
    });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not disclosed';
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
    return `₹${salary.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Jobs History
        </h1>
        <p className="text-gray-500 mt-1">
          Track all the jobs you've applied for
        </p>
      </div>

      {/* Stats Cards */}
      <JobStatsCards stats={stats} />

      {/* Search and Filter */}
      <JobSearchFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyJobsState searchTerm={searchTerm} />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <JobApplicationCard
              key={application.id}
              application={application}
              index={index}
              onViewDetails={setSelectedApplication}
              formatDate={formatDate}
              formatSalary={formatSalary}
            />
          ))}
        </div>
      )}

      {/* Application Details Dialog */}
      <JobDetailsDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
        formatSalary={formatSalary}
      />
    </div>
  );
}