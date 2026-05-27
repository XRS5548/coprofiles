// app/manager/whatsapp/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageCircle,
  Smartphone,
  Users,
  MessageSquare,
  TrendingUp,
  Send,
  Plus,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardStats {
  totalAccounts: number;
  activeAccounts: number;
  totalConversations: number;
  unreadMessages: number;
  totalMessages: number;
  templatesCount: number;
}

interface RecentConversation {
  id: number;
  customerNumber: string;
  customerName: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

interface RecentActivity {
  id: number;
  type: 'message_sent' | 'message_received' | 'account_connected' | 'template_created';
  title: string;
  description: string;
  time: string;
}

export default function WhatsAppDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalAccounts: 0,
    activeAccounts: 0,
    totalConversations: 0,
    unreadMessages: 0,
    totalMessages: 0,
    templatesCount: 0,
  });
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/manager/whatsapp/dashboard', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentConversations(data.recentConversations || []);
        setRecentActivities(data.recentActivities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'message_received':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'account_connected':
        return <Smartphone className="h-4 w-4 text-purple-500" />;
      case 'template_created':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const statsCards = [
    {
      title: 'WhatsApp Accounts',
      value: stats.totalAccounts,
      subValue: `${stats.activeAccounts} active`,
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Conversations',
      value: stats.totalConversations,
      subValue: `${stats.unreadMessages} unread`,
      icon: Users,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Message Templates',
      value: stats.templatesCount,
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">WhatsApp Business</h1>
          <p className="text-muted-foreground mt-1">Manage your WhatsApp Business accounts and conversations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/manager/whatsapp/accounts')}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={cn("rounded-lg p-2", stat.color)}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/manager/whatsapp/conversations')}>
          <CardContent className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">View Conversations</h3>
            <p className="text-sm text-muted-foreground mt-1">See all your WhatsApp conversations</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/manager/whatsapp/accounts')}>
          <CardContent className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Manage Accounts</h3>
            <p className="text-sm text-muted-foreground mt-1">Add or remove WhatsApp Business accounts</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/manager/whatsapp/templates')}>
          <CardContent className="p-6 text-center">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Message Templates</h3>
            <p className="text-sm text-muted-foreground mt-1">Create and manage message templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations & Activities */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Conversations */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground">Start a conversation to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/manager/whatsapp/conversations?customer=${conv.customerNumber}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conv.customerName?.charAt(0) || conv.customerNumber.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {conv.customerName || conv.customerNumber}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {conv.lastMessagePreview || 'No messages'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatTime(conv.lastMessageAt)}</p>
                      {conv.unreadCount > 0 && (
                        <Badge className="mt-1 bg-green-500 text-white">
                          {conv.unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {recentConversations.length > 0 && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => router.push('/manager/whatsapp/conversations')}
              >
                View All Conversations
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">Activities will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="rounded-full bg-background p-2">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      {stats.totalAccounts === 0 && (
        <Card className="border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Get Started with WhatsApp Business</h3>
                <p className="text-muted-foreground mt-1">
                  Connect your first WhatsApp Business account to start messaging customers
                </p>
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => router.push('/manager/whatsapp/accounts')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Account
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://developers.facebook.com/docs/whatsapp/cloud-api/get-started', '_blank')}>
                    View Documentation
                  </Button>
                </div>
              </div>
              <MessageCircle className="h-12 w-12 text-muted-foreground hidden md:block" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}