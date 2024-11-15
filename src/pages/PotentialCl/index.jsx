import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Divider, Popconfirm, notification } from "antd";
import { Content } from "antd/es/layout/layout";
import potentialClAPI from "../../service/PotentialCl/PotentialCl";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setLoading(true);
    potentialClAPI
      .getPotentialCl()
      .then((response) => {
        const formattedData = response.data
          .map((client) => ({
            key: client.id.toString(),
            firstName: client.firstName,
            lastName: client.lastName,
            phone: client.phone,
            email: client.email,
          }))
          .sort((a, b) => b.key - a.key);
        setUserData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching potential clients:", error);
        notification.error({
          message: "Error",
          description: error.response
            ? error.response.data.message
            : "Failed to fetch potential clients",
        });
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      render: (_, record, index) => index + 1,
    },
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
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete?"
          okButtonProps={{ type: "link" }}
          cancelButtonProps={{ danger: true, type: "link" }}
          onConfirm={() => {
            setLoading(true);
            potentialClAPI
              .deletePotentialCl(record.key)
              .then((response) => {
                setUserData((prevUserData) =>
                  prevUserData.filter((user) => user.key !== record.key)
                );
                notification.success({
                  message: "Success",
                  description: "Client deleted successfully",
                });
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error deleting client:", error);
                notification.error({
                  message: "Error",
                  description: error.response
                    ? error.response.data.message
                    : "Failed to delete client",
                });
                setLoading(false);
              });
          }}
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <section>
        <Content
          style={{
            margin: "6px 16px",
            padding: 24,
            height: "90vh",
          }}
        >
          <Divider />
          <Table
            columns={columns}
            dataSource={userData}
            rowKey="key"
            className="w-full"
          />
        </Content>
      </section>
    </Spin>
  );
};

export default index;
