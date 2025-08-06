import React, { KeyboardEvent } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
// Define CurrencyItem interface locally to avoid import issues
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface DraggableCurrencyItemProps {
  currency: CurrencyItem;
  disabled?: boolean;
  className?: string;
}

const DraggableCurrencyItem: React.FC<DraggableCurrencyItemProps> = ({
  currency,
  disabled = false,
  className = ''
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: currency.id,
    data: {
      currency,
      type: 'currency-item'
    },
    disabled
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Trigger drag start for keyboard users
      listeners.onKeyDown?.(event);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onKeyDown={handleKeyDown}
      className={`
        cursor-grab active:cursor-grabbing
        border-2 border-gray-200 rounded-lg p-2
        bg-white shadow-sm hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDragging ? 'shadow-lg scale-105' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      role="button"
      aria-label={`Drag ${currency.name} (${currency.type}) - Press Enter or Space to start dragging`}
      aria-describedby={`${currency.id}-description`}
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isDragging}
    >
      <div className="flex flex-col items-center">
        <img
          src={currency.imagePath}
          alt={currency.name}
          className={`
            ${currency.type === 'coin' ? 'w-12 h-12' : 'w-16 h-10'}
            object-contain
            ${disabled ? 'grayscale' : ''}
          `}
          draggable={false}
        />
        <div className="mt-1 text-center">
          <p className="text-xs font-medium text-gray-700">
            {currency.name}
          </p>
          <p className="text-xs text-gray-500">
            ${currency.value.toFixed(2)}
          </p>
        </div>
        <div 
          id={`${currency.id}-description`}
          className="sr-only"
        >
          {currency.name} worth ${currency.value.toFixed(2)}. Use Enter or Space to start dragging, arrow keys to move, and Enter to drop.
        </div>
      </div>
    </div>
  );
};

export default DraggableCurrencyItem; 