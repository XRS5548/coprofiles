// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Star,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle,
  Loader2,
  Code2,
  Users,
  Building,
  Rocket,
  Target,
  Zap,
  Crown,
  Sparkles,
  Medal,
  Trophy,
  Gift,
  Bell,
  AlertCircle,
  FileText,
  ExternalLink,
  Mail as Github,
  Heart,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types based on API response
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNo: string | null;
  description: string | null;
  profileImgUrl: string | null;
  verified: boolean;
  memberSince: string;
  roleType: string;
}

interface DashboardStats {
  totalProjects: number;
  totalInternshipApplications: number;
  totalCareerApplications: number;
  totalApplications: number;
  totalCertificates: number;
  applicationSuccessRate: number;
  activeApplications: number;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  isPublic: boolean;
  githubId: string | null;
  postsCount: number;
}

interface InternshipApplication {
  id: number;
  internshipId: number;
  internshipTitle: string;
  internshipDuration: string;
  internshipStatus: boolean;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  appliedAt: number;
  certificateUnlocked: boolean;
  lastApplyDate: string | null;
}

interface CareerApplication {
  id: number;
  careerId: number;
  careerName: string;
  careerPosition: string;
  careerSalary: number | null;
  careerTierScore: number | null;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  appliedAt: number;
}

interface UpcomingDeadline {
  id: number;
  title: string;
  companyName: string;
  lastApplyDate: string;
  duration: string;
}

interface Certificate {
  id: number;
  internshipTitle: string;
  companyName: string;
  companyLogo: string | null;
  unlockedAt: number;
}

interface Activity {
  type: string;
  id: number;
  title: string;
  description: string;
  date: number;
  icon: string;
  color: string;
}

interface Recommendations {
  suggestedSkills: string[];
  suggestedProjects: string[];
  nextSteps: string[];
}

interface DashboardData {
  success: boolean;
  user: UserProfile;
  stats: DashboardStats;
  recentProjects: Project[];
  recentInternshipApplications: InternshipApplication[];
  recentCareerApplications: CareerApplication[];
  upcomingDeadlines: UpcomingDeadline[];
  certificates: Certificate[];
  recentActivities: Activity[];
  recommendations: Recommendations;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/user/dashboard', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard');
        }
        
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (timestamp: number | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (iconName: string, color: string) => {
    const iconProps = { className: `h-4 w-4 text-${color}-600 dark:text-${color}-400` };
    switch (iconName) {
      case 'FolderGit2':
        return <Code2 {...iconProps} />;
      case 'Briefcase':
        return <Briefcase {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 dark:bg-gray-800" />
          <Skeleton className="h-4 w-48 mt-2 dark:bg-gray-800" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-lg dark:bg-gray-800" />
          </div>
          <Skeleton className="h-96 rounded-lg dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-12 text-center dark:bg-gray-900">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">Failed to load dashboard</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1">Please try refreshing the page</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Card>
      </div>
    );
  }

  const { user, stats, recentProjects, recentInternshipApplications, recentCareerApplications, upcomingDeadlines, certificates, recentActivities, recommendations } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden relative dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={user.profileImgUrl || ''} />
                  <AvatarFallback className="bg-white/20 text-white text-xl">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white/80 text-sm">{greeting}!</p>
                  <h1 className="text-3xl font-bold mt-1">{user.name}</h1>
                  <p className="text-white/90 mt-1 text-sm">{user.email}</p>
                  {user.verified && (
                    <Badge className="mt-2 bg-green-500 text-white border-none hover:bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Account
                    </Badge>
                  )}
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                  <Crown className="h-12 w-12" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="hover:shadow-lg transition-all dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-950 p-3">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                <p className="text-2xl font-bold dark:text-gray-200">{stats.totalProjects}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="hover:shadow-lg transition-all dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-100 dark:bg-green-950 p-3">
                <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Internships</p>
                <p className="text-2xl font-bold dark:text-gray-200">{stats.totalInternshipApplications}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="hover:shadow-lg transition-all dark:bg-gray-900">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 dark:bg-purple-950 p-3">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Career Jobs</p>
                <p className="text-2xl font-bold dark:text-gray-200">{stats.totalCareerApplications}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="hover:shadow-lg transition-all bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 dark:bg-orange-900/50 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Apps</p>
                <p className="text-2xl font-bold dark:text-gray-200">{stats.totalApplications}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="hover:shadow-lg transition-all bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/50 p-3">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Certificates</p>
                <p className="text-2xl font-bold dark:text-gray-200">{stats.totalCertificates}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your latest projects and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Rocket className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="mt-0.5">
                        {activity.icon === 'FolderGit2' && <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                        {activity.icon === 'Briefcase' && <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                        {!activity.icon && <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm dark:text-gray-200">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(activity.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          {recentProjects.length > 0 && (
            <Card className="dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                  <FolderOpen className="h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-sm dark:text-gray-200">{project.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{project.description?.slice(0, 60)}</p>
                    </div>
                    <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                      {formatDate(project.createdAt)}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800" asChild>
                  <a href="/dashboard/projects">
                    View All Projects <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats & Recommendations */}
        <div className="space-y-6">
          {/* Success Rate */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <Medal className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.applicationSuccessRate}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Application Success Rate</p>
              <Progress value={stats.applicationSuccessRate} className="mt-2 h-1" />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{stats.totalCertificates} certificates earned</p>
            </CardContent>
          </Card>

          {/* Certificates */}
          {certificates.length > 0 && (
            <Card className="dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Earned Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-gray-200">{cert.internshipTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cert.companyName}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.nextSteps.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 dark:text-gray-300">Next Steps</h4>
                  <div className="space-y-1">
                    {recommendations.nextSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Target className="h-3 w-3" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.suggestedSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 mt-3 dark:text-gray-300">Suggested Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.suggestedSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.suggestedProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 mt-3 dark:text-gray-300">Project Ideas</h4>
                  <div className="space-y-1">
                    {recommendations.suggestedProjects.map((proj, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Code2 className="h-3 w-3" />
                        {proj}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <div className="px-6 pb-4">
              <Button className="w-full gap-2" asChild>
                <a href="/dashboard/careers">
                  Find Jobs <Briefcase className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card className="dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-200">
              <Bell className="h-5 w-5 text-red-500" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Internships closing soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm dark:text-gray-200">{deadline.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{deadline.companyName}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400">
                    Closing soon
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Since Footer */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Member since {new Date(user.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} • {stats.totalApplications + stats.totalProjects} total contributions
        </CardContent>
      </Card>
    </div>
  );
}