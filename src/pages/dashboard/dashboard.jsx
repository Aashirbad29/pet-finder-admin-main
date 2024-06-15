import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { axiosInstance } from "../../utils/axios";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Select } from "antd";
import moment from "moment";

// Register the necessary Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const { Option } = Select;

const Dashboard = () => {
  const [adoptionData, setAdoptionData] = useState({ total: 0, approved: 0, declined: 0 });
  const [rescueData, setRescueData] = useState({ total: 0, approved: 0, declined: 0 });
  const [petAdoptionData, setPetAdoptionData] = useState({
    species: [],
    adopted: [],
    notAdopted: [],
  });
  const [dateRange, setDateRange] = useState(30); // Default to last 30 days

  useEffect(() => {
    const fetchAdoptionData = async () => {
      try {
        const response = await axiosInstance.get("/adoption");
        const adoptions = response.data.result;
        const filteredAdoptions = filterByDateRange(adoptions, dateRange);

        const total = filteredAdoptions.length;
        const approved = filteredAdoptions.filter((req) => req.status === true).length;
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
        const filteredRescues = filterByDateRange(rescues, dateRange);

        const total = filteredRescues.length;
        const approved = filteredRescues.filter((req) => req.status === "Approved").length;
        const declined = filteredRescues.filter((req) => req.status === "Rejected").length;

        setRescueData({ total, approved, declined });
      } catch (error) {
        console.error("Error fetching rescue data:", error);
      }
    };

    const fetchPetData = async () => {
      try {
        const response = await axiosInstance.get("/pet");
        const pets = response.data.result;
        const filteredPets = filterByDateRange(pets, dateRange);

        const speciesCount = {};
        filteredPets.forEach((pet) => {
          if (!speciesCount[pet.species]) {
            speciesCount[pet.species] = { adopted: 0, notAdopted: 0 };
          }
          if (pet.is_adopted) {
            speciesCount[pet.species].adopted++;
          } else {
            speciesCount[pet.species].notAdopted++;
          }
        });

        const species = Object.keys(speciesCount);
        const adopted = species.map((specie) => speciesCount[specie].adopted);
        const notAdopted = species.map((specie) => speciesCount[specie].notAdopted);

        setPetAdoptionData({ species, adopted, notAdopted });
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchAdoptionData();
    fetchRescueData();
    fetchPetData();
  }, [dateRange]);

  const filterByDateRange = (data, range) => {
    const now = moment();
    return data.filter((item) => moment(item.createdAt).isAfter(now.clone().subtract(range, "days")));
  };

  const adoptionRescueData = {
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

  const petAdoptionStatusData = {
    labels: petAdoptionData.species,
    datasets: [
      {
        label: "Adopted",
        data: petAdoptionData.adopted,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Not Adopted",
        data: petAdoptionData.notAdopted,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
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
      <Select defaultValue={30} style={{ width: 120 }} onChange={(value) => setDateRange(value)}>
        <Option value={7}>Last 7 Days</Option>
        <Option value={15}>Last 15 Days</Option>
        <Option value={30}>Last 30 Days</Option>
      </Select>
      <Bar data={adoptionRescueData} options={options} />
      <h2>Pet Adoption Status by Species</h2>
      <Bar data={petAdoptionStatusData} options={options} />
    </div>
  );
};

export default Dashboard;
