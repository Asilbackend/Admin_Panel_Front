import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  theme,
  Button,
  Divider,
  Modal,
  Form,
  Flex,
  Input,
  Typography,
  Popconfirm,
  notification,
} from "antd";
import { Content } from "antd/es/layout/layout";
import userAPI from "../../service/Users/user";
import { useNavigate } from "react-router-dom";
import mailAPI from "../../service/Email/mail";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [codeVisible, setCodeVisible] = useState(false);
  const [apiCode, setApiCode] = useState("");

  const createUser = async (userData) => {
    try {
      "userData", userData;

      const data = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        rePassword: userData.rePassword,
        code: userData.code,
      };
      const response = await userAPI.createUser(data);
      "User created successfully:", response.data;
      notification.success({
        message: "Success",
        description: "User created successfully",
      });
      setOpenCreate(false);

      setUserData((prevUserData) => [
        ...prevUserData,
        {
          key: response.data.id.toString(),
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
          email: response.data.email,
        },
      ]);
    } catch (error) {
      console.error("Error creating user:", error);
      notification.error({
        message: "Error",
        description: error.response ? error.response.data.message : "Failed to create user", // Xatolikni notificationda ko'rsatish
      });
    }
  };

  useEffect(() => {
    userAPI.getAllUser().then((response) => {
      setLoading(true);
      const formattedData = response.data.map((user) => ({
        key: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      }));
      setUserData(formattedData);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const navigate = useNavigate();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!codeVisible) {
          mailAPI.sendEmail(values.email).then((response) => {
            // setApiCode(response.data.code);
            setCodeVisible(true);
            notification.success({
              message: "Success",
              description: "Code has been sent to your email",
            });
          }).catch((error) => {
            notification.error({
              message: "Error",
              description: error.response ? error.response.data.message : "Failed to send email", // Xatolikni notificationda ko'rsatish
            });
          });
        } else {
          createUser(values);
        }
      })
      .catch((info) => {
        "Validate Failed:", info;
      });
  };

  return (
    <Spin spinning={loading}>
      <section>
        <Content
          style={{
            margin: "6px 16px",
            padding: 24,
            height: "90vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="flex flex-col items-end">
            <Button
              type=""
              style={{ textAlign: "right" }}
              onClick={() => {
                form.resetFields();
                setOpenCreate(true);
              }}
            >
              Create
            </Button>
            <Divider />
            <Table
              columns={[
                ...columns,
                {
                  title: "Actions",
                  key: "actions",
                  render: (text, record) => (
                    <Popconfirm
                      title="O'chirishni xohlaysizmi?"
                      onConfirm={() => {
                        userAPI.deleteUser(record.key).then((response) => {
                          "User deleted:", response;
                        });
                      }}
                    >
                      <Button
                        type="link"
                        danger
                        onClick={() => {
                          "dele user:", record;
                          userAPI.deleteUser(record.key).then((response) => {
                            "User deleted:", response;
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  ),
                },
              ]}
              dataSource={userData}
              pagination={false}
              rowKey="key"
              className="w-full"
            />
          </div>
        </Content>
      </section>

      <Modal
        title="Create User"
        visible={openCreate}
        onCancel={() => setOpenCreate(false)}
        onOk={handleOk}
        okButtonProps={{ type: "" }}
        cancelButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="First Name" name="firstName">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Repassword" name="rePassword">
            <Input.Password />
          </Form.Item>
          {codeVisible && (
            <Form.Item label="Code" name="code">
              <Input allowClear />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Spin>
  );
};

export default index;
