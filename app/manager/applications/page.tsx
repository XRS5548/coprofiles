// app/manager/applications/page.tsx - Updated for your API structure
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
  MoreVertical,
  FileText,
  Award,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input as DateTimeInput } from '@/components/ui/input';

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
  category: string | null;
  description: string | null;
  verified: boolean;
  createdAt: string;
}

interface Internship {
  id: number;
  title: string;
  active: boolean;
  isLive: boolean;
  lastApplyDate: string | null;
  duration: number | null;
  autoCancel: boolean;
  createdAt: string;
  content: string | null;
  companyId: number;
}

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

interface ApiResponse {
  companies: Company[];
  internships: Internship[];
  applications: Application[];
}

export default function ManagerApplicationsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCompanies, setExpandedCompanies] = useState<Set<number>>(new Set());
  const [expandedInternships, setExpandedInternships] = useState<Set<number>>(new Set());
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
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
      
      const data: ApiResponse = await response.json();
      
      setCompanies(data.companies || []);
      setInternships(data.internships || []);
      setApplications(data.applications || []);
      
      // Calculate stats
      const apps = data.applications || [];
      const total = apps.length;
      const pending = apps.filter((a: Application) => a.status === 'pending').length;
      const accepted = apps.filter((a: Application) => a.status === 'accepted').length;
      const rejected = apps.filter((a: Application) => a.status === 'rejected').length;
      const completed = apps.filter((a: Application) => a.status === 'completed').length;
      
      setStats({ total, pending, accepted, rejected, completed });
      
      // Auto expand first company if any
      if (data.companies && data.companies.length > 0 && expandedCompanies.size === 0) {
        setExpandedCompanies(new Set([data.companies[0].id]));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
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

  const toggleCompany = (companyId: number) => {
    const newSet = new Set(expandedCompanies);
    if (newSet.has(companyId)) {
      newSet.delete(companyId);
    } else {
      newSet.add(companyId);
    }
    setExpandedCompanies(newSet);
  };

  const toggleInternship = (internshipId: number) => {
    const newSet = new Set(expandedInternships);
    if (newSet.has(internshipId)) {
      newSet.delete(internshipId);
    } else {
      newSet.add(internshipId);
    }
    setExpandedInternships(newSet);
  };

  // Group internships by company
  const internshipsByCompany = (companyId: number) => {
    return internships.filter(i => i.companyId === companyId);
  };

  // Get applications for an internship
  const getApplicationsForInternship = (internshipId: number) => {
    let apps = applications.filter(a => a.internshipId === internshipId);
    
    // Apply status filter
    if (statusFilter !== 'all') {
      apps = apps.filter(a => a.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      apps = apps.filter(a => 
        a.userName.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower) ||
        a.internshipTitle.toLowerCase().includes(searchLower) ||
        a.companyName.toLowerCase().includes(searchLower)
      );
    }
    
    return apps;
  };

  // Get all filtered applications for flat view
  const getFilteredApplications = () => {
    let apps = [...applications];
    
    if (statusFilter !== 'all') {
      apps = apps.filter(a => a.status === statusFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      apps = apps.filter(a => 
        a.userName.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower) ||
        a.internshipTitle.toLowerCase().includes(searchLower) ||
        a.companyName.toLowerCase().includes(searchLower)
      );
    }
    
    return apps;
  };

  const hasFilters = statusFilter !== 'all' || searchTerm;
  const filteredApps = getFilteredApplications();

  const statsCards = [
    { title: 'Total Applications', value: stats.total, color: 'bg-blue-100 text-blue-600', icon: FileText },
    { title: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-600', icon: Clock },
    { title: 'Accepted', value: stats.accepted, color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { title: 'Rejected', value: stats.rejected, color: 'bg-red-100 text-red-600', icon: XCircle },
    { title: 'Completed', value: stats.completed, color: 'bg-purple-100 text-purple-600', icon: Award },
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Internship Applications</h1>
        <p className="text-gray-500 mt-1">Manage and review all student applications across your companies</p>
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
              placeholder="Search by student name, email, internship, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {hasFilters && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {hasFilters ? (
        // Flat view when filters are applied
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No applications found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApps.map((app) => (
                      <TableRow key={app.applicationId}>
                        <TableCell className="font-medium">#{app.applicationId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.userName}</p>
                            <p className="text-xs text-gray-500">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{app.internshipTitle}</TableCell>
                        <TableCell>{app.companyName}</TableCell>
                        <TableCell>{app.rollNo || '—'}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/manager/applications/${app.applicationId}`)}>
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
      ) : (
        // Grouped view by company
        <div className="space-y-6">
          {companies.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No Applications Found</h3>
              <p className="text-gray-400 mt-1">No students have applied to your internships yet</p>
            </Card>
          ) : (
            companies.map((company) => {
              const companyInternships = internshipsByCompany(company.id);
              const hasInternships = companyInternships.length > 0;
              
              return (
                <Card key={company.id} className="overflow-hidden">
                  {/* Company Header */}
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
                    onClick={() => toggleCompany(company.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {company.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{company.name}</h3>
                        {company.category && (
                          <p className="text-sm text-gray-500">{company.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {companyInternships.reduce((sum, i) => sum + getApplicationsForInternship(i.id).length, 0)} applications
                      </Badge>
                      {expandedCompanies.has(company.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Internships List */}
                  {expandedCompanies.has(company.id) && (
                    <div className="p-4 space-y-4">
                      {companyInternships.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No internships for this company</p>
                      ) : (
                        companyInternships.map((internship) => {
                          const internshipApps = getApplicationsForInternship(internship.id);
                          
                          return (
                            <div key={internship.id} className="border rounded-lg overflow-hidden">
                              {/* Internship Header */}
                              <div 
                                className="p-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                                onClick={() => toggleInternship(internship.id)}
                              >
                                <div>
                                  <p className="font-medium">{internship.title}</p>
                                  <div className="flex gap-2 mt-1">
                                    {internship.duration && (
                                      <Badge variant="outline" className="text-xs">
                                        {internship.duration} weeks
                                      </Badge>
                                    )}
                                    {internship.isLive && (
                                      <Badge className="bg-green-100 text-green-700 text-xs">Live</Badge>
                                    )}
                                    {internship.active && !internship.isLive && (
                                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">Active</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline">
                                    {internshipApps.length} applications
                                  </Badge>
                                  {expandedInternships.has(internship.id) ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>

                              {/* Applications Table */}
                              {expandedInternships.has(internship.id) && (
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-gray-50">
                                        <TableHead>ID</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Roll No</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {internshipApps.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No applications for this internship
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        internshipApps.map((app) => (
                                          <TableRow key={app.applicationId}>
                                            <TableCell className="font-medium">#{app.applicationId}</TableCell>
                                            <TableCell>
                                              <div>
                                                <p className="font-medium">{app.userName}</p>
                                                <p className="text-xs text-gray-500">{app.email}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell>{app.rollNo || '—'}</TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right">
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                  <DropdownMenuItem onClick={() => router.push(`/manager/applications/${app.applicationId}`)}>
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
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

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
                <DateTimeInput
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
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