import React, { useContext } from 'react';
import './ItemList.css';
import { CurrencyContext }  from '../AuthContext/CurrencyContext';

const Item = ({ transaction, handleDeleteTransaction }) => {
  const { currency, position } = useContext(CurrencyContext);
  
  return (
    <div className="transaction-item">
      <div className="transaction-details">
        <p className="transaction-source">{transaction.source}</p>
        <p className="transaction-amount"> {position === 0 ? `${currency} ${transaction.amount}` : `${transaction.amount} ${currency}`}</p>
        <p className="transaction-category">{transaction.date}</p>
        <p className="transaction-category">{transaction.category}</p>
        <p className="transaction-description">{transaction.description}</p>
      </div>
      <button
        className="transaction-delete-button"
        onClick={() => handleDeleteTransaction(transaction._id)}
      >
        🗑
      </button>
    </div>
  );
};

export default Item;
