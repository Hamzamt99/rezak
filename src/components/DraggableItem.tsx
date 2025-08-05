import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Item {
  id: number;
  name: string;
  type: 'header' | 'form' | 'footer';
  fieldType?: string;
}

interface DraggableItemProps {
  item: Item;
}

const DraggableItem = ({ item }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white p-2 rounded shadow cursor-move transition-colors ${
        isDragging ? 'opacity-50 bg-gray-100' : ''
      }`}
      style={style}
    >
      {item.name}
    </div>
  );
};

export default DraggableItem;
