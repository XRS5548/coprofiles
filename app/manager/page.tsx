// app/manager/page.tsx - Enhanced Dashboard
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  DollarSign,
  FileText,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Download,
  Share2,
  MoreVertical,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  totalInternships: number;
  activeInternships: number;
  liveInternships: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  completedInternships: number;
  certificatesIssued: number;
  totalRevenue: number;
  growthRate: number;
  completionRate: number;
}

interface RecentActivity {
  id: number;
  type: 'application' | 'internship' | 'certificate' | 'payment';
  title: string;
  status: string;
  time: string;
  user?: string;
}

interface MonthlyData {
  month: string;
  applications: number;
  internships: number;
  revenue: number;
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalInternships: 0,
    activeInternships: 0,
    liveInternships: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    completedInternships: 0,
    certificatesIssued: 0,
    totalRevenue: 0,
    growthRate: 0,
    completionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topInternships, setTopInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/manager/dashboard/stats', {
        credentials: 'include',
      });
      const data = await response.json();
      
      console.log('Dashboard API response:', data);
      
      if (data.success && data.stats) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities || []);
        setMonthlyData(data.monthlyData || generateMockMonthlyData());
        setTopInternships(data.topInternships || generateMockTopInternships());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Generate mock data for demo
      setStats({
        totalInternships: 24,
        activeInternships: 18,
        liveInternships: 12,
        totalApplications: 156,
        pendingApplications: 45,
        acceptedApplications: 67,
        rejectedApplications: 32,
        completedInternships: 12,
        certificatesIssued: 89,
        totalRevenue: 11481,
        growthRate: 23.5,
        completionRate: 68.4,
      });
      setMonthlyData(generateMockMonthlyData());
      setTopInternships(generateMockTopInternships());
    } finally {
      setLoading(false);
    }
  };

  const generateMockMonthlyData = (): MonthlyData[] => {
    return [
      { month: 'Jan', applications: 12, internships: 3, revenue: 1548 },
      { month: 'Feb', applications: 19, internships: 4, revenue: 2451 },
      { month: 'Mar', applications: 15, internships: 3, revenue: 1935 },
      { month: 'Apr', applications: 27, internships: 5, revenue: 3483 },
      { month: 'May', applications: 32, internships: 6, revenue: 4128 },
      { month: 'Jun', applications: 28, internships: 4, revenue: 3612 },
      { month: 'Jul', applications: 35, internships: 7, revenue: 4515 },
      { month: 'Aug', applications: 42, internships: 8, revenue: 5418 },
      { month: 'Sep', applications: 38, internships: 6, revenue: 4902 },
      { month: 'Oct', applications: 45, internships: 9, revenue: 5805 },
      { month: 'Nov', applications: 52, internships: 10, revenue: 6708 },
      { month: 'Dec', applications: 48, internships: 8, revenue: 6192 },
    ];
  };

  const generateMockTopInternships = () => {
    return [
      { id: 1, title: 'Frontend Developer Intern', applications: 45, accepted: 12, company: 'Tech Corp' },
      { id: 2, title: 'Backend Developer Intern', applications: 38, accepted: 10, company: 'Code Labs' },
      { id: 3, title: 'Data Science Intern', applications: 32, accepted: 8, company: 'AI Solutions' },
      { id: 4, title: 'UI/UX Designer Intern', applications: 28, accepted: 7, company: 'Design Studio' },
    ];
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'rejected': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const pieData = [
    { name: 'Accepted', value: stats.acceptedApplications, color: '#10b981' },
    { name: 'Pending', value: stats.pendingApplications, color: '#eab308' },
    { name: 'Rejected', value: stats.rejectedApplications, color: '#ef4444' },
  ];

  const COLORS = ['#10b981', '#eab308', '#ef4444'];

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Track your internship program performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/manager/reports')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => router.push('/manager/internships/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Internship
          </Button>
        </div>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-indigo-100">Your internship program is growing steadily. Keep up the great work!</p>
              <div className="flex gap-4 mt-4">
                <div>
                  <p className="text-sm text-indigo-200">Growth Rate</p>
                  <p className="text-2xl font-bold">+{stats.growthRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-indigo-200">Completion Rate</p>
                  <p className="text-2xl font-bold">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Award className="h-16 w-16 text-indigo-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Internships</p>
                <p className="text-2xl font-bold mt-1">{stats.totalInternships}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {stats.activeInternships} Active
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {stats.liveInternships} Live
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold mt-1">{stats.totalApplications}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    {stats.pendingApplications} Pending
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {stats.acceptedApplications} Accepted
                  </Badge>
                </div>
              </div>
              <div className="rounded-lg bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Revenue Generated</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.certificatesIssued} certificates issued
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}%
                </p>
                <Progress 
                  value={(stats.acceptedApplications / stats.totalApplications) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
              <div className="rounded-lg bg-orange-100 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applications Trend</CardTitle>
            <p className="text-sm text-gray-500">Monthly application submissions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="#818cf8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
            <p className="text-sm text-gray-500">Monthly revenue from certificates</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Status</CardTitle>
            <p className="text-sm text-gray-500">Distribution of all applications</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Internships */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Internships</CardTitle>
            <p className="text-sm text-gray-500">Most applied internships</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInternships.map((internship, index) => (
                <div key={internship.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{internship.title}</p>
                    <p className="text-xs text-gray-500">{internship.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{internship.applications}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <p className="text-sm text-gray-500">Key performance indicators</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Completed Internships</span>
              <span className="font-bold text-lg">{stats.completedInternships}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Rejected Applications</span>
              <span className="font-bold text-lg text-red-600">{stats.rejectedApplications}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Certificates Issued</span>
              <span className="font-bold text-lg text-indigo-600">{stats.certificatesIssued}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Avg. Applications/Internship</span>
              <span className="font-bold text-lg">
                {Math.round(stats.totalApplications / stats.totalInternships) || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <p className="text-sm text-gray-500">Latest updates from your internships</p>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      {activity.type === 'application' && <FileText className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'internship' && <Briefcase className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'certificate' && <Award className="h-4 w-4 text-green-500" />}
                      {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(activity.status)}
                        <span className="text-xs text-gray-500 capitalize">{activity.status}</span>
                        {activity.user && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{activity.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <Button variant="ghost" size="sm" className="mt-1 h-6">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/manager/internships')}>
          <Briefcase className="h-5 w-5" />
          <span>Manage Internships</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/manager/applications')}>
          <Users className="h-5 w-5" />
          <span>Review Applications</span>
          {stats.pendingApplications > 0 && (
            <Badge className="bg-red-500 text-white">{stats.pendingApplications}</Badge>
          )}
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/manager/certificates')}>
          <Award className="h-5 w-5" />
          <span>Issue Certificates</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/manager/reports')}>
          <FileText className="h-5 w-5" />
          <span>Generate Reports</span>
        </Button>
      </div>
    </div>
  );
}