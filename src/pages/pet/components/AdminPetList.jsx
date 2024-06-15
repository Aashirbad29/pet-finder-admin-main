// AdminPetList.jsx

import React from "react";
import { Table, Image } from "antd";
import { axiosInstance } from "../../../utils/axios";
import { useQuery } from "react-query";

const AdminPetList = () => {
  const { data, isLoading } = useQuery("pets", () => axiosInstance.get("/pet"));

  const columns = [
    {
      title: "Picture",
      dataIndex: "photo",
      key: "photo",
      render: (text) => (
        <Image width={100} height={100} preview style={{ objectFit: "contain" }} src={`http://localhost:4000/${text}`} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Species",
      dataIndex: "species",
      key: "species",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Breed",
      dataIndex: "breed",
      key: "breed",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Age / Gender",
      key: "age-gender",
      render: (data) => (
        <>
          <p>{data.age}</p>
          <p>{data.gender}</p>
        </>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Vaccination Status",
      dataIndex: "vaccination_status",
      key: "vaccination_status",
      render: (text) => <p>{text ? "Vaccinated" : "Not Vaccinated"}</p>,
    },
    {
      title: "Is Adopted",
      dataIndex: "is_adopted",
      key: "is_adopted",
      render: (text) => <p>{text ? "Adopted" : "Not Adopted"}</p>,
    },
  ];

  return <Table loading={isLoading} bordered columns={columns} dataSource={data?.data?.result} rowKey={"_id"} />;
};

export default AdminPetList;
