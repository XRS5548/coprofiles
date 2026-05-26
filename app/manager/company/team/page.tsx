// app/manager/company/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  UserPlus,
  Trash2,
  UserCog,
  Search,
  Loader2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Shield,
  Crown,
  Star,
  Briefcase,
  MoreVertical,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Company {
  id: number;
  name: string;
  logoUrl: string | null;
  category: string | null;
  verified: boolean;
  role: string;
  permission: string;
}

interface TeamMember {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  userProfile: string | null;
  role: string;
  permission: string;
  joinedAt: string;
}

interface SearchUser {
  id: number;
  name: string;
  email: string;
  phoneNo: string | null;
  profileImgUrl: string | null;
  verified: boolean;
}

export default function CompanyTeamPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  
  // Add Member State
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [selectedPermission, setSelectedPermission] = useState('v');
  const [addingMember, setAddingMember] = useState(false);
  
  // Remove Member State
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);
  
  // Change Role State
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [memberToChange, setMemberToChange] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState('');
  const [newPermission, setNewPermission] = useState('');
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchTeamMembers(selectedCompany.id);
    }
  }, [selectedCompany]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const data = await response.json();
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

  const fetchTeamMembers = async (companyId: number) => {
    setTeamLoading(true);
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
    } finally {
      setTeamLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      toast.error('Please enter at least 2 characters to search');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/manager/users/search?q=${encodeURIComponent(searchTerm)}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser || !selectedCompany) return;

    setAddingMember(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompany.id}/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedRole,
          permission: selectedPermission,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to add member');

      toast.success(`${selectedUser.name} added to team as ${selectedRole}`);
      setAddMemberOpen(false);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUser(null);
      setSelectedRole('Employee');
      setSelectedPermission('v');
      fetchTeamMembers(selectedCompany.id);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !selectedCompany) return;

    setRemoving(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompany.id}/remove-member`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberToRemove.userId }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to remove member');

      toast.success(`${memberToRemove.userName} removed from team`);
      setRemoveDialogOpen(false);
      setMemberToRemove(null);
      fetchTeamMembers(selectedCompany.id);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  const handleChangeRole = async () => {
    if (!memberToChange || !selectedCompany) return;

    setChangingRole(true);
    try {
      const response = await fetch(`/api/manager/companies/${selectedCompany.id}/change-member-role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: memberToChange.userId,
          role: newRole,
          permission: newPermission,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to change role');

      toast.success(`Role changed to ${newRole} for ${memberToChange.userName}`);
      setRoleDialogOpen(false);
      setMemberToChange(null);
      fetchTeamMembers(selectedCompany.id);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to change role');
    } finally {
      setChangingRole(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Founder': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'CEO': return <Star className="h-4 w-4 text-purple-600" />;
      case 'CTO': return <Star className="h-4 w-4 text-blue-600" />;
      case 'HR': return <Users className="h-4 w-4 text-pink-600" />;
      case 'Manager': return <Shield className="h-4 w-4 text-green-600" />;
      default: return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Founder: 'bg-yellow-100 text-yellow-800',
      CEO: 'bg-purple-100 text-purple-800',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-gray-500 mt-1">Manage team members across your companies</p>
        </div>
        {selectedCompany && (selectedCompany.permission === 'f' || selectedCompany.role === 'Founder') && (
          <Button onClick={() => setAddMemberOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </div>

      {/* Company Selector */}
      <Card>
        <CardContent className="p-4">
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
                      <Badge className={getRoleBadge(company.role)} variant="secondary">
                        {company.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      {selectedCompany && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({teamMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members yet</p>
                {(selectedCompany.permission === 'f' || selectedCompany.role === 'Founder') && (
                  <Button onClick={() => setAddMemberOpen(true)} variant="link" className="mt-2">
                    Add your first team member
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        {member.userProfile ? (
                          <AvatarImage src={member.userProfile} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            {member.userName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.userName}</p>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-gray-500">{member.userEmail}</p>
                        {member.userPhone && (
                          <p className="text-xs text-gray-400">{member.userPhone}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Joined: {formatDate(member.joinedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getRoleBadge(member.role)}>
                          {member.role}
                        </Badge>
                        {getPermissionBadge(member.permission)}
                      </div>
                      {(selectedCompany.permission === 'f' || selectedCompany.role === 'Founder') && 
                       member.role !== 'Founder' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setMemberToChange(member);
                              setNewRole(member.role);
                              setNewPermission(member.permission);
                              setRoleDialogOpen(true);
                            }}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setMemberToRemove(member);
                                setRemoveDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Search for a user by name or email and add them to {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Section */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                  className="pl-9"
                />
              </div>
              <Button onClick={searchUsers} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedUser?.id === user.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.phoneNo && (
                          <p className="text-xs text-gray-400">{user.phoneNo}</p>
                        )}
                      </div>
                      {selectedUser?.id === user.id && (
                        <CheckCircle className="h-5 w-5 text-indigo-600 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected User */}
            {selectedUser && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Selected User:</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Permission</label>
                <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v">View Only</SelectItem>
                    <SelectItem value="c">Create & View</SelectItem>
                    <SelectItem value="f">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!selectedUser || addingMember}>
              {addingMember && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.userName} from {selectedCompany?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember} disabled={removing}>
              {removing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role & Permission</DialogTitle>
            <DialogDescription>
              Update role and permission for {memberToChange?.userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Permission</label>
              <Select value={newPermission} onValueChange={setNewPermission}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v">View Only</SelectItem>
                  <SelectItem value="c">Create & View</SelectItem>
                  <SelectItem value="f">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={changingRole}>
              {changingRole && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}