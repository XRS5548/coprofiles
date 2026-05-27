// app/manager/forms/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  Copy,
  Globe,
  Lock,
  Users,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  order: number;
}

const fieldTypes = [
  { value: 'text', label: 'Short Text', icon: '📝' },
  { value: 'textarea', label: 'Paragraph', icon: '📄' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone Number', icon: '📱' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'file', label: 'File Upload', icon: '📎' },
  { value: 'rating', label: 'Rating', icon: '⭐' },
];

export default function CreateFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      name: 'full_name',
      placeholder: 'Enter your full name',
      required: true,
      order: 0,
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
      order: 1,
    },
  ]);

  // Form basic info
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    formType: 'public',
    status: 'draft',
    passkey: '',
    requireAuth: false,
    collectPayment: false,
    paymentAmount: '',
    paymentDescription: '',
    confirmationMessage: '',
    redirectUrl: '',
    sendEmailCopy: false,
    maxSubmissions: '',
    submissionDeadline: '',
  });

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New Field ${fields.length + 1}`,
      name: `field_${fields.length + 1}`,
      placeholder: `Enter ${`field_${fields.length + 1}`}`,
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/manager/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentAmount: formData.collectPayment ? parseFloat(formData.paymentAmount) : null,
          maxSubmissions: formData.maxSubmissions ? parseInt(formData.maxSubmissions) : null,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Form created successfully');
        router.push('/manager/forms');
      } else {
        throw new Error(data.error || 'Failed to create form');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold mt-2">Create New Form</h1>
          <p className="text-muted-foreground mt-1">Build custom forms to collect data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('#', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <Save className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Form Title *</Label>
                <Input
                  placeholder="e.g., Contact Us, Job Application, Feedback Form"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what this form is for..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Form Type</Label>
                  <Select value={formData.formType} onValueChange={(val) => setFormData({ ...formData, formType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Public - Anyone can submit
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Private - Requires passkey
                        </div>
                      </SelectItem>
                      <SelectItem value="authenticated">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Authenticated - Login required
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Initial Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.formType === 'private' && (
                <div className="space-y-2">
                  <Label>Passkey</Label>
                  <Input
                    type="password"
                    placeholder="Enter a passkey to access this form"
                    value={formData.passkey}
                    onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Users will need this passkey to access the form</p>
                </div>
              )}

              {formData.formType === 'authenticated' && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Verify user's email before submission</p>
                  </div>
                  <Switch
                    checked={formData.requireAuth}
                    onCheckedChange={(val) => setFormData({ ...formData, requireAuth: val })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Form Fields</CardTitle>
                <div className="flex gap-2">
                  <Select onValueChange={addField}>
                    <SelectTrigger className="w-[180px]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No fields added yet</p>
                  <Button variant="link" onClick={() => addField('text')}>
                    Add your first field
                  </Button>
                </div>
              ) : (
                fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 relative group">
                    <div className="flex items-start gap-3">
                      <div className="cursor-move text-muted-foreground">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Field label"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                              placeholder="field_name"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            placeholder="Placeholder text"
                          />
                        </div>

                        {(field.type === 'radio' || field.type === 'select' || field.type === 'checkbox') && (
                          <div className="space-y-2">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {(field.options || ['Option 1']).map((option, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(field.options || [])];
                                      newOptions[optIndex] = e.target.value;
                                      updateField(field.id, { options: newOptions });
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newOptions = field.options?.filter((_, i) => i !== optIndex);
                                      updateField(field.id, { options: newOptions });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                                  updateField(field.id, { options: newOptions });
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            />
                            Required field
                          </label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Collect Payment</Label>
                  <p className="text-sm text-muted-foreground">Accept payments via Razorpay</p>
                </div>
                <Switch
                  checked={formData.collectPayment}
                  onCheckedChange={(val) => setFormData({ ...formData, collectPayment: val })}
                />
              </div>

              {formData.collectPayment && (
                <>
                  <div className="space-y-2">
                    <Label>Payment Amount (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 99, 499, 999"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Description</Label>
                    <Input
                      placeholder="What are they paying for?"
                      value={formData.paymentDescription}
                      onChange={(e) => setFormData({ ...formData, paymentDescription: e.target.value })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Confirmation Message</Label>
                <Textarea
                  placeholder="Thank you for your submission!"
                  rows={3}
                  value={formData.confirmationMessage}
                  onChange={(e) => setFormData({ ...formData, confirmationMessage: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Redirect URL (Optional)</Label>
                <Input
                  placeholder="https://example.com/thank-you"
                  value={formData.redirectUrl}
                  onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Submissions</Label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={formData.maxSubmissions}
                    onChange={(e) => setFormData({ ...formData, maxSubmissions: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Submission Deadline</Label>
                  <Input
                    type="datetime-local"
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Send Email Copy</Label>
                  <p className="text-sm text-muted-foreground">Send a copy of submission to submitter</p>
                </div>
                <Switch
                  checked={formData.sendEmailCopy}
                  onCheckedChange={(val) => setFormData({ ...formData, sendEmailCopy: val })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formData.title || 'Form Title'}</h3>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                    )}
                  </div>
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-sm">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={field.placeholder} disabled className="bg-background" />
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2">
                          <input type="checkbox" disabled />
                          <span className="text-sm">{field.placeholder}</span>
                        </div>
                      ) : (
                        <Input placeholder={field.placeholder} disabled className="bg-background" />
                      )}
                      {field.helpText && (
                        <p className="text-xs text-muted-foreground">{field.helpText}</p>
                      )}
                    </div>
                  ))}
                  {formData.collectPayment && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Payment Required: ₹{formData.paymentAmount}</span>
                      </div>
                      {formData.paymentDescription && (
                        <p className="text-sm text-muted-foreground mt-1">{formData.paymentDescription}</p>
                      )}
                    </div>
                  )}
                  <Button disabled className="w-full">Submit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}