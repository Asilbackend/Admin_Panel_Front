import { useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Spin,
  Breadcrumb,
  Input,
  notification,
} from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import mailAPI from "../../service/Email/mail";
import userAPI from "../../service/Users/user";

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);

  const location = useLocation();
  const emailAdres = localStorage.getItem("userEmail");

  const onFinish = (values) => {
    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      newRePassword: values.newRePassword,
      code: values.code,
    };
    userAPI.changePassword(data).then((response) => {
      notification.success({
        message: "Password Changed",
        description: "Your password has been successfully changed.",
      });
    }).catch((error) => {
      notification.error({
        message: "Error",
        description: error.response ? error.response.data.message : "An error occurred while changing the password.",
      });
    });
  };

  const onFinishFailed = (errorInfo) => {
    "Failed:", errorInfo;
  };

  const deleteFaq = () => {
    ("Faq deleted");
  };

  const sendEmailRequest = (email) => {
    mailAPI.sendEmail(email).then((response) => {
      notification.success({
        message: "Email Sent",
        description: "Verification code has been sent to your email.",
      });
      setCodeVisible(true);
    });
  };
  const navigate = useNavigate();
  return (
    <Spin spinning={loading}>
      <Content
        style={{
          margin: "6px 16px",
          padding: 24,
          minHeight: 280,
          background: "#fff",
          borderRadius: "8px",
        }}
      >
        <Breadcrumb style={{ marginBottom: "16px" }}>
          <Breadcrumb.Item>
            <a href="/profile">Profile</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit Profile</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          name="user-profile-details-form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]}>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Old Password"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your old password!",
                  },
                ]}
              >
                <Input.Password allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            <Col sm={24} lg={24}>
              <Form.Item
                label="Confirm New Password"
                name="newRePassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                ]}
              >
                <Input.Password allowClear style={{ height: 60 }} />
              </Form.Item>
            </Col>
            {codeVisible && (
              <Col sm={24} lg={24}>
                <Form.Item
                  label="Verification Code"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Please input the verification code!",
                    },
                  ]}
                >
                  <Input allowClear style={{ height: 60 }} />
                </Form.Item>
              </Col>
            )}
          </Row>

          <div className="flex items-center gap-4">
            <Button
              type=""
              htmlType="submit"
              icon={<SaveOutlined />}
              onClick={() => sendEmailRequest(emailAdres)}
            >
              Save changes
            </Button>

            <Button type="primary" danger onClick={() => navigate("/users")}>
              Cancel
            </Button>
          </div>
        </Form>
      </Content>
    </Spin>
  );
};

export default ProfileEdit;
