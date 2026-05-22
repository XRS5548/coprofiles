// components/dashboard/projects/ProjectSearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ProjectSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProjectSearchBar({ searchTerm, onSearchChange }: ProjectSearchBarProps) {
  return (
    <Card className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </Card>
  );
}