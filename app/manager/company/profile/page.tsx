// app/manager/company/profile/page.tsx - Updated with Delete and Role Change
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Award, 
  Calendar,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  UserCog,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface TeamMember {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: string;
  permission: string;
}
// Update the Stats interface
interface Stats {
  totalInternships: number;
  activeInternships: number;
  totalApplications: number;
  totalCareers: number;
  totalHired: number;
  totalMembers?: number; // Add this optional property
}

export default function ManagerCompanyProfilePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Record<number, Stats>>({});
  
  // Add Company State
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [addingCompany, setAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    category: '',
    description: '',
    logoUrl: '',
  });

  // Delete Company State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Role Change State
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedCompanyForRole, setSelectedCompanyForRole] = useState<Company | null>(null);
  const [newRole, setNewRole] = useState('');
  const [changingRole, setChangingRole] = useState(false);

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [selectedCompanyForTeam, setSelectedCompanyForTeam] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies || []);
        for (const company of (data.companies || [])) {
          await fetchCompanyStats(company.id);
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
        setStats(prev => ({ ...prev, [companyId]: data.stats }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTeamMembers = async (companyId: number) => {
    try {
      const response = await fetch(`/api/manager/companies/${companyId}/team`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/manager/companies/${editingCompany.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCompany.name,
          description: editingCompany.description,
          category: editingCompany.category,
          logoUrl: editingCompany.logoUrl,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update company');

      toast.success('Company updated successfully');
      setEditDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompany.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setAddingCompany(true);
    try {
      const response = await fetch('/api/manager/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompany.name,
          description: newCompany.description || null,
          category: newCompany.category || null,
          logoUrl: newCompany.logoUrl || null,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add company');

      toast.success('Company added successfully');
      setAddCompanyOpen(false);
      setNewCompany({
        name: '',
        category: '',
        description: '',
        logoUrl: '',
      });
      fetchCompanies();
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company');
    } finally {
      setAddingCompany(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/companies/${companyToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete company');

      toast.success('Company deleted successfully');
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedCompanyForRole || !newRole) return;
    
    setChangingRole(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompanyForRole.id}/change-role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to change role');

      toast.success(`Role changed to ${newRole} successfully`);
      setRoleDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to change role');
    } finally {
      setChangingRole(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Founder: 'bg-purple-100 text-purple-800',
      CEO: 'bg-red-100 text-red-800',
      CTO: 'bg-blue-100 text-blue-800',
      HR: 'bg-pink-100 text-pink-800',
      Manager: 'bg-green-100 text-green-800',
      Developer: 'bg-indigo-100 text-indigo-800',
      Employee: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || colors.Employee;
  };

  const getPermissionBadge = (permission: string) => {
    const config: Record<string, { label: string; color: string }> = {
      v: { label: 'View Only', color: 'bg-gray-100 text-gray-700' },
      c: { label: 'Create & View', color: 'bg-blue-100 text-blue-700' },
      f: { label: 'Full Access', color: 'bg-green-100 text-green-700' },
    };
    const { label, color } = config[permission] || config.v;
    return <Badge className={color}>{label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Company Profiles</h1>
          <p className="text-gray-500 mt-1">Manage all your associated companies</p>
        </div>
        <Button onClick={() => setAddCompanyOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Company
        </Button>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">No Companies Found</h2>
          <p className="text-gray-500 mt-2">You are not associated with any company yet.</p>
          <Button onClick={() => setAddCompanyOpen(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Company
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              {/* Company Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white">
                      {company.logoUrl ? (
                        <AvatarImage src={company.logoUrl} />
                      ) : (
                        <AvatarFallback className="bg-white/20 text-white text-xl">
                          {company.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{company.name}</h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {company.category && (
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {company.category}
                          </Badge>
                        )}
                        {company.verified && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRoleBadge(company.role)}>
                      {company.role}
                    </Badge>
                    {getPermissionBadge(company.permission)}
                  </div>
                </div>
              </div>

              {/* Company Content */}
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Internships</p>
                          <p className="text-xl font-bold">{stats[company.id]?.totalInternships || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Active Internships</p>
                          <p className="text-xl font-bold">{stats[company.id]?.activeInternships || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Applications</p>
                          <p className="text-xl font-bold">{stats[company.id]?.totalApplications || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                          <Award className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Hired</p>
                          <p className="text-xl font-bold">{stats[company.id]?.totalHired || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-6" />

                {/* Company Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      About
                    </h3>
                    <p className="text-gray-600">
                      {company.description || 'No description provided.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Joined:</span> {formatDate(company.createdAt)}
                      </p>
                      {company.category && (
                        <p className="text-sm">
                          <span className="text-gray-500">Category:</span> {company.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCompanyForTeam(company);
                      fetchTeamMembers(company.id);
                      setTeamDialogOpen(true);
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Team ({stats[company.id]?.totalMembers || 0})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/manager/internships?company=${company.id}`)}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Internships
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/manager/careers?company=${company.id}`)}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Jobs
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingCompany(company);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {(company.role === 'Founder' || company.permission === 'f') && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCompanyForRole(company);
                          setNewRole(company.role);
                          setRoleDialogOpen(true);
                        }}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Change Role
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setCompanyToDelete(company);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Company Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Update company information
            </DialogDescription>
          </DialogHeader>

          {editingCompany && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={editingCompany.category || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, category: e.target.value })}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={editingCompany.logoUrl || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingCompany.description || ''}
                  onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your company..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCompany} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Company Dialog */}
      <Dialog open={addCompanyOpen} onOpenChange={setAddCompanyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>
              Create a new company profile. You will be assigned as the Founder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                placeholder="Enter company name"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                placeholder="e.g., Technology, Finance, Healthcare, Education"
                value={newCompany.category}
                onChange={(e) => setNewCompany({ ...newCompany, category: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                placeholder="https://example.com/logo.png"
                value={newCompany.logoUrl}
                onChange={(e) => setNewCompany({ ...newCompany, logoUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your company, its mission, vision, and what it does..."
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-700 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                You will be automatically assigned as the <strong>Founder</strong> with full access.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCompanyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompany} disabled={addingCompany}>
              {addingCompany && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Plus className="h-4 w-4 mr-2" />
              Create Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Company Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Company
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{companyToDelete?.name}"? 
              This action cannot be undone. This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All internships and their applications</li>
                <li>All job postings and their applications</li>
                <li>All team member associations</li>
                <li>All company data</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-red-600 hover:bg-red-700">
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Your Role</DialogTitle>
            <DialogDescription>
              Update your role for {selectedCompanyForRole?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Founder">Founder</SelectItem>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="CTO">CTO</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Changing your role may affect your permissions and access level.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={changingRole}>
              {changingRole && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}