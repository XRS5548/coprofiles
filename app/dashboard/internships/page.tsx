// app/dashboard/internships/page.tsx
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

interface Internship {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  deadline: string;
  posted: string;
  applicants: number;
  status: 'active' | 'closing';
  skills?: string[]; // Made optional with fallback
  description?: string;
  requirements?: string[];
  perks?: string[];
  isApplied?: boolean;
  isSaved?: boolean;
}

// Default fallback values
const defaultInternship: Partial<Internship> = {
  skills: [],
  requirements: [],
  perks: [],
  description: 'No description available',
  type: 'Internship',
  duration: 'Not specified',
  stipend: 'Unpaid',
  status: 'active',
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

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
        
        // Ensure each internship has required fields with fallbacks
        const internshipsWithDefaults = (data.internships || []).map((internship: Internship) => ({
          ...defaultInternship,
          ...internship,
          skills: internship.skills || [],
          requirements: internship.requirements || [],
          perks: internship.perks || [],
          description: internship.description || 'No description available',
        }));
        
        setInternships(internshipsWithDefaults);
      } catch (error) {
        console.error('Error fetching internships:', error);
        toast.error('Failed to load internships', {
          description: 'Please try again later.',
        });
        // Set empty array on error
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

      if (response.ok) {
        setInternships(prev =>
          prev.map(i =>
            i.id === internshipId ? { ...i, isApplied: true } : i
          )
        );
        
        toast.success('Application Submitted!', {
          id: loadingToast,
          description: 'Your application has been sent successfully. Good luck! 🎉',
          duration: 5000,
        });
        
        setSelectedInternship(null);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to apply');
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

  // Save internship
  const handleSave = async (internshipId: number) => {
    setSaving(internshipId);
    
    const internship = internships.find(i => i.id === internshipId);
    const isCurrentlySaved = internship?.isSaved;
    
    try {
      const response = await fetch('/api/user/internships/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ internshipId }),
        credentials: 'include',
      });

      if (response.ok) {
        setInternships(prev =>
          prev.map(i =>
            i.id === internshipId ? { ...i, isSaved: !i.isSaved } : i
          )
        );
        
        toast.success(isCurrentlySaved ? 'Removed from saved' : 'Saved!', {
          description: isCurrentlySaved 
            ? 'Internship removed from your saved list.' 
            : 'Internship saved to your profile.',
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to save internship. Please try again.',
      });
    } finally {
      setSaving(null);
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || internship.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || internship.location?.includes(selectedLocation);
    return matchesSearch && matchesType && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Applications</p>
              <p className="text-xl font-bold">
                {internships.filter(i => i.isApplied).length}
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
              <p className="text-xl font-bold">
                {internships.filter(i => i.isSaved).length}
              </p>
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
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
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
                          {internship.companyLogo || internship.company?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{internship.title || 'Untitled'}</CardTitle>
                        <CardDescription className="text-sm">{internship.company || 'Unknown Company'}</CardDescription>
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
                          <Bookmark className={`h-4 w-4 ${internship.isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                        )}
                      </Button>
                      <Badge className={getStatusColor(internship.status || 'active')}>
                        <span className="flex items-center gap-1 text-xs">
                          {internship.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {internship.status === 'active' ? 'Active' : 'Closing Soon'}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs">{internship.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Briefcase className="h-3 w-3" />
                      <span className="text-xs">{internship.type || 'Internship'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{internship.duration || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-xs">{internship.stipend || 'Unpaid'}</span>
                    </div>
                  </div>
                  
                  {/* Fixed: Safe check for skills array */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {internship.skills && internship.skills.length > 0 ? (
                      <>
                        {internship.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-[10px]">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills.length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{internship.skills.length - 3}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        No skills listed
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{internship.applicants || 0} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Not specified'}</span>
                    </div>
                  </div>
                  <Progress value={Math.min((internship.applicants || 0) / 100 * 100, 100)} className="h-1" />
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
                    disabled={internship.isApplied || applying}
                    variant={internship.isApplied ? "outline" : "default"}
                  >
                    {internship.isApplied ? (
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
                      {selectedInternship.companyLogo || selectedInternship.company?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedInternship.title || 'Untitled'}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedInternship.company || 'Unknown Company'}
                    </DialogDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getStatusColor(selectedInternship.status || 'active')}>
                        {selectedInternship.status === 'active' ? 'Active' : 'Closing Soon'}
                      </Badge>
                      <Badge variant="outline">{selectedInternship.type || 'Internship'}</Badge>
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
                      <Bookmark className={`h-5 w-5 ${selectedInternship.isSaved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                    )}
                  </Button>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="requirements" className="flex-1">Requirements</TabsTrigger>
                  <TabsTrigger value="perks" className="flex-1">Perks</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm">{selectedInternship.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-medium text-sm">{selectedInternship.duration || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stipend</p>
                      <p className="font-medium text-sm text-green-600">{selectedInternship.stipend || 'Unpaid'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Posted</p>
                      <p className="font-medium text-sm">{selectedInternship.posted ? new Date(selectedInternship.posted).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedInternship.description || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInternship.skills && selectedInternship.skills.length > 0 ? (
                        selectedInternship.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No specific skills required</span>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      {selectedInternship.requirements && selectedInternship.requirements.length > 0 ? (
                        selectedInternship.requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{req}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No specific requirements listed</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="perks">
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      {selectedInternship.perks && selectedInternship.perks.length > 0 ? (
                        selectedInternship.perks.map((perk, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Building className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{perk}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No perks mentioned</p>
                      )}
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
                  disabled={selectedInternship.isApplied || applying}
                >
                  {selectedInternship.isApplied ? (
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