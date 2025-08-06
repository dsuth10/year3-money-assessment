import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import DraggableCurrencyItem from '../currency/DraggableCurrencyItem';
import CurrencyDropZone from '../currency/CurrencyDropZone';
import { useQuizStore } from '../../stores/quizStore';

// Define CurrencyItem interface
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface DragDropQuestionInterfaceProps {
  /** The question data */
  question: {
    id: number;
    title: string;
    prompt: string;
    type: string;
  };
  /** Available currency items for dragging */
  availableCurrency: CurrencyItem[];
  /** Drop zones configuration */
  dropZones: Array<{
    id: string;
    title: string;
    description: string;
    targetValue?: number;
    acceptedTypes?: string[];
  }>;
  /** Optional callback for when items are dropped */
  onDrop?: (zoneId: string, currency: CurrencyItem) => void;
  /** Optional callback for when the answer is validated */
  onValidate?: (answer: Record<string, CurrencyItem[]>) => void;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional disabled state */
  disabled?: boolean;
}

const DragDropQuestionInterface: React.FC<DragDropQuestionInterfaceProps> = ({
  question,
  availableCurrency,
  dropZones,
  onDrop,
  onValidate,
  isLoading = false,
  disabled = false
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<Record<string, CurrencyItem[]>>({});
  const { setAnswer } = useQuizStore();

  // Get the active currency item being dragged
  const activeCurrency = activeId ? availableCurrency.find(item => item.id === activeId) : null;

  // Handle drag start
  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (over && active.data.current?.type === 'currency-item') {
      const currency = active.data.current.currency as CurrencyItem;
      const zoneId = over.id as string;
      
      // Update dropped items state
      setDroppedItems(prev => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), currency]
      }));

      // Call onDrop callback if provided
      if (onDrop) {
        onDrop(zoneId, currency);
      }

      // Update quiz store answer
      const newAnswer = {
        ...droppedItems,
        [zoneId]: [...(droppedItems[zoneId] || []), currency]
      };
      setAnswer(question.id, newAnswer);

      // Call validation callback if provided
      if (onValidate) {
        onValidate(newAnswer);
      }
    }
    
    setActiveId(null);
  }, [droppedItems, onDrop, onValidate, question.id, setAnswer]);

  // Handle removing item from drop zone
  const handleRemoveItem = useCallback((zoneId: string, currencyId: string) => {
    setDroppedItems(prev => ({
      ...prev,
      [zoneId]: prev[zoneId]?.filter(item => item.id !== currencyId) || []
    }));

    // Update quiz store answer
    const newAnswer = {
      ...droppedItems,
      [zoneId]: droppedItems[zoneId]?.filter(item => item.id !== currencyId) || []
    };
    setAnswer(question.id, newAnswer);
  }, [droppedItems, question.id, setAnswer]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="space-y-6">
        {/* Question Prompt */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {question.prompt}
          </h3>
        </div>

        {/* Main Content Area with Drop Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Drop Zones */}
          <div className="space-y-4">
            {dropZones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-lg p-4 shadow-sm">
                <CurrencyDropZone
                  id={zone.id}
                  title={zone.title}
                  description={zone.description}
                  acceptedTypes={zone.acceptedTypes || ['currency-item']}
                  disabled={disabled || isLoading}
                  className="min-h-[120px]"
                />
                
                {/* Dropped Items Display */}
                {droppedItems[zone.id] && droppedItems[zone.id].length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Items in this zone:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {droppedItems[zone.id].map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2"
                        >
                          <img
                            src={item.imagePath}
                            alt={item.name}
                            className={`${item.type === 'coin' ? 'w-6 h-6' : 'w-8 h-5'} object-contain`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(zone.id, item.id)}
                            disabled={disabled}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            aria-label={`Remove ${item.name} from ${zone.title}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Zone Total */}
                    {zone.targetValue && (
                      <div className="mt-2 text-sm text-gray-600">
                        Total: ${droppedItems[zone.id].reduce((sum, item) => sum + item.value, 0).toFixed(2)}
                        {zone.targetValue && (
                          <span className={`ml-2 ${
                            droppedItems[zone.id].reduce((sum, item) => sum + item.value, 0) === zone.targetValue
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}>
                            {droppedItems[zone.id].reduce((sum, item) => sum + item.value, 0) === zone.targetValue
                              ? '✓ Target reached'
                              : `Target: $${zone.targetValue.toFixed(2)}`
                            }
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Currency Items Sidebar */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Available Currency
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-600">Loading currency...</span>
                </div>
              </div>
            ) : availableCurrency.length > 0 ? (
              <SortableContext items={availableCurrency.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableCurrency.map((currency) => (
                    <DraggableCurrencyItem
                      key={currency.id}
                      currency={currency}
                      disabled={disabled}
                      className="w-full"
                    />
                  ))}
                </div>
              </SortableContext>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-2xl mb-2">💰</div>
                <p className="text-gray-500 text-sm">No currency available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeCurrency ? (
          <DraggableCurrencyItem
            currency={activeCurrency}
            className="w-24 h-24"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropQuestionInterface; 