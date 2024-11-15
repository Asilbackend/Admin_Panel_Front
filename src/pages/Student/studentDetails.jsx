import {
  Card as AntCard,
  Button,
  Col,
  Form,
  Image,
  Input,
  Radio,
  Row,
  Select,
  theme,
  Typography,
  Spin,
  Popconfirm,
  notification,
  Upload,
  Breadcrumb,
} from "antd";

import {
  SaveOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import studentAPI from "../../service/Students/student";
import { useState } from "react";
import attachmentsAPI from "../../service/Attachments/attachments"; // attachmentsAPI ni import qilish

const StudentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const { student } = location.state || {};
  student;
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    const data = {
      firstname: values.firstName,
      lastname: values.lastName,
      level: values.level,
      description_uz: values.descriptionUz,
      description_ru: values.descriptionRu,
      description_en: values.descriptionEn,
      attachment: attachmentData || student.attachment,
    };
    "DFATA:", data;
    try {
      const token = localStorage.getItem("authToken");
      await studentAPI.editStudent(student.id, data, token);
      notification.success({
        message: "Success",
        description: "Student details updated successfully",
      });
      navigate("/student");
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Xato",
        description: error.response?.data?.message || "Xatolik yuz berdi",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    "Failed:", errorInfo;
  };

  const deleteStudent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await studentAPI.deleteStudent(student.id, token);
      ("Student deleted successfully");
      navigate("/student");
    } catch (error) {
      console.error("Error deleting student:", error);
      notification.error({
        message: "Xato",
        description:
          error.response?.data?.message ||
          "O'quvchini o'chirishda xatolik yuz berdi",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      if (attachmentData) {
        await attachmentsAPI.deleteAttachment(attachmentData.id);
      }

      const formData = new FormData();
      formData.append("multipartFile", file);

      const response = await attachmentsAPI.saveAttachment(formData);
      const data = response.data;
      setAttachmentData(data);
      "Attachment data:", data;
    } catch (error) {
      console.error("Error uploading file:", error);
      notification.error({
        message: "Xato",
        description:
          error.response?.data?.message || "Fayl yuklashda xatolik yuz berdi",
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Content
        style={{
          margin: "6px 16px",
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb style={{ marginBottom: "16px" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/student">Student</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          name="user-profile-details-form"
          layout="vertical"
          initialValues={{
            id: student.id,
            firstName: student.firstname,
            lastName: student.lastname,
            level: student.level,
            descriptionUz: student.description_uz,
            descriptionRu: student.description_ru,
            descriptionEn: student.description_en,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]} align="middle" className="mb-10">
            <Col sm={24} lg={4} className="flex flex-col gap-4 items-center">
              <Image
                width={150}
                src={
                  attachmentData
                    ? attachmentData?.url.replace("download", "view")
                    : student?.attachment?.url?.replace("download", "view")
                }
                alt="Student Attachment"
                height={150}
                className="rounded-lg object-cover"
              />
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
                  await handleUpload(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Col>
            <Col sm={24} lg={18}>
              <Row gutter={[16, 0]} align="middle">
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="User ID"
                    name="id"
                    rules={[
                      { required: true, message: "Please input your id!" },
                    ]}
                  >
                    <Input
                      allowClear
                      readOnly={true}
                      suffix={
                        <Typography.Paragraph
                          copyable={{ text: student.id }}
                          style={{ margin: 0 }}
                        ></Typography.Paragraph>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Level"
                    name="level"
                    rules={[
                      { required: true, message: "Please select your level!" },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col sm={24}>
              <Form.Item
                label="Description Uz"
                name="descriptionUz"
                rules={[
                  {
                    required: true,
                    message: "Please input your description Uz!",
                  },
                ]}
              >
                <TextArea allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col sm={24}>
              <Form.Item
                label="Description Ru"
                name="descriptionRu"
                rules={[
                  { required: true, message: "Please input description Ru!" },
                ]}
              >
                <TextArea allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col sm={24}>
              <Form.Item
                label="Description En"
                name="descriptionEn"
                rules={[
                  { required: true, message: "Please input description En!" },
                ]}
              >
                <TextArea allowClear />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex items-center gap-4">
            <Button type="" htmlType="submit" icon={<SaveOutlined />}>
              Save changes
            </Button>
            <Popconfirm
              title="O'chirishni xohlaysizmi?"
              onConfirm={deleteStudent}
              cancelButtonProps={{ type: "link", danger: true }}
              okButtonProps={{ type: "link" }}
              okText="Ha"
              cancelText="Yo'q"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </Content>
    </Spin>
  );
};

export default StudentDetails;
