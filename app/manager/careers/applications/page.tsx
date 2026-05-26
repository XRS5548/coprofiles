// app/manager/careers/applications/page.tsx - With Status Edit Feature
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Search, Eye, Mail, Loader2, Building2, User, Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Application {
  id: number;
  careerId: number;
  careerName: string;
  position: string;
  userName: string;
  userEmail: string;
  status: string;
  appliedDate: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  interviewDate: string | null;
  feedback: string | null;
  salaryOffered: number | null;
}

export default function CareerApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [salaryOffered, setSalaryOffered] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
    hired: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/manager/careers/applications', { 
        credentials: 'include' 
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/manager/careers/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: newStatus,
          interviewDate: interviewDate || null,
          feedback: feedback || null,
          salaryOffered: salaryOffered ? parseInt(salaryOffered) : null,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Application status updated to ${newStatus}`);
      setStatusDialogOpen(false);
      setDetailsOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Reviewing' },
      shortlisted: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Shortlisted' },
      interview: { color: 'bg-indigo-100 text-indigo-800', icon: Calendar, label: 'Interview' },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      hired: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, label: 'Hired' },
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
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interview: 'bg-indigo-100 text-indigo-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || colors.pending;
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.careerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statsCards = [
    { title: 'Total', value: stats.total, color: 'bg-blue-100 text-blue-600' },
    { title: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Reviewing', value: stats.reviewing, color: 'bg-blue-100 text-blue-600' },
    { title: 'Shortlisted', value: stats.shortlisted, color: 'bg-purple-100 text-purple-600' },
    { title: 'Interview', value: stats.interview, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Accepted', value: stats.accepted, color: 'bg-green-100 text-green-600' },
    { title: 'Rejected', value: stats.rejected, color: 'bg-red-100 text-red-600' },
    { title: 'Hired', value: stats.hired, color: 'bg-emerald-100 text-emerald-600' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <p className="text-gray-500 mt-1">Manage all job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-8">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
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
              placeholder="Search by name, email, or job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No applications yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>#{app.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.userName}</p>
                          <p className="text-xs text-gray-500">{app.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{app.careerName}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(app.appliedDate)}</TableCell>
                      <TableCell className="text-sm">{formatDate(app.interviewDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { 
                              setSelectedApp(app); 
                              setDetailsOpen(true); 
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.location.href = `mailto:${app.userEmail}`}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Application #{selectedApp.id} for {selectedApp.careerName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Candidate</p>
                    <p className="font-medium">{selectedApp.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedApp.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Job</p>
                    <p className="font-medium">{selectedApp.careerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="font-medium">{selectedApp.position || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applied Date</p>
                    <p className="font-medium">{formatDate(selectedApp.appliedDate)}</p>
                  </div>
                  {selectedApp.interviewDate && (
                    <div>
                      <p className="text-xs text-gray-500">Interview Date</p>
                      <p className="font-medium">{formatDate(selectedApp.interviewDate)}</p>
                    </div>
                  )}
                  {selectedApp.salaryOffered && (
                    <div>
                      <p className="text-xs text-gray-500">Salary Offered</p>
                      <p className="font-medium text-green-600">₹{selectedApp.salaryOffered.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {selectedApp.coverLetter && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cover Letter</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApp.coverLetter}</p>
                  </div>
                )}

                {selectedApp.feedback && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Feedback</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApp.feedback}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedApp.resumeUrl && (
                    <Button variant="outline" onClick={() => window.open(selectedApp.resumeUrl!, '_blank')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  )}
                  <Button onClick={() => {
                    setNewStatus(selectedApp.status);
                    setInterviewDate(selectedApp.interviewDate || '');
                    setFeedback(selectedApp.feedback || '');
                    setSalaryOffered(selectedApp.salaryOffered?.toString() || '');
                    setStatusDialogOpen(true);
                    setDetailsOpen(false);
                  }}>
                    Update Status
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Update status for {selectedApp?.userName}'s application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newStatus === 'interview' || newStatus === 'accepted') && (
              <div className="space-y-2">
                <Label>Interview Date</Label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
            )}

            {newStatus === 'accepted' && (
              <div className="space-y-2">
                <Label>Salary Offered (per year)</Label>
                <Input
                  type="number"
                  placeholder="Enter offered salary"
                  value={salaryOffered}
                  onChange={(e) => setSalaryOffered(e.target.value)}
                />
              </div>
            )}

            {(newStatus === 'rejected' || newStatus === 'accepted') && (
              <div className="space-y-2">
                <Label>Feedback (Optional)</Label>
                <Textarea
                  placeholder="Add feedback for the candidate..."
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
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}