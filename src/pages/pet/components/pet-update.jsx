import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select, Switch, Upload } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UploadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { axiosInstance } from "../../../utils/axios";

const { Option } = Select;

const PetUpdate = ({ handleCancel, currentId }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const { data } = useQuery(["pet", currentId], () => axiosInstance.get(`/pet/${currentId}`), {
    enabled: Boolean(currentId),
    onSuccess: (data) => {
      const petData = data?.data?.result;
      form.setFieldsValue(petData);
      const photoUrl = petData?.photo;
      if (photoUrl) {
        setFileList([
          {
            uid: "-1",
            name: photoUrl.split("/").pop(),
            status: "done",
            url: `http://localhost:4000/${photoUrl}`,
          },
        ]);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => axiosInstance.patch(`/pet/${currentId}`, { ...values, photo: imageFile }),
    onSuccess: () => {
      message.success("Pet updated successfully");
      queryClient.invalidateQueries(["pets"]);
      form.resetFields();
      handleCancel();
      setImageFile(null);
    },
    onError: (error) => {
      message.error(error.response.data.msg);
    },
  });

  const uploadProps = {
    name: "photo",
    action: "http://localhost:4000/api/pet/upload",
    headers: { authorization: Cookies.get("token") },
    fileList,
    onChange(info) {
      let newFileList = [...info.fileList].slice(-1); // Limit the number of uploaded files to 1
      setFileList(newFileList);
      if (info.file.status === "done") {
        setImageFile(info.fileList[0].response.photo);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Species" name="species" rules={[{ required: true, message: "Required" }]}>
        <Select placeholder="Select">
          <Option value="dog">Dog</Option>
          <Option value="cat">Cat</Option>
          <Option value="other animals">Other Animals</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Breed" name="breed" rules={[{ required: true, message: "Required" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Age (in years)"
        name="age"
        rules={[
          { required: true, message: "Required" },
          { type: "number", min: 1, max: 18, message: "Age must be between 1 and 18" },
        ]}
      >
        <InputNumber min={1} max={18} />
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
        <Upload maxCount={1} {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item label="Vaccination Status" name="vaccination_status" valuePropName="checked">
        <Switch checkedChildren="Yes" unCheckedChildren="No" />
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
