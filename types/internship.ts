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

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  companyName: string;
  companyLogo: string | null;
  status: ApplicationStatus;
  rollNo: string | null;
  examDate: string | null;
  certificateUnlocked: boolean;
  internshipActive: boolean;
  lastApplyDate: string | null;
  duration: number | null;
  description: string | null;
  appliedDate: string;
}


// types/internship.ts
export interface InternshipDetails {
  id: number;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  lastApplyDate?: Date | null;
}

export interface ApplicationDetails {
  id: number;
  internshipId: number;
  userId: number;
  certificateUnlocked: boolean;
  internshipActive: boolean;
  appliedAt: Date;
  internship: InternshipDetails;
}

export interface Application {
  id: number;
  internshipId: number;
  userId: number;
  certificateUnlocked: boolean;
  internshipActive: boolean;
  appliedDate: string;
  internship?: {
    id: number;
    title: string;
    company: string;
    companyLogo?: string | null;
    duration: string;
  };
}