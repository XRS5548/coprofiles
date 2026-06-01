// app/manager/forms/submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Form {
  id: number;
  title: string;
  slug: string;
}

interface Submission {
  id: number;
  formId: number;
  userId: number | null;
  submitterName: string | null;
  submitterEmail: string | null;
  submitterPhone: string | null;
  responseData: Record<string, string | number | boolean | null>;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentAmount: number | null;
  paymentCurrency?: string | null;
  status: string;
  createdAt: string;
}

export default function FormSubmissionsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      fetchSubmissions();
    }
  }, [selectedForm, statusFilter]);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/manager/forms', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setForms(data.forms);
        if (data.forms.length > 0) {
          setSelectedForm(data.forms[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!selectedForm) return;
    
    try {
      const response = await fetch(`/api/manager/forms/${selectedForm.id}/submissions`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const updateSubmissionStatus = async (submissionId: number, status: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/manager/forms/submissions/${submissionId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Submission ${status} successfully`);
        setSubmissions(prev => prev.map(sub =>
          sub.id === submissionId ? { ...sub, status } : sub
        ));
        setSelectedSubmission(prev =>
          prev?.id === submissionId ? { ...prev, status } : prev
        );
        fetchSubmissions();
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const exportSubmissions = () => {
    if (!submissions.length) {
      toast.error('No submissions to export');
      return;
    }

    const exportData = submissions.map(sub => ({
      ID: sub.id,
      'Submitted At': new Date(sub.createdAt).toLocaleString(),
      Name: sub.submitterName || '',
      Email: sub.submitterEmail || '',
      Phone: sub.submitterPhone || '',
      Status: sub.status,
      'Payment Status': sub.paymentStatus || 'N/A',
      'Payment Amount': sub.paymentAmount ? `₹${sub.paymentAmount / 100}` : 'N/A',
      ...sub.responseData,
    }));

    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedForm?.title}_submissions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Exported successfully');
  };

  const convertToCSV = (data: Array<Record<string, unknown>>) => {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => JSON.stringify(obj[header] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, label: 'Rejected' },
      spam: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', icon: XCircle, label: 'Spam' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <Badge className={cn("border-0", color)}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">No Payment</Badge>;
    
    const config: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
    };
    const { color, label } = config[status] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return `₹${amount / 100}`;
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      (sub.submitterName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (sub.submitterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (sub.submitterPhone?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    paid: submissions.filter(s => s.paymentStatus === 'completed').length,
    totalRevenue: submissions
      .filter(s => s.paymentStatus === 'completed')
      .reduce((sum, s) => sum + (s.paymentAmount || 0), 0),
  };

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
          <h1 className="text-2xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground mt-1">Manage all form submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSubmissions} disabled={submissions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Form Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Select Form:</label>
              <Select
                value={selectedForm?.id.toString()}
                onValueChange={(val) => {
                  const form = forms.find(f => f.id.toString() === val);
                  setSelectedForm(form || null);
                }}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a form" />
                </SelectTrigger>
                <SelectContent>
                  {forms.map((form) => (
                    <SelectItem key={form.id} value={form.id.toString()}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSubmissions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {selectedForm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Submissions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-blue-100 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="rounded-lg bg-yellow-100 p-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.paid}</p>
                </div>
                <div className="rounded-lg bg-purple-100 p-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="rounded-lg bg-green-100 p-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No submissions found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">#{sub.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sub.submitterName || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">{sub.submitterEmail || 'No email'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(sub.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getPaymentStatusBadge(sub.paymentStatus)}
                          {sub.paymentAmount && (
                            <span className="text-xs text-muted-foreground">{formatCurrency(sub.paymentAmount)}</span>
                          )}
                        </div>
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
                            <DropdownMenuItem onClick={() => {
                              setSelectedSubmission(sub);
                              setDetailsOpen(true);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${sub.submitterEmail}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateSubmissionStatus(sub.id, 'approved')}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubmissionStatus(sub.id, 'rejected')}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSubmissionStatus(sub.id, 'pending')}>
                              <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                              Mark as Pending
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

      {/* Submission Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
                <DialogDescription>
                  Submission #{selectedSubmission.id} from {selectedSubmission.submitterName || 'Anonymous'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Submission Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted At</p>
                    <p className="font-medium">{formatDate(selectedSubmission.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    {getPaymentStatusBadge(selectedSubmission.paymentStatus)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Amount</p>
                    <p className="font-medium">{formatCurrency(selectedSubmission.paymentAmount)}</p>
                  </div>
                </div>

                {/* User Info */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Submitter Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedSubmission.submitterName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedSubmission.submitterEmail || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedSubmission.submitterPhone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Form Responses */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Form Responses</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedSubmission.responseData).map(([key, value]) => (
                      <div key={key} className="border-b pb-2 last:border-0">
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="text-sm break-words">{value || '-'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info if exists */}
                {selectedSubmission.paymentId && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Transaction ID</p>
                        <p className="font-mono text-sm">{selectedSubmission.paymentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium text-green-600">{formatCurrency(selectedSubmission.paymentAmount)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                {selectedSubmission.submitterEmail && (
                  <Button onClick={() => window.location.href = `mailto:${selectedSubmission.submitterEmail}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
