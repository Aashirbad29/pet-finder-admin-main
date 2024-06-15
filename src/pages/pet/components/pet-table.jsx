// PetTable.jsx

import React, { useState } from "react";
import { Button, Image, Modal, Space, Table, message } from "antd";
import { axiosInstance } from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PetUpdate from "./pet-update";

const PetTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const queryClient = useQueryClient();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setCurrentId(null);
    setIsModalOpen(false);
  };

  const mutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/pet/${id}`),
    onSuccess: () => {
      message.success("Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error) => {
      message.error(error.response.data.msg);
    },
  });

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
    {
      title: "Actions",
      key: "actions",
      render: (data) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentId(data._id);
              showModal();
            }}
          />
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => mutation.mutate(data._id)} />
        </Space>
      ),
    },
  ];

  const { data, isLoading } = useQuery("pets", () => axiosInstance.get("/pet"), {
    select: (data) => ({
      ...data,
      data: {
        ...data.data,
        result: data.data.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      },
    }),
  });

  return (
    <div>
      <Table loading={isLoading} bordered columns={columns} dataSource={data?.data?.result} rowKey={"_id"} />
      <Modal title="Update Pet" open={isModalOpen} footer={null} onCancel={handleCancel}>
        <PetUpdate handleCancel={handleCancel} currentId={currentId} />
      </Modal>
    </div>
  );
};

export default PetTable;
