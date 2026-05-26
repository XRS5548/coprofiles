// app/manager/careers/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Career {
  id: number;
  name: string;
  position: string | null;
  salary: number | null;
  tierScore: number | null;
  tierListId: number | null;
  content: string | null;
  companyId: number;
}

export default function EditCareerPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [tierScore, setTierScore] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch career');
      
      const data = await response.json();
      const career: Career = data.career;
      
      setName(career.name);
      setPosition(career.position || '');
      setSalary(career.salary ? career.salary.toString() : '');
      setTierScore(career.tierScore ? career.tierScore.toString() : '');
      setContent(career.content || '');
    } catch (error) {
      console.error('Error fetching career:', error);
      toast.error('Failed to load job details');
      router.push('/manager/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Job title is required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/manager/careers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          position: position.trim() || null,
          salary: salary ? parseInt(salary) : null,
          tierScore: tierScore ? parseInt(tierScore) : null,
          content: content.trim() || null,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }

      toast.success('Job updated successfully!');
      router.push('/manager/careers');
    } catch (error) {
      console.error('Error updating career:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={saving} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Job</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="name">Job Title *</Label>
            <Input
              id="name"
              placeholder="e.g., Senior Software Engineer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position / Job Type</Label>
            <Input
              id="position"
              placeholder="e.g., Full-time, Remote, Hybrid"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <p className="text-xs text-gray-500">Specify work type, location, or employment type</p>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary (per year)</Label>
            <Input
              id="salary"
              type="number"
              placeholder="e.g., 1200000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <p className="text-xs text-gray-500">Enter amount in rupees (e.g., 1200000 for ₹12 LPA)</p>
          </div>

          {/* Tier Score */}
          <div className="space-y-2">
            <Label htmlFor="tierScore">Tier Score</Label>
            <Input
              id="tierScore"
              type="number"
              placeholder="e.g., 1, 2, 3"
              value={tierScore}
              onChange={(e) => setTierScore(e.target.value)}
            />
            <p className="text-xs text-gray-500">Company tier rating (1=Highest, 2=Medium, 3=Basic)</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="content">Job Description</Label>
            <Textarea
              id="content"
              placeholder="Describe the job responsibilities, requirements, benefits, and other details..."
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}