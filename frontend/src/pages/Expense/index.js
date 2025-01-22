import React, { useState, useEffect, useContext } from "react";
import "./Expense.css"; 
import AuthContext from "../../components/AuthContext/AuthContext";
import ExpenseChart from "../../components/Chart/BarChart"; 
import CategoryPieChart from "../../components/Chart/PieChart";
import { useLoading } from "../../components/AuthContext/Loading";
import ItemList from "../../components/ItemList/ItemList";
import Modal from "../../components/Modal/Modal";
import { CurrencyContext } from "../../components/AuthContext/CurrencyContext";
import { useAlert } from "../../components/Notify/Confirm";

const Expense = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]); 
  const { currency, position } = useContext(CurrencyContext);
  const [totalExpense, setTotalExpense] = useState(0); 
  const { startLoading, stopLoading } = useLoading();
  const [month, setMonth] = useState(new Date().getMonth() + 1); 
  const [year, setYear] = useState(new Date().getFullYear()); 
  const { showConfirm } = useAlert();

  const [formData, setFormData] = useState({
    source: "", 
    amount: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchExpenses = async () => {
    try {
      startLoading();
      const response = await fetch("http://localhost:5000/expenses/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.user_id, month, year }), 
      });
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();

      setExpenses(data.expenses || []); 
      setTotalExpense(data.totalExpense || 0); 
      stopLoading();
    } catch (err) {
      setError("Error fetching expenses: " + err.message);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleAddExpense = async () => {
    try {
      if (!formData.source || !formData.amount || !formData.category) {
        return setError("Source, amount, and category are required");
      }

      const response = await fetch("http://localhost:5000/expenses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: formData.source,
          amount: parseInt(formData.amount),
          description: formData.description,
          category: formData.category,
          user_id: user.user_id,
          date: formData.date,
        }),
      });

      if (!response.ok) throw new Error("Failed to add expense");
      await fetchExpenses();
      setFormData({ source: "", amount: "", description: "", category: "" });
      setIsModalOpen(false); 
    } catch (err) {
      setError("Error adding expense: " + err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const confirmed = await showConfirm({
        title: 'Bạn có chắc chắn xóa lịch sử này không?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });
  
      if (!confirmed) {
        return;
      } 

      const response = await fetch(`http://localhost:5000/expenses/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete expense");
      await fetchExpenses();
    } catch (err) {
      setError("Error deleting expense: " + err.message);
    }
  };

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h1>Chi tiêu</h1>
        <h2>
          Tổng chi tiêu tháng này: <span>{position === 0 ? `${currency} ${totalExpense}` : `${totalExpense} ${currency}`}</span>
        </h2>
      </div>
      {error && <div className="expense-error-message">{error}</div>}
      <button className="expense-add-button" onClick={() => setIsModalOpen(true)}>
        + Thêm khoản chi tiêu
      </button>
      <div className="expense-filter">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: 5 }, (_, i) => (
            <option key={year - i} value={year - i}>
              {year - i}
            </option>
          ))}
        </select>

        <button onClick={fetchExpenses}>Lọc</button>
      </div>

      <div className="expense-body">
        {expenses.length > 0 ? (
          <>
            <div className="expense-chart-container">
              <CategoryPieChart transactions={expenses} />
              <ExpenseChart transactions={expenses} />
            </div>

            <div className="list_history">
              <h3>Lịch sử thu nhập</h3>
              <div className="expense-item-container">
                <ItemList transactions={expenses} handleDeleteTransaction={handleDeleteExpense} />
              </div>
            </div>
          </>
        ) : (
          <div className="expense-empty-message">
            <p>Chưa có dữ liệu chi tiêu trong tháng này.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          formData={formData}
          setFormData={setFormData}
          handleAddIncome={handleAddExpense} 
          onClose={() => setIsModalOpen(false)}
          type="expense" 
        />
      )}
    </div>
  );
};

export default Expense;
