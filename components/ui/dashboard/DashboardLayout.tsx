'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Search,
  Sparkles,
  Star,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Award,
  Moon,
  Sun,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  roleType: string;
  phoneNo: string | null;
  description: string | null;
  profileImgUrl: string | null;
  verified: boolean;
  createdAt: string;
  authBy: string | null;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    name: 'Internships', 
    href: '/dashboard/internships', 
    icon: GraduationCap, 
  },
  { 
    name: 'My Applications', 
    href: '/dashboard/internships/my-applications', 
    icon: FileText, 
  },
  { 
    name: 'My Jobs History',
    href: '/dashboard/my-jobs-history', 
    icon: Clock, 
  },
  { name: 'Careers', href: '/dashboard/careers', icon: Briefcase},
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { 
    name: 'Certificates', 
    href: '/dashboard/certificates', 
    icon: Award,
  },
  { 
    name: 'Forms', 
    href: '/dashboard/forms', 
    icon: FileText,
  },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          credentials: 'include',
        });
        
        if (res.status === 401) {
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed');
      router.push('/login');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.slice(0, 2).toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/50"></div>
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Sqrock Portal
            </span>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">Enterprise Suite</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile Summary (Mobile) */}
      <div className="lg:hidden px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-indigo-100 dark:ring-indigo-950">
            <AvatarImage src={user?.profileImgUrl || ''} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
            <div className="flex items-center gap-1 mt-1">
              {user?.verified ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Verified Account</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Button
                variant="ghost"
                className={`w-full justify-between group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-400 border-r-2 border-indigo-500 dark:border-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 mt-auto">
        <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pro Plan</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">You're on the Professional tier</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="right">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
        className="hidden lg:block relative"
      >
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
        
        <div className="flex h-full flex-col bg-white dark:bg-gray-950">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative flex-shrink-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/50"></div>
                <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
              </div>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    Sqrock Portal
                  </span>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">Enterprise Suite</p>
                </motion.div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* User Profile (Sidebar open) */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-5 border-b border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-indigo-100 dark:ring-indigo-950">
                  <AvatarImage src={user?.profileImgUrl || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {loading ? (
                    <>
                      <Skeleton className="h-4 w-24 mb-1 dark:bg-gray-800" />
                      <Skeleton className="h-3 w-32 dark:bg-gray-800" />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {user?.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">Not Verified</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: sidebarOpen ? 5 : 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-between group relative ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200'
                    } ${!sidebarOpen && 'justify-center'}`}
                    onClick={() => router.push(item.href)}
                  >
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                      {sidebarOpen && <span className="font-medium">{item.name}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 mt-auto">
            {sidebarOpen && (
              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Professional Plan</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Access all premium features</p>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`w-full text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 ${!sidebarOpen && 'justify-center'}`}
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">Logout</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side={sidebarOpen ? "right" : "right"}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50 shadow-sm bg-white dark:bg-gray-950">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40"
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center max-w-md flex-1 ml-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search internships, projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    {loading ? (
                      <Skeleton className="h-8 w-8 rounded-full dark:bg-gray-800" />
                    ) : (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profileImgUrl || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user?.name?.split(' ')[0] || 'User'}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-gray-100">{user?.name || 'User'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      {user?.verified ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-green-600 dark:text-green-400 text-xs">Verified Account</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400 text-xs">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  );
}