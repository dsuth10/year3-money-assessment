import React, { useState, useCallback } from 'react';
// Temporarily comment out @dnd-kit imports for testing
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   KeyboardSensor,
//   useSensor,
//   useSensors,
//   closestCenter,
// } from '@dnd-kit/core';
// import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
// import {
//   SortableContext,
//   verticalListSortableKeyboardCoordinates,
//   sortableKeyboardCoordinates,
// } from '@dnd-kit/sortable';
// import {
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortingQuestionProps } from '../../types/questions';

// Define CurrencyItem interface locally to avoid import issues
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface SortableCurrencyItemProps {
  currency: CurrencyItem;
  disabled?: boolean;
}

const SortableCurrencyItem: React.FC<SortableCurrencyItemProps> = ({ currency, disabled = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: currency.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDragging ? 'shadow-lg scale-105 border-blue-500' : 'hover:shadow-md'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      role="button"
      aria-label={`Sort ${currency.name} (${currency.type}) - Press Enter or Space to start dragging`}
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isDragging}
    >
      <img
        src={currency.imagePath}
        alt={currency.name}
        className={`
          ${currency.type === 'coin' ? 'w-10 h-10' : 'w-12 h-8'}
          object-contain
          ${disabled ? 'grayscale' : ''}
        `}
        draggable={false}
      />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{currency.name}</p>
        <p className="text-sm text-gray-500">${currency.value.toFixed(2)}</p>
      </div>
      <div className="text-gray-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

const SortingQuestion: React.FC<SortingQuestionProps> = ({
  questionId,
  items,
  sortDirection,
  onAnswer,
  currentAnswer = [],
  disabled = false
}) => {
  const [sortedItems, setSortedItems] = useState<CurrencyItem[]>(currentAnswer.length > 0 ? currentAnswer : items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = sortedItems.findIndex(item => item.id === active.id);
      const newIndex = sortedItems.findIndex(item => item.id === over?.id);

      const newSortedItems = [...sortedItems];
      const [movedItem] = newSortedItems.splice(oldIndex, 1);
      newSortedItems.splice(newIndex, 0, movedItem);

      setSortedItems(newSortedItems);
      onAnswer(newSortedItems);

      // Check if sorting is correct
      const isCorrect = checkSorting(newSortedItems, sortDirection);
      if (isCorrect) {
        setFeedback('Perfect! The items are sorted correctly.');
      } else {
        setFeedback(`Try sorting the items in ${sortDirection} order by value.`);
      }
    }
  }, [sortedItems, sortDirection, onAnswer]);

  const checkSorting = useCallback((items: CurrencyItem[], direction: 'ascending' | 'descending') => {
    for (let i = 1; i < items.length; i++) {
      const prevValue = items[i - 1].value;
      const currentValue = items[i].value;
      
      if (direction === 'ascending' && prevValue > currentValue) {
        return false;
      }
      if (direction === 'descending' && prevValue < currentValue) {
        return false;
      }
    }
    return true;
  }, []);

  const resetOrder = useCallback(() => {
    setSortedItems(items);
    onAnswer(items);
    setFeedback('Order reset to original.');
  }, [items, onAnswer]);

  const isCorrectlySorted = checkSorting(sortedItems, sortDirection);

  return (
    <div className="space-y-6" role="region" aria-label={`Question ${questionId}: Sort currency in ${sortDirection} order`}>
      {/* Question Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sort the currency in {sortDirection} order
        </h3>
        <p className="text-gray-600">
          Drag and drop the items to arrange them from {sortDirection === 'ascending' ? 'lowest to highest' : 'highest to lowest'} value
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click and drag items to reorder them</li>
          <li>• Use arrow keys and Space/Enter for keyboard navigation</li>
          <li>• Sort from {sortDirection === 'ascending' ? 'lowest to highest' : 'highest to lowest'} value</li>
        </ul>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-3 rounded-lg border ${
          isCorrectlySorted 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm ${
            isCorrectlySorted ? 'text-green-800' : 'text-yellow-800'
          }`} role="alert" aria-live="polite">
            {feedback}
          </p>
        </div>
      )}

      {/* Sorting Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Sorting Area</h4>
            <button
              onClick={resetOrder}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={disabled}
              aria-label="Reset to original order"
            >
              Reset Order
            </button>
          </div>
          
          <SortableContext items={sortedItems.map(item => item.id)}>
            <div className="space-y-2">
              {sortedItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <SortableCurrencyItem
                    currency={item}
                    disabled={disabled}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              <SortableCurrencyItem
                currency={sortedItems.find(c => c.id === activeId)!}
                disabled={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Current Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Current Order</h4>
        <div className="text-sm text-gray-600">
          {sortedItems.map((item, index) => (
            <span key={item.id}>
              {index > 0 && ' → '}
              ${item.value.toFixed(2)}
            </span>
          ))}
        </div>
        {isCorrectlySorted && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            ✓ Correctly sorted!
          </p>
        )}
      </div>

      {/* Instructions for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {sortedItems.length > 0 
          ? `Sorted ${sortedItems.length} items. Current order: ${sortedItems.map(item => `$${item.value.toFixed(2)}`).join(', ')}. ${isCorrectlySorted ? 'Order is correct.' : 'Order needs adjustment.'}`
          : 'No items to sort.'
        }
      </div>
    </div>
  );
};

export default SortingQuestion; 