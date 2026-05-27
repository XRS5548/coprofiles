// components/dashboard/projects/ProjectDetailsDialog.tsx

'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Globe, Lock, Mail as Github, MessageSquare, Edit, Calendar, Star, GitFork, Eye, Users } from 'lucide-react';
import type { Project } from '@/types/project';

interface ProjectDetailsDialogProps {
    project: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (project: Project) => void;
}

export function ProjectDetailsDialog({ project, open, onOpenChange, onEdit }: ProjectDetailsDialogProps) {
    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-gray-900">
                {/* Header with Gradient */}
                <div className="relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-blue-500/10 to-cyan-500/10 rounded-full -ml-24 -mb-24" />
                    
                    <div className="relative p-6 pb-4">
                        <DialogHeader>
                            <DialogTitle className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                                {project.name}
                            </DialogTitle>
                            <DialogDescription className="mt-2 dark:text-gray-400">
                                <div 
                                    dangerouslySetInnerHTML={{ __html: project.description || 'No description provided' }}
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                />
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <div className="p-6 space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Visibility</p>
                            <div className="mt-1">
                                {project.isPublic ? (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-none">
                                        <Globe className="h-3 w-3 mr-1" />
                                        Public
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-none">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Private
                                    </Badge>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Created On</p>
                            <p className="text-sm font-medium flex items-center gap-1 dark:text-gray-300">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(project.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {project.category && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                                <p className="text-sm font-medium capitalize dark:text-gray-300">
                                    {project.category.replace('-', ' ')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    {(project.stars !== undefined || project.forks !== undefined) && (
                        <div className="flex gap-4 p-4 bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg">
                            {project.stars !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Stars</p>
                                        <p className="text-lg font-bold dark:text-gray-200">{project.stars}</p>
                                    </div>
                                </div>
                            )}
                            {project.forks !== undefined && (
                                <div className="flex items-center gap-2">
                                    <GitFork className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Forks</p>
                                        <p className="text-lg font-bold dark:text-gray-200">{project.forks}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 dark:text-gray-300">
                                <MessageSquare className="h-4 w-4" />
                                Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* GitHub Repository */}
                    {project.githubId && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 dark:text-gray-300">
                                <Github className="h-4 w-4" />
                                GitHub Repository
                            </h4>
                            <Button
                                variant="outline"
                                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                onClick={() => window.open(`https://github.com/${project.githubId}`, '_blank')}
                            >
                                <Github className="h-4 w-4" />
                                {project.githubId}
                            </Button>
                        </div>
                    )}

                    {/* Additional Posts/Notes */}
                    {project.posts && (
                        <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 dark:text-gray-300">
                                <MessageSquare className="h-4 w-4" />
                                Additional Notes
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div 
                                    dangerouslySetInnerHTML={{ __html: project.posts }}
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Project Info Footer */}
                    <div className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 dark:text-gray-300">
                            <MessageSquare className="h-4 w-4" />
                            Project Information
                        </h4>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Project ID: <span className="font-mono dark:text-gray-300">{project.id}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last updated: {new Date(project.updatedAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            {project.teamMembers && project.teamMembers.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Team Members: <span className="dark:text-gray-300">{project.teamMembers.join(', ')}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="dark:bg-gray-800" />

                <DialogFooter className="p-6 pt-4 flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="sm:order-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Close
                    </Button>
                    <Button 
                        onClick={() => {
                            onOpenChange(false);
                            onEdit(project);
                        }}
                        className="gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}