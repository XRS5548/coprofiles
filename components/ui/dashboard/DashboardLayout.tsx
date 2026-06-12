'use client';

import { useState, useEffect, useRef } from 'react';
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
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Award,
  Moon,
  Sun,
  ExternalLink,
  Loader2,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface SearchResult {
  type: 'internship' | 'career' | 'project' | 'form';
  id: number;
  title: string;
  description: string | null;
  company?: string;
  location?: string;
  url: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Internships', href: '/dashboard/internships', icon: GraduationCap },
  { name: 'My Applications', href: '/dashboard/internships/my-applications', icon: FileText },
  { name: 'My Jobs History', href: '/dashboard/my-jobs-history', icon: Clock },
  { name: 'Careers', href: '/dashboard/careers', icon: Briefcase },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
  { name: 'Forms', href: '/dashboard/forms', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch();
      } else if (searchQuery.length === 0) {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const performSearch = async () => {
    if (searchQuery.length < 2) return;

    setSearching(true);
    try {
      const response = await fetch(`/api/user/search?q=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      setShowSearchDialog(true);
      performSearch();
    }
  };

  const addToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(searchQuery);
    setShowSearchDialog(false);
    setSearchQuery('');
    router.push(result.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, []);

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
    <div className="flex h-full flex-col bg-background border-r-2 border-foreground">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-5 border-b-2 border-foreground">
        <div className="flex items-center gap-2.5">
          <div>
            <span className="text-lg font-bold tracking-tighter text-foreground font-serif">
              CO-PROFILES
            </span>
            <p className="text-[10px] text-muted-foreground -mt-0.5 uppercase tracking-widest font-mono">Student Portal</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-muted-foreground hover:bg-foreground hover:text-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile Summary (Mobile) */}
      <div className="lg:hidden px-4 py-5 border-b-2 border-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-foreground">
            <AvatarImage src={user?.profileImgUrl || ''} />
            <AvatarFallback className="bg-background text-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-serif font-semibold text-foreground">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground font-mono">{user?.email || 'user@example.com'}</p>
            <div className="flex items-center gap-1 mt-1">
              {user?.verified ? (
                <>
                  <CheckCircle className="h-3 w-3 text-foreground" />
                  <span className="text-xs text-foreground font-mono">Verified Account</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 text-foreground" />
                  <span className="text-xs text-foreground font-mono">Not Verified</span>
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
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-foreground hover:text-background'
                }`}
                onClick={() => router.push(item.href)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-background' : 'text-muted-foreground group-hover:text-background'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="outline" className="border-2 border-foreground text-foreground">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t-2 border-foreground p-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:bg-foreground hover:text-background">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background border-2 border-foreground" align="start" side="right">
            <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-foreground" />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="text-muted-foreground hover:bg-foreground hover:text-background">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground hover:bg-foreground hover:text-background">
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
        className="hidden lg:block relative"
      >
        <div className="flex h-full flex-col bg-background border-r-2 border-foreground">
          {/* Logo Section */}
          <div className="flex h-16 items-center justify-between px-5 border-b-2 border-foreground">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <span className="text-lg font-bold tracking-tighter text-foreground font-serif">
                    CO-PROFILES
                  </span>
                  <p className="text-[10px] text-muted-foreground -mt-0.5 uppercase tracking-widest font-mono">Student Portal</p>
                </motion.div>
              )}
              {!sidebarOpen && (
                <span className="text-lg font-bold tracking-tighter text-foreground font-serif">CP</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:bg-foreground hover:text-background flex-shrink-0"
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
              className="px-4 py-5 border-b-2 border-foreground"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-foreground">
                  <AvatarImage src={user?.profileImgUrl || ''} />
                  <AvatarFallback className="bg-background text-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {loading ? (
                    <>
                      <Skeleton className="h-4 w-24 mb-1 bg-muted" />
                      <Skeleton className="h-3 w-32 bg-muted" />
                    </>
                  ) : (
                    <>
                      <p className="font-serif font-semibold text-foreground">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{user?.email || 'user@example.com'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {user?.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-foreground" />
                            <span className="text-xs text-foreground font-mono">Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-foreground" />
                            <span className="text-xs text-foreground font-mono">Not Verified</span>
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
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-foreground hover:text-background'
                    } ${!sidebarOpen && 'justify-center'}`}
                    onClick={() => router.push(item.href)}
                  >
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-background' : 'text-muted-foreground group-hover:text-background'}`} />
                      {sidebarOpen && <span className="font-medium">{item.name}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <Badge variant="outline" className="border-2 border-foreground text-foreground">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t-2 border-foreground p-4 mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full text-muted-foreground hover:bg-foreground hover:text-background ${!sidebarOpen && 'justify-center'}`}
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">Logout</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border-2 border-foreground" align="start" side="right">
                <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-foreground" />
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground hover:bg-foreground hover:text-background">
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
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50 bg-background border-2 border-foreground">
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 bg-background border-r-2 border-foreground">
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
          className="bg-background border-b-2 border-foreground sticky top-0 z-40"
        >
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
                </p>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center max-w-md flex-1 ml-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search internships, careers, projects, forms... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchDialog(true)}
                    className="pl-9 border-2 border-foreground bg-background text-foreground placeholder:text-muted-foreground focus:bg-foreground focus:text-background"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:bg-foreground hover:text-background"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-foreground hover:text-background">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-foreground"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hover:bg-foreground hover:text-background">
                    {loading ? (
                      <Skeleton className="h-8 w-8 bg-muted" />
                    ) : (
                      <>
                        <Avatar className="h-8 w-8 border-2 border-foreground">
                          <AvatarImage src={user?.profileImgUrl || ''} />
                          <AvatarFallback className="bg-background text-foreground text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-sm font-medium text-foreground font-serif">
                          {user?.name?.split(' ')[0] || 'User'}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-2 border-foreground">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-foreground">{user?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground font-mono font-normal">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-foreground" />
                  <div className="px-2 py-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      {user?.verified ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-foreground" />
                          <span className="text-foreground text-xs font-mono">Verified Account</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-foreground" />
                          <span className="text-foreground text-xs font-mono">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-foreground" />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="text-muted-foreground hover:bg-foreground hover:text-background">
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-muted-foreground hover:bg-foreground hover:text-background">
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
          className="flex-1 overflow-y-auto bg-background"
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

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-2xl bg-background border-2 border-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Search Results</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-2 border-foreground bg-background text-foreground placeholder:text-muted-foreground focus:bg-foreground focus:text-background"
              autoFocus
            />
          </div>

          {searching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-foreground" />
            </div>
          ) : searchResults.length === 0 && searchQuery.length > 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 hover:bg-foreground hover:text-background cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs border-2 border-foreground text-muted-foreground">
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{result.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                      {result.company && (
                        <p className="text-xs text-muted-foreground mt-1">{result.company}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentSearches.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2 font-mono">Recent Searches</p>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-foreground hover:text-background cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSearchQuery(search);
                      performSearch();
                    }}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
