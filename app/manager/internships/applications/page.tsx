// app/manager/internships/applications/page.tsx - Updated for your API
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Building2,
  GraduationCap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  Award,
  CreditCard,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Application {
  applicationId: number;
  status: string;
  rollNo: string | null;
  examDate: string | null;
  internshipId: number;
  internshipTitle: string;
  companyId: number;
  companyName: string;
  userId: number;
  userName: string;
  email: string;
  phone: string | null;
  profile: string | null;
}

export default function ManagerApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [examDate, setExamDate] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manager/applications', {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const data = await response.json();
      
      // Extract applications from the response
      let allApps = data.applications || [];
      
      // Apply filters locally
      if (statusFilter !== 'all') {
        allApps = allApps.filter((app: Application) => app.status === statusFilter);
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        allApps = allApps.filter((app: Application) => 
          (app.userName && app.userName.toLowerCase().includes(searchLower)) ||
          (app.email && app.email.toLowerCase().includes(searchLower)) ||
          (app.internshipTitle && app.internshipTitle.toLowerCase().includes(searchLower))
        );
      }
      
      setApplications(allApps);
      
      // Calculate stats
      const statsData = {
        total: allApps.length,
        pending: allApps.filter((app: Application) => app.status === 'pending').length,
        accepted: allApps.filter((app: Application) => app.status === 'accepted').length,
        rejected: allApps.filter((app: Application) => app.status === 'rejected').length,
        completed: allApps.filter((app: Application) => app.status === 'completed').length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchApplications();
  };

  const updateApplicationStatus = async () => {
    if (!selectedApplication) return;
    
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/manager/applications/${selectedApplication.applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          feedback: feedback,
          examDate: examDate || null,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Application ${newStatus} successfully`);
      setStatusDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: Award, label: 'Completed' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statsCards = [
    { title: 'Total Applications', value: stats.total, color: 'bg-blue-100 text-blue-600', icon: FileText },
    { title: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-600', icon: Clock },
    { title: 'Accepted', value: stats.accepted, color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { title: 'Rejected', value: stats.rejected, color: 'bg-red-100 text-red-600', icon: XCircle },
    { title: 'Completed', value: stats.completed, color: 'bg-purple-100 text-purple-600', icon: Award },
  ];

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Internship Applications</h1>
        <p className="text-gray-500 mt-1">Manage and review all student applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
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
              placeholder="Search by student name, email, or internship..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Internship</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Exam Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No applications found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.applicationId}>
                      <TableCell className="font-medium">#{app.applicationId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.userName}</p>
                          <p className="text-xs text-gray-500">{app.email}</p>
                          {app.phone && <p className="text-xs text-gray-400">{app.phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{app.internshipTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{app.companyName}</span>
                      </TableCell>
                      <TableCell>{app.rollNo || '—'}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(app.examDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => router.push(`/manager/applications/${app.applicationId}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedApplication(app);
                              setNewStatus(app.status);
                              setStatusDialogOpen(true);
                            }}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${app.email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
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

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Update status for {selectedApplication?.userName}'s application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newStatus === 'accepted' || newStatus === 'completed') && (
              <div className="space-y-2">
                <Label>Exam Date (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
            )}

            {newStatus === 'rejected' && (
              <div className="space-y-2">
                <Label>Feedback (Optional)</Label>
                <Textarea
                  placeholder="Provide feedback to the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateApplicationStatus} disabled={updatingStatus}>
              {updatingStatus && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}