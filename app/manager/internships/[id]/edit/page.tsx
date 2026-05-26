// app/manager/internships/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
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

export default function EditInternshipPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(12);
  const [lastApplyDate, setLastApplyDate] = useState('');
  const [active, setActive] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [autoCancel, setAutoCancel] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch internship details
      const internshipRes = await fetch(`/api/manager/internships/${params.id}`, {
        credentials: 'include',
      });
      const internshipData = await internshipRes.json();
      
      // Fetch companies
      const companiesRes = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const companiesData = await companiesRes.json();
      
      setCompanies(companiesData.companies || []);
      setTitle(internshipData.internship.title);
      setCompanyId(internshipData.internship.companyId.toString());
      setContent(internshipData.internship.content);
      setDuration(internshipData.internship.duration);
      setLastApplyDate(internshipData.internship.lastApplyDate.split('T')[0]);
      setActive(internshipData.internship.active);
      setIsLive(internshipData.internship.isLive);
      setAutoCancel(internshipData.internship.autoCancel);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!companyId) newErrors.companyId = 'Please select a company';
    if (!content.trim()) newErrors.content = 'Description is required';
    if (!duration) newErrors.duration = 'Duration is required';
    if (!lastApplyDate) newErrors.lastApplyDate = 'Last apply date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setSaving(true);
    try {
      const response = await fetch(`/api/manager/internships/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

      if (!response.ok) throw new Error('Failed to update');
      
      toast.success('Internship updated successfully!');
      router.push(`/manager/internships/${params.id}`);
    } catch (error) {
      toast.error('Failed to update internship');
    } finally {
      setSaving(false);
    }
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
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-2 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Internship</h1>
        <p className="text-gray-500 mt-1">Update internship details</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label>Company *</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration (weeks) *</Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
              </div>

              <div className="space-y-2">
                <Label>Last Apply Date *</Label>
                <Input type="date" value={lastApplyDate} onChange={(e) => setLastApplyDate(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Label>Active Status</Label>
                  <p className="text-sm text-gray-500">Make visible to students</p>
                </div>
                <Switch checked={active} onCheckedChange={setActive} />
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Label>Live Status</Label>
                  <p className="text-sm text-gray-500">Feature prominently</p>
                </div>
                <Switch checked={isLive} onCheckedChange={setIsLive} />
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <Label>Auto Cancel</Label>
                  <p className="text-sm text-gray-500">Auto cancel after deadline</p>
                </div>
                <Switch checked={autoCancel} onCheckedChange={setAutoCancel} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}