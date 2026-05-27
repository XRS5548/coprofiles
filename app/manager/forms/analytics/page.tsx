// app/manager/forms/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  Eye,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Form {
  id: number;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

interface AnalyticsData {
  summary: {
    totalViews: number;
    totalStarts: number;
    totalCompletions: number;
    conversionRate: number;
    totalRevenue: number;
    avgCompletionTime: string;
  };
  dailyStats: Array<{
    date: string;
    views: number;
    starts: number;
    completions: number;
  }>;
  deviceStats: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  sourceStats: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  topForms: Array<{
    id: number;
    title: string;
    views: number;
    completions: number;
    conversionRate: number;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
  }>;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function FormsAnalyticsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [dateRange, setDateRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      fetchAnalytics();
    }
  }, [selectedForm, dateRange]);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/manager/forms', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setForms(data.forms);
        if (data.forms.length > 0) {
          setSelectedForm(data.forms[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedForm) return;
    
    setRefreshing(true);
    try {
      const response = await fetch(`/api/manager/forms/${selectedForm.id}/analytics?range=${dateRange}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      // Set mock data for demo
      setAnalytics(getMockAnalyticsData());
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getMockAnalyticsData = (): AnalyticsData => {
    return {
      summary: {
        totalViews: 1250,
        totalStarts: 980,
        totalCompletions: 756,
        conversionRate: 77.1,
        totalRevenue: 11481,
        avgCompletionTime: '2.3 min',
      },
      dailyStats: [
        { date: '2024-01-01', views: 45, starts: 38, completions: 32 },
        { date: '2024-01-02', views: 52, starts: 42, completions: 35 },
        { date: '2024-01-03', views: 48, starts: 40, completions: 33 },
        { date: '2024-01-04', views: 61, starts: 53, completions: 45 },
        { date: '2024-01-05', views: 55, starts: 49, completions: 41 },
        { date: '2024-01-06', views: 42, starts: 38, completions: 30 },
        { date: '2024-01-07', views: 58, starts: 52, completions: 44 },
      ],
      deviceStats: [
        { device: 'Desktop', count: 680, percentage: 54.4 },
        { device: 'Mobile', count: 520, percentage: 41.6 },
        { device: 'Tablet', count: 50, percentage: 4.0 },
      ],
      sourceStats: [
        { source: 'Direct', count: 450, percentage: 36.0 },
        { source: 'Social', count: 320, percentage: 25.6 },
        { source: 'Referral', count: 280, percentage: 22.4 },
        { source: 'Email', count: 200, percentage: 16.0 },
      ],
      topForms: [
        { id: 1, title: 'Job Application Form', views: 450, completions: 320, conversionRate: 71.1 },
        { id: 2, title: 'Contact Us', views: 380, completions: 290, conversionRate: 76.3 },
        { id: 3, title: 'Feedback Form', views: 220, completions: 180, conversionRate: 81.8 },
      ],
      recentActivity: [
        { id: 1, type: 'submission', message: 'New submission received for Job Application Form', time: '5 minutes ago' },
        { id: 2, type: 'view', message: 'Form viewed by new user', time: '1 hour ago' },
        { id: 3, type: 'completion', message: 'User completed Contact Us form', time: '2 hours ago' },
      ],
    };
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No Forms Found</h2>
        <p className="text-muted-foreground mt-2">Create a form to see analytics</p>
        <Button onClick={() => router.push('/manager/forms/create')} className="mt-4">
          Create Form
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forms Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your form performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedForm?.id.toString()}
            onValueChange={(val) => {
              const form = forms.find(f => f.id.toString() === val);
              setSelectedForm(form || null);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select form" />
            </SelectTrigger>
            <SelectContent>
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id.toString()}>
                  {form.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.totalViews || 0}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Starts</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.totalStarts || 0}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completions</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.totalCompletions || 0}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.conversionRate || 0}%</p>
              </div>
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics?.summary.totalRevenue || 0)}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.avgCompletionTime || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.dailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground text-xs" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="views" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Views" />
                <Area type="monotone" dataKey="starts" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Starts" />
                <Area type="monotone" dataKey="completions" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Completions" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Views to Starts</span>
                  <span className="text-sm font-medium">
                    {analytics?.summary.totalStarts && analytics?.summary.totalViews 
                      ? Math.round((analytics.summary.totalStarts / analytics.summary.totalViews) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${analytics?.summary.totalStarts && analytics?.summary.totalViews 
                      ? (analytics.summary.totalStarts / analytics.summary.totalViews) * 100 
                      : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Starts to Completions</span>
                  <span className="text-sm font-medium">
                    {analytics?.summary.totalCompletions && analytics?.summary.totalStarts 
                      ? Math.round((analytics.summary.totalCompletions / analytics.summary.totalStarts) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${analytics?.summary.totalCompletions && analytics?.summary.totalStarts 
                      ? (analytics.summary.totalCompletions / analytics.summary.totalStarts) * 100 
                      : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Overall Conversion</span>
                  <span className="text-sm font-medium">{analytics?.summary.conversionRate || 0}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${analytics?.summary.conversionRate || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={analytics?.deviceStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="device"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {(analytics?.deviceStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.sourceStats || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-muted-foreground text-xs" />
                <YAxis type="category" dataKey="source" className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Form Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Completions</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Conversion Rate</th>
                 </tr>
              </thead>
              <tbody>
                {(analytics?.topForms || []).map((form, index) => (
                  <tr key={form.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{form.title}</td>
                    <td className="py-3 px-4 text-muted-foreground">{form.views}</td>
                    <td className="py-3 px-4 text-muted-foreground">{form.completions}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{form.conversionRate}%</Badge>
                    </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(analytics?.recentActivity || []).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="rounded-full bg-background p-2">
                  {activity.type === 'submission' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'completion' && <CheckCircle className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}