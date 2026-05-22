// components/dashboard/projects/EmptyProjectsState.tsx
'use client';

import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyProjectsStateProps {
  onCreateClick: () => void;
  hasSearchTerm?: boolean;
}

export function EmptyProjectsState({ onCreateClick, hasSearchTerm = false }: EmptyProjectsStateProps) {
  if (hasSearchTerm) {
    return (
      <Card className="p-12 text-center">
        <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600">No projects found</h3>
        <p className="text-gray-400 mt-1">Try adjusting your search</p>
      </Card>
    );
  }

  return (
    <Card className="p-12 text-center">
      <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600">No projects found</h3>
      <p className="text-gray-400 mt-1">Create your first project to get started</p>
      <Button className="mt-4" onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" />
        Create Project
      </Button>
    </Card>
  );
}