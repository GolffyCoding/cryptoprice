import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import { CryptoApiResponse, CryptoData } from './types';

const App: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [filteredCryptoData, setFilteredCryptoData] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get<CryptoApiResponse[]>('https://api.binance.us/api/v3/ticker/24hr');
        const data: CryptoData[] = response.data
          .filter((coin) => coin.symbol.endsWith('USDT') && parseFloat(coin.lastPrice) > 0)
          .map((coin) => ({
            symbol: coin.symbol,
            price: parseFloat(coin.lastPrice),
            change: parseFloat(coin.priceChangePercent),
          }));
        setCryptoData(data);
        setFilteredCryptoData(data);
      } catch (error) {
        console.error('Failed to load crypto data', error);
      }
    };

    fetchCryptoData();
  }, []);

  useEffect(() => {
    setFilteredCryptoData(
      cryptoData.filter((coin) =>
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, cryptoData]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto Price</h1>
      </header>
      <main>
        <input
          type="text"
          placeholder="Search coin"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="crypto-list">
          {filteredCryptoData.length > 0 ? (
            filteredCryptoData.map((coin) => (
              <div className="crypto-item" key={coin.symbol}>
                <div>{coin.symbol}</div>    
                <a href={"https://www.tradingview.com/chart/?symbol="+coin.symbol}>Chart</a>
                <div className="price">${coin.price > 1 ? coin.price.toFixed(2) : coin.price.toFixed(6)}</div>
                <div className={`change ${coin.change >= 0 ? '' : 'negative'}`}>
                  {coin.change.toFixed(2)}%
                </div>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
