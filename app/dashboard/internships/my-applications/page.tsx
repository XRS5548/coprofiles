// app/dashboard/internships/my-applications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationStats } from './ApplicationStats';
import { ApplicationCard } from './ApplicationCard'; 
import { ApplicationDetailsDialog } from './ApplicationDetailsDialog'; 
import { EmptyApplications } from './EmptyApplications'; 
import type { ApiApplication, Application } from '@/types/internship';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/user/internships/applications', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        
        const data = await response.json();
        const apiApplications: ApiApplication[] = data.applications || [];
        
        // Transform API data to frontend format
        const transformedApplications: Application[] = apiApplications.map((app) => ({
          ...app,
          appliedDate: new Date(app.appliedAt).toISOString(),
        }));
        
        setApplications(transformedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications', {
          description: 'Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Calculate stats
  const stats = {
    total: applications.length,
    certificateAvailable: applications.filter((a) => a.certificateUnlocked).length,
    activeInternships: applications.filter((a) => a.internshipActive).length,
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
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
          My Applications
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage all your internship applications
        </p>
      </div>

      {/* Stats Cards */}
      <ApplicationStats 
        total={stats.total}
        certificateAvailable={stats.certificateAvailable}
        activeInternships={stats.activeInternships}
      />

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="certificates">Certificates ({stats.certificateAvailable})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.activeInternships})</TabsTrigger>
        </TabsList>

        {/* All Applications Tab */}
        <TabsContent value="all" className="space-y-4">
          {applications.length === 0 ? (
            <EmptyApplications type="all" />
          ) : (
            applications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                index={index}
                onViewDetails={setSelectedApplication}
              />
            ))
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          {applications.filter(a => a.certificateUnlocked).length === 0 ? (
            <EmptyApplications type="certificate" />
          ) : (
            applications
              .filter(a => a.certificateUnlocked)
              .map((application, index) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  index={index}
                  onViewDetails={setSelectedApplication}
                />
              ))
          )}
        </TabsContent>

        {/* Active Internships Tab */}
        <TabsContent value="active" className="space-y-4">
          {applications.filter(a => a.internshipActive).length === 0 ? (
            <EmptyApplications type="all" />
          ) : (
            applications
              .filter(a => a.internshipActive)
              .map((application, index) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  index={index}
                  onViewDetails={setSelectedApplication}
                />
              ))
          )}
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      />
    </div>
  );
}