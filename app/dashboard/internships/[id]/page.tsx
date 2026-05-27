// app/dashboard/internships/my-applications/[id]/page.tsx - Fixed Version

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
  FileCheck,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

interface ApplicationDetails {
  id: number;
  internshipId: number;
  userId: number;
  status: ApplicationStatus;
  rollNo: string | null;
  examDate: string | null;
  certificateUnlocked: boolean;
  certificatePaid: boolean;
  internshipActive: boolean;
  appliedAt?: Date | string | null;
  internshipTitle?: string;
  companyName?: string;
  companyLogo?: string | null;
  location?: string;
  duration?: string;
  description?: string;
  lastApplyDate?: Date | string | null;
  autoCancel?: boolean;
  companyVerified?: boolean;
  companyDescription?: string | null;
  internship?: {
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
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
}

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
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
        
        let appData = data.application;
        
        if (appData && !appData.internshipTitle && appData.internship) {
          setApplication(appData);
        } else if (appData) {
          setApplication({
            id: appData.id,
            internshipId: appData.internshipId,
            userId: appData.userId,
            status: appData.status,
            rollNo: appData.rollNo,
            examDate: appData.examDate,
            certificateUnlocked: appData.certificateUnlocked,
            certificatePaid: appData.certificatePaid,
            internshipActive: appData.internshipActive,
            appliedAt: appData.appliedAt,
            internship: {
              id: appData.internshipId,
              title: appData.internshipTitle || appData.internship?.title,
              company: appData.companyName || appData.internship?.company,
              companyLogo: appData.companyLogo,
              location: appData.location || 'Remote',
              duration: appData.duration || 'Not specified',
              description: appData.description || 'No description provided',
              requirements: [],
              lastApplyDate: appData.lastApplyDate,
              autoCancel: appData.autoCancel,
              companyVerified: appData.companyVerified,
              companyDescription: appData.companyDescription,
            }
          });
        }
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

  const getInternshipTitle = () => {
    if (!application) return '';
    if (application.internship?.title) return application.internship.title;
    if (application.internshipTitle) return application.internshipTitle;
    return 'Internship';
  };

  const getCompanyName = () => {
    if (!application) return '';
    if (application.internship?.company) return application.internship.company;
    if (application.companyName) return application.companyName;
    return 'Company';
  };

  const getLocation = () => {
    if (!application) return 'Remote';
    if (application.internship?.location) return application.internship.location;
    if (application.location) return application.location;
    return 'Remote';
  };

  const getDuration = () => {
    if (!application) return 'Not specified';
    if (application.internship?.duration) return application.internship.duration;
    if (application.duration) return application.duration;
    return 'Not specified';
  };

  const getDescription = () => {
    if (!application) return 'No description provided';
    if (application.internship?.description) return application.internship.description;
    if (application.description) return application.description;
    return 'No description provided';
  };

  const getLastApplyDate = () => {
    if (!application) return null;
    if (application.internship?.lastApplyDate) return application.internship.lastApplyDate;
    if (application.lastApplyDate) return application.lastApplyDate;
    return null;
  };

  const getAutoCancel = () => {
    if (!application) return false;
    if (application.internship?.autoCancel !== undefined) return application.internship.autoCancel;
    if (application.autoCancel !== undefined) return application.autoCancel;
    return false;
  };

