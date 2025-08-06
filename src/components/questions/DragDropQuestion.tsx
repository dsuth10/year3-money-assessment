import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableCurrencyItem from '../currency/DraggableCurrencyItem';
import CurrencyDropZone from '../currency/CurrencyDropZone';
import type { DragDropQuestionProps } from '../../types/questions';
import type { CurrencyItem } from '../../types/currency';
import { useQuizStore } from '../../stores/quizStore';

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  questionId,
  targetAmount,
  availableCurrency,
  maxItems = 10,
  onAnswer,
  currentAnswer = [],
  disabled = false
}) => {
  const [selectedItems, setSelectedItems] = useState<CurrencyItem[]>(currentAnswer);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localFeedback, setLocalFeedback] = useState<string>('');
  
  const { validateAnswer, validationResults } = useQuizStore();
  const validationResult = validationResults[questionId];

  // Update selected items when currentAnswer changes
  useEffect(() => {
    if (currentAnswer && Array.isArray(currentAnswer)) {
      setSelectedItems(currentAnswer);
    }
  }, [currentAnswer]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: verticalListSortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.data.current?.type === 'currency-item') {
      const currency = active.data.current.currency as CurrencyItem;
      
      // Check if item is already selected
      const isAlreadySelected = selectedItems.some(item => item.id === currency.id);
      
      if (!isAlreadySelected && selectedItems.length < maxItems) {
        const newSelectedItems = [...selectedItems, currency];
        setSelectedItems(newSelectedItems);
        onAnswer(newSelectedItems);
        
        // Validate the answer
        const result = validateAnswer(questionId, newSelectedItems);
        setLocalFeedback(result.feedback);
      } else if (isAlreadySelected) {
        setLocalFeedback('This item is already selected.');
      } else {
        setLocalFeedback(`You can only select up to ${maxItems} items.`);
      }
    }
  }, [selectedItems, maxItems, targetAmount, onAnswer, questionId, validateAnswer]);

  const removeItem = useCallback((itemId: string) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== itemId);
    setSelectedItems(newSelectedItems);
    onAnswer(newSelectedItems);
    
    // Validate the answer
    const result = validateAnswer(questionId, newSelectedItems);
    setLocalFeedback(result.feedback);
  }, [selectedItems, targetAmount, onAnswer, questionId, validateAnswer]);

  const totalSelected = selectedItems.reduce((sum, item) => sum + item.value, 0);

  // Use validation result feedback if available, otherwise use local feedback
  const displayFeedback = validationResult?.feedback || localFeedback;
  const isCorrect = validationResult?.isCorrect || false;

  return (
    <div className="space-y-6" role="region" aria-label={`Question ${questionId}: Drag and drop to make $${targetAmount.toFixed(2)}`}>
      {/* Question Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Make exactly ${targetAmount.toFixed(2)}
        </h3>
        <p className="text-gray-600">
          Drag coins and notes to the drop zone to make the target amount
        </p>
      </div>

      {/* Current Selection Display */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Your Selection</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedItems.length === 0 ? (
            <p className="text-blue-600 italic">No items selected yet</p>
          ) : (
            selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-200"
              >
                <img
                  src={item.imagePath}
                  alt={item.name}
                  className={`${item.type === 'coin' ? 'w-6 h-6' : 'w-8 h-5'} object-contain`}
                />
                <span className="text-sm font-medium text-blue-900">
                  ${item.value.toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  aria-label={`Remove ${item.name}`}
                  disabled={disabled}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <div className="text-sm font-medium text-blue-900">
          Total: ${totalSelected.toFixed(2)}
        </div>
      </div>

      {/* Feedback */}
      {displayFeedback && (
        <div className={`p-3 rounded-lg border ${
          isCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm ${
            isCorrect ? 'text-green-800' : 'text-yellow-800'
          }`} role="alert" aria-live="polite">
            {displayFeedback}
          </p>
        </div>
      )}

      {/* Drag and Drop Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Currency */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Available Currency</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableCurrency.map((currency) => (
                <DraggableCurrencyItem
                  key={currency.id}
                  currency={currency}
                  disabled={disabled || selectedItems.some(item => item.id === currency.id)}
                  className="w-full"
                />
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Drop Zone</h4>
            <CurrencyDropZone
              id={`question-${questionId}-dropzone`}
              title="Drop Currency Here"
              description="Drag currency items here to build your amount"
              onDrop={(currency) => {
                if (!selectedItems.some(item => item.id === currency.id) && selectedItems.length < maxItems) {
                  const newSelectedItems = [...selectedItems, currency];
                  setSelectedItems(newSelectedItems);
                  onAnswer(newSelectedItems);
                  
                  // Validate the answer
                  const result = validateAnswer(questionId, newSelectedItems);
                  setLocalFeedback(result.feedback);
                }
              }}
              disabled={disabled}
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              <DraggableCurrencyItem
                currency={availableCurrency.find(c => c.id === activeId)!}
                disabled={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Instructions for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {selectedItems.length === 0 
          ? 'No currency selected. Drag items from the available currency to the drop zone.'
          : `Selected ${selectedItems.length} items totaling $${totalSelected.toFixed(2)}. Target amount is $${targetAmount.toFixed(2)}. ${isCorrect ? 'Answer is correct.' : 'Answer needs adjustment.'}`
        }
      </div>
    </div>
  );
};

export default DragDropQuestion; 