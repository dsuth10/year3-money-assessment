import React from 'react';

const TrueFalseQuestion: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">True/False Question</h2>
      <p className="text-gray-600 mb-4">
        This component demonstrates a true/false question interface.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-white border rounded shadow-sm">
          <h3 className="font-semibold mb-3">Sample Question</h3>
          <p className="text-gray-700 mb-4">Is 2 + 2 equal to 4?</p>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="truefalse" value="true" className="text-blue-600" />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="radio" name="truefalse" value="false" className="text-blue-600" />
              <span>False</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseQuestion; 