import React from 'react';
import { DndContext } from '@dnd-kit/core';

const DragAndDropTest: React.FC = () => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active && over) {
      console.log('Drag ended:', { active: active.id, over: over.id });
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    console.log('Drag started:', active.id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Drag and Drop Test</h2>
      <p className="text-gray-600 mb-4">
        This is a basic drag and drop test component.
      </p>
      
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-100 rounded border-2 border-dashed border-blue-300">
            <p className="text-blue-800">Drag Zone</p>
            <p className="text-sm text-blue-600">Drop items here</p>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default DragAndDropTest; 