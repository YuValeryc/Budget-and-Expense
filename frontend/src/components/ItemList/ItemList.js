import React from 'react';
import './ItemList.css';
import Item from './Item';

const ItemList = ({ transactions, handleDeleteTransaction }) => {
  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <Item 
          key={transaction._id} 
          transaction={transaction} 
          handleDeleteTransaction={handleDeleteTransaction} 
        />
      ))}
    </div>
  );
};

export default ItemList;
