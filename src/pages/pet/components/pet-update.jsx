import { Form, Input, Select, InputNumber, Switch, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../../utils/axios";
import { getToken } from "../../../utils/token";

const { Option } = Select;

const PetUpdate = ({ id }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null); // New state for image file

  const { data } = useQuery(["pet", id], () => axiosInstance.get(`pet/${id}`), {
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("species", values.species);
      formData.append("breed", values.breed);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("description", values.description);
      formData.append("vaccination_status", values.vaccination_status);
      formData.append("photo", imageFile); // Append image file

      return axiosInstance.patch(`/pet/${id}`, formData);
    },
    onSuccess: () => {
      message.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error) => {
      message.error(error.response.data.msg);
    },
  });

  useEffect(() => {
    form.setFieldValue("name", data?.data?.result?.name);
    form.setFieldValue("species", data?.data?.result?.species);
    form.setFieldValue("breed", data?.data?.result?.breed);
    form.setFieldValue("age", data?.data?.result?.age);
    form.setFieldValue("gender", data?.data?.result?.gender);
    form.setFieldValue("description", data?.data?.result?.description);
    form.setFieldValue("photo", data?.data?.result?.photo);
    form.setFieldValue("vaccination_status", data?.data?.result?.vaccination_status);
  }, [data]);

  const onFinish = (values) => {
    mutation.mutate(values);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Form form={form} layout="vertical" name="pet-form" onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Speices" name="species" rules={[{ required: true, message: "Required" }]}>
        <Select placeholder="Select">
          <Option value="dog">Dog</Option>
          <Option value="cat">Cat</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Breed" name="breed" rules={[{ required: true, message: "Required" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Age" name="age" rules={[{ required: true, message: "Required" }]}>
        <InputNumber />
      </Form.Item>

      <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Required" }]}>
        <Select placeholder="Select">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Description" name="description" rules={[{ required: true, message: "Required" }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Photo">
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </Form.Item>

      <Form.Item label="Vaccination Status" name="vaccination_status">
        <Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PetUpdate;
