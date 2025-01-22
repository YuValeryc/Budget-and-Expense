import React, { useState, useEffect, useContext } from "react";
import "./Setting.css";
import AuthContext from "../../components/AuthContext/AuthContext";
import { useLoading } from "../../components/AuthContext/Loading";
import { CurrencyContext } from "../../components/AuthContext/CurrencyContext";
import Cookies from "js-cookie";
import { notify } from "../../components/Notify/notification";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext); // Ensure setUser is available
  const { startLoading, stopLoading } = useLoading();
  const { currency, setCurrency, position, setPosition } = useContext(CurrencyContext);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");

  const [editableUserName, setEditableUserName] = useState(user?.name || "");
  const [editableEmail, setEditableEmail] = useState(user?.email || "");
  const [editablePassword, setEditablePassword] = useState("");

  const handleCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency); 
  };

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchCategories = async (type, setCategories) => {
      startLoading();
      try {
        const res = await fetch(
          `http://localhost:5000/categories/show?user_id=${user.user_id}&type=${type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`Failed to fetch ${type} categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    };

    fetchCategories("income", setIncomeCategories);
    fetchCategories("expense", setExpenseCategories);
  }, [user?.user_id]);

  const handleUserUpdate = async (type, newValue) => {
    if (!newValue.trim()) return notify(2, "Vui lòng nhập thông tin mới", "Error");
    try {
      startLoading();
      const res = await fetch(`http://localhost:5000/updateUserInfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          [type]: newValue,
        }),
      });
      if (!res.ok) throw new Error(`Failed to update ${type}`);
      const updatedUser = await res.json();

      setUser(updatedUser.user);
      Cookies.set("user", JSON.stringify(updatedUser.user), { expires: 7 });
      stopLoading();
      notify(1, "Thông tin đã được cập nhật", "Success");
    } catch (err) {
      console.error(err);
      notify(2, "Có lỗi xảy ra khi cập nhật thông tin", "Error");
    }
  };

  const handlePasswordChange = async () => {
    if (!editablePassword.trim()) return notify(2, "Vui lòng nhập mật khẩu mới", "Error");
    try {
      startLoading();
      const res = await fetch(`http://localhost:5000/updatePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          newPassword: editablePassword,
        }),
      });
      stopLoading();
      if (!res.ok) throw new Error("Failed to change password");
      notify(1, "Mật khẩu thay đổi thành công", "Success");
    } catch (err) {
      console.error(err);
      notify(2, "Có lỗi xảy ra khi thay đổi mật khẩu", "Error");
    }
  };

  const addCategory = async (type, name, setCategories, setNewCategory) => {
    if (name.trim() === "") return notify(2, "Lỗi category không hợp lệ", "Error");

    try {
      startLoading();
      const res = await fetch(`http://localhost:5000/categories/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          user_id: user.user_id,
          type,
        }),
      });
      stopLoading();
      if (!res.ok) throw new Error("Failed to add category");
      const data = await res.json();
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
      notify(1, "Danh mục đã được thêm", "Success");
    } catch (err) {
      console.error(err);
      notify(2, "Có lỗi xảy ra khi thêm danh mục", "Error");
    }
  };

  const deleteCategory = async (id, type, setCategories) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này không?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/categories/delete/${id}?user_id=${user.user_id}&type=${type}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="setting-container">
      <h1 className="setting-title">Thông tin tài khoản</h1>
      <table className="setting-account-table">
        <tbody>
          <tr>
            <td className="setting-label">User name</td>
            <td>
              <input 
                type="text"
                value={editableUserName}
                onChange={(e) => setEditableUserName(e.target.value)}
                className="setting-input"
              />
            </td>
            <td>
              <button 
                className="setting-edit-button"
                onClick={() => handleUserUpdate("name", editableUserName)}
              >
                Lưu
              </button>
            </td>
          </tr>
          <tr>
            <td className="setting-label">Email</td>
            <td>
              <input 
                type="email"
                value={editableEmail}
                onChange={(e) => setEditableEmail(e.target.value)}
                className="setting-input"
              />
            </td>
            <td>
              <button 
                className="setting-edit-button"
                onClick={() => handleUserUpdate("email", editableEmail)}
              >
                Lưu
              </button>
            </td>
          </tr>
          <tr>
            <td className="setting-label">Password</td>
            <td>
              <input
                type="password"
                value={editablePassword}
                onChange={(e) => setEditablePassword(e.target.value)}
                className="setting-input"
              />
            </td>
            <td>
              <button 
                className="setting-password-button"
                onClick={handlePasswordChange}
              >
                Đổi mật khẩu
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="currency-settings">
          <h2 className="currency-settings-title">Cài đặt đơn vị tiền tệ</h2>
          <div className="currency-settings-content">
            <label htmlFor="currency-select" className="currency-settings-label">
              Đơn vị tiền 
            </label>
            <select
              id="currency-select"
              value={currency} 
              onChange={handleCurrencyChange}
              className="currency-settings-select"
            >
              <option value="USD">USD ($)</option>
              <option value="VND">VND (₫)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="currency-position-settings">
            <h3 className="currency-position-title">Ví trị của đơn vị tiền tệ</h3>
            <div className="currency-position-options">
              <label>
                <input
                  type="radio"
                  value="before"
                  checked={position === 0}
                  onChange={() => setPosition(0)}
                />
                Trước
              </label>
              <label>
                <input
                  type="radio"
                  value="after"
                  checked={position === 1}
                  onChange={() => setPosition(1)}
                />
                Sau
              </label>
            </div>
          </div>
        </div>

      <section className="setting-category">
        <h2 className="setting-section-title">Quản lý danh mục</h2>
        {/* Danh mục thu nhập */}
        <div className="setting-category-group">
          <h3 className="setting-category-title">Danh mục thu nhập</h3>
          <ul className="setting-category-list">
            {incomeCategories.map((category) => (
              <li key={category._id} className="setting-category-item">
                {category.name}
                <button
                  className="setting-delete-button"
                  onClick={() =>
                    deleteCategory(category._id, "income", setIncomeCategories)
                  }
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
          <div className="setting-add-category">
            <input
              className="setting-input"
              type="text"
              value={newIncomeCategory}
              onChange={(e) => setNewIncomeCategory(e.target.value)}
              placeholder="Thêm danh mục thu nhập mới"
            />
            <button
              className="setting-button"
              onClick={() =>
                addCategory("income", newIncomeCategory, setIncomeCategories, setNewIncomeCategory)
              }
            >
              Thêm
            </button>
          </div>
        </div>

        <div className="setting-category-group">
          <h3 className="setting-category-title">Danh mục chi tiêu</h3>
          <ul className="setting-category-list">
            {expenseCategories.map((category) => (
              <li key={category._id} className="setting-category-item">
                {category.name}
                <button
                  className="setting-delete-button"
                  onClick={() =>
                    deleteCategory(category._id, "expense", setExpenseCategories)
                  }
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
          <div className="setting-add-category">
            <input
              className="setting-input"
              type="text"
              value={newExpenseCategory}
              onChange={(e) => setNewExpenseCategory(e.target.value)}
              placeholder="Thêm danh mục chi tiêu mới"
            />
            <button
              className="setting-button"
              onClick={() =>
                addCategory("expense", newExpenseCategory, setExpenseCategories, setNewExpenseCategory)
              }
            >
              Thêm
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Settings;
