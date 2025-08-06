import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import DraggableCurrencyItem from './DraggableCurrencyItem';
import CurrencyDropZone from './CurrencyDropZone';
import { getAllCurrency } from '../../data/currency';
import { CurrencyItem } from '../../types/currency';

const DragAndDropTest: React.FC = () => {
  const allCurrency = getAllCurrency();
  const [droppedItems, setDroppedItems] = useState<Record<string, CurrencyItem[]>>({
    'zone-1': [],
    'zone-2': [],
    'zone-3': []
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (active && over) {
      const currency = active.data.current?.currency as CurrencyItem;
      const zoneId = over.id as string;
      
      if (currency && zoneId) {
        setDroppedItems(prev => ({
          ...prev,
          [zoneId]: [...(prev[zoneId] || []), currency]
        }));
        
        console.log(`Dropped ${currency.name} into ${zoneId}`);
      }
    }
  };

  const removeFromZone = (zoneId: string, currencyId: string) => {
    setDroppedItems(prev => ({
      ...prev,
      [zoneId]: prev[zoneId].filter(item => item.id !== currencyId)
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Complete Drag and Drop Test</h2>
      <p className="text-gray-600 mb-4">
        Drag currency items into the drop zones below. Items will be collected in each zone.
      </p>
      
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Draggable Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Currency Items</h3>
            <div className="grid grid-cols-3 gap-3">
              {allCurrency.map((currency) => (
                <DraggableCurrencyItem
                  key={currency.id}
                  currency={currency}
                />
              ))}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Drop Zones</h3>
            
            <CurrencyDropZone
              id="zone-1"
              title="Zone 1"
              description="Drop coins here"
            />
            
            <CurrencyDropZone
              id="zone-2"
              title="Zone 2"
              description="Drop notes here"
            />
            
            <CurrencyDropZone
              id="zone-3"
              title="Zone 3"
              description="Drop any currency here"
            />
          </div>
        </div>

        {/* Dropped Items Display */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Dropped Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(droppedItems).map(([zoneId, items]) => (
              <div key={zoneId} className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">{zoneId.replace('-', ' ').toUpperCase()}</h4>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items dropped</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={item.imagePath} 
                            alt={item.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <button
                          onClick={() => removeFromZone(zoneId, item.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default DragAndDropTest; 