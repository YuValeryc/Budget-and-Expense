import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeChart = ({ transactions }) => {
  const processChartData = () => {
    const groupedData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      const day = date.toISOString().split("T")[0]; 

      if (!groupedData[day]) {
        groupedData[day] = 0;
      }
      groupedData[day] += transaction.amount;
    });

    const labels = Object.keys(groupedData);
    const amounts = Object.values(groupedData);

    return { labels, amounts };
  };

  const chartData = processChartData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Thu nhập theo ngày",
        data: chartData.amounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        title: {
          display: true,
          text: "Thu nhập (VNĐ)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="income-chart">
      <h2>Biểu đồ thu nhập</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeChart;
