// app/dashboard/forms/page.tsx - Complete with Dark/Light Theme

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  FileText,
  Eye,
  Loader2,
  Calendar,
  DollarSign,
  Lock,
  Globe,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Form {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  formType: string;
  collectPayment: boolean;
  paymentAmount: number | null;
  submissionDeadline: string | null;
  submissionCount?: number;
  maxSubmissions: number | null;
}

export default function UserFormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAvailableForms();
  }, []);

  const fetchAvailableForms = async () => {
    try {
      const response = await fetch('/api/user/forms/available', {
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

  const getFormTypeIcon = (type: string) => {
    switch (type) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      case 'authenticated':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormTypeLabel = (type: string) => {
    switch (type) {
      case 'public':
        return 'Public';
      case 'private':
        return 'Private (Passkey)';
      case 'authenticated':
        return 'Login Required';
      default:
        return type;
    }
  };

  const isFormAvailable = (form: Form): boolean => {
    // Check deadline
    if (form.submissionDeadline && new Date(form.submissionDeadline) < new Date()) {
      return false;
    }
    // Check max submissions
    if (form.maxSubmissions && (form.submissionCount || 0) >= form.maxSubmissions) {
      return false;
    }
    return true;
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || form.formType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Available Forms
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Fill out forms to submit applications, feedback, or requests
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search forms by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="all">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="authenticated">Login Required</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <Card className="p-12 text-center dark:bg-gray-900">
          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No Forms Available</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            {searchTerm ? 'Try adjusting your search' : 'No forms are currently available for submission'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => {
            const isAvailable = isFormAvailable(form);
            return (
              <Card key={form.id} className="hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col dark:bg-gray-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 dark:bg-primary/20 p-2">
                        <div className="text-primary dark:text-primary-400">
                          {getFormTypeIcon(form.formType)}
                        </div>
                      </div>
                      <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                        {getFormTypeLabel(form.formType)}
                      </Badge>
                    </div>
                    {form.collectPayment && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-none">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ₹{(form.paymentAmount || 0) / 100}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-2 line-clamp-1 dark:text-gray-200">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 dark:text-gray-400">
                    {form.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {form.submissionDeadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Deadline: {format(new Date(form.submissionDeadline), 'dd MMM yyyy')}
                        </span>
                      </div>
                    )}
                    {form.maxSubmissions && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {form.submissionCount || 0} / {form.maxSubmissions} submissions
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full gap-2"
                    onClick={() => router.push(`/forms/${form.slug}`)}
                    disabled={!isAvailable}
                  >
                    <Eye className="h-4 w-4" />
                    {isAvailable ? 'Fill Form' : 'Closed'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}