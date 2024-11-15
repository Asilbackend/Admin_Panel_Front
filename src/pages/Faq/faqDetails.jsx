import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Popconfirm,
  Spin,
  notification,
  Breadcrumb,
} from "antd";

import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";

import useFaq from "../../service/Faq/faq";
const TeacherDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const { faq } = location.state || {};

  "Teacher Details:", faq;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formattedData = {
        answer_en: values.answer_en,
        answer_ru: values.answer_ru,
        answer_uz: values.answer_uz,
        question_en: values.question_en,
        question_ru: values.question_ru,
        question_uz: values.question_uz,
      };
      await useFaq.editFaq(faq.id, formattedData, token);
      notification.success({
        message: "Success",
        description: "Faq details updated successfully",
      });
    } catch (error) {
      console.error("Error updating faq:", error);
      notification.error({
        message: "Xato",
        description: error.message || "Faq yangilanishida xatolik yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    "Failed:", errorInfo;
  };

  const deleteFaq = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await useFaq.deleteFaq(faq.id, token);
      ("Faq deleted successfully");
      navigate("/faq");
    } catch (error) {
      console.error("Error deleting faq:", error);
      notification.error({
        message: "Xato",
        description: error.message || "Faq o'chirishda xatolik yuz berdi.",
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
            <a href="/faq">FAQ</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          name="user-profile-details-form"
          layout="vertical"
          initialValues={{
            id: faq.id,
            question_uz: faq.question_uz,
            question_ru: faq.question_ru,
            question_en: faq.question_en,
            answer_uz: faq.answer_uz,
            answer_ru: faq.answer_ru,
            answer_en: faq.answer_en,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]}>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Question Uz"
                name="question_uz"
                rules={[
                  {
                    required: true,
                    message: "Please input your question Uz!",
                  },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Question Ru"
                name="question_ru"
                rules={[
                  {
                    required: true,
                    message: "Please input your question Ru!",
                  },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Question En"
                name="question_en"
                rules={[
                  {
                    required: true,
                    message: "Please input your question En!",
                  },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Answer Uz"
                name="answer_uz"
                rules={[
                  {
                    required: true,
                    message: "Please input your answer Uz!",
                  },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Answer Ru"
                name="answer_ru"
                rules={[
                  { required: true, message: "Please input your answer Ru!" },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Answer En"
                name="answer_en"
                rules={[
                  {
                    required: true,
                    message: "Please input your answer En!",
                  },
                ]}
              >
                <TextArea allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex items-center gap-4">
            <Button type="" htmlType="submit" icon={<SaveOutlined />}>
              Save changes
            </Button>

            <Popconfirm
              title="O'chirishni xohlaysizmi?"
              onConfirm={deleteFaq}
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

export default TeacherDetails;
