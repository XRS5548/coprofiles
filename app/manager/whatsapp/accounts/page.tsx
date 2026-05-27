// app/manager/whatsapp/accounts/page.tsx - Complete Fixed Version
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  MoreVertical,
  Smartphone,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  MessageCircle,
  Send,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Edit,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface WhatsAppAccount {
  id: number;
  accountName: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string | null;
  status: 'active' | 'inactive' | 'pending' | 'error' | 'expired';
  verified: boolean;
  webhookEndpoint: string;
  createdAt: string;
  lastConnected: string | null;
  metadata?: {
    apiVersion?: string;
    lastWebhookReceived?: string;
    webhookFailures?: number;
    rateLimit?: number;
  };
}

interface Template {
  id: number;
  templateName: string;
  bodyText: string;
  headerText: string | null;
  footerText: string | null;
  status: string;
  approved: boolean;
  language: string;
  category: string;
}

export default function WhatsAppAccountsPage() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [templates, setTemplates] = useState<Record<number, Template[]>>({});
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editAccountDialogOpen, setEditAccountDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [adding, setAdding] = useState(false);
  const [sending, setSending] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [syncingTemplates, setSyncingTemplates] = useState<number | null>(null);
  
  // Form data for adding account
  const [formData, setFormData] = useState({
    accountName: '',
    phoneNumberId: '',
    phoneNumber: '',
    accessToken: '',
    businessAccountId: '',
  });

  // Form data for editing account
  const [editFormData, setEditFormData] = useState({
    accountName: '',
    phoneNumber: '',
    accessToken: '',
  });

  // Form data for sending message
  const [messageData, setMessageData] = useState({
    toNumber: '',
    message: '',
    messageType: 'text',
    templateName: '',
  });

  // Form data for creating template
  const [templateData, setTemplateData] = useState({
    templateName: '',
    bodyText: '',
    headerText: '',
    footerText: '',
    language: 'en',
    category: 'MARKETING',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/manager/whatsapp/accounts', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts);
        // Fetch templates for each account
        for (const account of data.accounts) {
          await fetchTemplates(account.id);
        }
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async (accountId: number) => {
    try {
      const response = await fetch(`/api/manager/whatsapp/templates?accountId=${accountId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(prev => ({ ...prev, [accountId]: data.templates || [] }));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const syncTemplates = async (accountId: number) => {
    setSyncingTemplates(accountId);
    try {
      const response = await fetch('/api/manager/whatsapp/templates/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Templates synced successfully');
        await fetchTemplates(accountId);
      } else {
        throw new Error(data.error || 'Failed to sync templates');
      }
    } catch (error) {
      console.error('Error syncing templates:', error);
      toast.error('Failed to sync templates');
    } finally {
      setSyncingTemplates(null);
    }
  };

  const handleAddAccount = async () => {
    if (!formData.accountName || !formData.phoneNumberId || !formData.phoneNumber || !formData.accessToken) {
      toast.error('Please fill all required fields');
      return;
    }

    setAdding(true);
    try {
      const response = await fetch('/api/manager/whatsapp/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('WhatsApp account added successfully');
        setAddDialogOpen(false);
        setFormData({
          accountName: '',
          phoneNumberId: '',
          phoneNumber: '',
          accessToken: '',
          businessAccountId: '',
        });
        fetchAccounts();
      } else {
        throw new Error(data.error || 'Failed to add account');
      }
    } catch (error) {
      console.error('Error adding account:', error);
      toast.error('Failed to add account');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!selectedAccount) return;

    setUpdatingAccount(true);
    try {
      const response = await fetch('/api/manager/whatsapp/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          accountName: editFormData.accountName,
          phoneNumber: editFormData.phoneNumber,
          accessToken: editFormData.accessToken,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Account updated successfully');
        setEditAccountDialogOpen(false);
        fetchAccounts();
      } else {
        throw new Error(data.error || 'Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    } finally {
      setUpdatingAccount(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedAccount) return;
    if (!messageData.toNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    if (messageData.messageType === 'text' && !messageData.message) {
      toast.error('Please enter a message');
      return;
    }
    if (messageData.messageType === 'template' && !messageData.templateName) {
      toast.error('Please select a template');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/manager/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          toNumber: messageData.toNumber,
          message: messageData.message,
          messageType: messageData.messageType,
          templateName: messageData.templateName,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Message sent successfully');
        setSendMessageDialogOpen(false);
        setMessageData({
          toNumber: '',
          message: '',
          messageType: 'text',
          templateName: '',
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!selectedAccount) return;
    if (!templateData.templateName || !templateData.bodyText) {
      toast.error('Please fill template name and body text');
      return;
    }

    setCreatingTemplate(true);
    try {
      const response = await fetch('/api/manager/whatsapp/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          templateName: templateData.templateName,
          bodyText: templateData.bodyText,
          headerText: templateData.headerText || null,
          footerText: templateData.footerText || null,
          language: templateData.language,
          category: templateData.category,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Template created successfully');
        setTemplateDialogOpen(false);
        setTemplateData({
          templateName: '',
          bodyText: '',
          headerText: '',
          footerText: '',
          language: 'en',
          category: 'MARKETING',
        });
        await fetchTemplates(selectedAccount.id);
      } else {
        throw new Error(data.error || 'Failed to create template');
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setCreatingTemplate(false);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    try {
      const response = await fetch(`/api/manager/whatsapp/accounts?id=${accountId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Account deleted successfully');
        fetchAccounts();
      } else {
        throw new Error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleRefreshToken = async (accountId: number) => {
    toast.info('Please enter new access token', {
      action: {
        label: 'Update',
        onClick: async () => {
          const newToken = prompt('Enter new access token:');
          if (newToken) {
            try {
              const response = await fetch('/api/manager/whatsapp/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, newAccessToken: newToken }),
                credentials: 'include',
              });
              const data = await response.json();
              if (data.success) {
                toast.success('Token refreshed successfully');
                fetchAccounts();
              } else {
                throw new Error(data.error);
              }
            } catch (error) {
              toast.error('Failed to refresh token');
            }
          }
        },
      },
    });
  };

  const getStatusBadge = (status: string, verified: boolean) => {
    if (verified && status === 'active') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
    }
    if (status === 'error') {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Error</Badge>;
    }
    if (status === 'expired') {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Expired</Badge>;
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  const copyWebhookUrl = (endpoint: string) => {
    const url = `${window.location.origin}${endpoint}`;
    navigator.clipboard.writeText(url);
    toast.success('Webhook URL copied to clipboard');
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
          <h1 className="text-2xl font-bold">WhatsApp Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage your WhatsApp Business accounts</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">No WhatsApp Accounts</h2>
          <p className="text-muted-foreground mt-2">Connect your first WhatsApp Business account to get started</p>
          <Button onClick={() => setAddDialogOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="overflow-hidden border-border">
              {/* Account Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{account.accountName}</h2>
                      <p className="text-green-100">{account.phoneNumber}</p>
                    </div>
                  </div>
                  {getStatusBadge(account.status, account.verified)}
                </div>
              </div>

              {/* Account Content */}
              <div className="p-6">
                <Tabs defaultValue="details" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="messages">Send Message</TabsTrigger>
                    <TabsTrigger value="templates">
                      Templates ({templates[account.id]?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="webhook">Webhook</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number ID</p>
                        <p className="font-mono text-sm">{account.phoneNumberId}</p>
                      </div>
                      {account.businessAccountId && (
                        <div>
                          <p className="text-xs text-muted-foreground">Business Account ID</p>
                          <p className="font-mono text-sm">{account.businessAccountId}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Connected On</p>
                        <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                      </div>
                      {account.lastConnected && (
                        <div>
                          <p className="text-xs text-muted-foreground">Last Connected</p>
                          <p>{new Date(account.lastConnected).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {account.metadata?.rateLimit && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Rate Limit Usage</p>
                        <Progress value={account.metadata.rateLimit} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{account.metadata.rateLimit}% of limit used</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setSendMessageDialogOpen(true);
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setTemplateDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Template
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditFormData({
                            accountName: account.accountName,
                            phoneNumber: account.phoneNumber,
                            accessToken: '',
                          });
                          setSelectedAccount(account);
                          setEditAccountDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRefreshToken(account.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Token
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Phone Number (with country code)</Label>
                        <Input
                          placeholder="e.g., 919876543210"
                          value={messageData.toNumber}
                          onChange={(e) => setMessageData({ ...messageData, toNumber: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Enter number without + sign</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Message Type</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="text"
                              checked={messageData.messageType === 'text'}
                              onChange={(e) => setMessageData({ ...messageData, messageType: e.target.value })}
                            />
                            Text Message
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="template"
                              checked={messageData.messageType === 'template'}
                              onChange={(e) => setMessageData({ ...messageData, messageType: e.target.value })}
                            />
                            Template Message
                          </label>
                        </div>
                      </div>

                      {messageData.messageType === 'text' && (
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea
                            placeholder="Type your message here..."
                            rows={4}
                            value={messageData.message}
                            onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                          />
                        </div>
                      )}

                      {messageData.messageType === 'template' && (
                        <div className="space-y-2">
                          <Label>Select Template</Label>
                          <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={messageData.templateName}
                            onChange={(e) => setMessageData({ ...messageData, templateName: e.target.value })}
                          >
                            <option value="">Select a template</option>
                            {(templates[account.id] || []).map((template) => (
                              <option key={template.id} value={template.templateName}>
                                {template.templateName} {template.approved ? '✓' : '(pending)'}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <Button onClick={handleSendMessage} disabled={sending} className="w-full">
                        {sending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Templates Tab */}
                  <TabsContent value="templates">
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => syncTemplates(account.id)}
                          disabled={syncingTemplates === account.id}
                        >
                          {syncingTemplates === account.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Sync Templates
                        </Button>
                      </div>

                      {(templates[account.id] || []).length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No templates yet</p>
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setSelectedAccount(account);
                              setTemplateDialogOpen(true);
                            }}
                          >
                            Create your first template
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {(templates[account.id] || []).map((template) => (
                            <div key={template.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{template.templateName}</h4>
                                    {template.approved ? (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>
                                    ) : (
                                      <Badge variant="outline">Pending</Badge>
                                    )}
                                  </div>
                                  {template.headerText && (
                                    <p className="text-xs text-muted-foreground mt-1">Header: {template.headerText}</p>
                                  )}
                                  <p className="text-sm mt-2">{template.bodyText}</p>
                                  {template.footerText && (
                                    <p className="text-xs text-muted-foreground mt-1">Footer: {template.footerText}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Webhook Tab */}
                  <TabsContent value="webhook">
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Webhook URL</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-background p-2 rounded border">
                            {`${window.location.origin}/whatsapp-hooks/${account.webhookEndpoint}`}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyWebhookUrl(account.webhookEndpoint)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Configure this URL in your Meta Developer Console under webhook settings
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Setup Instructions</h4>
                        <ol className="text-sm text-blue-600 dark:text-blue-400 space-y-2 list-decimal list-inside">
                          <li>Go to Meta Developer Console</li>
                          <li>Select your WhatsApp app</li>
                          <li>Go to Webhooks section</li>
                          <li>Add this URL as the callback URL</li>
                          <li>Set verify token as your webhook secret</li>
                          <li>Subscribe to messages and message_deliveries events</li>
                        </ol>
                      </div>

                      {account.metadata?.lastWebhookReceived && (
                        <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-400">
                            Last webhook received: {new Date(account.metadata.lastWebhookReceived).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {account.metadata?.webhookFailures && account.metadata.webhookFailures > 0 && (
                        <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {account.metadata.webhookFailures} webhook failures detected
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Account Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Connect WhatsApp Business Account</DialogTitle>
            <DialogDescription>
              Enter your WhatsApp Business API credentials to connect your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Account Name *</Label>
              <Input
                placeholder="e.g., My Business WhatsApp"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number ID *</Label>
              <Input
                placeholder="Your WhatsApp phone number ID"
                value={formData.phoneNumberId}
                onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                placeholder="+1 234 567 8900"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Access Token *</Label>
              <div className="relative">
                <Input
                  type={showToken ? 'text' : 'password'}
                  placeholder="Your WhatsApp Business API access token"
                  value={formData.accessToken}
                  onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Business Account ID (Optional)</Label>
              <Input
                placeholder="Your WhatsApp Business account ID"
                value={formData.businessAccountId}
                onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount} disabled={adding}>
              {adding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Connect Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={editAccountDialogOpen} onOpenChange={setEditAccountDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit WhatsApp Account</DialogTitle>
            <DialogDescription>
              Update your WhatsApp account details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                placeholder="Account name"
                value={editFormData.accountName}
                onChange={(e) => setEditFormData({ ...editFormData, accountName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="Phone number"
                value={editFormData.phoneNumber}
                onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>New Access Token (Optional)</Label>
              <div className="relative">
                <Input
                  type={showToken ? 'text' : 'password'}
                  placeholder="New access token"
                  value={editFormData.accessToken}
                  onChange={(e) => setEditFormData({ ...editFormData, accessToken: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Leave empty to keep current token</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAccount} disabled={updatingAccount}>
              {updatingAccount && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
            <DialogDescription>
              Create a reusable message template for WhatsApp
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
                  value={templateData.templateName}
                  onChange={(e) => setTemplateData({ ...templateData, templateName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Use lowercase with underscores</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={templateData.category}
                    onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
                  >
                    <option value="MARKETING">Marketing</option>
                    <option value="UTILITY">Utility</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={templateData.language}
                    onChange={(e) => setTemplateData({ ...templateData, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Header (Optional)</Label>
                <Input
                  placeholder="Header text"
                  value={templateData.headerText}
                  onChange={(e) => setTemplateData({ ...templateData, headerText: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Body Text *</Label>
                <Textarea
                  placeholder="Your message body. Use {{1}}, {{2}} for variables"
                  rows={5}
                  value={templateData.bodyText}
                  onChange={(e) => setTemplateData({ ...templateData, bodyText: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Use {'{{1}}'}, {'{{2}}'} for dynamic variables</p>
              </div>

              <div className="space-y-2">
                <Label>Footer (Optional)</Label>
                <Input
                  placeholder="Footer text"
                  value={templateData.footerText}
                  onChange={(e) => setTemplateData({ ...templateData, footerText: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="border rounded-lg p-4 bg-muted">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-background rounded-lg p-3 shadow-sm">
                      {templateData.headerText && (
                        <div className="font-semibold text-foreground mb-2">
                          {templateData.headerText}
                        </div>
                      )}
                      <div className="text-foreground whitespace-pre-wrap">
                        {templateData.bodyText}
                      </div>
                      {templateData.footerText && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {templateData.footerText}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={creatingTemplate}>
              {creatingTemplate && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={sendMessageDialogOpen} onOpenChange={setSendMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to a customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="e.g., 919876543210"
                value={messageData.toNumber}
                onChange={(e) => setMessageData({ ...messageData, toNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message..."
                rows={4}
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}