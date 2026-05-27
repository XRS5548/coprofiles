// app/manager/whatsapp/accounts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

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
}

export default function WhatsAppAccountsPage() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [adding, setAdding] = useState(false);
  const [sending, setSending] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  // Form data for adding account
  const [formData, setFormData] = useState({
    accountName: '',
    phoneNumberId: '',
    phoneNumber: '',
    accessToken: '',
    businessAccountId: '',
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
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
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
        });
        fetchTemplates(selectedAccount.id);
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

  const getStatusBadge = (status: string, verified: boolean) => {
    if (verified && status === 'active') {
      return <Badge className="cg-green-100 text-green-800">Active</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="cg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    if (status === 'error') {
      return <Badge className="cg-red-100 text-red-800">Error</Badge>;
    }
    if (status === 'expired') {
      return <Badge className="cg-orange-100 text-orange-800">Expired</Badge>;
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
          <p className="text-gray-500 mt-1">Manage your WhatsApp Business accounts</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Smartphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">No WhatsApp Accounts</h2>
          <p className="text-gray-500 mt-2">Connect your first WhatsApp Business account to get started</p>
          <Button onClick={() => setAddDialogOpen(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              {/* Account Header */}
              <div className="cg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="cg-white/20 rounded-full p-3">
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
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="messages">Send Message</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="webhook">Webhook</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Phone Number ID</p>
                        <p className="font-mono text-sm">{account.phoneNumberId}</p>
                      </div>
                      {account.businessAccountId && (
                        <div>
                          <p className="text-xs text-gray-500">Business Account ID</p>
                          <p className="font-mono text-sm">{account.businessAccountId}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Connected On</p>
                        <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                      </div>
                      {account.lastConnected && (
                        <div>
                          <p className="text-xs text-gray-500">Last Connected</p>
                          <p>{new Date(account.lastConnected).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {account.metadata?.rateLimit && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Rate Limit Usage</p>
                        <Progress value={account.metadata.rateLimit} className="h-2" />
                        <p className="text-xs text-gray-400 mt-1">{account.metadata.rateLimit}% of limit used</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
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
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Token
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Phone Number (with country code)</Label>
                            <Input
                              placeholder="e.g., 919876543210"
                              value={messageData.toNumber}
                              onChange={(e) => setMessageData({ ...messageData, toNumber: e.target.value })}
                            />
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
                                className="w-full p-2 border rounded-md"
                                value={messageData.templateName}
                                onChange={(e) => setMessageData({ ...messageData, templateName: e.target.value })}
                              >
                                <option value="">Select a template</option>
                                {templates.map((template) => (
                                  <option key={template.id} value={template.templateName}>
                                    {template.templateName}
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Templates Tab */}
                  <TabsContent value="templates">
                    <Card>
                      <CardContent className="pt-6">
                        {templates.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No templates yet</p>
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
                            {templates.map((template) => (
                              <div key={template.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{template.templateName}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{template.bodyText}</p>
                                    {template.headerText && (
                                      <p className="text-xs text-gray-400 mt-1">Header: {template.headerText}</p>
                                    )}
                                    {template.footerText && (
                                      <p className="text-xs text-gray-400">Footer: {template.footerText}</p>
                                    )}
                                  </div>
                                  {template.approved ? (
                                    <Badge className="cg-green-100 text-green-800">Approved</Badge>
                                  ) : (
                                    <Badge variant="outline">Pending</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Webhook Tab */}
                  <TabsContent value="webhook">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="cg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium mb-2">Webhook URL</p>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 text-xs cg-white p-2 rounded border">
                                {`${window.location.origin}${account.webhookEndpoint}`}
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
                            <p className="text-xs text-gray-500 mt-2">
                              Configure this URL in your Meta Developer Console under webhook settings
                            </p>
                          </div>

                          <div className="cg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-blue-700 mb-2">Setup Instructions</h4>
                            <ol className="text-sm text-blue-600 space-y-2 list-decimal list-inside">
                              <li>Go to Meta Developer Console</li>
                              <li>Select your WhatsApp app</li>
                              <li>Go to Webhooks section</li>
                              <li>Add this URL as the callback URL</li>
                              <li>Set verify token as your webhook secret</li>
                              <li>Subscribe to messages and message_deliveries events</li>
                            </ol>
                          </div>

                          {account.metadata?.lastWebhookReceived && (
                            <div className="cg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-green-700">
                                Last webhook received: {new Date(account.metadata.lastWebhookReceived).toLocaleString()}
                              </p>
                            </div>
                          )}

                          {account.metadata?.webhookFailures && account.metadata.webhookFailures > 0 && (
                            <div className="cg-red-50 p-3 rounded-lg">
                              <p className="text-sm text-red-700 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {account.metadata.webhookFailures} webhook failures detected
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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

      {/* Create Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
            <DialogDescription>
              Create a reusable message template for quick replies
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                placeholder="e.g., welcome_message"
                value={templateData.templateName}
                onChange={(e) => setTemplateData({ ...templateData, templateName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Header Text (Optional)</Label>
              <Input
                placeholder="Header for your message"
                value={templateData.headerText}
                onChange={(e) => setTemplateData({ ...templateData, headerText: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Body Text</Label>
              <Textarea
                placeholder="Your message body..."
                rows={4}
                value={templateData.bodyText}
                onChange={(e) => setTemplateData({ ...templateData, bodyText: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Footer Text (Optional)</Label>
              <Input
                placeholder="Footer for your message"
                value={templateData.footerText}
                onChange={(e) => setTemplateData({ ...templateData, footerText: e.target.value })}
              />
            </div>
          </div>

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
    </div>
  );
}