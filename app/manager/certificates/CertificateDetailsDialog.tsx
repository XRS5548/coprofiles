// components/manager/certificates/CertificateDetailsDialog.tsx
'use client';

import { Award, Download, Copy, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Certificate } from '@/types/certificate';

interface CertificateDetailsDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function CertificateDetailsDialog({ certificate, open, onOpenChange, onRefresh }: CertificateDetailsDialogProps) {
  if (!certificate) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/manager/certificates/${certificate.id}/download`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to download certificate');

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

  const handleShareVerification = () => {
    const verificationLink = `${window.location.origin}/verify-certificate?code=${certificate.verificationCode}`;
    navigator.clipboard.writeText(verificationLink);
    toast.success('Verification link copied to clipboard!');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      under_review: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Under Review' },
      bounced: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Bounced' },
    };
    const { color, icon: Icon, label } = config[status] || config.under_review;
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Certificate Details
          </DialogTitle>
          <DialogDescription>
            Certificate #{certificate.certificateNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Certificate of Completion</h3>
            <p className="text-gray-600">This certificate is proudly presented to</p>
            <p className="text-xl font-semibold text-indigo-600 my-2">{certificate.userName}</p>
            <p className="text-gray-600">for successfully completing</p>
            <p className="text-lg font-semibold text-gray-800 my-2">{certificate.internshipTitle}</p>
            <p className="text-gray-600">at</p>
            <p className="text-lg font-semibold text-gray-800">{certificate.companyName}</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Issue Date: {formatDate(certificate.issueDate)}
              </p>
              <p className="text-sm text-gray-500">
                Verification Code: {certificate.verificationCode}
              </p>
            </div>
          </div>

          <Separator />

          {/* Certificate Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Certificate Number</p>
              <p className="font-mono text-sm">{certificate.certificateNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              {getStatusBadge(certificate.status)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Issue Date</p>
              <p className="text-sm">{formatDate(certificate.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm">{formatDate(certificate.createdAt)}</p>
            </div>
          </div>

          <Separator />

          {/* Verification Link */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Verification Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white p-2 rounded border break-all">
                {`${window.location.origin}/verify-certificate?code=${certificate.verificationCode}`}
              </code>
              <Button size="sm" variant="outline" onClick={handleShareVerification}>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}