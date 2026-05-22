// app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  Key,
  Save,
  Camera,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  LogOut,
  Settings as SettingsIcon,
  Palette,
  Languages,
  Database,
  Clock,
  Download,
  Upload,
  Fingerprint,
  Smartphone,
  Laptop,
  Tablet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNo: string | null;
  description: string | null;
  profileImgUrl: string | null;
  verified: boolean;
  createdAt: string;
  roleType: string;
  authBy: string | null;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile?.name,
          phoneNo: profile?.phoneNo,
          description: profile?.description,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile updated successfully');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Password changed successfully');
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Upload profile image to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      // Upload to Cloudinary via your API
      const response = await fetch('/api/user/profile/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        // Update profile with new image URL
        const updateResponse = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileImgUrl: data.imageUrl,
          }),
          credentials: 'include',
        });

        if (updateResponse.ok) {
          setProfile(prev => prev ? { ...prev, profileImgUrl: data.imageUrl } : null);
          toast.success('Profile picture updated');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Remove profile image
  const handleRemoveImage = async () => {
    setUploading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileImgUrl: null,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, profileImgUrl: null } : null);
        toast.success('Profile picture removed');
      } else {
        throw new Error('Failed to remove');
      }
    } catch (error) {
      toast.error('Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: deletePassword || undefined,
          confirmDelete: true,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Account deleted successfully');
        window.location.href = '/login';
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    }
  };

  // Update settings (local storage for now)
  const handleUpdateSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Apply theme
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
          <div className="h-4 w-64 mt-2 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and profile</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="preferences"><SettingsIcon className="h-4 w-4 mr-2" />Preferences</TabsTrigger>
          <TabsTrigger value="data"><Database className="h-4 w-4 mr-2" />Data & Privacy</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Manage your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6 flex-wrap">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profileImgUrl || ''} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                  {profile.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="relative" disabled={uploading}>
                    <Camera className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleImageUpload} 
                      disabled={uploading} 
                    />
                  </Button>
                  {profile.profileImgUrl && (
                    <Button variant="ghost" size="sm" onClick={handleRemoveImage} disabled={uploading}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input 
                    value={profile.name || ''} 
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={profile.email} disabled className="bg-gray-50 dark:bg-gray-800" />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input 
                    value={profile.phoneNo || ''} 
                    onChange={(e) => setProfile({ ...profile, phoneNo: e.target.value })} 
                    placeholder="+91 XXXXXXXXXX" 
                  />
                </div>
                <div>
                  <Label>Member Since</Label>
                  <Input value={new Date(profile.createdAt).toLocaleDateString()} disabled className="bg-gray-50 dark:bg-gray-800" />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Input value={profile.authBy === 'google' ? 'Google Account' : profile.authBy === 'github' ? 'GitHub Account' : 'Email Account'} disabled className="bg-gray-50 dark:bg-gray-800" />
                </div>
                <div>
                  <Label>Verification Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {profile.verified ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label>Bio / Description</Label>
                <Textarea 
                  value={profile.description || ''} 
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })} 
                  rows={3} 
                  placeholder="Tell us about yourself" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password - Only show if not OAuth */}
          {profile.authBy === null && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowPasswordDialog(true)}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          )}

          {profile.authBy !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Account Type</CardTitle>
                <CardDescription>
                  You signed up with {profile.authBy === 'google' ? 'Google' : 'GitHub'}. 
                  Password management is handled by {profile.authBy === 'google' ? 'Google' : 'GitHub'}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge className="bg-blue-100 text-blue-700">
                  {profile.authBy === 'google' ? 'Google Account' : 'GitHub Account'}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Session Management */}
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Laptop className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-sm">Current Session</p>
                    <p className="text-xs text-gray-500">This device</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Active Now</Badge>
              </div>
              <Button variant="outline" className="w-full">Sign Out All Devices</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your dashboard appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={(v: any) => setSettings({ ...settings, theme: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light"><Sun className="h-4 w-4 inline mr-2" />Light</SelectItem>
                    <SelectItem value="dark"><Moon className="h-4 w-4 inline mr-2" />Dark</SelectItem>
                    <SelectItem value="system"><Monitor className="h-4 w-4 inline mr-2" />System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch checked={settings.emailNotifications} onCheckedChange={(v) => setSettings({ ...settings, emailNotifications: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Get real-time notifications</p>
                </div>
                <Switch checked={settings.pushNotifications} onCheckedChange={(v) => setSettings({ ...settings, pushNotifications: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive promotional emails</p>
                </div>
                <Switch checked={settings.marketingEmails} onCheckedChange={(v) => setSettings({ ...settings, marketingEmails: v })} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateSettings} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
              <CardDescription>Download a copy of your data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => toast.info('Export feature coming soon')}>
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input 
                  type={showCurrentPassword ? 'text' : 'password'} 
                  value={passwordData.currentPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2" 
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input 
                  type={showNewPassword ? 'text' : 'password'} 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                value={passwordData.confirmNewPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })} 
              />
            </div>
            <Progress 
              value={passwordData.newPassword.length > 0 ? Math.min((passwordData.newPassword.length / 10) * 100, 100) : 0} 
              className="h-1" 
            />
            <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
              <Input 
                value={deleteConfirmText} 
                onChange={(e) => setDeleteConfirmText(e.target.value)} 
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
            {profile.authBy === null && (
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={deletePassword} 
                  onChange={(e) => setDeletePassword(e.target.value)} 
                  placeholder="Enter your password"
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteAccount}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}