import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import DraggableCurrencyItem from './DraggableCurrencyItem';
import { getAllCurrency } from '../../data/currency';

const DraggableCurrencyTest: React.FC = () => {
  const allCurrency = getAllCurrency();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over) {
      console.log('Dragged currency:', active.data.current?.currency);
      console.log('Dropped over:', over.id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Draggable Currency Test</h2>
      <p className="text-gray-600 mb-4">
        Try dragging the currency items below. Check the console for drag events.
      </p>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {allCurrency.map((currency) => (
            <DraggableCurrencyItem
              key={currency.id}
              currency={currency}
            />
          ))}
        </div>
      </DndContext>
      
      <div className="mt-6 p-3 bg-gray-100 rounded">
        <p className="text-sm">
          <strong>Total Draggable Items:</strong> {allCurrency.length}
        </p>
        <p className="text-sm text-gray-600">
          Drag any currency item to test the functionality
        </p>
      </div>
    </div>
  );
};

export default DraggableCurrencyTest; 