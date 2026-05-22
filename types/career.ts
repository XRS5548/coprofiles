// types/career.ts
export interface JobApplication {
  id: number;
  careerId: number;
  careerName: string;
  position: string;
  salary: number | null;
  companyName: string;
  companyLogo: string | null;
  appliedAt: number;
}

export interface JobApplicationStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  companies: number;
}