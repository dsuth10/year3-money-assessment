import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CurrencyItem } from '../../types/currency';

interface CurrencyDropZoneProps {
  id: string;
  title?: string;
  description?: string;
  acceptedTypes?: string[];
  onDrop?: (currency: CurrencyItem) => void;
  className?: string;
  disabled?: boolean;
}

const CurrencyDropZone: React.FC<CurrencyDropZoneProps> = ({
  id,
  title = 'Drop Zone',
  description = 'Drop currency here',
  acceptedTypes = ['currency-item'],
  onDrop,
  className = '',
  disabled = false
}) => {
  const {
    setNodeRef,
    isOver,
    active
  } = useDroppable({
    id,
    data: {
      acceptedTypes,
      type: 'drop-zone'
    },
    disabled
  });

  const isActive = isOver && active?.data.current?.type === 'currency-item';

  return (
    <div
      ref={setNodeRef}
      className={`
        border-2 border-dashed rounded-lg p-4
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      role="region"
      aria-label={`${title} drop zone`}
      aria-describedby={`${id}-description`}
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <div className="text-center">
        <div className={`
          text-4xl mb-2
          ${isActive ? 'text-blue-500' : 'text-gray-400'}
        `}>
          {isActive ? '📥' : '📁'}
        </div>
        <h3 className={`
          font-medium mb-1
          ${isActive ? 'text-blue-700' : 'text-gray-700'}
        `}>
          {title}
        </h3>
        <p 
          id={`${id}-description`}
          className={`
            text-sm
            ${isActive ? 'text-blue-600' : 'text-gray-500'}
          `}
        >
          {isActive 
            ? `Drop ${active?.data.current?.currency?.name || 'currency'} here`
            : description
          }
        </p>
        {isActive && (
          <div className="sr-only" aria-live="assertive">
            {active?.data.current?.currency?.name} is being dragged over {title}. Press Enter to drop.
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyDropZone; 