// components/layouts/ManagerLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare,
  Download,
  Eye,
  MessageCircle,
  Smartphone,
  Plus,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    name: 'Overview',
    href: '/manager',
    icon: LayoutDashboard,
  },
  {
    name: 'Internships',
    href: '/manager/internships',
    icon: GraduationCap,
    children: [
      { name: 'All Internships', href: '/manager/internships', icon: Briefcase },
      { name: 'Create Internship', href: '/manager/internships/create', icon: FileText },
      { name: 'Applications', href: '/manager/internships/applications', icon: Users },
    ],
  },
  {
    name: 'Applications',
    href: '/manager/applications',
    icon: FileText,
    badge: 12,
  },
  {
    name: 'Certificates',
    href: '/manager/certificates',
    icon: Award,
    badge: 8,
  },
  {
    name: 'Careers',
    href: '/manager/careers',
    icon: Briefcase,
    children: [
      { name: 'All Jobs', href: '/manager/careers', icon: Briefcase },
      { name: 'Post Job', href: '/manager/careers/create', icon: FileText },
      { name: 'Applications', href: '/manager/careers/applications', icon: Users },
    ],
  },
  {
    name: 'WhatsApp',
    href: '/manager/whatsapp',
    icon: MessageCircle,
    badge: 3,
    children: [
      { name: 'Dashboard', href: '/manager/whatsapp', icon: LayoutDashboard },
      { name: 'Accounts', href: '/manager/whatsapp/accounts', icon: Smartphone },
      { name: 'Conversations', href: '/manager/whatsapp/conversations', icon: MessageSquare },
      { name: 'Templates', href: '/manager/whatsapp/templates', icon: FileText },
      { name: 'Bulk Send', href: '/manager/whatsapp/bulk-template-send', icon: Send },
      { name: 'Analytics', href: '/manager/whatsapp/analytics', icon: TrendingUp },
    ],
  },
  {
    name: 'Forms',
    href: '/manager/forms',
    icon: FileText,
    badge: 0,
    children: [
      { name: 'All Forms', href: '/manager/forms', icon: FileText },
      { name: 'Create Form', href: '/manager/forms/create', icon: Plus },
      { name: 'Submissions', href: '/manager/forms/submissions', icon: Users },
      { name: 'Analytics', href: '/manager/forms/analytics', icon: TrendingUp },
    ],
  },
  {
    name: 'Company',
    href: '/manager/company',
    icon: Building2,
    children: [
      { name: 'Profile', href: '/manager/company/profile', icon: Building2 },
      { name: 'Settings', href: '/manager/company/settings', icon: Settings },
      { name: 'Team', href: '/manager/company/team', icon: Users },
    ],
  },
  {
    name: 'Reports',
    href: '/manager/reports',
    icon: TrendingUp,
  },
  {
    name: 'Settings',
    href: '/manager/settings',
    icon: Settings,
  },
];
interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Internships', 'Careers', 'Company']);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New application received', time: '5 min ago', read: false },
    { id: 2, title: 'Internship deadline tomorrow', time: '1 hour ago', read: false },
    { id: 3, title: 'Certificate generated', time: '2 hours ago', read: true },
  ]);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/manager') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const NavItemComponent = ({ item, isMobile = false }: { item: NavItem; isMobile?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const active = isActive(item.href);

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => toggleExpand(item.name)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              active
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive(child.href)
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  )}
                >
                  <child.icon className="h-3.5 w-3.5" />
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setSidebarOpen(false)}
        className={cn(
          "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          active
            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4 dark:border-gray-800">
            <Link href="/manager" className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Coprofiles
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">Manager</Badge>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>

          {/* User Footer */}
          <div className="border-t p-4 dark:border-gray-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImgUrl} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {user?.name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user?.name || 'Manager'}</p>
                    <p className="text-xs text-gray-500">Company Admin</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/manager/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  User Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link href="/manager" className="flex items-center gap-2 font-bold text-xl">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
                <span>Coprofiles</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {navItems.map((item) => (
                <NavItemComponent key={item.href} item={item} isMobile />
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">
                  Welcome back, {user?.name?.split(' ')[0] || 'Manager'}!
                </h1>
                <p className="text-sm text-gray-500">Manage your company and internships</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2">
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                        <span className="text-sm font-medium">{notification.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImgUrl} />
                      <AvatarFallback className="bg-indigo-600 text-white">
                        {user?.name?.charAt(0) || 'M'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/manager/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    User Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}