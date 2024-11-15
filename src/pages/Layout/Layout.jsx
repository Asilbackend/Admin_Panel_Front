import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined,
  DiffOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
  AliwangwangOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  Menu as DropdownMenu,
} from "antd";
const { Header, Sider } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleExit = () => {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="py-[30px]"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
          items={[
            {
              key: "/teacher",
              icon: <UserOutlined />,
              label: (
                <NavLink to="/teacher" activeClassName="active">
                  Teacher
                </NavLink>
              ),
            },
            {
              key: "/student",
              icon: <TeamOutlined />,
              label: (
                <NavLink to="/student" activeClassName="active">
                  Student
                </NavLink>
              ),
            },
            {
              key: "/news",
              icon: <DiffOutlined />,
              label: (
                <NavLink to="/news" activeClassName="active">
                  News
                </NavLink>
              ),
            },
            {
              key: "/course",
              icon: <LinkOutlined />,
              label: (
                <NavLink to="/course" activeClassName="active">
                  Course
                </NavLink>
              ),
            },
            {
              key: "/material",
              icon: <FileOutlined />,
              label: (
                <NavLink to="/material" activeClassName="active">
                  Material
                </NavLink>
              ),
            },
            {
              key: "/users",
              icon: <UsergroupAddOutlined />,
              label: (
                <NavLink to="/users" activeClassName="active">
                  Users
                </NavLink>
              ),
            },
            {
              key: "/potential-cl",
              icon: <UsergroupAddOutlined />,
              label: (
                <NavLink to="/potential-clients" activeClassName="active">
                  Potential Clients
                </NavLink>
              ),
            },
            {
              key: "/edit-profile",
              icon: <EditOutlined />,
              label: (
                <NavLink to="/edit-profile" activeClassName="active">
                  Edit Profile
                </NavLink>
              ),
            },
            {
              key: "/faq",
              icon: <QuestionCircleOutlined />,
              label: (
                <NavLink to="/faq" activeClassName="active">
                  FAQ
                </NavLink>
              ),
            },
            {
              key: "/contact-us",
              icon: <AliwangwangOutlined />,
              label: (
                <NavLink to="/contact-us" activeClassName="active">
                  Contact-Us
                </NavLink>
              ),
            },
            {
              key: "/logout",
              icon: <LogoutOutlined />,
              label: (
                <div onClick={handleExit} style={{ marginTop: "auto" }}>
                  Logout
                </div>
              ),
            },
          ]}
          className=""
        />
      </Sider>

      <Layout style={{ height: "100vh", overflow: "auto" }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderBottom: "1px solid #e8e8e8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default App;
