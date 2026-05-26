// app/manager/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Send,
  Eye,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface Company {
  id: number;
  name: string;
  role: string;
}

interface ReportData {
  totalInternships: number;
  activeInternships: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  completedInternships: number;
  totalCertificates: number;
  totalRevenue: number;
  certificatesIssued: number;
  certificatesPaid: number;
}

interface MonthlyData {
  month: string;
  applications: number;
  internships: number;
  certificates: number;
  revenue: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [reportType, setReportType] = useState('full');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchReportData();
    }
  }, [selectedCompany, dateRange]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/manager/companies', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies || []);
        if (data.companies && data.companies.length > 0) {
          setSelectedCompany(data.companies[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async () => {
    if (!selectedCompany) return;
    
    setGenerating(true);
    try {
      const response = await fetch(`/api/manager/reports?companyId=${selectedCompany.id}&range=${dateRange}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setReportData(data.report);
        setMonthlyData(data.monthlyData || []);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedCompany) return;
    
    setSendingEmail(true);
    try {
      const response = await fetch('/api/manager/reports/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany.id,
          email: emailAddress,
          reportType: reportType,
          dateRange: dateRange,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast.success(`Report sent successfully to ${emailAddress}`);
      setEmailDialogOpen(false);
      setEmailAddress('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send report');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedCompany) return;
    
    try {
      const response = await fetch(`/api/manager/reports/download?companyId=${selectedCompany.id}&range=${dateRange}&type=${reportType}`, {
        credentials: 'include',
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${selectedCompany.name}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

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
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and download company reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEmailDialogOpen(true)} className="gap-2">
            <Mail className="h-4 w-4" />
            Email Report
          </Button>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Company Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-4 items-center">
              <label className="text-sm font-medium">Select Company:</label>
              <Select
                value={selectedCompany?.id.toString()}
                onValueChange={(val) => {
                  const company = companies.find(c => c.id.toString() === val);
                  setSelectedCompany(company || null);
                }}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Choose a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[150px]">
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Report</SelectItem>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="applications">Applications Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {generating ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Generating report...</span>
        </div>
      ) : reportData && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Internships</p>
                    <p className="text-2xl font-bold mt-1">{reportData.totalInternships}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {reportData.activeInternships} active
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Applications</p>
                    <p className="text-2xl font-bold mt-1">{reportData.totalApplications}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {reportData.pendingApplications} pending
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Certificates Issued</p>
                    <p className="text-2xl font-bold mt-1">{reportData.certificatesIssued}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {reportData.certificatesPaid} paid
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-2">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(reportData.totalRevenue)}</p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-2">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Overview of all applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium">{reportData.pendingApplications}</span>
                  </div>
                  <Progress 
                    value={(reportData.pendingApplications / reportData.totalApplications) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Accepted</span>
                    <span className="text-sm font-medium">{reportData.acceptedApplications}</span>
                  </div>
                  <Progress 
                    value={(reportData.acceptedApplications / reportData.totalApplications) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Rejected</span>
                    <span className="text-sm font-medium">{reportData.rejectedApplications}</span>
                  </div>
                  <Progress 
                    value={(reportData.rejectedApplications / reportData.totalApplications) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{reportData.completedInternships}</span>
                  </div>
                  <Progress 
                    value={(reportData.completedInternships / reportData.totalInternships) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Statistics</CardTitle>
                <CardDescription>Certificate issuance and payment status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Issued Certificates</span>
                    <span className="text-sm font-medium">{reportData.certificatesIssued}</span>
                  </div>
                  <Progress 
                    value={(reportData.certificatesIssued / (reportData.completedInternships || 1)) * 100} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Paid Certificates</span>
                    <span className="text-sm font-medium">{reportData.certificatesPaid}</span>
                  </div>
                  <Progress 
                    value={(reportData.certificatesPaid / (reportData.certificatesIssued || 1)) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue from Certificates</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(reportData.totalRevenue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          {monthlyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Applications and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Internships</TableHead>
                        <TableHead>Certificates</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{data.month}</TableCell>
                          <TableCell>{data.applications}</TableCell>
                          <TableCell>{data.internships}</TableCell>
                          <TableCell>{data.certificates}</TableCell>
                          <TableCell className="text-green-600">{formatCurrency(data.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Email Report Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Report via Email</DialogTitle>
            <DialogDescription>
              Enter the email address where you want to receive the report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="report@sqrock.cloud"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <p className="text-xs text-gray-500">Report will be sent to this email address</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Reports will be sent to: <strong>report@sqrock.cloud</strong>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={sendingEmail || !emailAddress}>
              {sendingEmail && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Send className="h-4 w-4 mr-2" />
              Send Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}