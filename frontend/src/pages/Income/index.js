import React, { useState, useEffect, useContext } from "react";
import "./Income.css";
import AuthContext from "../../components/AuthContext/AuthContext";
import IncomeChart from "../../components/Chart/BarChart";
import CategoryPieChart from "../../components/Chart/PieChart";
import { useLoading } from "../../components/AuthContext/Loading";
import ItemList from "../../components/ItemList/ItemList";
import Modal from "../../components/Modal/Modal";
import { CurrencyContext } from "../../components/AuthContext/CurrencyContext";
import { useAlert } from "../../components/Notify/Confirm";

const IncomePage = () => {
  const { user } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);
  const { currency, position } = useContext(CurrencyContext);
  const [totalIncome, setTotalIncome] = useState(0);
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

  // Fetch thu nhập từ API
  const fetchIncomes = async () => {
    try {
      startLoading();
      const response = await fetch("http://localhost:5000/incomes/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          month,
          year,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch incomes");
      const data = await response.json();

      setIncomes(data.incomes || []); 
      setTotalIncome(data.totalIncome || 0); 
      stopLoading();
    } catch (err) {
      setError("Error fetching incomes: " + err.message);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [user]);

  // Xử lý thêm thu nhập mới
  const handleAddIncome = async () => {
    try {
      if (!formData.source || !formData.amount || !formData.category) {
        return setError("Source, amount, and category are required");
      }

      const response = await fetch("http://localhost:5000/incomes/add", {
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

      if (!response.ok) throw new Error("Failed to add income");
      await fetchIncomes();
      setFormData({ source: "", amount: "", description: "", category: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Error adding income: " + err.message);
    }
  };

  // Xử lý xóa thu nhập
  const handleDeleteIncome = async (id) => {
    try {
      const confirmed = await showConfirm({
        title: 'Bạn có chắc xóa lịch sử này không?',
        text: 'Hành động này không thể hoàn tác!',
        icon: 'warning',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      });
  
      if (!confirmed) {
        return;
      } 

      const response = await fetch(`http://localhost:5000/incomes/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete income");
      await fetchIncomes();
    } catch (err) {
      setError("Error deleting income: " + err.message);
    }
  };

  return (
    <div className="income-container">
      <div className="income-header">
        <h1>Thu nhập</h1>
        <h2>
          Tổng thu nhập tháng này: <span>{position === 0 ? `${currency} ${totalIncome}` : `${totalIncome} ${currency}`}</span>
        </h2>
      </div>
      {error && <div className="income-error-message">{error}</div>}
      <button className="income-add-button" onClick={() => setIsModalOpen(true)}>
        + Thêm khoản thu nhập
      </button>

      <div className="income-filter">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => (
            <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>

        <button onClick={fetchIncomes}>Lọc</button>
      </div>

      <div className="income-body">
        {incomes.length > 0 ? (
          <>
            <div className="income-chart-container">
              <CategoryPieChart transactions={incomes} />
              <IncomeChart transactions={incomes} />
            </div>

            <div className="list_history">
              <h3>Lịch sử thu nhập</h3>
              <div className="income-item-container">
                <ItemList transactions={incomes} handleDeleteTransaction={handleDeleteIncome} />
              </div>
            </div>
          </>
        ) : (
          <div className="income-empty-message">
            <p>Chưa có dữ liệu thu nhập trong tháng này.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          formData={formData}
          setFormData={setFormData}
          handleAddIncome={handleAddIncome}
          onClose={() => setIsModalOpen(false)}
          type="income"
        />
      )}
    </div>
  );
};

export default IncomePage;
