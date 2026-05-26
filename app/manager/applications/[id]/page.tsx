// app/manager/applications/[id]/page.tsx - Fixed version
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Award,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface ApplicationDetail {
  applicationId: number;
  status: string;
  rollNo: string | null;
  examDate: string | null;
  internshipId: number;
  internshipTitle: string;
  internshipContent: string;
  internshipDuration: number;
  internshipLastApplyDate: string;
  companyId: number;
  companyName: string;
  companyLogo: string | null;
  userId: number;
  userName: string;
  email: string;
  phone: string | null;
  profileImgUrl: string | null;
  certificateUnlocked: boolean;
  certificatePaid: boolean;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchApplicationDetail();
    }
  }, [params?.id]);

  const fetchApplicationDetail = async () => {
    try {
      const response = await fetch(`/api/manager/applications/${params.id}`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch');
      }
      
      if (data.success && data.application) {
        setApplication(data.application);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: Award, label: 'Completed' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <Badge className={`${color} border-0 px-3 py-1`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Application not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button variant="outline" onClick={() => window.location.href = `mailto:${application.email}`}>
          <Mail className="h-4 w-4 mr-2" />
          Contact Student
        </Button>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
                {application.userName?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <h2 className="text-xl font-bold">{application.userName}</h2>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" /> {application.email}
                  </p>
                  {application.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" /> {application.phone}
                    </p>
                  )}
                </div>
                {getStatusBadge(application.status)}
              </div>
              {application.rollNo && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg inline-block">
                  <p className="text-sm">
                    <span className="font-semibold">Roll Number:</span> {application.rollNo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internship Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{application.internshipTitle}</h3>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3" /> {application.companyName}
              </p>
            </div>
            <Badge variant="outline">{application.internshipDuration} weeks</Badge>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600 whitespace-pre-wrap">
              {application.internshipContent || 'No description provided'}
            </p>
          </div>
          {application.examDate && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="flex items-center gap-2 text-purple-700">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">Exam Date:</span>
                {new Date(application.examDate).toLocaleString()}
              </p>
            </div>
          )}
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="flex items-center gap-2 text-yellow-700">
              <Calendar className="h-4 w-4" />
              <span className="font-semibold">Last Apply Date:</span>
              {formatDate(application.internshipLastApplyDate)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">Certificate</p>
              <p className={`font-semibold text-lg ${application.certificateUnlocked ? 'text-green-600' : 'text-gray-600'}`}>
                {application.certificateUnlocked ? '✓ Unlocked' : '🔒 Locked'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className={`font-semibold text-lg ${application.certificatePaid ? 'text-green-600' : 'text-gray-600'}`}>
                {application.certificatePaid ? '✓ Paid' : '⏳ Pending'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push(`/manager/internships/${application.internshipId}`)}
        >
          View Internship
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push(`/manager/company/${application.companyId}`)}
        >
          View Company
        </Button>
      </div>
    </div>
  );
}