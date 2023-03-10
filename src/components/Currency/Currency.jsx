import { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';

import useLocalStorage from '../../hooks/useLocalStorage';
import fetchExchangeRate from  '../../services/CurrencyApi';

import Loader from "../Loader/Loader";

import Vector from '../../icons/vector.svg';
import styles from './Currency.module.css';

const Currency = () => {
  const [requestData, setRequestData] = useLocalStorage("request", {
    currency: [],
    time: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const isDiagram = location.pathname === "/currencies";

  const prepareData = (data) => {
    const filteredData = data.filter(
      (el) => { if(el.cc === "USD" || el.cc === "EUR" || el.cc === "GBP") return el.cc
    else return "" });
      
    return filteredData.map((el) => ({
      ...el,
      buy: Number(el.rate).toFixed(2),
   
    }));
  };

  const countPastTime = useCallback(() => {
    const pastTime = new Date(Date.now() - requestData.time);
    return pastTime / (1000 * 60);
  }, [requestData.time]);

  useEffect(() => {
    (async () => {
      try {
        if (countPastTime() < 60) {
          return;
        }
        setLoading(true);
        setError("");
        const data = await fetchExchangeRate();
        const normalizedData = prepareData(data);
        setRequestData({ currency: normalizedData, time: Date.now() });
        setLoading(false);
      } catch (error) {
        setError("Sorry, exchange rate is not available now.");
        setLoading(false);
      }
    })();
  }, [countPastTime, requestData, setRequestData]);


  return (
    <div className={`${styles.currencyRatesPanel} ${isDiagram ? " ": styles.hidden}`}>
    <ul className={styles.currencyRatesHead} >
            <li>Currency</li>
            <li>Purchase</li>

          </ul>
          <div className={styles.conteinerdata}>
      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : null}
      {!error && !loading ? (
            <ul className={styles.currencyRatesList}>
            {requestData.currency?.map(({ rate, cc }) => (
              <li className={styles.currencyRatesListItem} key={cc} >
                <span className={styles.currencyData}>{cc}</span>
                <span className={styles.currencyData}>{rate}</span>
              </li>
            ))}

          </ul>
      ) : (
        <div >
          <p>{error}</p>
        </div>
      )}
<img src={Vector} alt="vector" className={styles.vector} />
      </div>
              
    </div>
  );
};
export default Currency;

