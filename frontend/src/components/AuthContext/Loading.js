import React, { createContext, useState, useContext } from 'react';
import './Loading.css';


const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const Loading = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      <>
        {loading && 
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>} 
        {children}
      </>
    </LoadingContext.Provider>
  );
};