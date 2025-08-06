export interface CurrencyItem {
  id: string;
  value: number;
  name: string;
  type: 'coin' | 'note';
  image: string;
  imagePath: string;
}

export interface CurrencyData {
  coins: CurrencyItem[];
  notes: CurrencyItem[];
}

export type CurrencyType = 'coin' | 'note'; 