// components/manager/certificates/CertificateTable.tsx
'use client';

import { MoreVertical, Eye, Download, ExternalLink, Copy, Award, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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
  updatedAt: string;
  studentEmail?: string;
  studentPhone?: string;
}

interface CertificateTableProps {
  certificates: Certificate[];
  onViewDetails: (certificate: Certificate) => void;
  onRefresh: () => void;
}

export function CertificateTable({ certificates, onViewDetails, onRefresh }: CertificateTableProps) {
  const handleDownload = async (certificate: Certificate) => {
    try {
      const response = await fetch(`/api/manager/certificates/${certificate.id}/download`, {
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
      link.download = `certificate-${certificate.certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to download certificate');
    }
  };

  const handleUpdateStatus = async (certificateId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/manager/certificates/${certificateId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update status');
      }

      toast.success(`Certificate status updated to ${newStatus}`);
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update certificate status');
    }
  };

  const handleShareVerification = (certificate: Certificate) => {
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Ensure certificates is an array
  const certificatesArray = Array.isArray(certificates) ? certificates : [];

  if (certificatesArray.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No certificates found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Certificate No.</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Internship</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificatesArray.map((cert: Certificate) => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">#{cert.id}</TableCell>
              <TableCell>
                <span className="font-mono text-xs">{cert.certificateNumber || 'N/A'}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{cert.userName || 'Unknown'}</p>
                  {cert.studentEmail && (
                    <p className="text-xs text-gray-500">{cert.studentEmail}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">{cert.internshipTitle || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{cert.companyName || 'N/A'}</span>
              </TableCell>
              <TableCell className="text-sm">{formatDate(cert.issueDate)}</TableCell>
              <TableCell>{getStatusBadge(cert.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs">{cert.verificationCode || 'N/A'}</span>
                  {cert.verificationCode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleShareVerification(cert)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(cert)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(cert)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareVerification(cert)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Share Verification Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(cert.id, 'active')}
                      disabled={cert.status === 'active'}
                      className="text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(cert.id, 'under_review')}
                      disabled={cert.status === 'under_review'}
                      className="text-yellow-600"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Set Under Review
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleUpdateStatus(cert.id, 'bounced')}
                      disabled={cert.status === 'bounced'}
                      className="text-red-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Set Bounced
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}