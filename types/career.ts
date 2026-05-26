// types/career.ts
export type CareerApplicationStatus = 
  | 'pending' 
  | 'reviewing' 
  | 'shortlisted' 
  | 'interview' 
  | 'accepted' 
  | 'rejected' 
  | 'hired';

export interface JobApplication {
  id: number;
  careerId: number;
  careerName: string;
  companyName: string;
  companyLogo: string | null;
  position: string | null;
  salary: number | null;
  status: CareerApplicationStatus;
  officeId: string | null;
  appliedAt: number;
  interviewDate: number | null;
  joiningDate: number | null;
  feedback: string | null;
  offerLetterUrl: string | null;
  salaryOffered: number | null;
  coverLetter?: string | null;
  resumeUrl?: string | null;
}

export interface JobApplicationStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  companies: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interview: number;
  accepted: number;
  rejected: number;
  hired: number;
}