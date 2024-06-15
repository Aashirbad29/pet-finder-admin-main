import { Form, Input, Select, InputNumber, Switch, Button, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../../utils/axios";
import { UploadOutlined } from "@ant-design/icons";
import { getToken } from "../../../utils/token";

const { Option } = Select;

const PetUpdate = ({ id }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [fileList, setFileList] = useState([]); // State for file list

  const { data } = useQuery(["pet", id], () => axiosInstance.get(`pet/${id}`), {
    enabled: Boolean(id),
    onSuccess: (data) => {
      const photoUrl = data?.data?.result?.photo;
      if (photoUrl) {
        setFileList([
          {
            uid: "-1", // Unique identifier
            name: photoUrl.split("/").pop(), // Extract the file name from the URL
            status: "done",
            url: `http://localhost:4000/${photoUrl}`,
          },
        ]);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      return axiosInstance.patch(`/pet/${id}`, { ...values, photo: imageFile });
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

  const props = {
    name: "photo",
    action: "http://localhost:4000/api/pet/upload",
    fileList: fileList,
    onChange(info) {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1); // Limit the number of uploaded files to 1
      setFileList(newFileList);

      if (info.file.status !== "uploading") {
      }
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
    <Form form={form} initialValues={{ data }} layout="vertical" name="pet-form" onFinish={onFinish}>
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
      <Form.Item label="Photo" name="photo" rules={[{ required: true, message: "Required" }]}>
        <Upload maxCount={1} {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
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
