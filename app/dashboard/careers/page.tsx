// app/dashboard/careers/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  TrendingUp,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Clock,
  Mail,
  Phone,
  Mail as Linkedin,
  Globe,
  FileText,
  Send,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Career {
  id: number;
  name: string;
  position: string;
  salary: number | null;
  salaryFormatted: string | null;
  tierScore: number | null;
  content: string | null;
  createdAt: number;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  companyCategory: string | null;
  companyVerified: boolean;
  applicationsCount: number;
  hasApplied?: boolean;
}

interface Filters {
  search: string;
  minSalary: string;
  maxSalary: string;
  minTierScore: string;
  position: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const tierConfig = {
  1: { label: 'Tier 1 - Elite', color: 'bg-purple-100 text-purple-700', icon: Award },
  2: { label: 'Tier 2 - Premium', color: 'bg-blue-100 text-blue-700', icon: Star },
  3: { label: 'Tier 3 - Standard', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minSalary: '',
    maxSalary: '',
    minTierScore: '',
    position: '',
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch careers with filters
  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', '10');
      if (filters.search) params.append('search', filters.search);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
      if (filters.minTierScore) params.append('minTierScore', filters.minTierScore);
      if (filters.position) params.append('position', filters.position);

      const response = await fetch(`/api/user/careers?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch careers');
      }
      
      const data = await response.json();
      setCareers(data.careers || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching careers:', error);
      toast.error('Failed to load job opportunities');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  // Apply for job - matches your API exactly
  const handleApply = async () => {
    if (!selectedCareer) return;
    
    setApplying(true);
    try {
      const response = await fetch('/api/user/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ careerId: selectedCareer.id }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully!', {
          description: `You've applied for ${selectedCareer.name} at ${selectedCareer.companyName}`,
          icon: <ThumbsUp className="h-5 w-5" />,
        });
        
        // Update the career in the list to show as applied
        setCareers(prev =>
          prev.map(career =>
            career.id === selectedCareer.id
              ? { ...career, hasApplied: true, applicationsCount: (career.applicationsCount || 0) + 1 }
              : career
          )
        );
        
        setIsApplyOpen(false);
        setSelectedCareer(null);
      } else if (response.status === 409) {
        // Already applied
        toast.error('Already Applied', {
          description: data.error || 'You have already applied for this position',
        });
        
        // Mark as applied in UI
        setCareers(prev =>
          prev.map(career =>
            career.id === selectedCareer.id ? { ...career, hasApplied: true } : career
          )
        );
      } else {
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (error: any) {
      toast.error('Application Failed', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setApplying(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      minSalary: '',
      maxSalary: '',
      minTierScore: '',
      position: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getTierBadge = (score: number | null) => {
    if (!score) return null;
    const tier = score >= 80 ? 1 : score >= 60 ? 2 : 3;
    const config = tierConfig[tier as 1 | 2 | 3];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && careers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Career Opportunities
          </h1>
          <p className="text-gray-500 mt-1">Find your dream job at top companies</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label>Search by Job Title</Label>
                  <Input
                    placeholder="e.g., Software Engineer"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Position/Level</Label>
                  <Input
                    placeholder="e.g., Senior, Junior"
                    value={filters.position}
                    onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Min Salary (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500000"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Max Salary (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2000000"
                    value={filters.maxSalary}
                    onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Min Tier Score</Label>
                  <Select 
                    value={filters.minTierScore} 
                    onValueChange={(v) => setFilters({ ...filters, minTierScore: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Tier</SelectItem>
                      <SelectItem value="80">Tier 1 (80+)</SelectItem>
                      <SelectItem value="60">Tier 2 (60+)</SelectItem>
                      <SelectItem value="40">Tier 3 (40+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => {
                  setPagination(prev => ({ ...prev, page: 1 }));
                  fetchCareers();
                }}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Found {pagination.total} job{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Careers Grid */}
      {careers.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No jobs found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search filters</p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col relative">
                {career.hasApplied && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Applied
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={career.companyLogo || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {career.companyName?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{career.name}</CardTitle>
                        <CardDescription>{career.companyName}</CardDescription>
                      </div>
                    </div>
                    {career.companyVerified && (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="h-3 w-3" />
                    <span>{career.position || 'Not specified'}</span>
                  </div>
                  
                  {career.salaryFormatted && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      <span>{career.salaryFormatted} / year</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">{career.applicationsCount} applicants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs">Posted {formatDate(career.createdAt)}</span>
                    </div>
                  </div>
                  
                  {career.tierScore && getTierBadge(career.tierScore)}
                  
                  {career.content && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                      {career.content}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter className="flex gap-2 pt-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-1"
                    onClick={() => setSelectedCareer(career)}
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button 
                    className="flex-1 gap-1"
                    onClick={() => {
                      setSelectedCareer(career);
                      setIsApplyOpen(true);
                    }}
                    disabled={career.hasApplied}
                    variant={career.hasApplied ? "outline" : "default"}
                  >
                    {career.hasApplied ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={!pagination.hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={!!selectedCareer && !isApplyOpen} onOpenChange={() => setSelectedCareer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCareer && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                      {selectedCareer.companyName?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedCareer.name}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedCareer.companyName}
                    </DialogDescription>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedCareer.companyVerified && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Company
                        </Badge>
                      )}
                      {selectedCareer.tierScore && getTierBadge(selectedCareer.tierScore)}
                      {selectedCareer.hasApplied && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Already Applied
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="font-medium">{selectedCareer.position || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="font-medium text-green-600">{selectedCareer.salaryFormatted || 'Not disclosed'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted On</p>
                    <p className="font-medium">{formatDate(selectedCareer.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Applicants</p>
                    <p className="font-medium">{selectedCareer.applicationsCount} applied</p>
                  </div>
                </div>

                {selectedCareer.content && (
                  <div>
                    <h4 className="font-semibold mb-2">Job Description</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedCareer.content}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    About {selectedCareer.companyName}
                  </h4>
                  {selectedCareer.companyCategory && (
                    <p className="text-sm text-gray-600">Category: {selectedCareer.companyCategory}</p>
                  )}
                </div>
              </div>

              <Separator />

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCareer(null)}>
                  Close
                </Button>
                <Button 
                  onClick={() => setIsApplyOpen(true)}
                  disabled={selectedCareer.hasApplied}
                >
                  {selectedCareer.hasApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Confirmation Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              You are about to apply for this position
            </DialogDescription>
          </DialogHeader>
          
          {selectedCareer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {selectedCareer.companyName?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedCareer.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCareer.companyName}</p>
                  {selectedCareer.salaryFormatted && (
                    <p className="text-sm text-green-600">{selectedCareer.salaryFormatted} / year</p>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  By clicking "Confirm Application", you agree to submit your application for this position. 
                  The company will review your profile and contact you if shortlisted.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applying}>
              {applying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirm Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}