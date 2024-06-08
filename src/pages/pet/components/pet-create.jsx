import React, { useState } from "react";
import { Button, Modal, Form, Input, message, InputNumber, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../../utils/axios";

const { Option } = Select;

const PetCreate = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null); // New state for image file

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

      return axiosInstance.post("/pet", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      form.resetFields();
      setIsModalOpen(false);
      setImageFile(null); // Reset image file state
    },
    onError: (error) => {
      message.error(error.response.data.msg);
    },
  });

  const onFinish = (value) => {
    mutation.mutate(value);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Speices" name="species" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select">
              <Option value="dog">Dog</Option>
              <Option value="cat">Cat</Option>
              <Option value="other animals">Other Animals</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Breed" name="breed" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Age (in years)" name={["age", "years"]} rules={[{ required: true, message: "Required" }]}>
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
      </Modal>
    </div>
  );
};

export default PetCreate;
