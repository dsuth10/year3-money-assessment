import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import DraggableCurrencyItem from './DraggableCurrencyItem';
import CurrencyDropZone from './CurrencyDropZone';
import { getAllCurrency } from '../../data/currency';
import { CurrencyItem } from '../../types/currency';

const AccessibilityTest: React.FC = () => {
  const allCurrency = getAllCurrency();
  const [droppedItems, setDroppedItems] = useState<CurrencyItem[]>([]);
  const [instructions, setInstructions] = useState<string>('');

  const handleDragStart = (event: DragStartEvent) => {
    const currency = event.active.data.current?.currency as CurrencyItem;
    setInstructions(`Started dragging ${currency?.name}. Use arrow keys to move, Enter to drop, Escape to cancel.`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over) {
      const currency = active.data.current?.currency as CurrencyItem;
      if (currency) {
        setDroppedItems(prev => [...prev, currency]);
        setInstructions(`Successfully dropped ${currency.name} into the drop zone.`);
      }
    } else {
      setInstructions('Drag cancelled or dropped outside drop zone.');
    }
  };

  const clearDroppedItems = () => {
    setDroppedItems([]);
    setInstructions('Cleared all dropped items.');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Accessibility Test</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Keyboard Navigation Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tab to navigate between currency items</li>
          <li>• Enter or Space to start dragging a currency item</li>
          <li>• Arrow keys to move the dragged item</li>
          <li>• Enter to drop the item</li>
          <li>• Escape to cancel dragging</li>
          <li>• Tab to navigate to drop zones</li>
        </ul>
      </div>

      {instructions && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{instructions}</p>
        </div>
      )}

      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Draggable Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Currency Items (Keyboard Accessible)</h3>
            <div className="grid grid-cols-3 gap-3">
              {allCurrency.map((currency) => (
                <DraggableCurrencyItem
                  key={currency.id}
                  currency={currency}
                />
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Drop Zone</h3>
            <CurrencyDropZone
              id="accessibility-test-zone"
              title="Test Drop Zone"
              description="Drop currency items here to test accessibility"
            />
          </div>
        </div>

        {/* Dropped Items Display */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Dropped Items</h3>
            <button
              onClick={clearDroppedItems}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear All
            </button>
          </div>
          
          {droppedItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No items dropped yet. Try dragging some currency items!</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {droppedItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                  <img 
                    src={item.imagePath} 
                    alt={item.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DndContext>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">Accessibility Features Tested:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✅ ARIA labels and descriptions</li>
          <li>✅ Keyboard navigation (Tab, Enter, Space, Arrow keys)</li>
          <li>✅ Focus indicators and visual feedback</li>
          <li>✅ Screen reader announcements</li>
          <li>✅ Live regions for dynamic content</li>
          <li>✅ Proper roles and states</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityTest; 