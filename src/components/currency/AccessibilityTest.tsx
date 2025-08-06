import React from 'react';
import { DndContext } from '@dnd-kit/core';

const AccessibilityTest: React.FC = () => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active && over) {
      console.log('Accessible drag ended:', { active: active.id, over: over.id });
    }
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    console.log('Accessible drag started:', active.id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Accessibility Test</h2>
      <p className="text-gray-600 mb-4">
        This component tests accessibility features of the drag and drop functionality.
      </p>
      
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded border-2 border-dashed border-green-300">
            <p className="text-green-800">Accessible Drag Zone</p>
            <p className="text-sm text-green-600">This zone supports keyboard navigation</p>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default AccessibilityTest; 