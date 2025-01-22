import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineChart = ({ expenses, incomes }) => {
  const uniqueDates = Array.from(
    new Set([...incomes.map((income) => income.date), ...expenses.map((expense) => expense.date)])
  ).sort((a, b) => new Date(a) - new Date(b));

  const expenseData = uniqueDates.map((date) => {
    const expense = expenses.find((exp) => exp.date === date);
    return expense ? expense.amount : 0;
  });

  const incomeData = uniqueDates.map((date) => {
    const income = incomes.find((inc) => inc.date === date);
    return income ? income.amount : 0;
  });

  const data = {
    labels: uniqueDates,
    datasets: [
      {
        label: "Chi Tiêu",
        data: expenseData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Thu Nhập",
        data: incomeData,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ Thu Chi",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
