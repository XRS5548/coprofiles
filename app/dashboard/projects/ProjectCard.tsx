// components/dashboard/projects/ProjectCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, Star, GitFork, MoreVertical, Globe, Lock, 
  CheckCircle, Loader2, Clock, Eye, Edit, Trash2, Mail as Github 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  index: number;
  onViewDetails: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  isDeleting: boolean;
}

export function ProjectCard({ 
  project, 
  index, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  isDeleting 
}: ProjectCardProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700"><Loader2 className="h-3 w-3 mr-1 animate-spin" />In Progress</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Planning</Badge>;
    }
  };

  const getCategoryBadge = (category?: string) => {
    const config: Record<string, { label: string; color: string }> = {
      web: { label: 'Web Dev', color: 'bg-blue-100 text-blue-700' },
      mobile: { label: 'Mobile', color: 'bg-green-100 text-green-700' },
      backend: { label: 'Backend', color: 'bg-purple-100 text-purple-700' },
      'ai-ml': { label: 'AI/ML', color: 'bg-pink-100 text-pink-700' },
      design: { label: 'Design', color: 'bg-orange-100 text-orange-700' },
    };
    const cat = category || 'web';
    return (
      <Badge className={config[cat]?.color || 'bg-gray-100 text-gray-700'}>
        {config[cat]?.label || 'Other'}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getCategoryBadge(project.category)}
                {project.isPublic ? (
                  <Badge variant="outline" className="text-green-600">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
                {getStatusBadge(project.status)}
              </div>
              <CardTitle className="text-xl line-clamp-1">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description || 'No description provided'}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(project)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDelete(project.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 flex-1">
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.techStack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-600">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {project.stars !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">{project.stars}</span>
                </div>
              )}
              {project.forks !== undefined && (
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3 text-gray-500" />
                  <span className="text-xs">{project.forks}</span>
                </div>
              )}
            </div>
          </div>
          
          {project.status !== 'completed' && project.progress !== undefined && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1"
            onClick={() => onViewDetails(project)}
          >
            <Eye className="h-3 w-3" />
            Details
          </Button>
          {project.githubId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => window.open(`https://github.com/${project.githubId}`, '_blank')}
            >
              <Github className="h-3 w-3" />
              GitHub
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}