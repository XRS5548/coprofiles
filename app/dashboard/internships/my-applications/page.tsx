// app/dashboard/internships/my-applications/page.tsx - Complete with Dark/Light Theme

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationStats } from './ApplicationStats';
import { ApplicationCard } from './ApplicationCard'; 
import { ApplicationDetailsDialog } from './ApplicationDetailsDialog'; 
import { EmptyApplications } from './EmptyApplications'; 
import type { Application, ApplicationStatus } from '@/types/internship';

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
        console.log('API Response:', data);
        
        const apiApplications = data.applications || [];
        
        // Transform API data to frontend format
        const transformedApplications: Application[] = apiApplications.map((app: any) => ({
          id: app.id,
          internshipId: app.internshipId,
          internshipTitle: app.internshipTitle,
          companyName: app.companyName,
          companyLogo: app.companyLogo,
          status: app.status || 'pending',
          rollNo: app.rollNo,
          examDate: app.examDate,
          certificateUnlocked: app.certificateUnlocked || false,
          internshipActive: app.internshipActive || false,
          lastApplyDate: app.lastApplyDate,
          duration: app.duration,
          description: app.description,
          appliedDate: app.appliedAt || new Date().toISOString(),
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

  // Calculate stats based on new fields
  const stats = {
    total: applications.length,
    certificateAvailable: applications.filter((a) => a.certificateUnlocked).length,
    activeInternships: applications.filter((a) => a.internshipActive).length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    completed: applications.filter((a) => a.status === 'completed').length,
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 dark:bg-gray-800" />
          <Skeleton className="h-4 w-64 mt-2 dark:bg-gray-800" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          My Applications
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track and manage all your internship applications
        </p>
      </div>

      {/* Stats Cards */}
      <ApplicationStats 
        total={stats.total}
        certificateAvailable={stats.certificateAvailable}
        activeInternships={stats.activeInternships}
        pending={stats.pending}
        accepted={stats.accepted}
        completed={stats.completed}
      />

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap dark:bg-gray-800">
          <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            Accepted ({stats.accepted})
          </TabsTrigger>
          <TabsTrigger value="completed" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            Completed ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="certificates" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            Certificates ({stats.certificateAvailable})
          </TabsTrigger>
          <TabsTrigger value="active" className="dark:data-[state=active]:bg-gray-900 dark:text-gray-400 dark:data-[state=active]:text-gray-200">
            Active ({stats.activeInternships})
          </TabsTrigger>
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

        {/* Pending Applications Tab */}
        <TabsContent value="pending" className="space-y-4">
          {stats.pending === 0 ? (
            <EmptyApplications type="pending" />
          ) : (
            applications
              .filter(a => a.status === 'pending')
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

        {/* Accepted Applications Tab */}
        <TabsContent value="accepted" className="space-y-4">
          {stats.accepted === 0 ? (
            <EmptyApplications type="accepted" />
          ) : (
            applications
              .filter(a => a.status === 'accepted')
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

        {/* Completed Applications Tab */}
        <TabsContent value="completed" className="space-y-4">
          {stats.completed === 0 ? (
            <EmptyApplications type="completed" />
          ) : (
            applications
              .filter(a => a.status === 'completed')
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

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          {stats.certificateAvailable === 0 ? (
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
          {stats.activeInternships === 0 ? (
            <EmptyApplications type="active" />
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