// types/project.ts
export interface Project {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  githubId: string | null;
  posts: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  // Extended fields for UI
  stars?: number;
  forks?: number;
  techStack?: string[];
  status?: 'completed' | 'in-progress' | 'planning';
  progress?: number;
  teamMembers?: string[];
  startDate?: string;
  endDate?: string | null;
  featured?: boolean;
  category?: 'web' | 'mobile' | 'backend' | 'ai-ml' | 'design' | 'other';
}

export interface ProjectStats {
  total: number;
  public: number;
  private: number;
  withGithub: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
  isPublic: boolean;
  githubId: string;
  posts: string;
}