import React, { useContext, useEffect, useState } from 'react';
import './Modal.css';
import AuthContext from '../AuthContext/AuthContext';
import { useLoading } from '../AuthContext/Loading';

const Modal = ({ formData, setFormData, handleAddIncome, onClose, type }) => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (!user?.user_id) return;
    const fetchCategories = async () => {
      startLoading();
      try {
        const res = await fetch(
          `http://localhost:5000/categories/show?user_id=${user.user_id}&type=${type}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        stopLoading();
      }
    };
    fetchCategories();
  }, [user?.user_id]);

  return (
    <div className="income-modal-overlay">
      <div className="income-modal">
        <h2>Thêm</h2>
        <input
          placeholder="Nguồn gốc"
          value={formData.source}
          onChange={(e) =>
            setFormData({ ...formData, source: e.target.value })
          }
        />
        <input
          placeholder="Số Tiền"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Mô tả (Tùy chọn)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.date || ''}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          placeholder="Ngày sử dụng tiền"
        />
        <div className="income-modal-buttons">
          <button onClick={handleAddIncome}>Thêm</button>
          <button onClick={onClose}>Hủy bỏ</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
