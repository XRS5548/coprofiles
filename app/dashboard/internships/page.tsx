// app/dashboard/internships/page.tsx - Fixed version
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  DollarSign,
  Eye,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Users,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Updated interface matching API response
interface Internship {
  id: number;
  title: string;
  description: string;
  duration: string;
  lastApplyDate: string | null;
  isLive: boolean;
  active: boolean;
  createdAt: string;
  autoCancel: boolean;
  company: {
    id: number;
    name: string;
    logo: string | null;
    category: string | null;
    verified: boolean;
  };
  applicationStatus: {
    hasApplied: boolean;
    applicationId: number | null;
    certificateUnlocked: boolean;
  };
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  // Get unique companies for filter
  const uniqueCompanies = [...new Set(internships.map(i => i.company.name))];

  // Fetch internships from API
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('/api/user/internships', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch internships');
        }
        
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        if (data.success && data.internships) {
          setInternships(data.internships);
        } else {
          setInternships([]);
        }
      } catch (error) {
        console.error('Error fetching internships:', error);
        toast.error('Failed to load internships', {
          description: 'Please try again later.',
        });
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Apply for internship
  const handleApply = async (internshipId: number) => {
    setApplying(true);
    
    const loadingToast = toast.loading('Submitting your application...', {
      description: 'Please wait while we process your request.',
    });

    try {
      const response = await fetch('/api/user/internships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internshipId }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setInternships(prev =>
          prev.map(i =>
            i.id === internshipId 
              ? { 
                  ...i, 
                  applicationStatus: { 
                    ...i.applicationStatus, 
                    hasApplied: true,
                    applicationId: data.application?.id || null
                  } 
                } 
              : i
          )
        );
        
        toast.success('Application Submitted!', {
          id: loadingToast,
          description: 'Your application has been sent successfully. Good luck! 🎉',
          duration: 5000,
        });
        
        setSelectedInternship(null);
      } else {
        throw new Error(data.message || 'Failed to apply');
      }
    } catch (error: any) {
      toast.error('Application Failed', {
        id: loadingToast,
        description: error.message || 'Please try again later.',
        duration: 4000,
      });
    } finally {
      setApplying(false);
    }
  };

  // Save internship (mock for now - implement API later)
  const handleSave = async (internshipId: number) => {
    setSaving(internshipId);
    
    toast.info('Save Feature', {
      description: 'This feature will be implemented soon!',
      duration: 2000,
    });
    
    setSaving(null);
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || internship.company.name === selectedCompany;
    const matchesDuration = selectedDuration === 'all' || 
      (selectedDuration === 'lessThan3' && parseInt(internship.duration) < 3) ||
      (selectedDuration === '3to6' && parseInt(internship.duration) >= 3 && parseInt(internship.duration) <= 6) ||
      (selectedDuration === 'moreThan6' && parseInt(internship.duration) > 6);
    
    return matchesSearch && matchesCompany && matchesDuration;
  });

  const formatDate = (date: string | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDurationNumber = (duration: string) => {
    const match = duration.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Loading skeleton
  if (loading) {
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
                <div className="flex items-start gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
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
            Find Internships
          </h1>
          <p className="text-gray-500 mt-1">Discover opportunities that match your skills</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>{internships.length} internships available</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Available Positions</p>
              <p className="text-xl font-bold">{internships.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Applications</p>
              <p className="text-xl font-bold">
                {internships.filter(i => i.applicationStatus.hasApplied).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Bookmark className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Saved Jobs</p>
              <p className="text-xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <GraduationCap className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Profile Match</p>
              <p className="text-xl font-bold">85%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="lessThan3">Less than 3 months</SelectItem>
                <SelectItem value="3to6">3-6 months</SelectItem>
                <SelectItem value="moreThan6">More than 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Internship Cards */}
      {filteredInternships.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No internships found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {internship.company.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{internship.title}</CardTitle>
                        <CardDescription className="text-sm">{internship.company.name}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSave(internship.id)}
                        disabled={saving === internship.id}
                      >
                        {saving === internship.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                      <Badge className={internship.isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {internship.isLive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{internship.company.category || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Building className="h-3 w-3" />
                      <span className="text-xs">
                        {internship.company.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {internship.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Posted: {formatDate(internship.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Deadline: {formatDate(internship.lastApplyDate)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2 text-sm"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    <Eye className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button 
                    className="flex-1 gap-2 text-sm"
                    onClick={() => handleApply(internship.id)}
                    disabled={internship.applicationStatus.hasApplied || applying}
                    variant={internship.applicationStatus.hasApplied ? "outline" : "default"}
                  >
                    {internship.applicationStatus.hasApplied ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Applied
                      </>
                    ) : (
                      applying ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply Now'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Internship Details Dialog */}
      <Dialog open={!!selectedInternship} onOpenChange={() => setSelectedInternship(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInternship && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                      {selectedInternship.company.name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedInternship.title}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedInternship.company.name}
                    </DialogDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge className={selectedInternship.isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {selectedInternship.isLive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {selectedInternship.company.verified ? 'Verified Company' : 'Company'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(selectedInternship.id)}
                    disabled={saving === selectedInternship.id}
                  >
                    {saving === selectedInternship.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium text-sm">{selectedInternship.company.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm">{selectedInternship.company.category || 'Remote'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-sm">{selectedInternship.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Posted Date</p>
                      <p className="font-medium text-sm">{formatDate(selectedInternship.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Apply Date</p>
                      <p className="font-medium text-sm">{formatDate(selectedInternship.lastApplyDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Auto Cancel</p>
                      <p className="font-medium text-sm">{selectedInternship.autoCancel ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {selectedInternship.applicationStatus.hasApplied && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700">You have applied for this internship</span>
                      </div>
                      {selectedInternship.applicationStatus.certificateUnlocked && (
                        <p className="text-sm text-green-600 mt-2">
                          Certificate has been unlocked for this internship!
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="description">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedInternship.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Separator />

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedInternship(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => handleApply(selectedInternship.id)}
                  disabled={selectedInternship.applicationStatus.hasApplied || applying}
                >
                  {selectedInternship.applicationStatus.hasApplied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Already Applied
                    </>
                  ) : (
                    applying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Apply Now'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}