import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { login } from "../../api/login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const history = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      history("/");
    }
  }, []);

  const onFinish = (values) => {
    login(values)
      .then((res) => {
        Cookies.set("user", JSON.stringify(res.tokenUser), { expires: 86400, sameSite: "lax" });
        Cookies.set("token", res.token, { expires: 86400, sameSite: "lax" });
        history("/");
      })
      .catch((err) => message.error(err.response.data.msg));
  };

  return (
    <div className="login-page">
      <Form layout="vertical" name="login-form" style={{ width: 500 }} onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input email" }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
