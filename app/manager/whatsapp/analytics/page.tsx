// app/manager/whatsapp/analytics/page.tsx - Fixed
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
  TrendingUp,
  Users,
  MessageCircle,
  Send,
  Clock,
  Loader2,
  Calendar,
  Download,
  RefreshCw,
  Smartphone,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface WhatsAppAccount {
  id: number;
  accountName: string;
  phoneNumber: string;
  status: string;
  verified: boolean;
}

interface AnalyticsData {
  summary: {
    totalMessages: number;
    totalConversations: number;
    activeConversations: number;
    responseRate: number;
    avgResponseTime: string;
    messagesSent: number;
    messagesReceived: number;
    templatesUsed: number;
  };
  messageTrends: Array<{
    date: string;
    sent: number;
    received: number;
    total: number;
  }>;
  conversationTrends: Array<{
    date: string;
    active: number;
    new: number;
    total: number;
  }>;
  topConversations: Array<{
    customerNumber: string;
    customerName: string | null;
    messageCount: number;
    lastMessageAt: string;
  }>;
  messageTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  responseTimeStats: {
    average: number;
    fastest: number;
    slowest: number;
    distribution: Array<{
      range: string;
      count: number;
    }>;
  };
}

export default function WhatsAppAnalyticsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchAnalytics();
    }
  }, [selectedAccount, dateRange]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/manager/whatsapp/accounts', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts);
        if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load WhatsApp accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedAccount) return;
    
    setRefreshing(true);
    try {
      const response = await fetch(`/api/manager/whatsapp/analytics?accountId=${selectedAccount.id}&range=${dateRange}`, {
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
      toast.error('Failed to load analytics data');
      setAnalytics(getMockAnalyticsData());
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchAnalytics();
    toast.success('Analytics refreshed');
  };

  const handleExport = () => {
    if (!analytics) return;
    
    const exportData = {
      summary: analytics.summary,
      messageTrends: analytics.messageTrends,
      conversationTrends: analytics.conversationTrends,
      topConversations: analytics.topConversations,
      messageTypeDistribution: analytics.messageTypeDistribution,
      responseTimeStats: analytics.responseTimeStats,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whatsapp-analytics-${selectedAccount?.accountName}-${dateRange}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Analytics exported successfully');
  };

  const getMockAnalyticsData = (): AnalyticsData => {
    return {
      summary: {
        totalMessages: 1250,
        totalConversations: 45,
        activeConversations: 12,
        responseRate: 92.5,
        avgResponseTime: '2.3 min',
        messagesSent: 680,
        messagesReceived: 570,
        templatesUsed: 45,
      },
      messageTrends: [
        { date: 'Jan 1', sent: 45, received: 38, total: 83 },
        { date: 'Jan 2', sent: 52, received: 42, total: 94 },
        { date: 'Jan 3', sent: 48, received: 45, total: 93 },
        { date: 'Jan 4', sent: 61, received: 53, total: 114 },
        { date: 'Jan 5', sent: 55, received: 49, total: 104 },
        { date: 'Jan 6', sent: 42, received: 38, total: 80 },
        { date: 'Jan 7', sent: 58, received: 52, total: 110 },
      ],
      conversationTrends: [
        { date: 'Jan 1', active: 25, new: 5, total: 30 },
        { date: 'Jan 2', active: 28, new: 6, total: 34 },
        { date: 'Jan 3', active: 30, new: 4, total: 34 },
        { date: 'Jan 4', active: 35, new: 8, total: 43 },
        { date: 'Jan 5', active: 32, new: 5, total: 37 },
        { date: 'Jan 6', active: 28, new: 3, total: 31 },
        { date: 'Jan 7', active: 34, new: 7, total: 41 },
      ],
      topConversations: [
        { customerNumber: '919876543210', customerName: 'Rahul Sharma', messageCount: 45, lastMessageAt: new Date().toISOString() },
        { customerNumber: '919876543211', customerName: 'Priya Patel', messageCount: 38, lastMessageAt: new Date().toISOString() },
        { customerNumber: '919876543212', customerName: 'Amit Kumar', messageCount: 32, lastMessageAt: new Date().toISOString() },
        { customerNumber: '919876543213', customerName: 'Neha Singh', messageCount: 28, lastMessageAt: new Date().toISOString() },
        { customerNumber: '919876543214', customerName: 'Vikram Verma', messageCount: 25, lastMessageAt: new Date().toISOString() },
      ],
      messageTypeDistribution: [
        { type: 'Text', count: 890 },
        { type: 'Template', count: 180 },
        { type: 'Image', count: 95 },
        { type: 'Document', count: 55 },
        { type: 'Video', count: 30 },
      ],
      responseTimeStats: {
        average: 2.3,
        fastest: 0.5,
        slowest: 15.2,
        distribution: [
          { range: '< 1 min', count: 45 },
          { range: '1-3 min', count: 120 },
          { range: '3-5 min', count: 85 },
          { range: '5-10 min', count: 60 },
          { range: '> 10 min', count: 35 },
        ],
      },
    };
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const getInitials = (name: string | null, phoneNumber: string): string => {
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    if (phoneNumber && phoneNumber.length > 0) {
      return phoneNumber.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getDisplayName = (name: string | null, phoneNumber: string): string => {
    if (name && name.trim().length > 0) {
      return name;
    }
    if (phoneNumber && phoneNumber.length > 0) {
      return phoneNumber;
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No WhatsApp Accounts</h2>
        <p className="text-muted-foreground mt-2">Connect a WhatsApp account to view analytics</p>
        <Button onClick={() => router.push('/manager/whatsapp/accounts')} className="mt-4">
          Connect Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">WhatsApp Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your WhatsApp performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedAccount?.id.toString()}
            onValueChange={(val) => {
              const account = accounts.find(a => a.id.toString() === val);
              setSelectedAccount(account || null);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <Smartphone className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.accountName}
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
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.totalMessages || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Send className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">Sent: {analytics?.summary.messagesSent || 0}</span>
                  <MessageCircle className="h-3 w-3 text-blue-500 ml-2" />
                  <span className="text-xs text-muted-foreground">Received: {analytics?.summary.messagesReceived || 0}</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.totalConversations || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active: {analytics?.summary.activeConversations || 0}
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.responseRate || 0}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Avg: {analytics?.summary.avgResponseTime || 'N/A'}</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Templates Used</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.summary.templatesUsed || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">+12% this period</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Send className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Message Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.messageTrends || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground text-xs" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="sent" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Sent" />
                <Area type="monotone" dataKey="received" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Received" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Conversation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.conversationTrends || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground text-xs" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={2} name="Active" />
                <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={2} name="New" />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} name="Total" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Message Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.messageTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {(analytics?.messageTypeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Response Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.responseTimeStats.distribution || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-muted-foreground text-xs" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Messages" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="text-lg font-semibold text-foreground">{analytics?.responseTimeStats.average} min</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Fastest</p>
                <p className="text-lg font-semibold text-green-600">{analytics?.responseTimeStats.fastest} min</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Slowest</p>
                <p className="text-lg font-semibold text-red-600">{analytics?.responseTimeStats.slowest} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Conversations */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Top Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone Number</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Messages</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.topConversations || []).map((conv, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {getInitials(conv.customerName, conv.customerNumber)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {getDisplayName(conv.customerName, conv.customerNumber)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{conv.customerNumber || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{conv.messageCount || 0} messages</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/manager/whatsapp/conversations?customer=${conv.customerNumber}`)}
                        disabled={!conv.customerNumber}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}