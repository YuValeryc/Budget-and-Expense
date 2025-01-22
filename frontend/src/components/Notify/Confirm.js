import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const showAlert = ({ title, text, icon, confirmButtonText }) => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
    });
  };

  const showConfirm = async ({ title, text, icon, confirmButtonText = 'Yes', cancelButtonText = 'No' }) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });
    return result.isConfirmed; 
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook để sử dụng AlertContext
export const useAlert = () => useContext(AlertContext);
