// components/dashboard/projects/ProjectCard.tsx - No Status/Progress

'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, Star, GitFork, MoreVertical, Globe, Lock, 
  Eye, Edit, Trash2, Loader2, Mail as Github 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const getCategoryBadge = (category?: string) => {
    const config: Record<string, { label: string; color: string; darkColor: string }> = {
      web: { label: 'Web Dev', color: 'bg-blue-100 text-blue-700', darkColor: 'dark:bg-blue-950 dark:text-blue-400' },
      mobile: { label: 'Mobile', color: 'bg-green-100 text-green-700', darkColor: 'dark:bg-green-950 dark:text-green-400' },
      backend: { label: 'Backend', color: 'bg-purple-100 text-purple-700', darkColor: 'dark:bg-purple-950 dark:text-purple-400' },
      'ai-ml': { label: 'AI/ML', color: 'bg-pink-100 text-pink-700', darkColor: 'dark:bg-pink-950 dark:text-pink-400' },
      design: { label: 'Design', color: 'bg-orange-100 text-orange-700', darkColor: 'dark:bg-orange-950 dark:text-orange-400' },
    };
    const cat = category || 'web';
    return (
      <Badge className={`${config[cat]?.color || 'bg-gray-100 text-gray-700'} ${config[cat]?.darkColor || 'dark:bg-gray-800 dark:text-gray-400'} border-none`}>
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
      <Card className="hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {getCategoryBadge(project.category)}
                {project.isPublic ? (
                  <Badge variant="outline" className="text-green-600 dark:text-green-400 dark:border-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 dark:text-gray-400 dark:border-gray-700">
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl line-clamp-1 dark:text-gray-200">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 dark:text-gray-400">
                {project.description || 'No description provided'}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onClick={() => onViewDetails(project)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem 
                  className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
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
                <Badge key={tech} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {project.stars !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs dark:text-gray-400">{project.stars}</span>
                </div>
              )}
              {project.forks !== undefined && (
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs dark:text-gray-400">{project.forks}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => onViewDetails(project)}
          >
            <Eye className="h-3 w-3" />
            Details
          </Button>
          {project.githubId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
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