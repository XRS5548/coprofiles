// app/manager/internships/create/page.tsx - Without react-hook-form
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Eye,
  Building2,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
  category: string | null;
}

export default function CreateInternshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  
  // Form state
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(12);
  const [lastApplyDate, setLastApplyDate] = useState('');
  const [active, setActive] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [autoCancel, setAutoCancel] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/manager/companies', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCompanies(data.companies || []);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!companyId) {
      newErrors.companyId = 'Please select a company';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Description is required';
    } else if (content.length < 50) {
      newErrors.content = 'Description must be at least 50 characters';
    }
    
    if (!duration) {
      newErrors.duration = 'Duration is required';
    } else if (duration < 1) {
      newErrors.duration = 'Duration must be at least 1 week';
    } else if (duration > 52) {
      newErrors.duration = 'Duration cannot exceed 52 weeks';
    }
    
    if (!lastApplyDate) {
      newErrors.lastApplyDate = 'Last apply date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/manager/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          companyId: parseInt(companyId),
          content,
          duration,
          lastApplyDate,
          active,
          isLive,
          autoCancel,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create internship');
      }

      toast.success('Internship created successfully!');
      router.push('/manager/internships');
    } catch (error) {
      console.error('Error creating internship:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create internship');
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    const selectedCompany = companies.find(c => c.id === parseInt(companyId));
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setPreviewMode(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <h1 className="text-2xl font-bold">Preview Internship</h1>
          </div>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Publish Internship
          </Button>
        </div>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{title || 'Untitled Internship'}</CardTitle>
                <CardDescription className="mt-1">
                  {selectedCompany?.name || 'Select Company'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {isLive && (
                  <Badge className="bg-green-100 text-green-700">Live</Badge>
                )}
                {active && !isLive && (
                  <Badge className="bg-yellow-100 text-yellow-700">Active</Badge>
                )}
                {!active && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Duration
                </p>
                <p className="font-medium">{duration} weeks</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Last Apply Date
                </p>
                <p className="font-medium">
                  {lastApplyDate ? new Date(lastApplyDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Auto Cancel</p>
                <p className="font-medium">{autoCancel ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{content || 'No description provided'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Internship</h1>
        <p className="text-gray-500 mt-1">Post a new internship opportunity</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the fundamental details of the internship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Internship Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Frontend Developer Intern"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
                <p className="text-sm text-gray-500">A clear and descriptive title for the internship</p>
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger className={errors.companyId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCompanies ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {company.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.companyId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.companyId}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 12"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.duration}
                  </p>
                )}
                <p className="text-sm text-gray-500">How many weeks will the internship last?</p>
              </div>

              {/* Last Apply Date */}
              <div className="space-y-2">
                <Label htmlFor="lastApplyDate">Last Apply Date *</Label>
                <Input
                  id="lastApplyDate"
                  type="date"
                  value={lastApplyDate}
                  onChange={(e) => setLastApplyDate(e.target.value)}
                  className={errors.lastApplyDate ? 'border-red-500' : ''}
                />
                {errors.lastApplyDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.lastApplyDate}
                  </p>
                )}
                <p className="text-sm text-gray-500">The last date for students to apply</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
              <CardDescription>Describe the internship in detail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Description *</Label>
                <Textarea
                  id="content"
                  placeholder="Describe the internship responsibilities, requirements, and benefits..."
                  className="min-h-[200px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.content}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Include details about daily tasks, required skills, learning opportunities, and any perks
                </p>
                <p className="text-sm text-gray-400">
                  {content.length}/50 characters minimum
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internship Settings</CardTitle>
              <CardDescription>Configure how the internship appears</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Status */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Active Status</Label>
                  <p className="text-sm text-gray-500">Make this internship visible to students</p>
                </div>
                <Switch
                  checked={active}
                  onCheckedChange={setActive}
                />
              </div>

              {/* Live Status */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Live Status</Label>
                  <p className="text-sm text-gray-500">Mark as live to feature prominently</p>
                </div>
                <Switch
                  checked={isLive}
                  onCheckedChange={setIsLive}
                />
              </div>

              {/* Auto Cancel */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Cancel</Label>
                  <p className="text-sm text-gray-500">Automatically cancel after deadline</p>
                </div>
                <Switch
                  checked={autoCancel}
                  onCheckedChange={setAutoCancel}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="button" variant="outline" onClick={() => setPreviewMode(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button type="button" onClick={onSubmit} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Create Internship
        </Button>
      </div>
    </div>
  );
}