// app/manager/careers/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
  category: string | null;
}

export default function CreateCareerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  // Form fields
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [salary, setSalary] = useState('');
  const [tierScore, setTierScore] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toast.error('Job title is required');
      return;
    }
    
    if (!companyId) {
      toast.error('Please select a company');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/manager/careers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          position: position.trim() || null,
          companyId: parseInt(companyId),
          salary: salary ? parseInt(salary) : null,
          tierScore: tierScore ? parseInt(tierScore) : null,
          content: content.trim() || null,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      toast.success('Job posted successfully!');
      router.push('/manager/careers');
    } catch (error) {
      console.error('Error creating career:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post New Job</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new job posting</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="name">Job Title *</Label>
            <Input
              id="name"
              placeholder="e.g., Senior Software Engineer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-gray-500">Enter the full job title as it will appear to candidates</p>
          </div>

          {/* Position / Job Type */}
          <div className="space-y-2">
            <Label htmlFor="position">Position / Job Type</Label>
            <Input
              id="position"
              placeholder="e.g., Full-time, Remote, Hybrid, On-site"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <p className="text-xs text-gray-500">Specify work type, location, or employment type</p>
          </div>

          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger className={!companyId && !loadingCompanies ? 'border-red-500' : ''}>
                <SelectValue placeholder={loadingCompanies ? "Loading companies..." : "Select a company"} />
              </SelectTrigger>
              <SelectContent>
                {loadingCompanies ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {company.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Select the company offering this position</p>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary (per year)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="salary"
                type="number"
                placeholder="e.g., 1200000"
                className="pl-8"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">Enter amount in rupees (e.g., 1200000 for ₹12 LPA). Leave empty if not disclosed</p>
          </div>

          {/* Tier Score */}
          <div className="space-y-2">
            <Label htmlFor="tierScore">Tier Score</Label>
            <Input
              id="tierScore"
              type="number"
              placeholder="e.g., 1, 2, 3"
              min="1"
              max="5"
              value={tierScore}
              onChange={(e) => setTierScore(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Company tier rating (1=Highest tier, 2=Medium tier, 3=Basic tier). Used for ranking jobs
            </p>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="content">Job Description</Label>
            <Textarea
              id="content"
              placeholder="Describe the job responsibilities, requirements, qualifications, benefits, and other important details..."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Provide a detailed description of the role, including:
              • Key responsibilities
              • Required skills and experience
              • Qualifications
              • Benefits and perks
              • Application process
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Post Job
            </>
          )}
        </Button>
      </div>
    </div>
  );
}