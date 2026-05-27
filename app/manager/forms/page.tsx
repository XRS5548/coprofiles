// app/manager/forms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  FileText,
  Eye,
  Copy,
  Trash2,
  MoreVertical,
  Users,
  TrendingUp,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Globe,
  DollarSign,
} from 'lucide-react';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Form {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  formType: 'public' | 'private' | 'authenticated';
  status: 'draft' | 'active' | 'paused' | 'closed' | 'archived';
  collectPayment: boolean;
  paymentAmount: number | null;
  maxSubmissions: number | null;
  submissionCount: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/manager/forms', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setForms(data.forms);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId: number) => {
    setDeleting(formId);
    try {
      const response = await fetch(`/api/manager/forms/${formId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Form deleted successfully');
        fetchForms();
      } else {
        throw new Error(data.error || 'Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    } finally {
      setDeleting(null);
    }
  };

  const handleDuplicate = async (formId: number) => {
    try {
      const response = await fetch(`/api/manager/forms/${formId}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Form duplicated successfully');
        fetchForms();
      } else {
        throw new Error(data.error || 'Failed to duplicate form');
      }
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast.error('Failed to duplicate form');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: Clock, label: 'Draft' },
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, label: 'Active' },
      paused: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, label: 'Paused' },
      closed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, label: 'Closed' },
      archived: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: FileText, label: 'Archived' },
    };
    const { color, icon: Icon, label } = config[status] || config.draft;
    return (
      <Badge className={cn("border-0", color)}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      public: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Globe, label: 'Public' },
      private: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Lock, label: 'Private' },
      authenticated: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Users, label: 'Authenticated' },
    };
    const { color, icon: Icon, label } = config[type] || config.public;
    return (
      <Badge variant="outline" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return null;
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    const matchesType = typeFilter === 'all' || form.formType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: forms.length,
    active: forms.filter(f => f.status === 'active').length,
    draft: forms.filter(f => f.status === 'draft').length,
    totalSubmissions: forms.reduce((sum, f) => sum + (f.submissionCount || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forms</h1>
          <p className="text-muted-foreground mt-1">Create and manage forms to collect data</p>
        </div>
        <Button onClick={() => router.push('/manager/forms/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Forms</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Draft Forms</p>
                <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
              </div>
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSubmissions}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Form Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="authenticated">Authenticated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">No Forms Found</h2>
          <p className="text-muted-foreground mt-2">Create your first form to start collecting data</p>
          <Button onClick={() => router.push('/manager/forms/create')} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
            <Card key={form.id} className="border-border hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{form.title}</h3>
                      {form.collectPayment && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(form.paymentAmount)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {form.description || 'No description'}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {getStatusBadge(form.status)}
                      {getTypeBadge(form.formType)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push(`/manager/forms/${form.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/manager/forms/${form.id}/submissions`)}>
                        <Users className="mr-2 h-4 w-4" />
                        View Submissions ({form.submissionCount || 0})
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/manager/forms/${form.id}/analytics`)}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDuplicate(form.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(form.id)}
                        disabled={deleting === form.id}
                        className="text-red-600"
                      >
                        {deleting === form.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-xs">{formatDate(form.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                        <p className="text-xs font-medium">{form.submissionCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-xs font-medium">{form.views || 0}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/forms/${form.slug}`, '_blank')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}