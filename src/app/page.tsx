"use client"

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { LayoutProvider } from '@/context/LayoutContext';

import SortableLinks from '@/components/SortableLinks';
import { Card, CardContent } from '@/components/ui/card';
import DraggableItem from '@/components/DraggableItem';
import { ActionButton } from '@/components/ActionButton';
import { SectionEditor } from '@/components/SectionEditor';
import { PreviewDroppable } from '@/components/PreviewDroppable';
import { Section } from '@/types/builder';
import { useLayout } from '@/context/LayoutContext';

interface LayoutState {
  header: Section[];
  form: Section[];
  footer: Section[];
}

interface HomeProps {
}

const Home: React.FC<HomeProps> = () => {
  return (
    <LayoutProvider>
      <HomeContent />
    </LayoutProvider>
  );
};

const HomeContent: React.FC = () => {
  const {
    layout,
    previewLayout,
    activeId,
    draggingItem,
    isEditorOpen,
    editingSection,
    setActiveId,
    setDraggingItem,
    setPreviewLayout,
    setIsEditorOpen,
    setEditingSection,
    handleExport,
    handleImport,
    handleEdit,
    handleSaveEdit,
    removeFromPreview
  } = useLayout();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
    const draggedItem = Object.values(layout)
      .flat()
      .find((item) => item.id === active.id);
    if (draggedItem) {
      setDraggingItem(draggedItem);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggingItem(null);

    if (!over) return;

    // Handle dropping into preview area
    if (over.id === 'preview-area') {
      const draggedItem = Object.values(layout)
        .flat()
        .find((item: Section) => item.id === active.id);

      if (draggedItem) {
        const existingTypeIndex = previewLayout.findIndex(
          (item: Section) => item.type === draggedItem.type
        );

        setPreviewLayout((items: Section[]) => {
          if (existingTypeIndex !== -1) {
            // Replace existing item of same type
            const newItems = [...items];
            newItems[existingTypeIndex] = { ...draggedItem, id: Date.now() };
            return newItems;
          } else {
            // Add new item
            return [...items, { ...draggedItem, id: Date.now() }];
          }
        });
      }
      return;
    }

    // Handle reordering within preview area
    if (active.id !== over.id) {
      setPreviewLayout((items: Section[]) => {
        const oldIndex = items.findIndex((item: Section) => item.id === active.id);
        const overIndex = items.findIndex((item: Section) => item.id === over.id);
        
        if (oldIndex !== -1 && overIndex !== -1) {
          return arrayMove(items, oldIndex, overIndex);
        }
        return items;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className='flex h-screen'>
        {/* Sidebar */}
        <div className='w-64 bg-gray-100 p-4 border-r'>
          <div className='flex items-center justify-between mb-4'>
            {/* <h2 className='text-lg font-bold'>Components</h2> */}
            <div className='flex gap-2'>
              <ActionButton
                onClick={handleImport}
                icon="import"
                label="Import"
              />
              <ActionButton
                onClick={handleExport}
                icon="export"
                label="Export"
              />
            </div>
          </div>
          <div className='space-y-4'>
            {Object.entries(layout).map(([section, items]) => (
              <div key={section}>
                <h3 className='text-sm font-semibold capitalize mb-2'>{section}</h3>
                <div className='space-y-2'>
                  {items.map((item: Section) => (
                    <DraggableItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Area */}
        <div className='flex-1 p-4'>
          <Card className='h-full'>
            <CardContent className='p-6'>
              <PreviewDroppable>
                <div className='min-h-[800px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-6 overflow-y-auto'>
                  <SortableContext items={previewLayout} strategy={verticalListSortingStrategy}>
                    {previewLayout.map((item) => (
                      <div key={item.id} className="relative group">
                        <SortableLinks 
                          key={item.id} 
                          id={item} 
                          onDelete={() => removeFromPreview(item.id)} 
                        />
                        <button
                          onClick={() => handleEdit(item)}
                          className="absolute hidden group-hover:flex items-center gap-2 top-2 right-12 bg-white rounded-full p-2 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </SortableContext>
                </div>
              </PreviewDroppable>
            </CardContent>
          </Card>
        </div>
      </main>

      <DragOverlay>
        {draggingItem ? (
          <div className='bg-white p-2 rounded shadow opacity-80'>
            {draggingItem.name}
          </div>
        ) : null}
      </DragOverlay>

      <SectionEditor
        section={editingSection}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingSection(null);
        }}
        onSave={handleSaveEdit}
      />
    </DndContext>
  );
};

export default Home;
