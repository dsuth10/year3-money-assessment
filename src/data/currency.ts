// Define CurrencyData interface locally to avoid import issues
interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

interface CurrencyData {
  coins: CurrencyItem[];
  notes: CurrencyItem[];
}

// Import all currency images from Static/Currency folder
// import fiveCentCoin from '../../Static/Currency/Five Cent Coin.png';
// import tenCentCoin from '../../Static/Currency/Ten Cent Coin.png';
// import twentyCentCoin from '../../Static/Currency/Twenty Cent Coin.png';
// import fiftyCentCoin from '../../Static/Currency/Fifty Cent Coin.png';
// import oneDollarCoin from '../../Static/Currency/One Dollar Coin.png';
// import twoDollarCoin from '../../Static/Currency/Two Dollar Coin.png';

// import fiveDollarNote from '../../Static/Currency/Five Dollar Note.png';
// import tenDollarNote from '../../Static/Currency/Ten Dollar Note.jpg';
// import twentyDollarNote from '../../Static/Currency/Twenty Dollar Note.jpg';
// import fiftyDollarNote from '../../Static/Currency/Fifty Dollar Note.png';
// import oneHundredDollarNote from '../../Static/Currency/One Hundred Dollar Note.jpg';

export const CURRENCY_DATA: CurrencyData = {
  coins: [
    {
      id: '5c',
      value: 0.05,
      name: 'Five Cent',
      type: 'coin',
      image: 'Five Cent Coin.png',
      imagePath: '/Static/Currency/Five Cent Coin.png'
    },
    {
      id: '10c',
      value: 0.10,
      name: 'Ten Cent',
      type: 'coin',
      image: 'Ten Cent Coin.png',
      imagePath: '/Static/Currency/Ten Cent Coin.png'
    },
    {
      id: '20c',
      value: 0.20,
      name: 'Twenty Cent',
      type: 'coin',
      image: 'Twenty Cent Coin.png',
      imagePath: '/Static/Currency/Twenty Cent Coin.png'
    },
    {
      id: '50c',
      value: 0.50,
      name: 'Fifty Cent',
      type: 'coin',
      image: 'Fifty Cent Coin.png',
      imagePath: '/Static/Currency/Fifty Cent Coin.png'
    },
    {
      id: '1',
      value: 1.00,
      name: 'One Dollar',
      type: 'coin',
      image: 'One Dollar Coin.png',
      imagePath: '/Static/Currency/One Dollar Coin.png'
    },
    {
      id: '2',
      value: 2.00,
      name: 'Two Dollar',
      type: 'coin',
      image: 'Two Dollar Coin.png',
      imagePath: '/Static/Currency/Two Dollar Coin.png'
    }
  ],
  notes: [
    {
      id: '5',
      value: 5.00,
      name: 'Five Dollar',
      type: 'note',
      image: 'Five Dollar Note.png',
      imagePath: '/Static/Currency/Five Dollar Note.png'
    },
    {
      id: '10',
      value: 10.00,
      name: 'Ten Dollar',
      type: 'note',
      image: 'Ten Dollar Note.jpg',
      imagePath: '/Static/Currency/Ten Dollar Note.jpg'
    },
    {
      id: '20',
      value: 20.00,
      name: 'Twenty Dollar',
      type: 'note',
      image: 'Twenty Dollar Note.jpg',
      imagePath: '/Static/Currency/Twenty Dollar Note.jpg'
    },
    {
      id: '50',
      value: 50.00,
      name: 'Fifty Dollar',
      type: 'note',
      image: 'Fifty Dollar Note.png',
      imagePath: '/Static/Currency/Fifty Dollar Note.png'
    },
    {
      id: '100',
      value: 100.00,
      name: 'One Hundred Dollar',
      type: 'note',
      image: 'One Hundred Dollar Note.jpg',
      imagePath: '/Static/Currency/One Hundred Dollar Note.jpg'
    }
  ]
};

// Helper functions for currency data
export const getAllCurrency = () => [...CURRENCY_DATA.coins, ...CURRENCY_DATA.notes];

export const getCurrencyById = (id: string) => 
  getAllCurrency().find(item => item.id === id);

export const getCurrencyByValue = (value: number) => 
  getAllCurrency().find(item => item.value === value);

export const getCoins = () => CURRENCY_DATA.coins;

export const getNotes = () => CURRENCY_DATA.notes; 