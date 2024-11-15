import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  theme,
  Typography,
  Spin,
  Popconfirm,
  Upload,
  notification,
  Breadcrumb,
} from "antd";

import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import courseAPI from "../../service/Course/course";

const StudentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const { course } = location.state || {};
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    const data = {
      name: values.name,
      description_uz: values.description_uz,
      description_ru: values.description_ru,
      description_en: values.description_en,
      attachments: attachmentData
        ? [{ id: attachmentData.id }]
        : course.attachments,
    };

    try {
      const token = localStorage.getItem("authToken");
      await courseAPI.editCourse(course.id, data, token);
      notification.success({
        message: "Success",
        description: "Course details updated successfully",
      });
      ("Course edited successfully");
      navigate("/course");
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Xato",
        description: error.response?.data?.message || "Ma'lumotlarni yangilashda xato yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    "Failed:", errorInfo;
  };

  const deleteNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await courseAPI.deleteCourse(course.id, token);
      ("Student deleted successfully");
      navigate("/course");
    } catch (error) {
      console.error("Error deleting student:", error);
      notification.error({
        message: "Xato",
        description: error.response?.data?.message || "Talabani o'chirishda xato yuz berdi.",
      });
    } finally {
      setLoading(false);
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
            <a href="/course">Course</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          name="user-profile-details-form"
          layout="vertical"
          initialValues={{
            id: course.id,
            name: course.name,
            description_uz: course.description_uz,
            description_ru: course.description_ru,
            description_en: course.description_en,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]} className="">
            <Col sm={24} lg={24}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]} className="">
            <Col sm={24} lg={24}>
              <Form.Item
                label="Description Uz"
                name="description_uz"
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
            <Col sm={24} lg={24}>
              <Form.Item
                label="Description Ru"
                name="description_ru"
                rules={[
                  { required: true, message: "Please input description Ru!" },
                ]}
              >
                <TextArea allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Description En"
                name="description_en"
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
              onConfirm={deleteNews}
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
