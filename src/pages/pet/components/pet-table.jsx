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
    mutationFn: (id) => {
      return axiosInstance.delete(`/pet/${id}`);
    },
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
      render: (text) => <Image width={100} height={100} preview style={{ objectFit: "contain" }} src={text} />,
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
      title: "Action",
      key: "action",
      render: (data) => (
        <Space direction="vertical" size="middle">
          <Button
            type="primary"
            onClick={() => {
              showModal();
              setCurrentId(data._id);
            }}
          >
            <EditOutlined />
          </Button>
          <Button type="primary" onClick={() => mutation.mutate(data._id)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const { data, isLoading } = useQuery("pets", () => axiosInstance.get("/pet"), { initialData: [] });

  return (
    <>
      <Modal title="Update Pet" open={isModalOpen} onCancel={handleCancel} footer={false}>
        <PetUpdate id={currentId} />
      </Modal>
      <Table loading={isLoading} bordered columns={columns} dataSource={data?.data?.result} rowKey={"_id"} />
    </>
  );
};

export default PetTable;
