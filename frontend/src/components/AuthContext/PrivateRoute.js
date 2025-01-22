import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext';
import { Loading } from './Loading';

const PrivateRoute = ({ element, ...rest }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
