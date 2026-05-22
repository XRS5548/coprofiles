// components/dashboard/projects/ProjectFormDialog.tsx
'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { Editor } from "@ckeditor/ckeditor5-core";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { ProjectFormData } from '@/types/project';

import 'ckeditor5/ckeditor5.css';

// Fix: Properly type the editor config
const editorConfig = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      'blockQuote',
      '|',
      'insertTable',
      'mediaEmbed',
      '|',
      'sourceEditing',
    ],
  },
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
    ],
  },
  placeholder: 'Write here...',
  licenseKey: 'GPL',
};

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: ProjectFormData;
  onFormChange: (data: Partial<ProjectFormData>) => void;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  onFormChange,
  mode,
  isLoading = false,
}: ProjectFormDialogProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (open) {
      setEditorLoaded(true);
    }
  }, [open]);

  const titles = {
    create: {
      title: 'Create New Project',
      description: 'Add a new project to your portfolio',
    },
    edit: {
      title: 'Edit Project',
      description: 'Update your project details',
    },
  };

  const title = titles[mode];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[1200px] h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <DialogTitle>{title.title}</DialogTitle>
          <DialogDescription>{title.description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Name */}
          <div className="shrink-0">
            <Label>
              Project Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              disabled={isLoading}
              className="mt-2"
              placeholder="Project Name"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col min-h-[300px]">
            <Label>Description</Label>
            <div className="mt-2 border rounded-xl overflow-hidden flex-1">
              {mounted && editorLoaded && (
                <div className="h-[300px]">
                  <CKEditor
                    editor={ClassicEditor as any}
                    config={editorConfig as any}
                    data={formData.description || ''}
                    disabled={isLoading}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      onFormChange({ description: data });
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rich description for project
            </p>
          </div>

          {/* Github */}
          <div className="shrink-0">
            <Label>GitHub Repository ID</Label>
            <Input
              value={formData.githubId || ''}
              onChange={(e) => onFormChange({ githubId: e.target.value })}
              className="mt-2"
              placeholder="username/repository"
            />
          </div>

          {/* Posts */}
          <div className="flex flex-col min-h-[300px]">
            <Label>Additional Posts</Label>
            <div className="mt-2 border rounded-xl overflow-hidden flex-1">
              {mounted && editorLoaded && (
                <div className="h-[300px]">
                  <CKEditor
                    editor={ClassicEditor as any}
                    config={editorConfig as any}
                    data={formData.posts || ''}
                    disabled={isLoading}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      onFormChange({ posts: data });
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Public */}
          <div className="flex gap-3 items-start p-4 rounded-xl border bg-muted/30 shrink-0">
            <input
              type="checkbox"
              checked={formData.isPublic || false}
              onChange={(e) => onFormChange({ isPublic: e.target.checked })}
              className="mt-1"
            />
            <div>
              <Label>Make Public</Label>
              <p className="text-xs text-muted-foreground">
                Visible on your profile
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading || !formData.name?.trim()}
            onClick={onSubmit}
          >
            {isLoading
              ? 'Saving...'
              : mode === 'create'
              ? 'Create Project'
              : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}