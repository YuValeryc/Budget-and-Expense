import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { FaHome, FaMoneyBill, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { LuGoal } from "react-icons/lu";
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from '../AuthContext/AuthContext';
import Cookies from 'js-cookie'; 

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); 
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); 

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    Cookies.remove("user"); 
    navigate("/");
  };

  const menuItems = [
    { path: "/home", label: "Trang chủ", icon: <FaHome className="icon" /> },
    { path: "/home/income", label: "Thu nhập", icon: <FaMoneyBillTrendUp className="icon" /> },
    { path: "/home/expense", label: "Tiêu dùng", icon: <FaMoneyBill className="icon" /> },
    { path: "/home/goals", label: "Mục tiêu", icon: <LuGoal className="icon" /> },
    { path: "/home/setting", label: "Cài đặt", icon: <FaCog className="icon" /> },
    { path: "/", label: "Thoát", icon: <FaSignOutAlt className="icon" />, onClick: handleLogout },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <FaBars className="icon-toggle" />
      </div>
      <div className="profile">
        {isExpanded && (
          <>
            <img
              src={user.avatar}
              alt="profile"
              className="profile-pic"
            />
            <h3 className="profile-name">{user ? user.name : "Nguyễn Văn Mười"}</h3>
          </>
        )}
      </div>
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link to={item.path} onClick={item.onClick}>
              {item.icon} {isExpanded && item.label}
            </Link>
          </li>
        ))}
      </ul>
      {isExpanded && (
        <div className="logo">
          <h3>@by Uy Le</h3>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
