import { useDroppable } from '@dnd-kit/core';
import React from 'react';

interface PreviewDroppableProps {
  children: React.ReactNode;
}

export function PreviewDroppable({ children }: PreviewDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'preview-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full transition-colors duration-200 ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      {children}
    </div>
  );
}
