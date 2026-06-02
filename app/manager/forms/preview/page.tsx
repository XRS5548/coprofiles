// app/manager/forms/preview/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/ui/rating';
import { ArrowLeft, Eye, Upload, AlertCircle, FileText } from 'lucide-react';
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

interface PreviewData {
    formData: FormData;
    fields: FormField[];
}

export default function FormPreviewPage() {
    const router = useRouter();
    const [data, setData] = useState<PreviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('preview_form');
            if (stored) {
                const parsed = JSON.parse(stored) as PreviewData;
                setData(parsed);
                localStorage.removeItem('preview_form');
            }
        } catch (error) {
            console.error('Error reading preview data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.name,
            placeholder: field.placeholder || undefined,
            disabled: true,
            className: cn(
                'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                'disabled:cursor-not-allowed disabled:opacity-50'
            ),
        };

        switch (field.type) {
            case 'textarea':
                return <Textarea {...commonProps} rows={4} />;

            case 'email':
                return <Input {...commonProps} type="email" />;

            case 'phone':
                return <Input {...commonProps} type="tel" />;

            case 'number':
                return <Input {...commonProps} type="number" />;

            case 'date':
                return <Input {...commonProps} type="date" />;

            case 'checkbox': {
                const options = field.options || [];
                if (options.length === 0) {
                    return (
                        <div className="flex items-start gap-3 rounded-md border p-3 opacity-50">
                            <input type="checkbox" id={field.name} disabled className="mt-1 h-4 w-4 shrink-0" />
                            <Label htmlFor={field.name} className="text-sm font-normal leading-5 opacity-50">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                        </div>
                    );
                }
                return (
                    <div className="space-y-3 pt-1">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`${field.name}-${index}`}
                                    disabled
                                    className="h-4 w-4 rounded border-gray-300 opacity-50"
                                />
                                <Label htmlFor={`${field.name}-${index}`} className="text-sm font-normal opacity-50">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );
            }

            case 'radio': {
                const options = field.options || [];
                return (
                    <div className="space-y-2 pt-1">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id={`${field.name}-${index}`}
                                    name={field.name}
                                    disabled
                                    className="h-4 w-4 border-gray-300 opacity-50"
                                />
                                <Label htmlFor={`${field.name}-${index}`} className="text-sm font-normal opacity-50">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                );
            }

            case 'select': {
                const options = field.options || [];
                return (
                    <select {...commonProps}>
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            }

            case 'rating':
                return <Rating value={0} onChange={() => {}} disabled />;

            case 'file':
                return (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center opacity-50">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click or drag file to upload</p>
                    </div>
                );

            default:
                return <Input {...commonProps} type="text" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="animate-pulse text-muted-foreground">Loading preview...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Preview Data</h2>
                        <p className="text-muted-foreground mb-6">
                            No form data found. Please create a form first before previewing.
                        </p>
                        <Button onClick={() => router.push('/manager/forms/create')} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Editor
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { formData, fields } = data;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="container max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            localStorage.setItem('preview_form', JSON.stringify(data));
                            router.push('/manager/forms/create');
                        }}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Editor
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        Preview Mode
                    </div>
                </div>

                {/* Preview Banner */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <FileText className="h-4 w-4 shrink-0" />
                    This is a preview. Fields are disabled and no data will be saved.
                </div>

                {/* Form Preview */}
                <Card className="shadow-lg">
                    <CardContent className="p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {formData.title || 'Untitled Form'}
                            </h1>
                            {formData.description && (
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    {formData.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-6">
                            {fields.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                                    <p>No fields added yet. Go back to the editor to add form fields.</p>
                                </div>
                            ) : (
                                fields
                                    .sort((a, b) => a.order - b.order)
                                    .map((field) => (
                                        <div key={field.id} className="space-y-2">
                                            {!(field.type === 'checkbox' && (field.options || []).length === 0) && (
                                                <Label htmlFor={field.name} className="text-base font-medium">
                                                    {field.label}
                                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                                </Label>
                                            )}

                                            {renderField(field)}

                                            {field.helpText && (
                                                <p className="text-xs text-gray-500">{field.helpText}</p>
                                            )}
                                        </div>
                                    ))
                            )}
                        </div>

                        {fields.length > 0 && (
                            <div className="mt-8">
                                <Button className="w-full" disabled>
                                    Submit
                                </Button>
                            </div>
                        )}

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Powered by Coprofiles
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
