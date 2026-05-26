// components/manager/certificates/CreateCertificateDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Award, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Application {
  applicationId: number;
  userName: string;
  userEmail: string;
  internshipTitle: string;
  companyName: string;
  rollNo: string | null;
  status: string;
}

interface CreateCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCertificateDialog({ open, onOpenChange, onSuccess }: CreateCertificateDialogProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Form fields
  const [certificateNumber, setCertificateNumber] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (open) {
      fetchApplications();
      setIssueDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/manager/applications', {
        credentials: 'include',
      });
      const data = await response.json();
      
      let appsArray: Application[] = [];
      if (data.applications && Array.isArray(data.applications)) {
        appsArray = data.applications;
      } else if (data.data && Array.isArray(data.data)) {
        appsArray = data.data;
      }
      
      // Filter only completed applications without certificates
      setApplications(appsArray.filter(app => app.status === 'completed'));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSelect = (applicationId: string) => {
    const app = applications.find(a => a.applicationId.toString() === applicationId);
    setSelectedApp(app || null);
  };

  const handleSubmit = async () => {
    if (!selectedApp) {
      toast.error('Please select an application');
      return;
    }
    
    if (!certificateNumber || !pdfUrl || !issueDate || !verificationCode) {
      toast.error('Please fill all required fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/manager/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipApplicationId: selectedApp.applicationId,
          pdfUrl,
          certificateNumber,
          userName: selectedApp.userName,
          internshipTitle: selectedApp.internshipTitle,
          companyName: selectedApp.companyName,
          issueDate,
          verificationCode,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create certificate');
      }

      toast.success('Certificate created successfully!');
      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setSelectedApp(null);
      setCertificateNumber('');
      setPdfUrl('');
      setVerificationCode('');
    } catch (error) {
      console.error('Error creating certificate:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create certificate');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Add New Certificate
          </DialogTitle>
          <DialogDescription>
            Select an application and enter certificate details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Application Selection */}
          <div className="space-y-2">
            <Label>Select Application *</Label>
            <Select onValueChange={handleApplicationSelect} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : "Select a completed application"} />
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.applicationId} value={app.applicationId.toString()}>
                    {app.userName} - {app.internshipTitle} ({app.companyName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Application Details */}
          {selectedApp && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Selected Application:</p>
              <p className="text-sm">Student: {selectedApp.userName} ({selectedApp.userEmail})</p>
              <p className="text-sm">Internship: {selectedApp.internshipTitle}</p>
              <p className="text-sm">Company: {selectedApp.companyName}</p>
              {selectedApp.rollNo && <p className="text-sm">Roll No: {selectedApp.rollNo}</p>}
            </div>
          )}

          {/* Certificate Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Certificate Number *</Label>
              <Input
                placeholder="e.g., CERT-2024-001234"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PDF URL *</Label>
              <Input
                placeholder="/certificates/file.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Verification Code *</Label>
              <Input
                placeholder="e.g., SQR4F7K2B891234"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={generating} className="gap-2">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Award className="h-4 w-4" />
                Create Certificate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}