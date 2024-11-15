import React, { useState, useEffect } from "react";
import {
  Divider,
  Modal,
  Table,
  theme,
  Button,
  Form,
  Input,
  Tooltip,
  Spin,
  Upload,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import studentAPI from "../../service/Students/student";
import { useNavigate } from "react-router-dom";
import attachmentsAPI from "../../service/Attachments/attachments";

const index = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [attachment, setAttachmentData] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    studentAPI.getStudents().then((response) => {
      const formattedData = response.data.map((item) => ({
        key: item.id.toString(),
        id: item.id.toString(),
        ...item,
        createdAt: new Date(item.createdAt).toLocaleString("en-EN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        updatedAt: new Date(item.updatedAt).toLocaleString("en-EN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Ma'lumotlarni id bo'yicha kamayuvchi tartibda saralash
      const sortedData = formattedData.sort((a, b) => b.id - a.id); // Kamayish tartibida
      setDataSource(sortedData);
      setLoading(false);
    });
  }, []);

  const handleCreate = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const data = {
        ...values,
        attachment: attachment,
      };
      console.log("data", data);
      studentAPI
        .createStudent(data)
        .then((response) => {
          const newRecord = {
            key: response.data.id.toString(),
            id: response.data.id.toString(),
            ...values,
          };
          setDataSource([...dataSource, newRecord]);
          setOpenCreate(false);
          setLoading(false);
          // Notification qo'shish
          notification.success({
            message: "Ma'lumot qo'shildi",
            description: "Talaba muvaffaqiyatli qo'shildi!",
          });
        })
        .catch((error) => {
          setLoading(false);
          // Xatolik haqida notification qo'shish
          notification.error({
            message: "Xatolik",
            description: error.response
              ? error.response.data.message
              : "Ma'lumot qo'shishda xatolik yuz berdi!",
          });
        });
    });
  };

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
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
    },
  ];
  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("multipartFile", file);

      const response = await attachmentsAPI.saveAttachment(formData);
      const data = response.data;
      setAttachmentData(data);
      console.log("Attachment data:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const navigate = useNavigate();
  return (
    <Spin spinning={loading}>
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
              className="w-full"
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/studentDetails/${record.id}`, {
                      state: { student: record },
                    });
                  },
                };
              }}
            />

            <Modal
              title={"Create Student"}
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
                  rules={[
                    { required: true, message: "Please input the last name!" },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  name="level"
                  label="Level"
                  rules={[
                    { required: true, message: "Please input the level!" },
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
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      notification.error({
                        message: "Noto'g'ri fayl turi",
                        description: "Iltimos, rasm faylini tanlang!",
                      });
                      return false;
                    }
                    console.log(file);
                    await handleUpload(file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form>
            </Modal>
          </div>
        </Content>
      </section>
    </Spin>
  );
};

export default index;
