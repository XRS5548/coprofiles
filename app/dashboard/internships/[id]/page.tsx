// app/dashboard/internships/my-applications/[id]/page.tsx - Updated with Razorpay payment
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  Award,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  ExternalLink,
  UserCheck,
  Hash,
  Calendar as CalendarIcon,
  CreditCard,
  Lock,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface InternshipDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  lastApplyDate?: Date | string | null;
  autoCancel?: boolean;
  companyVerified?: boolean;
  companyDescription?: string | null;
}

interface ApplicationDetails {
  id: number;
  internshipId: number;
  userId: number;
  certificateUnlocked: boolean;
  certificatePaid: boolean;
  status: ApplicationStatus;
  rollNo: string | null;
  examDate: string | null;
  internshipActive: boolean;
  appliedAt?: Date | string | null;
  internship: InternshipDetails;
}

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const id = params.id as string;
        console.log('Fetching application with ID:', id);
        
        const response = await fetch(`/api/user/internships/applications/${id}`, {
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Application not found');
            router.push('/dashboard/internships/my-applications');
            return;
          }
          throw new Error(data.message || 'Failed to fetch application details');
        }

        console.log('Application data received:', data);
        setApplication(data.application);
      } catch (error) {
        console.error('Error fetching application details:', error);
        toast.error('Failed to load application details', {
          description: error instanceof Error ? error.message : 'Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApplicationDetails();
    }
  }, [params.id, router]);

  const handlePayment = async () => {
    if (!application) return;

    setProcessingPayment(true);
    
    try {
      // Create order on backend
      const orderResponse = await fetch('/api/payments/create-certificate-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          amount: 100, // 1 INR in paise
        }),
        credentials: 'include',
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Coprofiles',
        description: `Certificate for ${application.internship.title}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify-certificate-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              applicationId: application.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
            credentials: 'include',
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok) {
            toast.success('Payment successful! Certificate unlocked!');
            // Update application state
            setApplication({
              ...application,
              certificatePaid: true,
              certificateUnlocked: true,
            });
          } else {
            throw new Error(verifyData.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Student Name', // You can get from user context
          email: 'student@example.com', // You can get from user context
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!application?.certificateUnlocked) {
      toast.error('Certificate not available', {
        description: 'Please complete the internship and pay for the certificate to unlock.',
      });
      return;
    }

    setDownloadingCertificate(true);
    try {
      const response = await fetch(`/api/user/internships/${application.internshipId}/certificate`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${application.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setDownloadingCertificate(false);
    }
  };

  const getStatusBadge = () => {
    if (!application) return null;
    
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending Review' },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Award, label: 'Completed' },
    };
    
    const config = statusConfig[application.status];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border px-3 py-1 text-sm font-medium`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusMessage = () => {
    if (!application) return { title: '', message: '', icon: null };
    
    switch (application.status) {
      case 'pending':
        return {
          title: 'Application Under Review',
          message: 'Your application is being reviewed by the company. You will receive an update once a decision is made.',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
        };
      case 'accepted':
        return {
          title: 'Application Accepted 🎉',
          message: 'Congratulations! Your application has been accepted. The company will contact you with further instructions.',
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
        };
      case 'rejected':
        return {
          title: 'Application Not Selected',
          message: 'We appreciate your interest. Unfortunately, your application was not selected this time. Keep exploring other opportunities!',
          icon: <XCircle className="h-5 w-5 text-red-500" />
        };
      case 'completed':
        return {
          title: 'Internship Completed ✅',
          message: 'You have successfully completed this internship. Your certificate is now available for download.',
          icon: <Award className="h-5 w-5 text-blue-500" />
        };
      default:
        return {
          title: 'Application Under Review',
          message: 'Your application is being processed.',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />
        };
    }
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Date not available';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatExamDate = (date: string | null): string => {
    if (!date) return 'Not scheduled';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600">Application Not Found</h2>
        <p className="text-gray-500 mt-2">The application you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/internships/my-applications')} className="mt-4">
          Back to Applications
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusMessage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {application.internship.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{application.internship.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{application.internship.location || 'Remote'}</span>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <Separator />

      {/* Application Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Applied Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {formatDate(application.appliedAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{application.internship.duration}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Roll Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-400" />
              <span className="font-medium">
                {application.rollNo || 'Not provided'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Certificate Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className={`h-4 w-4 ${application.certificateUnlocked ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`font-medium ${application.certificateUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                {application.certificateUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {application.certificatePaid && (
              <Badge variant="secondary" className="mt-2 text-xs">
                <CreditCard className="h-3 w-3 mr-1" />
                Payment Completed
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exam Date Card - Only show if exam date exists */}
      {application.examDate && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Exam Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700">
                {formatExamDate(application.examDate)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internship Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Internship Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {application.internship.description}
          </p>
          
          {application.internship.requirements && application.internship.requirements.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Requirements</h3>
              <ul className="list-disc list-inside space-y-2">
                {application.internship.requirements.map((req, index) => (
                  <li key={index} className="text-gray-600">{req}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Status Details */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>
            Track the progress of your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{statusInfo.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{statusInfo.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{statusInfo.message}</p>
              </div>
            </div>

            {/* Show internship active status */}
            {application.internshipActive && application.status === 'pending' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Internship Status: </span>
                  This internship is currently active and accepting applications.
                </p>
              </div>
            )}

            {/* Show auto cancel info */}
            {application.internship.autoCancel && application.status === 'accepted' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">Note: </span>
                  This internship has auto-cancel enabled. Make sure to complete it before the deadline.
                </p>
              </div>
            )}

            {/* Show last apply date if available */}
            {application.internship.lastApplyDate && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Last Application Date: </span>
                  {formatDate(application.internship.lastApplyDate)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Section - Updated with payment option */}
      {application.status === 'completed' && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Award className="h-5 w-5" />
              Internship Certificate
            </CardTitle>
            <CardDescription>
              You have successfully completed this internship!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!application.certificatePaid && !application.certificateUnlocked && (
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Certificate Locked - Payment Required
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Unlock your internship certificate for just ₹129. Get a verified certificate that you can share on LinkedIn and with employers.
                  </p>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  {processingPayment ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay ₹129 & Unlock Certificate
                    </>
                  )}
                </Button>
              </div>
            )}

            {application.certificateUnlocked && (
              <>
                <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Certificate Unlocked!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your certificate is ready for download.
                  </p>
                </div>
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={downloadingCertificate}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  {downloadingCertificate ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Certificate (PDF)
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        {application.status === 'rejected' && (
          <Button variant="outline" onClick={() => router.push('/dashboard/internships')}>
            Browse More Internships
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        {application.status === 'accepted' && (
          <Button variant="outline" onClick={() => router.push('/dashboard/internships/my-applications')}>
            <UserCheck className="h-4 w-4 mr-2" />
            View All Applications
          </Button>
        )}
        
        <Button variant="outline" onClick={() => router.push('/dashboard/internships/my-applications')}>
          View All Applications
        </Button>
      </div>
    </div>
  );
}