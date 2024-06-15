import React from "react";
import { Button, Space, Table, message } from "antd";
import { axiosInstance } from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const RescueTable = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => {
      return axiosInstance.patch(`/rescues/${id}`, { status });
    },
    onSuccess: () => {
      message.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["rescues"] });
    },
    onError: (error) => {
      message.error(error.response.data?.msg);
    },
  });

  const { data, isLoading } = useQuery("rescues", () => axiosInstance.get("/rescues"), {
    initialData: [],
    select: (data) => ({
      ...data,
      data: {
        ...data.data,
        result: data.data.result.sort((a, b) => new Date(b.request_date) - new Date(a.request_date)),
      },
    }),
  });

  const columns = [
    {
      title: "Requested By",
      key: "requestedBy",
      render: (data) => (
        <>
          <p>Name: {data?.user_id?.name}</p>
          <p>Email: {data?.user_id?.email}</p>
          <p>
            Contact: {data?.user_id.address}, {data?.user_id.phone_number}
          </p>
        </>
      ),
    },
    {
      title: "Pet Details",
      key: "pet_details",
      render: (data) => <p>{data?.pet_details}</p>,
    },
    {
      title: "Status",
      key: "status",
      render: (data) => <p>{data?.status}</p>,
    },
    {
      title: "Request Date",
      key: "request_date",
      render: (data) => <p>{new Date(data.request_date).toLocaleString()}</p>,
    },
    {
      title: "Response Date",
      key: "response_date",
      render: (data) => (data.response_date ? <p>{new Date(data.response_date).toLocaleString()}</p> : <p>Pending</p>),
    },
    {
      title: "Action",
      key: "action",
      render: (data) => (
        <Space direction="vertical" size="middle">
          <Button onClick={() => mutation.mutate({ id: data?._id, status: "Approved" })}>
            <CheckOutlined style={{ color: "green" }} />
          </Button>

          <Button onClick={() => mutation.mutate({ id: data?._id, status: "Rejected" })}>
            <CloseOutlined style={{ color: "red" }} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table loading={isLoading} bordered columns={columns} dataSource={data?.data?.result} rowKey="_id" />
    </>
  );
};

export default RescueTable;
