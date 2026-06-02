// app/manager/forms/create/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Settings2,
  LayoutTemplate,
  Info,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormData {
  title: string;
  description: string;
  formType: 'public' | 'private' | 'authenticated';
  status: 'draft' | 'active' | 'paused';
  passkey: string;
  requireAuth: boolean;
  collectPayment: boolean;
  paymentAmount: string;
  paymentDescription: string;
  confirmationMessage: string;
  redirectUrl: string;
  sendEmailCopy: boolean;
  maxSubmissions: string;
  submissionDeadline: string;
}

const fieldTypes = [
  { value: 'text', label: 'Short Text', icon: '📝', description: 'Single line text input' },
  { value: 'textarea', label: 'Paragraph', icon: '📄', description: 'Multi-line text input' },
  { value: 'email', label: 'Email', icon: '📧', description: 'Email address with validation' },
  { value: 'phone', label: 'Phone Number', icon: '📱', description: 'Phone number input' },
  { value: 'number', label: 'Number', icon: '🔢', description: 'Numeric input' },
  { value: 'date', label: 'Date', icon: '📅', description: 'Date picker' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Single or multiple selection' },
  { value: 'radio', label: 'Radio Buttons', icon: '🔘', description: 'Single selection' },
  { value: 'select', label: 'Dropdown', icon: '📋', description: 'Dropdown selection' },
  { value: 'file', label: 'File Upload', icon: '📎', description: 'Allow file attachments' },
  { value: 'rating', label: 'Rating', icon: '⭐', description: 'Star rating input' },
];

// Sortable Field Item Component
function SortableFieldItem({ 
  field, 
  index, 
  onUpdate, 
  onRemove,
  isExpanded,
  onToggleExpand 
}: { 
  field: FormField; 
  index: number;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onRemove: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-lg bg-card transition-all",
        isDragging && "shadow-lg ring-2 ring-primary",
        !isExpanded && "hover:shadow-sm"
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{fieldTypes.find(t => t.value === field.type)?.icon}</span>
              <span className="font-medium truncate">{field.label || 'Untitled Field'}</span>
              {field.required && (
                <span className="text-xs bg-red-100 dark:bg-red-950 text-red-600 px-1.5 py-0.5 rounded">Required</span>
              )}
              <span className="text-xs text-muted-foreground">
                {fieldTypes.find(t => t.value === field.type)?.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {field.name || 'field_name'} • {field.placeholder || 'No placeholder'}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(field.id)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(field.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Field Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                  placeholder="e.g., Full Name"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Field Name (ID)</Label>
                <Input
                  value={field.name}
                  onChange={(e) => onUpdate(field.id, { name: e.target.value })}
                  placeholder="field_name"
                  className="h-9 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Unique identifier for this field</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Placeholder Text</Label>
              <Input
                value={field.placeholder}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                placeholder="Enter text here..."
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Help Text</Label>
              <Input
                value={field.helpText || ''}
                onChange={(e) => onUpdate(field.id, { helpText: e.target.value })}
                placeholder="Additional instructions for users"
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">Shown below the field for guidance</p>
            </div>

            {(field.type === 'radio' || field.type === 'select' || field.type === 'checkbox') && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Options</Label>
                <div className="space-y-2">
                  {(field.options || ['Option 1']).map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[optIndex] = e.target.value;
                            onUpdate(field.id, { options: newOptions });
                          }}
                          placeholder={`Option ${optIndex + 1}`}
                          className="h-9"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = field.options?.filter((_, i) => i !== optIndex);
                          onUpdate(field.id, { options: newOptions || [] });
                        }}
                        className="h-9 w-9 p-0 text-red-500"
                        disabled={(field.options?.length || 0) <= 1}
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
                      onUpdate(field.id, { options: newOptions });
                    }}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Required field
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  
  const [fields, setFields] = useState<FormField[]>([
    {
      id: crypto.randomUUID(),
      type: 'text',
      label: 'Full Name',
      name: 'full_name',
      placeholder: 'Enter your full name',
      required: true,
      order: 0,
    },
    {
      id: crypto.randomUUID(),
      type: 'email',
      label: 'Email Address',
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
      order: 1,
    },
  ]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    formType: 'public',
    status: 'draft',
    passkey: '',
    requireAuth: false,
    collectPayment: false,
    paymentAmount: '',
    paymentDescription: '',
    confirmationMessage: 'Thank you for your submission!',
    redirectUrl: '',
    sendEmailCopy: false,
    maxSubmissions: '',
    submissionDeadline: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleFieldExpand = (id: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addField = (type: string) => {
    const typeInfo = fieldTypes.find(t => t.value === type);
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${typeInfo?.label || 'Field'}`,
      name: `field_${fields.length + 1}`,
      placeholder: `Enter ${typeInfo?.label?.toLowerCase() || 'value'}`,
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
    setExpandedFields(prev => new Set(prev).add(newField.id));
    toast.success(`${typeInfo?.label} field added`);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.info('Field removed');
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Please enter a form title');
      return false;
    }

    if (formData.formType === 'private' && !formData.passkey.trim()) {
      toast.error('Please enter a passkey for private form');
      return false;
    }

    if (formData.collectPayment) {
      const amount = parseFloat(formData.paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid payment amount');
        return false;
      }
    }

    const duplicateNames = fields.map(f => f.name).filter((name, i, arr) => arr.indexOf(name) !== i);
    if (duplicateNames.length > 0) {
      toast.error(`Duplicate field names found: ${duplicateNames.join(', ')}`);
      return false;
    }

    if (fields.length === 0) {
      toast.error('Please add at least one form field');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/manager/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fields: fields.map(f => ({
            fieldLabel: f.label,
            fieldName: f.name,
            fieldType: f.type,
            placeholder: f.placeholder,
            helpText: f.helpText,
            isRequired: f.required,
            options: f.options,
            validation: f.validation,
          })),
          paymentAmount: formData.collectPayment ? parseFloat(formData.paymentAmount) : null,
          maxSubmissions: formData.maxSubmissions ? parseInt(formData.maxSubmissions) : null,
          submissionDeadline: formData.submissionDeadline || null,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Form created successfully!');
        router.push('/manager/forms');
      } else {
        throw new Error(data.error || 'Failed to create form');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    localStorage.setItem('preview_form', JSON.stringify({ formData, fields }));
    window.open('/manager/forms/preview', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="-ml-2 mb-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Create New Form
              </h1>
              <p className="text-muted-foreground mt-1">Build custom forms to collect data from your users</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                disabled={fields.length === 0}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="gap-2 "
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                {loading ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="basic" className="gap-2">
              <Info className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="fields" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Form Fields
              {fields.length > 0 && (
                <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5">
                  {fields.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Form Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Form Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Contact Us, Job Application, Feedback Form"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-lg h-12"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Description</Label>
                  <Textarea
                    placeholder="Describe what this form is for and any instructions for users..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">This will be shown at the top of your form</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Form Type</Label>
                    <Select value={formData.formType} onValueChange={(val: any) => setFormData({ ...formData, formType: val })}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-3 py-1">
                            <Globe className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="font-medium">Public</p>
                              <p className="text-xs text-muted-foreground">Anyone with the link can submit</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-3 py-1">
                            <Lock className="h-4 w-4 text-yellow-500" />
                            <div>
                              <p className="font-medium">Private</p>
                              <p className="text-xs text-muted-foreground">Requires a passkey to access</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="authenticated">
                          <div className="flex items-center gap-3 py-1">
                            <Users className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="font-medium">Authenticated</p>
                              <p className="text-xs text-muted-foreground">Only logged-in users can submit</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Form Status</Label>
                    <Select value={formData.status} onValueChange={(val: any) => setFormData({ ...formData, status: val })}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Draft - Not yet published
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Active - Ready to accept submissions
                          </div>
                        </SelectItem>
                        <SelectItem value="paused">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            Paused - Temporarily unavailable
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.formType === 'private' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <Label className="text-base font-semibold">Passkey</Label>
                    <Input
                      type="password"
                      placeholder="Enter a secure passkey"
                      value={formData.passkey}
                      onChange={(e) => setFormData({ ...formData, passkey: e.target.value })}
                      className="h-11 font-mono"
                    />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <HelpCircle className="h-3 w-3 mt-0.5" />
                      <span>Users will need this passkey to access and submit the form</span>
                    </div>
                  </div>
                )}

                {formData.formType === 'authenticated' && (
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-blue-50/30 dark:bg-blue-950/20">
                    <div>
                      <Label className="text-base font-semibold">Email Verification</Label>
                      <p className="text-sm text-muted-foreground">Verify user's email address before allowing submission</p>
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
          <TabsContent value="fields" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <LayoutTemplate className="h-5 w-5 text-blue-500" />
                    Form Fields
                  </CardTitle>
                  <Select onValueChange={addField}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{type.icon}</span>
                            <div>
                              <p>{type.label}</p>
                              <p className="text-xs text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {fields.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No fields added yet</h3>
                    <p className="text-muted-foreground mb-4">Start building your form by adding your first field</p>
                    <Button onClick={() => addField('text')} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add your first field
                    </Button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={fields.map(f => f.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <SortableFieldItem
                            key={field.id}
                            field={field}
                            index={index}
                            onUpdate={updateField}
                            onRemove={removeField}
                            isExpanded={expandedFields.has(field.id)}
                            onToggleExpand={toggleFieldExpand}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Payment Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base font-semibold">Collect Payment</Label>
                    <p className="text-sm text-muted-foreground">Accept payments via Razorpay payment gateway</p>
                  </div>
                  <Switch
                    checked={formData.collectPayment}
                    onCheckedChange={(val) => setFormData({ ...formData, collectPayment: val })}
                  />
                </div>

                {formData.collectPayment && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Payment Amount (₹)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 99, 499, 999"
                          value={formData.paymentAmount}
                          onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Description</Label>
                        <Input
                          placeholder="What are they paying for?"
                          value={formData.paymentDescription}
                          onChange={(e) => setFormData({ ...formData, paymentDescription: e.target.value })}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submission Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-gray-50/50 dark:bg-gray-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Submission Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label>Confirmation Message</Label>
                  <Textarea
                    placeholder="Thank you for your submission!"
                    rows={3}
                    value={formData.confirmationMessage}
                    onChange={(e) => setFormData({ ...formData, confirmationMessage: e.target.value })}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Shown to users after successful submission</p>
                </div>

                <div className="space-y-2">
                  <Label>Redirect URL (Optional)</Label>
                  <Input
                    placeholder="https://example.com/thank-you"
                    value={formData.redirectUrl}
                    onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">Redirect users to a custom URL after submission</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Submissions</Label>
                    <Input
                      type="number"
                      placeholder="Unlimited"
                      value={formData.maxSubmissions}
                      onChange={(e) => setFormData({ ...formData, maxSubmissions: e.target.value })}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty for unlimited submissions</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Submission Deadline</Label>
                    <Input
                      type="datetime-local"
                      value={formData.submissionDeadline}
                      onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">Form will close after this date and time</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base font-semibold">Send Email Copy</Label>
                    <p className="text-sm text-muted-foreground">Send a copy of submission to the submitter's email</p>
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
    </div>
  );
}