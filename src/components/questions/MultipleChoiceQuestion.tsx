import React from 'react';

const MultipleChoiceQuestion: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Multiple Choice Question</h2>
      <p className="text-gray-600 mb-4">
        This component demonstrates a multiple choice question interface.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-white border rounded shadow-sm">
          <h3 className="font-semibold mb-3">Sample Question</h3>
          <p className="text-gray-700 mb-4">What is 2 + 2?</p>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="answer" value="3" className="text-blue-600" />
              <span>3</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="answer" value="4" className="text-blue-600" />
              <span>4</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="answer" value="5" className="text-blue-600" />
              <span>5</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion; 