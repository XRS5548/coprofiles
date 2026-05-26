// app/manager/careers/page.tsx - Updated according to your API
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Search, Eye, Edit, Trash2, MoreVertical, Briefcase, Building2, DollarSign, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Career {
  id: number;
  name: string;
  position: string | null;
  salary: number | null;
  tierScore: number | null;
  content: string | null;
  companyId: number;
  companyName: string;
  applicationsCount: number;
}

export default function ManagerCareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/manager/careers', {
        credentials: 'include',
      });
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      // Your API returns { careers: [...] }
      const careersList = data.careers || [];
      setCareers(careersList);
      
      const totalApps = careersList.reduce((sum: number, c: Career) => sum + (c.applicationsCount || 0), 0);
      setStats({ 
        total: careersList.length, 
        totalApplications: totalApps 
      });
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCareer) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/careers/${selectedCareer.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Job deleted successfully');
      setDeleteDialogOpen(false);
      fetchCareers();
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not disclosed';
    if (salary >= 10000000) return `₹${(salary / 10000000).toFixed(1)}Cr`;
    if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
    return `₹${salary.toLocaleString()}`;
  };

  const filteredCareers = careers.filter(career =>
    career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (career.position && career.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    career.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Jobs</h1>
          <p className="text-gray-500 mt-1">Manage all job postings</p>
        </div>
        <Button onClick={() => router.push('/manager/careers/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by job title, position, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No jobs found</p>
                      <Button variant="link" onClick={() => router.push('/manager/careers/create')}>
                        Post your first job
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCareers.map((career) => (
                    <TableRow key={career.id}>
                      <TableCell className="font-medium">#{career.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{career.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{career.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{career.position || '—'}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatSalary(career.salary)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" />
                          {career.applicationsCount || 0} applications
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/manager/careers/${career.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/manager/careers/${career.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/manager/careers/${career.id}/applications`)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Applications ({career.applicationsCount || 0})
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedCareer(career);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCareer?.name}"? This action cannot be undone.
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