import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LayoutDefault from './layouts/LayoutDefault/LayoutDefault';
import LoginPage from './pages/Login/LoginPage';
import IncomePage from './pages/Income/index';
import HomePage from './pages/Home/index';
import { AuthProvider } from './components/AuthContext/AuthContext';
import PrivateRoute from './components/AuthContext/PrivateRoute';
import { Loading } from './components/AuthContext/Loading';
import Expense from './pages/Expense';
import Settings from './pages/Setting';
import { CurrencyProvider } from "./components/AuthContext/CurrencyContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from 'react';
import Notification from './components/Notify/notification';
import ForgotPassword from './pages/Login/ForgotPassword';
import GoalPage from './pages/Goal';
import { AlertProvider } from './components/Notify/Confirm';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const isLoggedIn = Cookies.get("user"); 

    if (isLoggedIn && location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate, location]);
  return (
    <AuthProvider>
      <CurrencyProvider>
      <Notification />
      <AlertProvider>
          <Loading> 
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route element={<PrivateRoute />}>
                <Route path="/home" element={<LayoutDefault />}>
                  <Route index element={<HomePage />} />
                  <Route path="income" element={<IncomePage />} />
                  <Route path="expense" element={<Expense />} />
                  <Route path="goals" element={<GoalPage />} />
                  <Route path="setting" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </Loading>
      </AlertProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}


export default App;
