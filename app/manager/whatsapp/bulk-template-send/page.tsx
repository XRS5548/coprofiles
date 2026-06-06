'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Send,
  Loader2,
  Smartphone,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';

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
  language: string;
  category: string | null;
  headerText: string | null;
  bodyText: string;
  footerText: string | null;
  status: string;
  approved: boolean;
}

interface SendResult {
  toNumber: string;
  success: boolean;
  error?: string;
  messageId?: string;
}

export default function BulkTemplateSendPage() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVars, setTemplateVars] = useState<string[]>([]);
  const [recipients, setRecipients] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<SendResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // CSV state
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTemplates();
    }
  }, [selectedAccount]);

  useEffect(() => {
    const template = templates.find(t => t.templateName === selectedTemplate);
    if (template) {
      const matches = template.bodyText.match(/\{\{(\d+)\}\}/g);
      if (matches) {
        const maxVar = Math.max(...matches.map(m => parseInt(m.replace(/\{|\}/g, ''))));
        setTemplateVars(Array(maxVar).fill(''));
      } else {
        setTemplateVars([]);
      }
    } else {
      setTemplateVars([]);
    }
  }, [selectedTemplate, templates]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/manager/whatsapp/accounts', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts);
        if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0].id.toString());
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
    try {
      const response = await fetch(`/api/manager/whatsapp/templates?accountId=${selectedAccount}`, {
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

  const parseRecipients = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        let num = line.replace(/[\s\-\(\)]/g, '');
        if (!num.startsWith('+')) {
          num = '+91' + num;
        }
        return num;
      });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        toast.error('CSV must have a header row and at least one data row');
        return;
      }

      const headers = parseCsvLine(lines[0]);
      const rows = lines.slice(1).map(line => parseCsvLine(line)).filter(row => row.length > 0);

      setCsvRawText(text);
      setCsvHeaders(headers);
      setCsvRows(rows.slice(0, 5));
      setCsvFileName(file.name);
      setSelectedColumn('');
      setCsvDialogOpen(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const applyCsvColumn = () => {
    if (!selectedColumn) {
      toast.error('Please select a column');
      return;
    }
    const colIdx = csvHeaders.indexOf(selectedColumn);
    if (colIdx === -1) return;

    const lines = csvRawText.split('\n').filter(l => l.trim());
    const numbers = lines.slice(1).map(line => {
        const cols = parseCsvLine(line);
        return cols[colIdx] || '';
      }).filter(Boolean);

    setRecipients(prev => {
      const existing = prev ? prev.split('\n').filter(l => l.trim()) : [];
      return [...existing, ...numbers].join('\n');
    });
    setCsvDialogOpen(false);
    setCsvRawText('');
    toast.success(`Added ${numbers.length} numbers from column "${selectedColumn}"`);
  };

  const handleSend = async () => {
    const recipientList = parseRecipients(recipients);
    if (selectedAccount && !selectedTemplate) {
      setSelectedTemplate(templates[0]?.templateName || '');
    }
    if (!selectedAccount) {
      toast.error('Please select a WhatsApp account');
      return;
    }
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }
    if (recipientList.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }
    if (recipientList.length > 500) {
      toast.error('Maximum 500 recipients allowed');
      return;
    }

    setSending(true);
    setShowResults(false);
    setProgress({ current: 0, total: recipientList.length });

    const template = templates.find(t => t.templateName === selectedTemplate);

    try {
      const response = await fetch('/api/manager/whatsapp/bulk-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: parseInt(selectedAccount),
          templateName: selectedTemplate,
          templateVariables: {
            header: template?.headerText ? (document.querySelector<HTMLInputElement>('[data-var="header"]')?.value || '') : undefined,
            body: templateVars.length > 0 ? templateVars : undefined,
          },
          recipients: recipientList,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
        setShowResults(true);
        toast.success(`Sent to ${data.totalSent} recipients`);
        if (data.totalFailed > 0) {
          toast.error(`${data.totalFailed} failed to send`);
        }
      } else {
        toast.error(data.error || 'Failed to send');
      }
    } catch (error) {
      console.error('Error sending:', error);
      toast.error('Failed to send messages');
    } finally {
      setSending(false);
    }
  };

  const downloadResults = () => {
    const csv = [
      ['Phone Number', 'Status', 'Message ID', 'Error'].join(','),
      ...results.map(r => [
        r.toNumber,
        r.success ? 'Sent' : 'Failed',
        r.messageId || '',
        r.error || '',
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-send-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSelectedTemplateData = () => {
    return templates.find(t => t.templateName === selectedTemplate) || null;
  };

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
        <Smartphone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">No WhatsApp Accounts</h2>
        <p className="text-muted-foreground mt-2">Connect a WhatsApp account to send bulk messages</p>
      </div>
    );
  }

  const template = getSelectedTemplateData();
  const recipientList = parseRecipients(recipients);
  const totalSent = results.filter(r => r.success).length;
  const totalFailed = results.filter(r => !r.success).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Template Send</h1>
          <p className="text-muted-foreground mt-1">
            Send WhatsApp templates to multiple recipients at once
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Account & Template Selection */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>WhatsApp Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
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
                </div>
                <div className="space-y-2">
                  <Label>Message Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <FileText className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.filter(t => t.approved).map((t) => (
                        <SelectItem key={t.id} value={t.templateName}>
                          {t.templateName}
                        </SelectItem>
                      ))}
                      {templates.filter(t => t.approved).length === 0 && (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          No approved templates
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {!template && selectedTemplate && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      Template data may take a moment to load
                    </div>
                  )}
                </div>
              </div>

              {/* Template Preview */}
              {template && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{template.templateName}</span>
                        {template.approved && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                        )}
                      </div>
                      <div className="bg-background rounded-lg p-3 shadow-sm border">
                        {template.headerText && (
                          <div className="font-semibold text-foreground mb-2 text-sm">
                            {template.headerText}
                          </div>
                        )}
                        <div className="text-foreground whitespace-pre-wrap text-sm">
                          {template.bodyText.replace(/\{\{\d+\}\}/g, (match) => {
                            const idx = parseInt(match.replace(/\{|\}/g, '')) - 1;
                            return templateVars[idx] || match;
                          })}
                        </div>
                        {template.footerText && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {template.footerText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Template Variables */}
              {templateVars.length > 0 && (
                <div className="space-y-3">
                  <Label>Template Variables</Label>
                  <p className="text-xs text-muted-foreground">
                    These values will be used for all recipients
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {templateVars.map((_, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-xs">{`Variable {{${index + 1}}}`}</Label>
                        <Input
                          placeholder={`Value for {{${index + 1}}}`}
                          value={templateVars[index]}
                          onChange={(e) => {
                            const newVars = [...templateVars];
                            newVars[index] = e.target.value;
                            setTemplateVars(newVars);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {template?.headerText && (
                    <div className="space-y-1">
                      <Label className="text-xs">Header Variable</Label>
                      <Input
                        data-var="header"
                        placeholder="Value for header"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recipients</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    One phone number per line (with or without country code).
                    Numbers without country code will get +91 prefix.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Upload className="h-4 w-4" />
                      Import CSV
                    </div>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                </div>
              </div>
              <Textarea
                placeholder={`+919876543210\n9876543211\n+919876543212`}
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              {recipientList.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {recipientList.length} recipient{recipientList.length !== 1 ? 's' : ''} detected
                  </p>
                  {recipientList.length > 500 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Maximum 500 allowed
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleSend}
            disabled={sending || recipientList.length === 0 || recipientList.length > 500}
          >
            {sending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Sending... {progress.current}/{progress.total}
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send to {recipientList.length} recipient{recipientList.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="text-sm font-medium text-foreground">
                    {accounts.find(a => a.id.toString() === selectedAccount)?.accountName || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Template</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedTemplate || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recipients</span>
                  <span className="text-sm font-medium text-foreground">
                    {recipientList.length}
                  </span>
                </div>
                {showResults && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between text-green-600">
                        <span className="text-sm">Sent</span>
                        <span className="font-semibold">{totalSent}</span>
                      </div>
                      <div className="flex items-center justify-between text-destructive mt-1">
                        <span className="text-sm">Failed</span>
                        <span className="font-semibold">{totalFailed}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {showResults && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Actions</h3>
                <Button variant="outline" className="w-full" onClick={downloadResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Results (CSV)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CSV Column Selector Dialog - FIXED */}
      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Phone Number Column</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
              <FileText className="h-4 w-4" />
              <span>{csvFileName}</span>
              <Badge variant="outline" className="ml-1">{csvRows.length + 1} rows</Badge>
            </div>

            {/* Column Selection */}
            <div className="space-y-2 flex-shrink-0">
              <Label>Choose the column containing phone numbers</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {csvHeaders.map((header, i) => {
                    const sample = csvRows.length > 0 ? csvRows[0][i] || '' : '';
                    return (
                      <SelectItem key={i} value={header}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium">{header}</span>
                          {sample && (
                            <span className="text-xs text-muted-foreground font-mono">e.g. {sample}</span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Preview Table - FIXED with better scrolling and wrapping */}
            <div className="border rounded-lg overflow-auto flex-1 min-h-0">
              <div className="min-w-[500px] w-full">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      {csvHeaders.map((header, i) => (
                        <TableHead 
                          key={i} 
                          className={cn(
                            header === selectedColumn ? 'bg-primary/5' : '',
                            'whitespace-normal break-words'
                          )}
                          style={{ minWidth: '120px', maxWidth: '200px' }}
                        >
                          <div className="flex items-center gap-1">
                            <span className="truncate">{header}</span>
                            {header === selectedColumn && (
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvRows.map((row, ri) => (
                      <TableRow key={ri}>
                        {row.map((cell, ci) => (
                          <TableCell 
                            key={ci} 
                            className={cn(
                              csvHeaders[ci] === selectedColumn ? 'font-mono text-primary font-medium' : 'font-mono',
                              'whitespace-normal break-words'
                            )}
                            style={{ minWidth: '120px', maxWidth: '200px' }}
                          >
                            <div className="break-words">
                              {cell}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {csvRows.length >= 5 && (
              <p className="text-xs text-muted-foreground flex-shrink-0">
                Showing first {csvRows.length} of {csvRows.length}+ rows
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 flex-shrink-0 border-t">
            <Button variant="outline" onClick={() => setCsvDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyCsvColumn} disabled={!selectedColumn}>
              <Eye className="h-4 w-4 mr-2" />
              Add Numbers
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Table */}
      {showResults && results.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message ID</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-mono">{result.toNumber}</TableCell>
                      <TableCell>
                        {result.success ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {result.messageId || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-destructive max-w-[200px] truncate">
                        {result.error || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}