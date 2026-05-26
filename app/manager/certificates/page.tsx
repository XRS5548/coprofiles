// app/manager/certificates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CertificateStats } from './CertificateStats'; 
import { CertificateFilters } from './CertificateFilters';
import { CertificateTable } from './CertificateTable';
import { CreateCertificateDialog } from './CreateCertificateDialog'; 
import { CertificateDetailsDialog } from './CertificateDetailsDialog'; 
import type { Certificate } from '@/types/certificate';

export default function ManagerCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    underReview: 0,
    bounced: 0,
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  // app/manager/certificates/page.tsx - Fix the fetchCertificates function

const fetchCertificates = async () => {
  try {
    const response = await fetch('/api/manager/certificates', {
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error('Failed to fetch certificates');
    
    const data = await response.json();
    
    console.log('API Response:', data); // Debug log
    
    let certsArray: Certificate[] = [];
    
    // Handle your actual API response structure
    if (data.success && data.certificates) {
      // If certificates has rows property (Postgres result)
      if (data.certificates.rows && Array.isArray(data.certificates.rows)) {
        certsArray = data.certificates.rows;
        console.log('Extracted from rows:', certsArray);
      } 
      // If certificates is directly an array
      else if (Array.isArray(data.certificates)) {
        certsArray = data.certificates;
        console.log('Direct array:', certsArray);
      }
    } else if (Array.isArray(data)) {
      certsArray = data;
      console.log('Data is array:', certsArray);
    }
    
    setCertificates(certsArray);
    
    const total = certsArray.length;
    const active = certsArray.filter((c: Certificate) => c.status === 'active').length;
    const underReview = certsArray.filter((c: Certificate) => c.status === 'under_review').length;
    const bounced = certsArray.filter((c: Certificate) => c.status === 'bounced').length;
    
    setStats({ total, active, underReview, bounced });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    toast.error('Failed to load certificates');
  } finally {
    setLoading(false);
  }
};

  const getFilteredCertificates = () => {
    let certs = [...certificates];
    
    if (statusFilter !== 'all') {
      certs = certs.filter(c => c.status === statusFilter);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      certs = certs.filter(c => 
        (c.userName && c.userName.toLowerCase().includes(searchLower)) ||
        (c.internshipTitle && c.internshipTitle.toLowerCase().includes(searchLower)) ||
        (c.companyName && c.companyName.toLowerCase().includes(searchLower)) ||
        (c.certificateNumber && c.certificateNumber.toLowerCase().includes(searchLower))
      );
    }
    
    return certs;
  };

  const filteredCertificates = getFilteredCertificates();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Certificates Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all issued internship certificates</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Certificate
        </Button>
      </div>

      {/* Stats Cards */}
      <CertificateStats stats={stats} />

      {/* Filters */}
      <CertificateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Certificates Table */}
      <CertificateTable
        certificates={filteredCertificates}
        onViewDetails={(cert) => {
          setSelectedCertificate(cert);
          setDetailsDialogOpen(true);
        }}
        onRefresh={fetchCertificates}
      />

      {/* Create Certificate Dialog */}
      <CreateCertificateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchCertificates}
      />

      {/* Certificate Details Dialog */}
      <CertificateDetailsDialog
        certificate={selectedCertificate}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onRefresh={fetchCertificates}
      />
    </div>
  );
}