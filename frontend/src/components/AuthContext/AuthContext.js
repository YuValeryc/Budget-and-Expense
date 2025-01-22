import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Loading } from './Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get('user'); 
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 }); 
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('user'); 
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
