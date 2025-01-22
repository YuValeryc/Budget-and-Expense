import { Outlet } from "react-router-dom";
import "./LayoutDefault.css";
import Sidebar from "../../components/SideBar";

const LayoutDefault = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutDefault;
