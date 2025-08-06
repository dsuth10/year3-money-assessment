import React from 'react';
import { CURRENCY_DATA, getAllCurrency } from '../data/currency';

const CurrencyTest: React.FC = () => {
  const allCurrency = getAllCurrency();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Currency Images Test</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Coins</h3>
        <div className="grid grid-cols-3 gap-4">
          {CURRENCY_DATA.coins.map((coin) => (
            <div key={coin.id} className="border rounded-lg p-3 text-center">
              <img 
                src={coin.imagePath} 
                alt={coin.name}
                className="w-16 h-16 mx-auto mb-2 object-contain"
              />
              <p className="text-sm font-medium">{coin.name}</p>
              <p className="text-xs text-gray-600">${coin.value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Notes</h3>
        <div className="grid grid-cols-3 gap-4">
          {CURRENCY_DATA.notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-3 text-center">
              <img 
                src={note.imagePath} 
                alt={note.name}
                className="w-20 h-12 mx-auto mb-2 object-contain"
              />
              <p className="text-sm font-medium">{note.name}</p>
              <p className="text-xs text-gray-600">${note.value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm">
          <strong>Total Items:</strong> {allCurrency.length} 
          ({CURRENCY_DATA.coins.length} coins, {CURRENCY_DATA.notes.length} notes)
        </p>
      </div>
    </div>
  );
};

export default CurrencyTest; 