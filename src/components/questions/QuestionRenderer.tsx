import React from 'react';

const QuestionRenderer: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Question Renderer</h2>
      <p className="text-gray-600 mb-4">
        This component demonstrates a question renderer interface.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-white border rounded shadow-sm">
          <h3 className="font-semibold mb-3">Sample Question</h3>
          <p className="text-gray-700 mb-4">This is a sample question that would be rendered here.</p>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              The question renderer would dynamically load different question types based on the question configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionRenderer; 