import React, { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const storedCurrency = localStorage.getItem("currency") || "USD";
  const storedPosition = parseInt(localStorage.getItem("position")) || 0;

  const [currency, setCurrency] = useState(storedCurrency);
  const [position, setPosition] = useState(storedPosition);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("position", position.toString());
  }, [position]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, position, setPosition }}>
      {children}
    </CurrencyContext.Provider>
  );
};
