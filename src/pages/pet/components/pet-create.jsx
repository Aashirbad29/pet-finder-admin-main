import React, { useState } from "react";
import { Button, Modal, Form, Input, message, InputNumber, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../../utils/axios";

const { Option } = Select;

const PetCreate = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (values) => {
      return axiosInstance.post("/pet", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      form.resetFields();
      setIsModalOpen(false);
    },
    onError: (error) => {
      message.error(error.response.data.msg);
    },
  });

  const onFinish = (value) => {
    mutation.mutate(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginBottom: 6 }}>
      <Button type="primary" onClick={showModal}>
        Create New Pet
      </Button>
      <Modal title="Create New Pet" open={isModalOpen} onOk={handleOk} footer={null} onCancel={handleCancel}>
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
      </Modal>
    </div>
  );
};
export default PetCreate;
