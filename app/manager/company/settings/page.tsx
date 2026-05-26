// app/manager/company/settings/page.tsx - Fixed description issue
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  Award,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Company {
  id: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  category: string | null;
  verified: boolean;
  createdAt: string;
  role: string;
  permission: string;
}

interface CompanyStats {
  totalInternships: number;
  activeInternships: number;
  totalApplications: number;
  totalCareers: number;
  totalHired: number;
  totalTeamMembers: number;
}

export default function CompanySettingsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [companyCategory, setCompanyCategory] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Delete company state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      console.log('Selected company:', selectedCompany); // Debug log
      setCompanyName(selectedCompany.name || '');
      setCompanyCategory(selectedCompany.category || '');
      setCompanyDescription(selectedCompany.description || '');
      setCompanyLogoUrl(selectedCompany.logoUrl || '');
      fetchCompanyStats(selectedCompany.id);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const data = await response.json();
      console.log('Companies API response:', data); // Debug log
      if (data.success) {
        setCompanies(data.companies || []);
        if (data.companies && data.companies.length > 0) {
          setSelectedCompany(data.companies[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyStats = async (companyId: number) => {
    try {
      const response = await fetch(`/api/manager/company/${companyId}/stats`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setCompanyStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompany.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          description: companyDescription,
          category: companyCategory,
          logoUrl: companyLogoUrl,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update company');
      }

      toast.success('Company settings updated successfully');
      // Update the selected company with new values
      setSelectedCompany({
        ...selectedCompany,
        name: companyName,
        description: companyDescription,
        category: companyCategory,
        logoUrl: companyLogoUrl,
      });
      fetchCompanies(); // Refresh the list
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update company settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch('/api/manager/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;
    
    if (deleteConfirmText !== selectedCompany.name) {
      toast.error('Company name does not match');
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompany.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete company');

      toast.success('Company deleted successfully');
      setDeleteDialogOpen(false);
      
      const updatedCompanies = companies.filter(c => c.id !== selectedCompany.id);
      setCompanies(updatedCompanies);
      if (updatedCompanies.length > 0) {
        setSelectedCompany(updatedCompanies[0]);
      } else {
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    } finally {
      setDeleting(false);
      setDeleteConfirmText('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">No Companies Found</h2>
        <p className="text-gray-500 mt-2">You are not associated with any company yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-gray-500 mt-1">Manage your company preferences and configurations</p>
      </div>

      {/* Company Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium">Select Company:</label>
              <Select
                value={selectedCompany?.id.toString()}
                onValueChange={(val) => {
                  const company = companies.find(c => c.id.toString() === val);
                  setSelectedCompany(company || null);
                }}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {company.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCompany && (
              <Badge className={selectedCompany.permission === 'f' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {selectedCompany.permission === 'f' ? 'Full Access' : selectedCompany.permission === 'c' ? 'Create & View' : 'View Only'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedCompany && (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      {companyLogoUrl ? (
                        <AvatarImage src={companyLogoUrl} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                          {companyName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label>Company Logo URL</Label>
                      <Input
                        placeholder="https://example.com/logo.png"
                        value={companyLogoUrl}
                        onChange={(e) => setCompanyLogoUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={companyCategory}
                    onChange={(e) => setCompanyCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your company's mission, vision, and what it does..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    {companyDescription.length} characters
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Company ID</p>
                      <p className="font-mono">#{selectedCompany.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Joined Date</p>
                      <p>{formatDate(selectedCompany.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Verification Status</p>
                      {selectedCompany.verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="outline">Pending Verification</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Your Role</p>
                      <Badge className="bg-purple-100 text-purple-800">{selectedCompany.role}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Company Statistics</CardTitle>
                <CardDescription>Overview of your company's activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{companyStats?.totalInternships || 0}</p>
                    <p className="text-xs text-gray-500">Internships</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{companyStats?.totalApplications || 0}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">{companyStats?.totalHired || 0}</p>
                    <p className="text-xs text-gray-500">Hired</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                    <p className="text-2xl font-bold">{companyStats?.totalTeamMembers || 0}</p>
                    <p className="text-xs text-gray-500">Team Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleUpdateCompany} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Configure how applications are handled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email notifications for new applications</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Approve Applications</Label>
                    <p className="text-sm text-gray-500">Automatically approve internship applications</p>
                  </div>
                  <Switch
                    checked={autoApprove}
                    onCheckedChange={setAutoApprove}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Company Profile</Label>
                    <p className="text-sm text-gray-500">Make your company profile visible to all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Manage your active sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout from all devices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-4">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-500">
                  Irreversible actions that cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Delete Company</h3>
                    <p className="text-sm text-gray-500">
                      Permanently delete your company and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={selectedCompany.permission !== 'f'}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Company
                  </Button>
                </div>

                {selectedCompany.permission !== 'f' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Only users with Full Access permission can delete this company
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Company Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Company
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{selectedCompany?.name} company profile</li>
                <li>All internships and job postings</li>
                <li>All applications from students</li>
                <li>All team member associations</li>
                <li>All certificates issued</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  Please type <strong>{selectedCompany?.name}</strong> to confirm.
                </p>
              </div>
              <Input
                className="mt-3"
                placeholder="Type company name to confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              disabled={deleting || deleteConfirmText !== selectedCompany?.name}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Permanently Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}