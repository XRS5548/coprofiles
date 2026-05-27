// app/manager/whatsapp/templates/page.tsx - Complete Fixed Version
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MoreVertical,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Eye,
  FileText,
  Smartphone,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppAccount {
  id: number;
  accountName: string;
  phoneNumber: string;
  status: string;
  verified: boolean;
}

interface Template {
  id: number;
  whatsappAccountId: number;
  templateName: string;
  templateId: string | null;
  language: string;
  category: string | null;
  components: any[] | null;
  headerText: string | null;
  bodyText: string;
  footerText: string | null;
  buttons: Array<{
    type: string;
    text: string;
    url?: string;
    phoneNumber?: string;
  }> | null;
  status: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WhatsAppTemplatesPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form data for template
  const [formData, setFormData] = useState({
    templateName: '',
    language: 'en',
    category: 'MARKETING',
    headerText: '',
    bodyText: '',
    footerText: '',
    buttons: [] as Array<{ type: string; text: string; url?: string; phoneNumber?: string }>,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTemplates();
    }
  }, [selectedAccount]);

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

  const fetchTemplates = async () => {
    if (!selectedAccount) return;
    
    try {
      const response = await fetch(`/api/manager/whatsapp/templates?accountId=${selectedAccount.id}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const handleCreateTemplate = async () => {
    if (!formData.templateName || !formData.bodyText) {
      toast.error('Please fill template name and body text');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/manager/whatsapp/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount?.id,
          templateName: formData.templateName,
          bodyText: formData.bodyText,
          headerText: formData.headerText || null,
          footerText: formData.footerText || null,
          language: formData.language,
          category: formData.category,
          buttons: formData.buttons,
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Template created successfully');
        setCreateDialogOpen(false);
        resetForm();
        fetchTemplates();
      } else {
        throw new Error(data.error || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return;
    if (!formData.templateName || !formData.bodyText) {
      toast.error('Please fill template name and body text');
      return;
    }

    setEditing(true);
    try {
      const response = await fetch('/api/manager/whatsapp/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          templateName: formData.templateName,
          bodyText: formData.bodyText,
          headerText: formData.headerText || null,
          footerText: formData.footerText || null,
          language: formData.language,
          category: formData.category,
          buttons: formData.buttons,
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Template updated successfully');
        setEditDialogOpen(false);
        resetForm();
        fetchTemplates();
      } else {
        throw new Error(data.error || 'Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/manager/whatsapp/templates?id=${selectedTemplate.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Template deleted successfully');
        setDeleteDialogOpen(false);
        fetchTemplates();
      } else {
        throw new Error(data.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      templateName: template.templateName,
      language: template.language,
      category: template.category || 'MARKETING',
      headerText: template.headerText || '',
      bodyText: template.bodyText,
      footerText: template.footerText || '',
      buttons: template.buttons || [],
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      templateName: '',
      language: 'en',
      category: 'MARKETING',
      headerText: '',
      bodyText: '',
      footerText: '',
      buttons: [],
    });
    setSelectedTemplate(null);
  };

  const copyTemplateName = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success('Template name copied');
  };

  const getStatusBadge = (template: Template | null) => {
    if (!template) return <Badge variant="outline">Unknown</Badge>;
    if (template.approved) {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    }
    if (template.status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    if (template.status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
    return <Badge variant="outline">Draft</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      MARKETING: 'bg-blue-100 text-blue-800',
      UTILITY: 'bg-purple-100 text-purple-800',
      AUTHENTICATION: 'bg-indigo-100 text-indigo-800',
    };
    return <Badge className={colors[category] || 'bg-gray-100 text-gray-800'}>{category || 'MARKETING'}</Badge>;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.bodyText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && template.approved) ||
                         (statusFilter === 'pending' && template.status === 'pending') ||
                         (statusFilter === 'rejected' && template.status === 'rejected');
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">No WhatsApp Accounts</h2>
        <p className="text-gray-500 mt-2">Connect a WhatsApp account to create templates</p>
        <Button onClick={() => router.push('/manager/whatsapp/accounts')} className="mt-4">
          Connect Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Message Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage WhatsApp message templates</p>
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
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Templates</p>
                <p className="text-2xl font-bold mt-1">{templates.length}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Approved</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {templates.filter(t => t.approved).length}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {templates.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No templates found</p>
                      <Button variant="link" onClick={() => setCreateDialogOpen(true)} className="mt-2">
                        Create your first template
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{template.templateName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-md">{template.bodyText.substring(0, 60)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(template.category || 'MARKETING')}</TableCell>
                      <TableCell className="uppercase">{template.language}</TableCell>
                      <TableCell>{getStatusBadge(template)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedTemplate(template);
                              setPreviewDialogOpen(true);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyTemplateName(template.templateName)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Name
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedTemplate(template);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for WhatsApp messages
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  placeholder="e.g., welcome_message"
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                />
                <p className="text-xs text-gray-500">Use lowercase with underscores</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="UTILITY">Utility</SelectItem>
                      <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={formData.language} onValueChange={(val) => setFormData({ ...formData, language: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Header (Optional)</Label>
                <Input
                  placeholder="Header text"
                  value={formData.headerText}
                  onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Body Text *</Label>
                <Textarea
                  placeholder="Your message body. Use {{1}}, {{2}} for variables"
                  rows={5}
                  value={formData.bodyText}
                  onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                />
                <p className="text-xs text-gray-500">{"Use {{1}}, {{2}} etc. for dynamic variables"}</p>
              </div>

              <div className="space-y-2">
                <Label>Footer (Optional)</Label>
                <Input
                  placeholder="Footer text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {formData.headerText && (
                        <div className="font-semibold text-gray-800 mb-2">
                          {formData.headerText}
                        </div>
                      )}
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {formData.bodyText}
                      </div>
                      {formData.footerText && (
                        <div className="text-xs text-gray-400 mt-2">
                          {formData.footerText}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.templateName || 'No template selected'}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {selectedTemplate.headerText && (
                        <div className="font-semibold text-gray-800 mb-2">
                          {selectedTemplate.headerText}
                        </div>
                      )}
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {selectedTemplate.bodyText}
                      </div>
                      {selectedTemplate.footerText && (
                        <div className="text-xs text-gray-400 mt-2">
                          {selectedTemplate.footerText}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date().toLocaleTimeString()} ✓✓
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-2">
                  {getStatusBadge(selectedTemplate)}
                  {getCategoryBadge(selectedTemplate.category || 'MARKETING')}
                </div>
                <Button variant="outline" size="sm" onClick={() => copyTemplateName(selectedTemplate.templateName)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Name
                </Button>
              </div>
            </>
          )}

          {!selectedTemplate && (
            <div className="text-center py-8">
              <p className="text-gray-500">No template selected</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Message Template</DialogTitle>
            <DialogDescription>
              Update your message template
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              {/* Same form fields as create template */}
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  placeholder="e.g., welcome_message"
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="UTILITY">Utility</SelectItem>
                      <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={formData.language} onValueChange={(val) => setFormData({ ...formData, language: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Header (Optional)</Label>
                <Input
                  placeholder="Header text"
                  value={formData.headerText}
                  onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Body Text *</Label>
                <Textarea
                  placeholder="Your message body. Use {{1}}, {{2}} for variables"
                  rows={5}
                  value={formData.bodyText}
                  onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Footer (Optional)</Label>
                <Input
                  placeholder="Footer text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {formData.headerText && (
                        <div className="font-semibold text-gray-800 mb-2">
                          {formData.headerText}
                        </div>
                      )}
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {formData.bodyText}
                      </div>
                      {formData.footerText && (
                        <div className="text-xs text-gray-400 mt-2">
                          {formData.footerText}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate} disabled={editing}>
              {editing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTemplate?.templateName || 'this template'}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}