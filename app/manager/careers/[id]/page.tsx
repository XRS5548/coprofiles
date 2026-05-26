// app/manager/careers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Trash2, Briefcase, Building2, DollarSign, TrendingUp, Calendar, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Career {
  id: number;
  name: string;
  position: string | null;
  salary: number | null;
  tierScore: number | null;
  tierListId: number | null;
  content: string | null;
  companyId: number;
  companyName?: string;
}

export default function CareerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCareer(data.career);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load job details');
      router.push('/manager/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Job deleted successfully');
      router.push('/manager/careers');
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not disclosed';
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)} Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)} L`;
    return `₹${salary.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/manager/careers/${career.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Title Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{career.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{career.companyName || 'Company'}</span>
                {career.position && (
                  <>
                    <span className="text-gray-300">•</span>
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{career.position}</span>
                  </>
                )}
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatSalary(career.salary)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="font-semibold">{formatSalary(career.salary)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tier Score</p>
              <p className="font-semibold">{career.tierScore || 'Not rated'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Applications</p>
              <p className="font-semibold">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {career.content && (
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{career.content}</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{career.name}"? This action cannot be undone.
              All applications for this job will also be deleted.
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