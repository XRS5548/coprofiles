// types/internship.ts
export interface ApiApplication {
  id: number;
  internshipId: number;
  internshipTitle: string;
  companyName: string;
  companyLogo: string | null;
  appliedAt: number;
  certificateUnlocked: boolean;
  internshipActive: boolean;
  lastApplyDate: string | null;
}

export interface Application extends ApiApplication {
  appliedDate: string;
}