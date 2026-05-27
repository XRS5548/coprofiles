// app/forms/[slug]/page.tsx - Complete Fixed Version

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Rating } from '@/components/ui/rating';
import {
    Loader2,
    Lock,
    DollarSign,
    CheckCircle,
    AlertCircle,
    Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface FormField {
    id: number;
    fieldLabel: string;
    fieldName: string;
    fieldType: string;
    placeholder: string | null;
    helpText: string | null;
    isRequired: boolean;
    order: number;
    options: any[] | null;
    validation: any | null;
}

interface Form {
    id: number;
    title: string;
    description: string | null;
    slug: string;
    formType: string;
    status: string;
    collectPayment: boolean;
    paymentAmount: number | null;
    paymentDescription: string | null;
    confirmationMessage: string | null;
    redirectUrl: string | null;
    maxSubmissions: number | null;
    submissionCount?: number;
    submissionDeadline: string | null;
}

export default function PublicFormPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [form, setForm] = useState<Form | null>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passkey, setPasskey] = useState('');
    const [passkeyVerified, setPasskeyVerified] = useState(false);
    const [passkeyError, setPasskeyError] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        fetchForm();
    }, [slug]);

    // Helper function to parse options (handles both string and array formats)
    const parseOptions = (options: any): any[] => {
        if (!options) return [];

        // If options is already an array
        if (Array.isArray(options)) {
            return options;
        }

        // If options is a string, try to parse it as JSON
        if (typeof options === 'string') {
            try {
                const parsed = JSON.parse(options);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                // If not valid JSON, split by comma
                return options.split(',').map(opt => opt.trim());
            }
        }

        return [];
    };

    const fetchForm = async () => {
        try {
            const response = await fetch(`/api/forms/${slug}`);
            const data = await response.json();

            if (data.success) {
                setForm(data.form);
                setFields(data.fields || []);

                const initialData: Record<string, any> = {};
                (data.fields || []).forEach((field: FormField) => {
                    if (field.fieldType === 'checkbox') {
                        // Check if it's a multiple checkbox field (has options array)
                        const options = parseOptions(field.options);
                        if (options.length > 0) {
                            initialData[field.fieldName] = []; // Initialize as empty array for multiple checkboxes
                        } else {
                            initialData[field.fieldName] = false; // Initialize as false for single checkbox
                        }
                    } else if (field.fieldType === 'radio' || field.fieldType === 'select') {
                        initialData[field.fieldName] = '';
                    } else {
                        initialData[field.fieldName] = '';
                    }
                });
                setFormData(initialData);
            } else {
                toast.error(data.error || 'Form not found');
            }
        } catch (error) {
            console.error('Error fetching form:', error);
            toast.error('Failed to load form');
        } finally {
            setLoading(false);
        }
    };

    const verifyPasskey = async () => {
        if (!passkey) {
            setPasskeyError('Please enter passkey');
            return;
        }

        try {
            const response = await fetch(`/api/forms/${slug}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passkey }),
            });
            const data = await response.json();
            if (data.success) {
                setPasskeyVerified(true);
                setPasskeyError('');
            } else {
                setPasskeyError(data.error || 'Invalid passkey');
            }
        } catch (error) {
            setPasskeyError('Failed to verify passkey');
        }
    };

    const validateField = (field: FormField, value: any): string => {
        if (!field.isRequired) return '';

        if (field.fieldType === 'checkbox') {
            // Handle both single checkbox (boolean) and multiple checkboxes (array)
            const options = parseOptions(field.options);
            if (options.length > 0) {
                // Multiple checkboxes - check if array has any items
                const isChecked = Array.isArray(value) && value.length > 0;
                if (!isChecked) {
                    return `${field.fieldLabel} is required (select at least one option)`;
                }
            } else {
                // Single checkbox
                const isChecked = value === true || value === 'true' || value === 'on' || value === 1 || value === 'yes';
                if (!isChecked) {
                    return `${field.fieldLabel} is required`;
                }
            }
        } else if (field.fieldType === 'radio') {
            if (!value || (typeof value === 'string' && !value.trim())) {
                return `${field.fieldLabel} is required`;
            }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
            return `${field.fieldLabel} is required`;
        }
        return '';
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        for (const field of fields) {
            const error = validateField(field, formData[field.fieldName]);
            if (error) {
                newErrors[field.fieldName] = error;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const initiateRazorpayPayment = async (orderData: any) => {
        setProcessingPayment(true);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: form?.title,
            description: form?.paymentDescription || 'Payment for form submission',
            order_id: orderData.orderId,
            prefill: {
                name: formData.name || '',
                email: formData.email || '',
                contact: formData.phone || '',
            },
            theme: {
                color: '#4f46e5',
            },
            handler: async (response: any) => {
                try {
                    const verifyResponse = await fetch(`/api/forms/${slug}/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            formData,
                            userEmail: formData.email,
                            userName: formData.name,
                        }),
                    });

                    const verifyData = await verifyResponse.json();
                    if (verifyData.success) {
                        setSubmitted(true);
                        toast.success('Payment successful! Form submitted.');
                        if (verifyData.redirectUrl) {
                            window.location.href = verifyData.redirectUrl;
                        }
                    } else {
                        toast.error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    toast.error('Payment verification failed');
                } finally {
                    setProcessingPayment(false);
                }
            },
            modal: {
                ondismiss: () => {
                    setProcessingPayment(false);
                    toast.info('Payment cancelled');
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`/api/forms/${slug}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formData,
                    formId: form?.id,
                    userEmail: formData.email,
                    userName: formData.name,
                }),
            });

            const data = await response.json();

            if (data.requiresPayment) {
                initiateRazorpayPayment(data);
            } else if (data.success) {
                setSubmitted(true);
                toast.success('Form submitted successfully!');
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const renderField = (field: FormField) => {
        const value = formData[field.fieldName];
        const error = errors[field.fieldName];

        const commonProps = {
            id: field.fieldName,
            placeholder: field.placeholder || undefined,
            disabled: submitting || processingPayment,
            className: cn(
                "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus-visible:ring-red-500"
            ),
        };

        switch (field.fieldType) {
            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        rows={4}
                    />
                );

            case 'email':
                return (
                    <Input
                        {...commonProps}
                        type="email"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                    />
                );

            case 'phone':
                return (
                    <Input
                        {...commonProps}
                        type="tel"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                    />
                );

            case 'number':
                return (
                    <Input
                        {...commonProps}
                        type="number"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, parseFloat(e.target.value))}
                    />
                );

            case 'date':
                return (
                    <Input
                        {...commonProps}
                        type="date"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                    />
                );

            case 'checkbox': {
                const checkboxOptions = parseOptions(field.options);
                // Handle single checkbox vs multiple checkboxes
                if (checkboxOptions.length === 0) {
                    // Single checkbox (boolean)
                    return (
                        <div className="flex items-start gap-3 rounded-md border p-3">
                            <input
                                type="checkbox"
                                id={field.fieldName}
                                checked={value || false}
                                onChange={(e) =>
                                    handleFieldChange(
                                        field.fieldName,
                                        e.target.checked
                                    )
                                }
                                disabled={submitting || processingPayment}
                                className="mt-1 h-4 w-4 shrink-0"
                            />
                            <Label
                                htmlFor={field.fieldName}
                                className="text-sm font-normal leading-5 cursor-pointer"
                            >
                                {field.fieldLabel}
                                {field.isRequired && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </Label>
                        </div>
                    );
                } else {
                    // Multiple checkboxes - store as array
                    const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

                    return (
                        <div className="space-y-3 pt-1">
                            {checkboxOptions.map((option, index) => {
                                const optionValue = typeof option === 'object' ? (option.value || option.label || option) : option;
                                const optionLabel = typeof option === 'object' ? (option.label || option.value || option) : option;
                                const isChecked = selectedValues.includes(optionValue);

                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`${field.fieldName}-${index}`}
                                            value={optionValue}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                let newValues: any[];
                                                if (e.target.checked) {
                                                    newValues = [...selectedValues, optionValue];
                                                } else {
                                                    newValues = selectedValues.filter(v => v !== optionValue);
                                                }
                                                handleFieldChange(field.fieldName, newValues);
                                            }}
                                            disabled={submitting || processingPayment}
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
                                        />
                                        <Label
                                            htmlFor={`${field.fieldName}-${index}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {optionLabel}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
            }

            case 'radio': {
                const radioOptions = parseOptions(field.options);
                return (
                    <div className="space-y-2 pt-1">
                        {radioOptions.map((option, index) => {
                            const optionValue = typeof option === 'object' ? (option.value || option.label || option) : option;
                            const optionLabel = typeof option === 'object' ? (option.label || option.value || option) : option;

                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id={`${field.fieldName}-${index}`}
                                        name={field.fieldName}
                                        value={optionValue}
                                        checked={value === optionValue}
                                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                                        disabled={submitting || processingPayment}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                    <Label
                                        htmlFor={`${field.fieldName}-${index}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {optionLabel}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            case 'select': {
                const selectOptions = parseOptions(field.options);
                return (
                    <select
                        {...commonProps}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                    >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {selectOptions.map((option, index) => {
                            const optionValue = typeof option === 'object' ? (option.value || option.label || option) : option;
                            const optionLabel = typeof option === 'object' ? (option.label || option.value || option) : option;

                            return (
                                <option key={index} value={optionValue}>
                                    {optionLabel}
                                </option>
                            );
                        })}
                    </select>
                );
            }

            case 'rating':
                return (
                    <Rating
                        value={value || 0}
                        onChange={(val) => handleFieldChange(field.fieldName, val)}
                        disabled={submitting || processingPayment}
                    />
                );

            case 'file':
                return (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click or drag file to upload</p>
                        <input type="file" className="hidden" disabled />
                    </div>
                );

            default:
                return (
                    <Input
                        {...commonProps}
                        type="text"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!form) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
                        <p className="text-muted-foreground">The form you're looking for doesn't exist or has been removed.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (form.status !== 'active') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Form is {form.status}</h2>
                        <p className="text-muted-foreground">This form is currently not accepting responses.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (form.maxSubmissions && (form.submissionCount || 0) >= form.maxSubmissions) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Form Closed</h2>
                        <p className="text-muted-foreground">This form has reached its maximum number of submissions.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (form.submissionDeadline && new Date(form.submissionDeadline) < new Date()) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Submission Deadline Passed</h2>
                        <p className="text-muted-foreground">The submission deadline for this form has passed.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (form.formType === 'private' && !passkeyVerified) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8">
                        <div className="text-center mb-6">
                            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">This form is private</h2>
                            <p className="text-muted-foreground">Please enter the passkey to access this form.</p>
                        </div>
                        <div className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Enter passkey"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && verifyPasskey()}
                            />
                            {passkeyError && <p className="text-sm text-red-500">{passkeyError}</p>}
                            <Button onClick={verifyPasskey} className="w-full">Access Form</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
                        <p className="text-muted-foreground">
                            {form.confirmationMessage || 'Your response has been submitted successfully.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
            <div className="container max-w-3xl mx-auto px-4">
                <Card className="shadow-lg">
                    <CardContent className="p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold">{form.title}</h1>
                            {form.description && (
                                <p className="text-gray-500 dark:text-gray-400 mt-2">{form.description}</p>
                            )}
                            {form.collectPayment && (
                                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        <span className="font-semibold">Payment Required: ₹{(form.paymentAmount || 0) / 100}</span>
                                    </div>
                                    {form.paymentDescription && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{form.paymentDescription}</p>
                                    )}
                                </div>
                            )}
                            {processingPayment && (
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                        <span className="font-semibold">Redirecting to payment...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    {/* Show label for all fields except single checkbox (which has label inside) */}
                                    {!(field.fieldType === 'checkbox' && parseOptions(field.options).length === 0) && (
                                        <Label htmlFor={field.fieldName} className="text-base font-medium">
                                            {field.fieldLabel}
                                            {field.isRequired && (
                                                <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </Label>
                                    )}

                                    {renderField(field)}

                                    {field.helpText && (
                                        <p className="text-xs text-gray-500">
                                            {field.helpText}
                                        </p>
                                    )}

                                    {errors[field.fieldName] && (
                                        <p className="text-sm text-red-500">
                                            {errors[field.fieldName]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {fields.length > 0 && (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={submitting || processingPayment}
                                >
                                    {submitting || processingPayment ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            {processingPayment ? 'Redirecting to payment...' : 'Submitting...'}
                                        </>
                                    ) : (
                                        form.collectPayment ? `Pay ₹${(form.paymentAmount || 0) / 100} & Submit` : 'Submit'
                                    )}
                                </Button>
                            )}
                        </form>

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Powered by Coprofiles
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}