  const handlePayment = async () => {
    if (!application) return;

    setProcessingPayment(true);
    
    try {
      const orderResponse = await fetch('/api/payments/create-certificate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
        }),
        credentials: 'include',
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Coprofiles',
        description: `Certificate for ${getInternshipTitle()}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch('/api/payments/verify-certificate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            toast.success('Payment successful! Certificate will be available soon!');
            setApplication({
              ...application,
              certificatePaid: true,
            });
          } else {
            throw new Error(verifyData.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: application.user?.name || 'Student',
          email: application.user?.email || 'student@example.com',
        },
        theme: { color: '#6366f1' },
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

  const getStatusBadge = () => {
    if (!application) return null;
    
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800', icon: Clock, label: 'Pending Review' },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800', icon: CheckCircle2, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800', icon: XCircle, label: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800', icon: Award, label: 'Completed' },
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
          message: 'You have successfully completed this internship. Your certificate will be available in the Certificates section once the company issues it.',
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
          <Skeleton className="h-10 w-10 rounded-full dark:bg-gray-800" />
          <Skeleton className="h-8 w-48 dark:bg-gray-800" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg dark:bg-gray-800" />
        <Skeleton className="h-96 rounded-lg dark:bg-gray-800" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Application Not Found</h2>
        <p className="text-gray-500 dark:text-gray-500 mt-2">The application you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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
      <Button variant="ghost" onClick={() => router.back()} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Applications
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            {getInternshipTitle()}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{getCompanyName()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{getLocation()}</span>
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <Separator className="dark:bg-gray-800" />

      {/* Application Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="font-medium dark:text-gray-300">{formatDate(application.appliedAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="font-medium dark:text-gray-300">{getDuration()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="font-medium dark:text-gray-300">{application.rollNo || 'Not provided'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificate Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className={`h-4 w-4 ${application.certificateUnlocked ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`font-medium ${application.certificateUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {application.certificateUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            {application.certificatePaid && (
              <Badge variant="secondary" className="mt-2 text-xs dark:bg-gray-800 dark:text-gray-300">
                <CreditCard className="h-3 w-3 mr-1" />
                Payment Completed
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exam Date Card */}
      {application.examDate && (
        <Card className="border-purple-200 bg-purple-50/30 dark:border-purple-800 dark:bg-purple-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Exam Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="font-medium text-purple-700 dark:text-purple-400">{formatExamDate(application.examDate)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internship Description */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-200">
            <FileText className="h-5 w-5" />
            Internship Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{getDescription()}</p>
        </CardContent>
      </Card>

      {/* Application Status Details */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">Application Status</CardTitle>
          <CardDescription className="dark:text-gray-400">Track the progress of your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{statusInfo.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{statusInfo.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{statusInfo.message}</p>
              </div>
            </div>

            {application.internshipActive && application.status === 'pending' && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <span className="font-semibold">Internship Status: </span>
                  This internship is currently active and accepting applications.
                </p>
              </div>
            )}

            {getAutoCancel() && application.status === 'accepted' && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-100 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <span className="font-semibold">Note: </span>
                  This internship has auto-cancel enabled. Make sure to complete it before the deadline.
                </p>
              </div>
            )}

            {getLastApplyDate() && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Last Application Date: </span>
                  {formatDate(getLastApplyDate())}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Section - Only for Payment (Not for Download) */}
      {application.status === 'completed' && (
        <Card className="border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Award className="h-5 w-5" />
              Internship Certificate
            </CardTitle>
            <CardDescription className="dark:text-green-300/70">You have successfully completed this internship!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!application.certificatePaid && !application.certificateUnlocked && (
              <div className="space-y-3">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Certificate Locked - Payment Required
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400/80 mt-1">
                    Unlock your internship certificate for just ₹129. Get a verified certificate that you can share on LinkedIn and with employers.
                  </p>
                </div>
                <Button onClick={handlePayment} disabled={processingPayment} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700">
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

            {application.certificatePaid && !application.certificateUnlocked && (
              <div className="p-4 bg-blue-100 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Payment Completed!
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400/80 mt-1">
                  Your payment has been successfully processed. The certificate will be available in the Certificates section once the company issues it.
                </p>
              </div>
            )}

            {application.certificateUnlocked && (
              <div className="p-4 bg-green-100 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-400 flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Certificate Available!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400/80 mt-1">
                  Your certificate has been issued and is now available for download.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-3 w-full gap-2 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
                  onClick={() => router.push('/dashboard/certificates')}
                >
                  <Download className="h-4 w-4" />
                  View in Certificates
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        {application.status === 'rejected' && (
          <Button variant="outline" onClick={() => router.push('/dashboard/internships')} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Browse More Internships
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        <Button variant="outline" onClick={() => router.push('/dashboard/internships/my-applications')} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          View All Applications
        </Button>
      </div>
    </div>
  );
}