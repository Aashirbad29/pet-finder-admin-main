import { Form, Input, Select, InputNumber, Switch, Button, message } from "antd";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../../utils/axios";
import { getToken } from "../../../utils/token";

const { Option } = Select;

const PetUpdate = ({ id }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data } = useQuery(["pet", id], () => axiosInstance.get(`pet/${id}`), {
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      return axiosInstance.patch(`/pet/${id}`, values);
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

  return (
    <Form form={form} layout="vertical" name="pet-form" onFinish={onFinish}>
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

      <Form.Item label="Photo" name="photo" rules={[{ required: true, message: "Required" }]}>
        <Input />
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
