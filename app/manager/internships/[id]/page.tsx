// app/manager/internships/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  Building2,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Internship {
  id: number;
  title: string;
  active: boolean;
  isLive: boolean;
  lastApplyDate: string;
  duration: number;
  autoCancel: boolean;
  createdAt: string;
  content: string;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  applicationsCount: number;
}

interface Application {
  id: number;
  userName: string;
  userEmail: string;
  rollNo: string;
  status: string;
  appliedAt: string;
  certificateUnlocked: boolean;
  certificatePaid: boolean;
}

export default function InternshipDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
  }, []);

  const fetchInternshipDetails = async () => {
    try {
      const response = await fetch(`/api/manager/internships/${params.id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setInternship(data.internship);
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load internship details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/internships/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Internship deleted successfully');
      router.push('/manager/internships');
    } catch (error) {
      toast.error('Failed to delete internship');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = () => {
    if (!internship) return null;
    if (!internship.active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (internship.isLive) {
      return <Badge className="bg-green-100 text-green-700">Live</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700">Active</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Internship not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{internship.title}</h1>
          <p className="text-gray-500 mt-1">{internship.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/manager/internships/${params.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            <Eye className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-xl font-bold">{internship.duration} weeks</p>
            </div>
            <Clock className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Applications</p>
              <p className="text-xl font-bold">{internship.applicationsCount}</p>
            </div>
            <Users className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Last Apply Date</p>
              <p className="text-sm font-medium">{formatDate(internship.lastApplyDate)}</p>
            </div>
            <Calendar className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({internship.applicationsCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{internship.content}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Auto Cancel</span>
                <Badge variant={internship.autoCancel ? 'default' : 'secondary'}>
                  {internship.autoCancel ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Created At</span>
                <span className="text-gray-600">{formatDate(internship.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Students who applied for this internship</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{app.userName}</p>
                        <p className="text-sm text-gray-500">{app.userEmail}</p>
                        <p className="text-xs text-gray-400">Roll No: {app.rollNo || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={app.status === 'pending' ? 'outline' : 'default'}>
                          {app.status}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(app.appliedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{internship.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}