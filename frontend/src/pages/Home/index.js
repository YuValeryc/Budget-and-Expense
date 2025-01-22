import React, { useState, useEffect, useContext } from "react";
import "./Home.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AuthContext from "../../components/AuthContext/AuthContext";
import LineChart from "../../components/Chart/LineChart";
import { CurrencyContext } from "../../components/AuthContext/CurrencyContext";

const HomePage = () => {
  const [financialData, setFinancialData] = useState({
    balance: 0,
    totalExpense: 0,
    totalIncome: 0,
    expenses: [],
    incomes: [],
  });
  const { currency, position } = useContext(CurrencyContext);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const fetchFinancialData = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (0-based index)
      const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
      const response = await fetch(
        `http://localhost:5000/financial-summary/${userId}?month=${currentMonth}&year=${currentYear}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setFinancialData(data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu tài chính.");
    }
  };
  
  useEffect(() => {
    fetchFinancialData();
  }, [userId]);
  

  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const element = document.getElementById("financial-summary");

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("financial-summary.pdf");
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Tổng Quan Tài Chính</h1>
      </header>

      {error && <div className="home-error">{error}</div>}

      <div id="financial-summary">
        <section className="home-summary">
          <div className={`summary-card ${financialData.balance < 0 ? "negative-balance" : "positive-balance"}`}>
            <h2>Số dư tài khoản</h2>
            <p className={`amount balance`}>{
              position === 0
                ? `${currency} ${financialData.balance}`
                : `${financialData.balance} ${currency}`
            }</p>
            {financialData.balance < 0 ? (
              <p className="warning-text">Số dư âm! Hãy kiểm soát chi tiêu.</p>
            ) : (
              <p className="info-text">Bạn đang có thể tiêu thêm.</p>
            )}
          </div>
          <div className="summary-card">
            <h2>Chi tiêu tháng này</h2>
            <p className="amount expense">- {
              position === 0
                ? `${currency} ${financialData.totalExpense}`
                : `${financialData.totalExpense} ${currency}`
            }</p>
          </div>
          <div className="summary-card">
            <h2>Thu nhập tháng này</h2>
            <p className="amount income">+ {
              position === 0
                ? `${currency} ${financialData.totalIncome}`
                : `${financialData.totalIncome} ${currency}`
            }</p>
          </div>
        </section>

        <section className="home-chart">
          <h3>Biểu đồ Thu Chi</h3>
          <LineChart expenses={financialData.expenses} incomes={financialData.incomes} />
        </section>

        <section className="home-history">
          <div className="history-block">
            <h3>Lịch sử Chi Tiêu</h3>
            {financialData.expenses.length > 0 ? (
              <ul className="history-list">
                {financialData.expenses.map((expense, index) => (
                  <li key={index} className="history-item">
                    <span>{expense.source}</span>
                    <span className="amount expense">- {
                      position === 0
                        ? `${currency} ${expense.amount}`
                        : `${expense.amount} ${currency}`
                    }</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có chi tiêu nào được ghi nhận.</p>
            )}
          </div>
          <div className="history-block">
            <h3>Lịch sử Thu Nhập</h3>
            {financialData.incomes.length > 0 ? (
              <ul className="history-list">
                {financialData.incomes.map((income, index) => (
                  <li key={index} className="history-item">
                    <span>{income.source}</span>
                    <span className="amount income">+ {
                      position === 0
                        ? `${currency} ${income.amount}`
                        : `${income.amount} ${currency}`
                    }</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có thu nhập nào được ghi nhận.</p>
            )}
          </div>
        </section>
      </div>

      <button className="export-button" onClick={handleExportPDF}>
        Xuất PDF
      </button>
    </div>
  );
};

export default HomePage;
