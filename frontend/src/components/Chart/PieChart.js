import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin

// Đăng ký các thành phần cần thiết
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const CategoryPieChart = ({ transactions }) => {
  const categoryData = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        hoverBackgroundColor: ["#FF6384AA", "#36A2EBAA", "#FFCE56AA", "#4BC0C0AA", "#9966FFAA", "#FF9F40AA"],
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        color: "#fff", // Màu sắc chữ
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%'; // Tính phần trăm
          return percentage;
        },
        font: {
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart;
