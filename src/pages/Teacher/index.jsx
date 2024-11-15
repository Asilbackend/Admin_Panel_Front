import React, { useState, useEffect } from "react";
import {
  Divider,
  Table,
  theme,
  Button,
  Spin,
  Tooltip,
  Form,
  Input,
  Modal,
  Upload,
} from "antd";
import { Content } from "antd/es/layout/layout";
import teacherAPI from "../../service/Teachers/teacher";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import attachmentsAPI from "../../service/Attachments/attachments";
import { notification } from "antd";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [attachment, setAttachmentData] = useState(null);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const authToken = localStorage.getItem("authToken");
      const data = {
        ...values,
        attachments: [attachment],
      };

      teacherAPI
        .createTeacher(data, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const newRecord = {
            key: Date.now().toString(), // Yangi ID sifatida vaqtni ishlatamiz
            ...values,
            createdAt: new Date().toLocaleString("uz-UZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            updatedAt: new Date().toLocaleString("uz-UZ", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setDataSource((prevData) => [...prevData, newRecord]);
          setOpenCreate(false);
        })
        .catch((error) => {
          notification.error({
            message: "Xato",
            description:
              error.response?.data?.message || "Backenddan xato kelmoqda.",
          });
        });
    });
  };

  useEffect(() => {
    teacherAPI.getTeachers().then((response) => {
      const formattedData = response.data.map((item) => ({
        key: item.id.toString(),
        ...item,
        createdAt: new Date(item.createdAt).toLocaleString("uz-UZ", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(item.updatedAt).toLocaleString("uz-UZ", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      const sortedData = formattedData.sort((a, b) => b.key - a.key);
      setDataSource(sortedData);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      render: (_, record, index) => index + 1, // O'sish tartibida ID ko'rsatish
    },
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
    },
    {
      title: "Level",
      dataIndex: "level",
    },
    {
      title: "Students Studied",
      dataIndex: "studentsStudied",
    },
    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Description (Uzbek)",
      dataIndex: "description_uz",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 10 ? `${text.substring(0, 10)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (Russian)",
      dataIndex: "description_ru",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 10 ? `${text.substring(0, 10)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (English)",
      dataIndex: "description_en",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 10 ? `${text.substring(0, 10)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      width: 150,
    },
  ];

  return (
    <section>
      <Content
        style={{
          margin: "6px 16px",
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Spin spinning={loading}>
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
              columns={columns}
              dataSource={dataSource}
              rowClassName={() => "cursor-pointer"}
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/teacherDetails/${record.id}`, {
                      state: { teacher: record },
                    });
                  },
                };
              }}
              className="w-full"
            />
          </div>
        </Spin>
      </Content>

      <Modal
        title={"Create Teacher"}
        centered
        open={openCreate}
        onOk={handleCreate}
        okButtonProps={{ type: "default" }}
        cancelButtonProps={{ danger: true }}
        onCancel={() => setOpenCreate(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level"
            rules={[{ required: true, message: "Please input the level!" }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="studentsStudied"
            label="Students Studied"
            rules={[
              {
                required: true,
                message: "Please input the number of students studied!",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience"
            rules={[
              { required: true, message: "Please input the experience!" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="description_uz"
            label="Description (Uzbek)"
            rules={[
              {
                required: true,
                message: "Please input the description in Uzbek!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="description_ru"
            label="Description (Russian)"
            rules={[
              {
                required: true,
                message: "Please input the description in Russian!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="description_en"
            label="Description (English)"
            rules={[
              {
                required: true,
                message: "Please input the description in English!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Upload
            name="image"
            listType="picture"
            showUploadList={false}
            beforeUpload={async (file) => {
              const isImageOrVideo =
                file.type.startsWith("image/") ||
                file.type.startsWith("video/");
              if (!isImageOrVideo) {
                notification.error({
                  message: "Noto'g'ri fayl turi",
                  description: "Iltimos, rasm yoki video faylini tanlang!",
                });
                return false;
              }
              try {
                const formData = new FormData();
                formData.append("multipartFile", file);
                const response = await attachmentsAPI.saveAttachment(formData);

                const data = response.data;
                setAttachmentData(data);

                notification.success({
                  message: "Uploaded successfully",
                  description: "The file has been uploaded successfully.",
                });
              } catch (error) {
                console.error("Error uploading file:", error);
                notification.error({
                  message: "Xato",
                  description: "Faylni yuklashda xato yuz berdi.",
                });
              }

              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Image or Video</Button>
          </Upload>
        </Form>
      </Modal>
    </section>
  );
};

export default index;
