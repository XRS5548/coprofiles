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
import { Globe, Lock, Mail as Github, MessageSquare, Edit, Calendar } from 'lucide-react';
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{project.name}</DialogTitle>
                    <DialogDescription>
                        <div
                            dangerouslySetInnerHTML={{ __html: project.description || 'No description provided' }}
                        />
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Visibility</p>
                            <div className="mt-1">
                                {project.isPublic ? (
                                    <Badge className="bg-green-100 text-green-700">
                                        <Globe className="h-3 w-3 mr-1" />
                                        Public
                                    </Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-700">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Private
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {project.githubId && (
                        <div>
                            <p className="text-xs text-gray-500">GitHub Repository</p>
                            <Button
                                variant="outline"
                                className="mt-1 gap-2"
                                onClick={() => window.open(`https://github.com/${project.githubId}`, '_blank')}
                            >
                                <Github className="h-4 w-4" />
                                {project.githubId}
                            </Button>
                        </div>
                    )}

                    {project.posts && (
                        <div>
                            <p className="text-xs text-gray-500">Additional Notes</p>
                            <p className="text-sm mt-1 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                {project.posts}
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Project Info
                        </h4>
                        <p className="text-xs text-gray-500">Project ID: {project.id}</p>
                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={() => {
                        onOpenChange(false);
                        onEdit(project);
                    }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}