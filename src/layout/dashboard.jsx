import React from "react";
import { DashboardOutlined, LogoutOutlined, OrderedListOutlined, PullRequestOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const { Header, Content, Sider } = Layout;

const DashboardLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const history = useNavigate();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/pet",
      icon: <OrderedListOutlined />,
      label: "Pets",
    },
    {
      key: "/adoption-request",
      icon: <OrderedListOutlined />,
      label: "Adoption Request",
    },
    {
      key: "/rescue-request",
      icon: <OrderedListOutlined />,
      label: "Rescue Request",
    },
  ];

  const onMenuClick = (event) => {
    const { key } = event;
    history(key);
  };

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["/"]} items={menuItems} onClick={onMenuClick} />
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              Cookies.remove("token");
              Cookies.remove("user");
              history("/login");
            }}
          >
            <LogoutOutlined />
          </Button>
        </Header>

        <Content
          style={{
            margin: "10px",
          }}
        >
          <div
            style={{
              minHeight: "calc(100vh - 100px)",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default DashboardLayout;
