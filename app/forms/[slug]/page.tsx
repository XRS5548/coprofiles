// app/forms/[slug]/page.tsx - Updated with authentication handling

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
    LogIn,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Navbar } from '@/page_components/home/navbar';
import { Footer } from '@/page_components/home/footer';

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
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

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
        checkAuthStatus();
        fetchForm();
    }, [slug]);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/user/profile', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUser(data.profile);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    };

    const parseOptions = (options: any): any[] => {
        if (!options) return [];
        if (Array.isArray(options)) return options;
        if (typeof options === 'string') {
            try {
                const parsed = JSON.parse(options);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
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
                        const options = parseOptions(field.options);
                        if (options.length > 0) {
                            initialData[field.fieldName] = [];
                        } else {
                            initialData[field.fieldName] = false;
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
            const options = parseOptions(field.options);
            if (options.length > 0) {
                const isChecked = Array.isArray(value) && value.length > 0;
                if (!isChecked) {
                    return `${field.fieldLabel} is required (select at least one option)`;
                }
            } else {
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
        setPaymentError(null);

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: form?.title,
            description: form?.paymentDescription || 'Payment for form submission',
            order_id: orderData.orderId,
            prefill: {
                name: formData.name || user?.name || '',
                email: formData.email || user?.email || '',
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
                            userEmail: formData.email || user?.email,
                            userName: formData.name || user?.name,
                        }),
                    });

                    const verifyData = await verifyResponse.json();
                    if (verifyData.success) {
                        setSubmitted(true);
                        setPaymentError(null);
                        toast.success('Payment successful! Form submitted.');
                        if (verifyData.redirectUrl) {
                            window.location.href = verifyData.redirectUrl;
                        }
                    } else {
                        setPaymentError(verifyData.error || 'Payment verification failed. Please try again.');
                        toast.error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setPaymentError('Payment verification failed due to a server error. Please try again.');
                    toast.error('Payment verification failed');
                } finally {
                    setProcessingPayment(false);
                }
            },
            modal: {
                ondismiss: () => {
                    setProcessingPayment(false);
                    setPaymentError('Payment was cancelled. Please try again.');
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
                    userEmail: formData.email || user?.email,
                    userName: formData.name || user?.name,
                    userId: user?.id,
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
        if (paymentError) setPaymentError(null);
    };

    const renderField = (field: FormField) => {
        const value = formData[field.fieldName];
        const error = errors[field.fieldName];

        const commonProps = {
            id: field.fieldName,
            placeholder: field.placeholder || undefined,
            disabled: submitting || processingPayment,
            className: cn(
                "w-full rounded-md border bg-[#27272A] px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#A1A1AA]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFE104] focus-visible:ring-offset-0",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-red-500 focus-visible:ring-red-500" : "border-[#3F3F46]"
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
                if (checkboxOptions.length === 0) {
                    return (
                        <div className="flex items-start gap-3 rounded-md border border-[#3F3F46] p-3">
                            <input
                                type="checkbox"
                                id={field.fieldName}
                                checked={value || false}
                                onChange={(e) => handleFieldChange(field.fieldName, e.target.checked)}
                                disabled={submitting || processingPayment}
                                className="mt-1 h-4 w-4 shrink-0 accent-[#DFE104]"
                            />
                            <Label htmlFor={field.fieldName} className="text-sm font-normal leading-5 cursor-pointer text-[#FAFAFA]">
                                {field.fieldLabel}
                                {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                        </div>
                    );
                } else {
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
                                            className="h-4 w-4 rounded border-[#3F3F46] text-[#DFE104] focus:ring-[#DFE104] bg-[#27272A] accent-[#DFE104]"
                                        />
                                        <Label htmlFor={`${field.fieldName}-${index}`} className="text-sm font-normal cursor-pointer text-[#FAFAFA]">
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
                                        className="h-4 w-4 border-[#3F3F46] text-[#DFE104] focus:ring-[#DFE104] bg-[#27272A] accent-[#DFE104]"
                                    />
                                    <Label htmlFor={`${field.fieldName}-${index}`} className="text-sm font-normal cursor-pointer text-[#FAFAFA]">
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
                    <select {...commonProps} value={value || ''} onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}>
                        <option value="" className="bg-[#27272A]">{field.placeholder || 'Select an option'}</option>
                        {selectOptions.map((option, index) => {
                            const optionValue = typeof option === 'object' ? (option.value || option.label || option) : option;
                            const optionLabel = typeof option === 'object' ? (option.label || option.value || option) : option;

                            return (
                                <option key={index} value={optionValue} className="bg-[#27272A]">
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
                    <div className="border-2 border-dashed border-[#3F3F46] rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-[#A1A1AA]" />
                        <p className="text-sm text-[#A1A1AA]">Click or drag file to upload</p>
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
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#DFE104]" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!form) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Form Not Found</h2>
                            <p className="text-[#A1A1AA]">The form you're looking for doesn't exist or has been removed.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    // Check if form requires authentication
    if (form.formType === 'authenticated' && !isLoggedIn) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-amber-100/10 p-3">
                                    <Lock className="h-8 w-8 text-amber-500" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Authentication Required</h2>
                            <p className="text-[#A1A1AA] mb-6">
                                This form requires you to be logged in to submit. Please login to continue.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button onClick={() => router.push('/login')} className="bg-[#DFE104] text-black hover:bg-[#DFE104]/90 gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Button>
                                <Button variant="outline" onClick={() => router.back()} className="border-[#3F3F46] text-[#FAFAFA] hover:bg-[#3F3F46]/50">
                                    Go Back
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (form.status !== 'active') {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Form is {form.status}</h2>
                            <p className="text-[#A1A1AA]">This form is currently not accepting responses.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (form.maxSubmissions && (form.submissionCount || 0) >= form.maxSubmissions) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Form Closed</h2>
                            <p className="text-[#A1A1AA]">This form has reached its maximum number of submissions.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (form.submissionDeadline && new Date(form.submissionDeadline) < new Date()) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Submission Deadline Passed</h2>
                            <p className="text-[#A1A1AA]">The submission deadline for this form has passed.</p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (form.formType === 'private' && !passkeyVerified) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <Lock className="h-12 w-12 text-[#A1A1AA] mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">This form is private</h2>
                                <p className="text-[#A1A1AA]">Please enter the passkey to access this form.</p>
                            </div>
                            <div className="space-y-4">
                                <Input
                                    type="password"
                                    placeholder="Enter passkey"
                                    value={passkey}
                                    onChange={(e) => setPasskey(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && verifyPasskey()}
                                    className="bg-[#27272A] border-[#3F3F46] text-[#FAFAFA] placeholder:text-[#A1A1AA]"
                                />
                                {passkeyError && <p className="text-sm text-red-500">{passkeyError}</p>}
                                <Button onClick={verifyPasskey} className="w-full bg-[#DFE104] text-black hover:bg-[#DFE104]/90">Access Form</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="bg-[#09090B]">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen pt-20 px-4">
                    <Card className="max-w-md w-full mx-4 bg-[#18181B] border-[#3F3F46]">
                        <CardContent className="p-8 text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2 text-[#FAFAFA]">Thank You!</h2>
                            <p className="text-[#A1A1AA]">
                                {form.confirmationMessage || 'Your response has been submitted successfully.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#09090B] min-h-screen">
            <Navbar />
            <div className="pt-28 pb-16">
                <div className="container max-w-3xl mx-auto px-4">
                    <Card className="bg-[#18181B] border-[#3F3F46] shadow-lg">
                        <CardContent className="p-6 md:p-8">
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#FAFAFA]">{form.title}</h1>
                                {form.description && (
                                    <p className="text-[#A1A1AA] mt-2">{form.description}</p>
                                )}
                                {form.collectPayment && (
                                    <div className="mt-4 p-4 bg-green-950/30 border border-green-800/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-green-500" />
                                            <span className="font-semibold text-[#FAFAFA]">Payment Required: ₹{(form.paymentAmount || 0) / 100}</span>
                                        </div>
                                        {form.paymentDescription && (
                                            <p className="text-sm text-[#A1A1AA] mt-1">{form.paymentDescription}</p>
                                        )}
                                    </div>
                                )}
                                {processingPayment && (
                                    <div className="mt-4 p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                            <span className="font-semibold text-[#FAFAFA]">Redirecting to payment...</span>
                                        </div>
                                    </div>
                                )}
                                {paymentError && (
                                    <div className="mt-4 p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                                            <div>
                                                <span className="font-semibold text-[#FAFAFA]">Payment Failed</span>
                                                <p className="text-sm text-[#A1A1AA] mt-0.5">{paymentError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        {!(field.fieldType === 'checkbox' && parseOptions(field.options).length === 0) && (
                                            <Label htmlFor={field.fieldName} className="text-base font-medium text-[#FAFAFA]">
                                                {field.fieldLabel}
                                                {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                        )}

                                        {renderField(field)}

                                        {field.helpText && (
                                            <p className="text-xs text-[#A1A1AA]">{field.helpText}</p>
                                        )}

                                        {errors[field.fieldName] && (
                                            <p className="text-sm text-red-500">{errors[field.fieldName]}</p>
                                        )}
                                    </div>
                                ))}

                                {fields.length > 0 && (
                                    <Button type="submit" className="w-full bg-[#DFE104] text-black hover:bg-[#DFE104]/90" disabled={submitting || processingPayment}>
                                        {submitting || processingPayment ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                {processingPayment ? 'Redirecting to payment...' : 'Submitting...'}
                                            </>
                                        ) : paymentError ? (
                                            'Retry Payment'
                                        ) : (
                                            form.collectPayment ? `Pay ₹${(form.paymentAmount || 0) / 100} & Submit` : 'Submit'
                                        )}
                                    </Button>
                                )}
                            </form>

                            <div className="mt-6 text-center text-xs text-[#3F3F46]">
                                Powered by Coprofiles
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
}