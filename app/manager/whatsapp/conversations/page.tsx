// app/manager/whatsapp/conversations/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  CheckCheck,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Download,
  Image,
  File,
  Video,
  Music,
  MapPin,
  User,
  Building2,
  Plus,
  XCircle,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Conversation {
  id: number;
  whatsappAccountId: number;
  customerNumber: string;
  customerName: string | null;
  customerProfile: {
    name?: string;
    avatar?: string;
    lastSeen?: string;
  } | null;
  totalMessages: number;
  unreadCount: number;
  lastMessageAt: string;
  lastMessagePreview: string | null;
  isActive: boolean;
  assignedTo: number | null;
  tags: string[];
  metadata: {
    firstContact?: string;
    lastContact?: string;
    notes?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: number;
  messageId: string;
  waMessageId: string | null;
  fromNumber: string;
  toNumber: string;
  messageType: string;
  direction: 'incoming' | 'outgoing';
  status: string;
  textBody: string | null;
  mediaUrl: string | null;
  mediaId: string | null;
  mediaMimeType: string | null;
  caption: string | null;
  interactiveData: any | null;
  templateData: any | null;
  locationData: any | null;
  contactData: any | null;
  metadata: any | null;
  repliedTo: number | null;
  replyToMessageId: string | null;
  createdAt: string;
  deliveredAt: string | null;
  readAt: string | null;
}

interface WhatsAppAccount {
  id: number;
  accountName: string;
  phoneNumber: string;
  status: string;
  verified: boolean;
}

export default function WhatsAppConversationsPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchConversations();
    }
  }, [selectedAccount, statusFilter]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      // Mark as read
      markConversationAsRead();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchConversations = async () => {
    if (!selectedAccount) return;
    
    try {
      const response = await fetch(`/api/manager/whatsapp/conversations?accountId=${selectedAccount.id}&status=${statusFilter}&search=${searchTerm}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation || !selectedAccount) return;
    
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/manager/whatsapp/messages?accountId=${selectedAccount.id}&customerNumber=${selectedConversation.customerNumber}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const markConversationAsRead = async () => {
    if (!selectedConversation) return;
    
    try {
      await fetch('/api/manager/whatsapp/conversations/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
        }),
        credentials: 'include',
      });
      
      // Update local state
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, unreadCount: 0 }
          : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !selectedAccount) return;
    
    setSendingMessage(true);
    try {
      const response = await fetch('/api/manager/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          toNumber: selectedConversation.customerNumber,
          message: newMessage,
          messageType: 'text',
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        fetchMessages();
        fetchConversations();
        toast.success('Message sent');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return format(date, 'h:mm a');
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
      case 'contact':
        return <User className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (statusFilter === 'unread' && conv.unreadCount === 0) return false;
    if (statusFilter === 'read' && conv.unreadCount > 0) return false;
    return true;
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
        <p className="text-gray-500 mt-2">Connect a WhatsApp account to start messaging</p>
        <Button onClick={() => router.push('/manager/whatsapp/accounts')} className="mt-4">
          Connect Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Conversations</h1>
          <p className="text-gray-500 mt-1">Manage all your customer conversations</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedAccount?.id.toString()}
            onValueChange={(val) => {
              const account = accounts.find(a => a.id.toString() === val);
              setSelectedAccount(account || null);
              setSelectedConversation(null);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {account.accountName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchConversations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Conversations List */}
        <Card className="w-96 flex flex-col flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conv.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {conv.customerName?.charAt(0) || conv.customerNumber.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {conv.customerName || conv.customerNumber}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessagePreview || 'No messages'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-green-500 text-white text-xs">
                              {conv.unreadCount} new
                            </Badge>
                          )}
                          {conv.tags?.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {selectedConversation.customerName?.charAt(0) || selectedConversation.customerNumber.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedConversation.customerName || selectedConversation.customerNumber}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.customerNumber}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowDetails(!showDetails)}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.direction === 'outgoing'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.messageType !== 'text' && (
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageTypeIcon(msg.messageType)}
                            <span className="text-xs opacity-75 capitalize">{msg.messageType}</span>
                          </div>
                        )}
                        <p className="text-sm break-words">{msg.textBody || msg.caption || 'Media message'}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-75">
                            {formatTime(msg.createdAt)}
                          </span>
                          {msg.direction === 'outgoing' && getMessageStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex-shrink-0">
                {replyTo && (
                  <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Replying to:</p>
                      <p className="text-sm truncate">{replyTo.textBody?.substring(0, 50)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={sendingMessage || !newMessage.trim()}>
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">Select a conversation</h3>
                <p className="text-gray-400 mt-1">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>

        {/* Customer Details Sidebar */}
        {showDetails && selectedConversation && (
          <Card className="w-80 flex-shrink-0 overflow-y-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Customer Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarFallback className="bg-green-100 text-green-600 text-2xl">
                    {selectedConversation.customerName?.charAt(0) || selectedConversation.customerNumber.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mt-2">{selectedConversation.customerName || 'Unknown'}</h3>
                <p className="text-sm text-gray-500">{selectedConversation.customerNumber}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedConversation.customerNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>First contact: {format(new Date(selectedConversation.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Last active: {formatTime(selectedConversation.lastMessageAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span>Total messages: {selectedConversation.totalMessages}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-7">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                  {selectedConversation.metadata?.notes || 'No notes added yet'}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Edit className="h-3 w-3 mr-1" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}