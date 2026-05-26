// types/certificate.ts
export interface Certificate {
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
}