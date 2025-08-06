import React from 'react';

const TextInputQuestion: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Text Input Question</h2>
      <p className="text-gray-600 mb-4">
        This component demonstrates a text input question interface.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-white border rounded shadow-sm">
          <h3 className="font-semibold mb-3">Sample Question</h3>
          <p className="text-gray-700 mb-4">What is your favorite number?</p>
          
          <div className="space-y-2">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
              Your Answer:
            </label>
            <input
              type="text"
              id="answer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your answer here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInputQuestion; 