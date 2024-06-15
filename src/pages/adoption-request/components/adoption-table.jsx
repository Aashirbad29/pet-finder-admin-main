import { Button, Image, Space, Table, message } from "antd";
import { axiosInstance } from "../../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const AdoptionTable = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => {
      return axiosInstance.patch(`/adoption/${id}`, { status });
    },
    onSuccess: () => {
      message.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });
    },
    onError: (error) => {
      message.error(error.response.data?.msg);
    },
  });

  const columns = [
    {
      title: "Requested By",
      key: "requestedBy",
      render: (data) => (
        <>
          <p>Name: {data?.user_id.name}</p>
          <p>Email: {data?.user_id.email}</p>
          <p>
            Contact: {data?.user_id.address}, {data?.user_id.phone_number}
          </p>
        </>
      ),
    },
    {
      title: "Pet Description",
      key: "pet_description",
      render: (data) => (
        <>
          <p>Pet Id: {data?.pet_id?._id}</p>
          <p>Name: {data?.pet_id.name}</p>
          <p>
            Species / Breed: {data?.pet_id.species} - {data?.pet_id.breed}
          </p>
          <p>
            Age / Gender: {data?.pet_id.age} - {data?.pet_id.gender}
          </p>
          <p>Description: {data?.pet_id.description}</p>
        </>
      ),
    },
    {
      title: "Photo",
      key: "photo",
      render: (data) => (
        <Image width={100} height={100} preview style={{ objectFit: "contain" }} src={data?.pet_id?.photo} />
      ),
    },
    {
      title: "Adoption Status",
      key: "adoption_status",
      render: (data) => <p>{data?.status ? "Adopted" : "Not Adopted"}</p>,
    },
    {
      title: "Request Date",
      key: "request_date",
      render: (data) => <p>{new Date(data?.request_date).toLocaleString()}</p>,
    },
    {
      title: "Response Date",
      key: "response_date",
      render: (data) => (data?.response_date ? <p>{new Date(data?.response_date).toLocaleString()}</p> : <p>Pending</p>),
    },
    {
      title: "Action",
      key: "action",
      render: (data) => (
        <Space direction="vertical" size="middle">
          <Button onClick={() => mutation.mutate({ id: data?._id, status: true })}>
            <CheckOutlined style={{ color: "green" }} />
          </Button>

          <Button onClick={() => mutation.mutate({ id: data?._id, status: false })}>
            <CloseOutlined style={{ color: "red" }} />
          </Button>
        </Space>
      ),
    },
  ];

  const { data, isLoading } = useQuery("adoptions", () => axiosInstance.get("/adoption"), { initialData: [] });

  return (
    <>
      <Table loading={isLoading} bordered columns={columns} dataSource={data?.data?.result} rowKey={"_id"} />
    </>
  );
};

export default AdoptionTable;
