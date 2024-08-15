export interface CryptoApiResponse {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
  }
  
  export interface CryptoData {
    symbol: string;
    price: number;
    change: number;
  }