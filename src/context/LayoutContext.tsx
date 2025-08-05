"use client"

import React, { createContext, useContext, useState } from 'react';
import { initialLayoutData } from '@/data/layout-data';
import { LayoutState, Section, PageConfig } from '@/types/builder';

interface LayoutContextType {
  layout: LayoutState;
  previewLayout: Section[];
  activeId: number | null;
  draggingItem: Section | null;
  editingSection: Section | null;
  isEditorOpen: boolean;
  setLayout: (layout: LayoutState) => void;
  setPreviewLayout: (layout: Section[] | ((prev: Section[]) => Section[])) => void;
  setActiveId: (id: number | null) => void;
  setDraggingItem: (item: any | null) => void;
  setEditingSection: (section: Section | null) => void;
  setIsEditorOpen: (isOpen: boolean) => void;
  handleExport: () => void;
  handleImport: () => void;
  handleEdit: (section: Section) => void;
  handleSaveEdit: (updatedSection: Section) => void;
  removeFromPreview: (id: number) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<LayoutState>(initialLayoutData);
  const [previewLayout, setPreviewLayout] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [draggingItem, setDraggingItem] = useState<any | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Export current layout
  const handleExport = () => {
    const config: PageConfig = {
      sections: previewLayout,
      lastModified: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import layout
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config: PageConfig = JSON.parse(e.target?.result as string);
            setPreviewLayout(config.sections);
          } catch (error) {
            console.error('Error parsing config file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Handle section editing
  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsEditorOpen(true);
  };

  const handleSaveEdit = (updatedSection: Section) => {
    setPreviewLayout((items: Section[]) =>
      items.map((item: Section) =>
        item.id === updatedSection.id ? updatedSection : item
      )
    );
  };

  const removeFromPreview = (id: number) => {
    setPreviewLayout((items) => items.filter((item) => item.id !== id));
  };

  const value = {
    layout,
    previewLayout,
    activeId,
    draggingItem,
    editingSection,
    isEditorOpen,
    setLayout,
    setPreviewLayout,
    setActiveId,
    setDraggingItem,
    setEditingSection,
    setIsEditorOpen,
    handleExport,
    handleImport,
    handleEdit,
    handleSaveEdit,
    removeFromPreview,
  };

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
