import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";

const CryptoPriceChart = () => {
  const [bitcoinPrices, setBitcoinPrices] = useState([]);
  const [labels, setLabels] = useState([]);

  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [usdtPrice, setUSDTPrice] = useState(null);

    useEffect(() => {
      // Fetch Bitcoin price
      axios
        .get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
          },
        })
        .then((response) => {
          setBitcoinPrice(response.data.bitcoin.usd);
        })
        .catch((error) => {
          console.error('Error fetching Bitcoin price: ', error);
        });

      // Fetch USDT (Tether) price
      axios
        .get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'tether',
            vs_currencies: 'usd',
          },
        })
        .then((response) => {
          setUSDTPrice(response.data.tether.usd);
        })
        .catch((error) => {
          console.error('Error fetching USDT price: ', error);
        });
    }, []);


    
  return (
    <View style={{ padding: 10 , marginLeft: 5  }}>
      <Text style={{fontSize: 15 , fontWeight: '400' , color: 'white', marginVertical: 5}}>Bitcoin Price: ${bitcoinPrice}</Text>

      <Text style={{fontSize: 15 , fontWeight: '400' , color: 'white'}}>USDT Price: ${usdtPrice}</Text>


    </View>
  );
};

export default CryptoPriceChart;
