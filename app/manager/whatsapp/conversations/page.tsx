// app/manager/whatsapp/conversations/page.tsx - Fixed with proper theme support
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  CheckCheck,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  File,
  Video,
  Music,
  MapPin,
  User,
  XCircle,
  Edit,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

function MediaImagePreview({ message }: { message: Message }) {
  const [failed, setFailed] = useState(false);
  const src = message.mediaId
    ? `/api/manager/whatsapp/media?messageId=${message.id}`
    : message.mediaUrl;

  if (!src || failed) {
    return (
      <div className="mb-2 flex min-h-28 items-center justify-center rounded-md border border-border/60 bg-background/40 px-4 py-6 text-xs opacity-75">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={message.caption || 'WhatsApp image'}
      className="mb-2 max-h-72 w-full rounded-md object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
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
  const [showDetails, setShowDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      markConversationAsRead();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversation) {
        fetchMessages();
      }
      if (selectedAccount) {
        fetchConversations();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedConversation, selectedAccount]);

  async function fetchAccounts() {
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
  }

  async function fetchConversations() {
    if (!selectedAccount) return;
    
    try {
      const response = await fetch(`/api/manager/whatsapp/conversations?accountId=${selectedAccount.id}&status=${statusFilter}&search=${searchTerm}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }

  async function fetchMessages() {
    if (!selectedConversation || !selectedAccount) return;
    
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/manager/whatsapp/messages?accountId=${selectedAccount.id}&customerNumber=${selectedConversation.customerNumber}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  }

  async function markConversationAsRead() {
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
      
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, unreadCount: 0 }
          : c
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

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
        await fetchMessages();
        await fetchConversations();
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    if (selectedConversation) {
      await fetchMessages();
    }
    setRefreshing(false);
    toast.success('Refreshed');
  };

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

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
        return <CheckCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-500 dark:text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500 dark:text-blue-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No WhatsApp Accounts</h2>
        <p className="text-muted-foreground mt-2">Connect a WhatsApp account to start messaging</p>
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
          <h1 className="text-2xl font-bold text-foreground">WhatsApp Conversations</h1>
          <p className="text-muted-foreground mt-1">Manage all your customer conversations</p>
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
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Conversations List */}
        <Card className="w-96 flex flex-col flex-shrink-0 border-border">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "p-3 cursor-pointer transition-colors",
                      selectedConversation?.id === conv.id 
                        ? "bg-muted" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conv.customerName?.charAt(0) || conv.customerNumber.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">
                            {conv.customerName || conv.customerNumber}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessagePreview || 'No messages'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-green-500 text-white text-xs">
                              {conv.unreadCount} new
                            </Badge>
                          )}
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
        <Card className="flex-1 flex flex-col overflow-hidden border-border">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b flex-shrink-0 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedConversation.customerName?.charAt(0) || selectedConversation.customerNumber.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedConversation.customerName || selectedConversation.customerNumber}
                      </h3>
                      <p className="text-xs text-muted-foreground">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.direction === 'outgoing' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          msg.direction === 'outgoing'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        {msg.messageType !== 'text' && (
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageTypeIcon(msg.messageType)}
                            <span className="text-xs opacity-75 capitalize">{msg.messageType}</span>
                          </div>
                        )}
                        {msg.messageType === 'image' && <MediaImagePreview message={msg} />}
                        {(msg.textBody || msg.caption || msg.messageType !== 'image') && (
                          <p className="text-sm break-words whitespace-pre-wrap">
                            {msg.textBody || msg.caption || 'Media message'}
                          </p>
                        )}
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
              <div className="p-4 border-t flex-shrink-0 border-border bg-background">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
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
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">Select a conversation</h3>
                <p className="text-muted-foreground mt-1">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>

        {/* Customer Details Sidebar */}
        {showDetails && selectedConversation && (
          <Card className="w-80 flex-shrink-0 overflow-y-auto border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Customer Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {selectedConversation.customerName?.charAt(0) || selectedConversation.customerNumber.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-foreground mt-2">
                  {selectedConversation.customerName || 'Unknown'}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedConversation.customerNumber}</p>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedConversation.customerNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    First contact: {format(new Date(selectedConversation.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Last active: {formatTime(selectedConversation.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Total messages: {selectedConversation.totalMessages}
                  </span>
                </div>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Tags</h4>
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
                <h4 className="text-sm font-semibold text-foreground mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded-lg">
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
