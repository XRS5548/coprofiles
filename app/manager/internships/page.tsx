// app/manager/internships/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TrendingUp,
  MoreVertical,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface Internship {
  id: number;
  title: string;
  active: boolean;
  isLive: boolean;
  lastApplyDate: string;
  duration: number;
  autoCancel: boolean;
  createdAt: string;
  companyId: number;
  companyName: string;
  applicationsCount: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ManagerInternshipsPage() {
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    live: 0,
    totalApplications: 0,
  });

  const limit = 10;

  useEffect(() => {
    fetchInternships();
  }, [currentPage, statusFilter]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/manager/internships?page=${currentPage}&limit=${limit}&status=${statusFilter}&search=${searchTerm}`,
        {
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch internships');
      }

      const data = await response.json();
      setInternships(data.internships);
      setPagination(data.pagination);
      
      // Calculate stats
      if (data.internships) {
        const total = data.pagination.total;
        const active = data.internships.filter((i: Internship) => i.active).length;
        const live = data.internships.filter((i: Internship) => i.isLive).length;
        const totalApplications = data.internships.reduce((sum: number, i: Internship) => sum + i.applicationsCount, 0);
        
        setStats({ total, active, live, totalApplications });
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchInternships();
  };

  const handleDelete = async () => {
    if (!selectedInternship) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/internships/${selectedInternship.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete internship');
      }

      toast.success('Internship deleted successfully');
      setDeleteDialogOpen(false);
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Failed to delete internship');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (internship: Internship) => {
    try {
      const response = await fetch(`/api/manager/internships/${internship.id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !internship.active,
          isLive: !internship.isLive,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Internship ${!internship.active ? 'activated' : 'deactivated'} successfully`);
      fetchInternships();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update internship status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (internship: Internship) => {
    if (!internship.active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inactive</Badge>;
    }
    if (internship.isLive) {
      return <Badge className="bg-green-100 text-green-700">Live</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">Draft</Badge>;
  };

  const statsCards = [
    {
      title: 'Total Internships',
      value: stats.total,
      icon: BriefcaseIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Active Internships',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Live Internships',
      value: stats.live,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  if (loading && internships.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Internships</h1>
          <p className="text-gray-500 mt-1">
            Manage and monitor all your internship programs
          </p>
        </div>
        <Button onClick={() => router.push('/manager/internships/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Internship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Internships Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Last Apply Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No internships found</p>
                      <Button 
                        variant="link" 
                        onClick={() => router.push('/manager/internships/create')}
                        className="mt-2"
                      >
                        Create your first internship
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  internships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">#{internship.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{internship.title}</p>
                          <p className="text-xs text-gray-500">
                            Auto-cancel: {internship.autoCancel ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span>{internship.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(internship)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{internship.duration} weeks</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{internship.applicationsCount}</span>
                          {internship.applicationsCount > 0 && (
                            <Progress 
                              value={Math.min((internship.applicationsCount / 100) * 100, 100)} 
                              className="h-1 w-12" 
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{formatDate(internship.lastApplyDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(internship.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/manager/internships/${internship.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/manager/internships/${internship.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/manager/internships/${internship.id}/applications`)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Applications ({internship.applicationsCount})
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleStatus(internship)}>
                              {internship.active ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInternship(internship);
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * limit) + 1} to {Math.min(pagination.page * limit, pagination.total)} of {pagination.total} internships
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedInternship?.title}"? This action cannot be undone.
              All applications for this internship will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icon component for Briefcase (to avoid naming conflict)
function BriefcaseIcon(props: any) {
  return <Briefcase {...props} />;
}