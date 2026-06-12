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
            className={`w-full flex items-center justify-between px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                    isActive(child.href)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-foreground hover:text-background"
                  }`}
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
        className={`flex items-center justify-between px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
          active
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <Badge className="ml-auto border-2 border-foreground text-foreground font-mono text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r-2 border-foreground bg-background lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b-2 border-foreground px-4">
            <Link href="/manager" className="flex items-center gap-2 font-serif font-bold tracking-tighter text-foreground">
              <GraduationCap className="h-6 w-6 text-foreground" />
              <span>Coprofiles</span>
              <Badge className="border-2 border-foreground text-foreground font-mono text-xs">Manager</Badge>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </nav>

          {/* User Footer */}
          <div className="border-t-2 border-foreground p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 px-3 py-2 hover:bg-foreground hover:text-background">
                  <Avatar className="h-8 w-8 border-2 border-foreground">
                    <AvatarImage src={user?.profileImgUrl} />
                    <AvatarFallback className="bg-foreground text-background">
                      {user?.name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-serif text-foreground">{user?.name || 'Manager'}</p>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Company Admin</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-2 border-foreground">
                <DropdownMenuLabel className="font-serif text-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-foreground" />
                <DropdownMenuItem onClick={() => router.push('/manager/settings')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  User Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-foreground" />
                <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground hover:bg-foreground hover:text-background">
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
            className="lg:hidden fixed left-4 top-4 z-40 hover:bg-foreground hover:text-background"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-background border-r-2 border-foreground">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b-2 border-foreground px-4">
              <Link href="/manager" className="flex items-center gap-2 font-serif font-bold tracking-tighter text-foreground">
                <GraduationCap className="h-6 w-6 text-foreground" />
                <span>Coprofiles</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hover:bg-foreground hover:text-background">
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
        <header className="sticky top-0 z-20 border-b-2 border-foreground bg-background">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-foreground hover:text-background"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:block">
                <h1 className="font-serif text-foreground">
                  Welcome back, {user?.name?.split(' ')[0] || 'Manager'}!
                </h1>
                <p className="font-serif text-muted-foreground">Manage your company and internships</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64 border-2 border-foreground bg-background text-foreground font-serif"
                />
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-foreground hover:text-background">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-foreground" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-background border-2 border-foreground">
                  <DropdownMenuLabel className="flex items-center justify-between font-serif text-foreground">
                    <span>Notifications</span>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-foreground hover:text-background">
                      Mark all as read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-foreground" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 text-muted-foreground hover:bg-foreground hover:text-background">
                      <div className="flex items-center gap-2">
                        {!notification.read && <div className="h-2 w-2 bg-foreground" />}
                        <span className="text-sm">{notification.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-foreground hover:text-background">
                    <Avatar className="h-8 w-8 border-2 border-foreground">
                      <AvatarImage src={user?.profileImgUrl} />
                      <AvatarFallback className="bg-foreground text-background">
                        {user?.name?.charAt(0) || 'M'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-2 border-foreground">
                  <DropdownMenuLabel className="font-serif text-foreground">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-foreground" />
                  <DropdownMenuItem onClick={() => router.push('/manager/settings')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    User Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-foreground" />
                  <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground hover:bg-foreground hover:text-background">
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
