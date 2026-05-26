// app/dashboard/certificates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Award,
  Download,
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  User,
  FileText,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Certificate {
  id: number;
  internshipApplicationId: number;
  pdfUrl: string;
  certificateNumber: string;
  userName: string;
  internshipTitle: string;
  companyName: string;
  issueDate: string;
  status: 'active' | 'under_review' | 'bounced';
  verificationCode: string;
  createdAt: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [verificationLink, setVerificationLink] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/user/certificates', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }

      const data = await response.json();
      setCertificates(data.certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      const response = await fetch(`/api/user/certificates/${certificate.id}/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = (certificate: Certificate) => {
    const link = `${window.location.origin}/verify-certificate?code=${certificate.verificationCode}`;
    setVerificationLink(link);
    navigator.clipboard.writeText(link);
    toast.success('Verification link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Under Review</Badge>;
      case 'bounced':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Bounced</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.verificationCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          My Certificates
        </h1>
        <p className="text-gray-500 mt-1">
          View and download all your internship certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Certificates</p>
              <p className="text-2xl font-bold">{certificates.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Certificates</p>
              <p className="text-2xl font-bold">
                {certificates.filter(c => c.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Companies</p>
              <p className="text-2xl font-bold">
                {new Set(certificates.map(c => c.companyName)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by internship title, company, certificate number, or verification code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Certificates Found</h3>
          <p className="text-gray-400 mt-1">
            {searchTerm ? 'Try adjusting your search' : 'Complete internships to earn certificates'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    {getStatusBadge(certificate.status)}
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 line-clamp-1">
                  {certificate.internshipTitle}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {certificate.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Certificate No:</span>
                    <span className="font-mono text-xs">{certificate.certificateNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Verification Code:</span>
                    <span className="font-mono text-xs">{certificate.verificationCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="text-sm">{formatDate(certificate.issueDate)}</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleDownload(certificate)}
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedCertificate(certificate);
                    handleShare(certificate);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-indigo-600" />
                        Certificate Details
                      </DialogTitle>
                      <DialogDescription>
                        Internship completion certificate
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          Certificate of Completion
                        </h3>
                        <p className="text-gray-600">This certificate is proudly presented to</p>
                        <p className="text-xl font-semibold text-indigo-600 my-2">
                          {certificate.userName}
                        </p>
                        <p className="text-gray-600">for successfully completing</p>
                        <p className="text-lg font-semibold text-gray-800 my-2">
                          {certificate.internshipTitle}
                        </p>
                        <p className="text-gray-600">at</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {certificate.companyName}
                        </p>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-500">
                            Certificate Number: {certificate.certificateNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            Issue Date: {formatDate(certificate.issueDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Verification Code: {certificate.verificationCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-2"
                          onClick={() => handleDownload(certificate)}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => {
                            const link = `${window.location.origin}/verify-certificate?code=${certificate.verificationCode}`;
                            navigator.clipboard.writeText(link);
                            toast.success('Verification link copied!');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                          Copy Verification Link
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={!!verificationLink} onOpenChange={() => setVerificationLink('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Certificate</DialogTitle>
            <DialogDescription>
              Share this verification link on LinkedIn, resume, or portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono break-all">{verificationLink}</p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(verificationLink);
                  toast.success('Link copied!');
                }}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => window.open(verificationLink, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Open Verification Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}