// app/manager/forms/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Globe,
  Lock,
  Users,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Copy,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FormField {
  id?: number;
  formId?: number;
  fieldLabel: string;
  fieldName: string;
  fieldType: string;
  placeholder: string | null;
  helpText: string | null;
  isRequired: boolean;
  order: number;
  options: any[] | null;
  validation: any | null;
  conditionalLogic: any | null;
  appearance: any | null;
}

interface Form {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  formType: string;
  status: string;
  passkey: string | null;
  requireAuth: boolean;
  collectPayment: boolean;
  paymentAmount: number | null;
  paymentDescription: string | null;
  confirmationMessage: string | null;
  redirectUrl: string | null;
  sendEmailCopy: boolean;
  maxSubmissions: number | null;
  submissionDeadline: string | null;
  createdAt: string;
  updatedAt: string;
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

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);

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

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/manager/forms/${formId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setForm(data.form);
        setFields(data.fields || []);
        setFormData({
          title: data.form.title,
          description: data.form.description || '',
          formType: data.form.formType,
          status: data.form.status,
          passkey: data.form.passkey || '',
          requireAuth: data.form.requireAuth,
          collectPayment: data.form.collectPayment,
          paymentAmount: data.form.paymentAmount ? (data.form.paymentAmount / 100).toString() : '',
          paymentDescription: data.form.paymentDescription || '',
          confirmationMessage: data.form.confirmationMessage || '',
          redirectUrl: data.form.redirectUrl || '',
          sendEmailCopy: data.form.sendEmailCopy,
          maxSubmissions: data.form.maxSubmissions?.toString() || '',
          submissionDeadline: data.form.submissionDeadline?.split('T')[0] || '',
        });
      } else {
        toast.error(data.error || 'Failed to load form');
        router.push('/manager/forms');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newField: FormField = {
      fieldLabel: `New Field ${fields.length + 1}`,
      fieldName: `field_${fields.length + 1}_${Date.now()}`,
      fieldType: 'text',
      placeholder: null,
      helpText: null,
      isRequired: false,
      order: fields.length,
      options: null,
      validation: null,
      conditionalLogic: null,
      appearance: null,
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    setSaving(true);
    try {
      // Update form basic info
      const formResponse = await fetch(`/api/manager/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentAmount: formData.collectPayment ? parseFloat(formData.paymentAmount) : null,
          maxSubmissions: formData.maxSubmissions ? parseInt(formData.maxSubmissions) : null,
        }),
        credentials: 'include',
      });

      if (!formResponse.ok) {
        throw new Error('Failed to update form');
      }

      // Update fields
      const fieldsResponse = await fetch(`/api/manager/forms/${formId}/fields`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
        credentials: 'include',
      });

      if (!fieldsResponse.ok) {
        throw new Error('Failed to update fields');
      }

      toast.success('Form updated successfully');
      router.push('/manager/forms');
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Failed to update form');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/manager/forms/${formId}/publish`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Form published successfully');
        fetchForm();
      } else {
        throw new Error(data.error || 'Failed to publish form');
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      toast.error('Failed to publish form');
    } finally {
      setSaving(false);
    }
  };

  const getFormUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/forms/${form?.slug}`;
    }
    return '';
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
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold mt-2">Edit Form</h1>
          <p className="text-muted-foreground mt-1">{form?.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(getFormUrl(), '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {form?.status !== 'active' && (
            <Button variant="outline" onClick={handlePublish} disabled={saving}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="fields">Form Fields ({fields.length})</TabsTrigger>
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
                  <Label>Form URL</Label>
                  <Input value={getFormUrl()} readOnly className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Share this link with users</p>
                </div>

                <div className="space-y-2">
                  <Label>Form Status</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Form Type</Label>
                  <Select value={formData.formType} onValueChange={(val) => setFormData({ ...formData, formType: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can submit</SelectItem>
                      <SelectItem value="private">Private - Requires passkey</SelectItem>
                      <SelectItem value="authenticated">Authenticated - Login required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.formType === 'private' && (
                  <div className="space-y-2">
                    <Label>Passkey</Label>
                    <Input
                      type="password"
                      placeholder="Enter passkey"
                      value={formData.passkey}
                      onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Form Fields</CardTitle>
                <Button onClick={addField} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No fields added yet</p>
                  <Button variant="link" onClick={addField}>
                    Add your first field
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={index} className="border rounded-lg p-4 relative group">
                      <div className="flex items-start gap-3">
                        <div className="cursor-move text-muted-foreground">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label>Field Label</Label>
                              <Input
                                value={field.fieldLabel}
                                onChange={(e) => updateField(index, { fieldLabel: e.target.value })}
                                placeholder="Field label"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Field Name</Label>
                              <Input
                                value={field.fieldName}
                                onChange={(e) => updateField(index, { fieldName: e.target.value })}
                                placeholder="field_name"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label>Field Type</Label>
                              <Select
                                value={field.fieldType}
                                onValueChange={(val) => updateField(index, { fieldType: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.icon} {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label>Placeholder</Label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                placeholder="Placeholder text"
                              />
                            </div>
                          </div>

                          {(field.fieldType === 'radio' || field.fieldType === 'select' || field.fieldType === 'checkbox') && (
                            <div className="space-y-2">
                              <Label>Options</Label>
                              <div className="space-y-2">
                                {(field.options || ['Option 1']).map((option, optIndex) => (
                                  <div key={optIndex} className="flex gap-2">
                                    <Input
                                      value={typeof option === 'string' ? option : option.label}
                                      onChange={(e) => {
                                        const newOptions = [...(field.options || [])];
                                        newOptions[optIndex] = typeof option === 'string' ? e.target.value : { ...option, label: e.target.value };
                                        updateField(index, { options: newOptions });
                                      }}
                                      placeholder={`Option ${optIndex + 1}`}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const newOptions = field.options?.filter((_, i) => i !== optIndex);
                                        updateField(index, { options: newOptions });
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
                                    updateField(index, { options: newOptions });
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
                                checked={field.isRequired}
                                onChange={(e) => updateField(index, { isRequired: e.target.checked })}
                              />
                              Required field
                            </label>
                          </div>

                          <div className="space-y-1">
                            <Label>Help Text (Optional)</Label>
                            <Input
                              value={field.helpText || ''}
                              onChange={(e) => updateField(index, { helpText: e.target.value })}
                              placeholder="Additional help text for this field"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}