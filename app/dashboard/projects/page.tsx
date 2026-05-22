'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import type { Project, ProjectStats, ProjectFormData } from '@/types/project';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// सभी components को dynamically import करो (SSR बंद करने के लिए)
const ProjectStatsCards = dynamic(
  () => import('./ProjectStatsCards').then(mod => mod.ProjectStatsCards),
  { 
    ssr: false,
    loading: () => (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }
);

const ProjectSearchBar = dynamic(
  () => import('./ProjectSearchBar').then(mod => mod.ProjectSearchBar),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full" />
  }
);

const ProjectCard = dynamic(
  () => import('./ProjectCard').then(mod => mod.ProjectCard),
  { ssr: false }
);

const ProjectFormDialog = dynamic(
  () => import('./ProjectFormDialog').then(mod => mod.ProjectFormDialog),
  { ssr: false }
);

const ProjectDetailsDialog = dynamic(
  () => import('./ProjectDetailsDialog').then(mod => mod.ProjectDetailsDialog),
  { ssr: false }
);

const EmptyProjectsState = dynamic(
  () => import('./EmptyProjectsState').then(mod => mod.EmptyProjectsState),
  { ssr: false }
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    isPublic: true,
    githubId: '',
    posts: '',
  });

  // Helper functions (ये safe हैं क्योंकि ये window use नहीं करतीं)
  const extractTechStack = (description: string): string[] => {
    const commonTech = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind', 'MongoDB', 'PostgreSQL'];
    const found: string[] = [];
    commonTech.forEach(tech => {
      if (description.toLowerCase().includes(tech.toLowerCase())) {
        found.push(tech);
      }
    });
    return found.length > 0 ? found.slice(0, 4) : ['React', 'Node.js'];
  };

  const getRandomStatus = (): 'completed' | 'in-progress' | 'planning' => {
    const statuses: ('completed' | 'in-progress' | 'planning')[] = ['in-progress', 'planning', 'completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getRandomProgress = (): number => {
    return Math.floor(Math.random() * 100);
  };

  const detectCategory = (name: string, description: string): Project['category'] => {
    const text = (name + ' ' + description).toLowerCase();
    if (text.includes('mobile') || text.includes('app')) return 'mobile';
    if (text.includes('api') || text.includes('backend') || text.includes('server')) return 'backend';
    if (text.includes('ai') || text.includes('ml') || text.includes('machine learning')) return 'ai-ml';
    if (text.includes('design') || text.includes('ui') || text.includes('ux')) return 'design';
    return 'web';
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/projects', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      const transformedProjects = (data.projects || []).map((project: any) => ({
        ...project,
        stars: Math.floor(Math.random() * 100),
        forks: Math.floor(Math.random() * 50),
        techStack: extractTechStack(project.description || ''),
        status: getRandomStatus(),
        progress: getRandomProgress(),
        teamMembers: ['You'],
        startDate: project.createdAt,
        endDate: null,
        featured: false,
        category: detectCategory(project.name, project.description || ''),
      }));
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Calculate stats
  const stats: ProjectStats = {
    total: projects.length,
    public: projects.filter(p => p.isPublic).length,
    private: projects.filter(p => !p.isPublic).length,
    withGithub: projects.filter(p => p.githubId).length,
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesSearch;
  });

  // Create project
  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          isPublic: formData.isPublic,
          githubId: formData.githubId || null,
          posts: formData.posts || null,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Project created successfully');
        setIsCreateOpen(false);
        resetForm();
        fetchProjects();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update project
  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/user/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          isPublic: formData.isPublic,
          githubId: formData.githubId || null,
          posts: formData.posts || null,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Project updated successfully');
        setIsEditOpen(false);
        resetForm();
        fetchProjects();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId: number) => {
    setDeleting(projectId);
    try {
      const response = await fetch(`/api/user/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isPublic: true,
      githubId: '',
      posts: '',
    });
    setSelectedProject(null);
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      isPublic: project.isPublic,
      githubId: project.githubId || '',
      posts: project.posts || '',
    });
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-gray-500 mt-1">Manage and showcase your coding projects</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <ProjectStatsCards stats={stats} />

      {/* Search Bar */}
      <ProjectSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyProjectsState 
          onCreateClick={() => setIsCreateOpen(true)}
          hasSearchTerm={searchTerm.length > 0}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onViewDetails={setSelectedProject}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
              isDeleting={deleting === project.id}
            />
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <ProjectFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateProject}
        formData={formData}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
        mode="create"
        isLoading={isSubmitting}
      />

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onEdit={openEditModal}
      />

      {/* Edit Project Dialog */}
      <ProjectFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdateProject}
        formData={formData}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
        mode="edit"
        isLoading={isSubmitting}
      />
    </div>
  );
}