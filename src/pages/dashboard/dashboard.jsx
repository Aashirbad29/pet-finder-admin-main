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
  const [petAdoptionData, setPetAdoptionData] = useState({ species: [], adopted: [], notAdopted: [] });
  const [petSpeciesData, setPetSpeciesData] = useState({ species: [], counts: [] });
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

        // Data for pet adoption status
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

        // Data for pet species count
        const speciesCounts = {};
        filteredPets.forEach((pet) => {
          speciesCounts[pet.species] = (speciesCounts[pet.species] || 0) + 1;
        });

        const speciesList = Object.keys(speciesCounts);
        const counts = speciesList.map((specie) => speciesCounts[specie]);

        setPetSpeciesData({ species: speciesList, counts });
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

  const petSpeciesColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    // Add more colors if needed
  ];

  const petSpeciesBorderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    // Add more border colors if needed
  ];

  const petSpeciesDataChart = {
    labels: petSpeciesData.species,
    datasets: [
      {
        label: "Number of Pets",
        data: petSpeciesData.counts,
        backgroundColor: petSpeciesColors.slice(0, petSpeciesData.species.length),
        borderColor: petSpeciesBorderColors.slice(0, petSpeciesData.species.length),
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
      <h2>Adoption Request & Rescue Request</h2>
      <Bar data={adoptionRescueData} options={options} />
      <h2>Pet Adoption Status by Species</h2>
      <Bar data={petAdoptionStatusData} options={options} />
      <h2>Number of Pets by Species</h2>
      <Bar data={petSpeciesDataChart} options={options} />
    </div>
  );
};

export default Dashboard;
