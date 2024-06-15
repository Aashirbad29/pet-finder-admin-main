import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { axiosInstance } from "../../utils/axios";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const [adoptionData, setAdoptionData] = useState({ total: 0, approved: 0, declined: 0 });
  const [rescueData, setRescueData] = useState({ total: 0, approved: 0, declined: 0 });

  useEffect(() => {
    const fetchAdoptionData = async () => {
      try {
        const response = await axiosInstance.get("/adoption");
        const adoptions = response.data.result;

        const total = adoptions.length;
        const approved = adoptions.filter((req) => req.status === true).length;
        const declined = total - approved;

        setAdoptionData({ total, approved, declined });
      } catch (error) {
        console.error("Error fetching adoption data:", error);
      }
    };

    const fetchRescueData = async () => {
      try {
        const response = await axiosInstance.get("/rescues");
        const rescues = response.data.result;

        const total = rescues.length;
        const approved = rescues.filter((req) => req.status === "Approved").length;
        const declined = rescues.filter((req) => req.status === "Rejected").length;

        setRescueData({ total, approved, declined });
      } catch (error) {
        console.error("Error fetching rescue data:", error);
      }
    };

    fetchAdoptionData();
    fetchRescueData();
  }, []);

  const data = {
    labels: ["Adoption Requests", "Rescue Requests"],
    datasets: [
      {
        label: "Total Requests",
        data: [adoptionData.total, rescueData.total],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Approved Requests",
        data: [adoptionData.approved, rescueData.approved],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Declined Requests",
        data: [adoptionData.declined, rescueData.declined],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Dashboard;
