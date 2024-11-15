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
  Tabs,
  Upload,
  Dropdown,
} from "antd";

import {
  SaveOutlined,
  DeleteOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";
import attachmentsAPI from "../../service/Attachments/attachments";

import teacherAPI from "../../service/Teachers/teacher";
const TeacherDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const { teacher } = location.state || {};

  const [attachmentData, setAttachmentData] = useState(null);
  const [tempAttachments, setTempAttachments] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const formattedData = {
        firstname: values.firstName,
        lastname: values.lastName,
        level: values.level,
        description_uz: values.descriptionUz,
        description_ru: values.descriptionRu,
        description_en: values.descriptionEn,
        studentsStudied: values.studentsStudied,
        experience: values.experience,
        attachments: attachmentData
          ? teacher.attachments.length > 1
            ? [...teacher.attachments, attachmentData]
            : [attachmentData]
          : teacher.attachments,
      };
      await teacherAPI.editTeacher(teacher.id, formattedData, token);
      notification.success({
        message: "Success",
        description: "Teacher details updated successfully",
      });
      navigate("/teacher");
    } catch (error) {
      console.error("Error updating teacher:", error);
      notification.error({
        message: "Xato",
        description: error.response?.data || "O'zgartirishda xato yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    "Failed:", errorInfo;
  };

  const deleteTeacher = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await teacherAPI.deleteTeacher(teacher.id, token);
      ("Teacher deleted successfully");
      navigate("/teacher");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      notification.error({
        message: "Xato",
        description:
          error.response?.data || "O'qituvchi o'chirishda xato yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await attachmentsAPI.deleteAttachment(attachmentId);
      notification.success({
        message: "Success",
        description: "Attachment deleted successfully",
      });
      setTempAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== attachmentId)
      );
      navigate("/teacher");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      notification.error({
        message: "Xato",
        description:
          error.response?.data || "Ilova o'chirishda xato yuz berdi.",
      });
    }
  };

  const items = (attachmentId) => [
    {
      label: (
        <Button
          type="link"
          danger
          onClick={() => handleDeleteAttachment(attachmentId)}
        >
          Delete
        </Button>
      ),
      key: "1",
    },
  ];

  const handleUpload = async (file, type) => {
    const isImageOrVideo =
      file.type.startsWith("image/") || file.type.startsWith("video/");
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
      if (type === "image") {
        document.querySelector("img").src = data.url;
      } else if (type === "video") {
        document.querySelector("video").src = data.url;
      }
      console.log("Attachment data:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
      notification.error({
        message: "Xato",
        description: error.response?.data || "Fayl yuklashda xato yuz berdi.",
      });
    }
    return false;
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
        <Form
          name="user-profile-details-form"
          layout="vertical"
          initialValues={{
            id: teacher.id,
            username: teacher.username,
            firstName: teacher.firstname,
            lastName: teacher.lastname,
            company: teacher.company,
            email: teacher.email,
            descriptionUz: teacher.description_uz,
            descriptionRu: teacher.description_ru,
            descriptionEn: teacher.description_en,
            studentsStudied: teacher.studentsStudied,
            experience: teacher.experience,
            level: teacher.level,
            status: "active",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]}>
            <Col sm={24} lg={24}>
              <div className="flex justify-between gap-4 mb-10">
                {teacher.attachments.length === 1 && (
                  <Col
                    sm={24}
                    lg={4}
                    className="flex flex-col gap-4 items-center"
                  >
                    <Image
                      width={150}
                      src={teacher.attachments[0].url?.replace(
                        "download",
                        "view"
                      )}
                      alt="Teacher Attachment"
                      height={150}
                      className="rounded-lg object-cover"
                    />
                    <Upload
                      name="image"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={(file) => handleUpload(file, "image")}
                    >
                      <Button icon={<UploadOutlined />}>
                        Upload Image or Video
                      </Button>
                    </Upload>
                  </Col>
                )}

                <div className="flex gap-4">
                  <Form.Item
                    label="User ID"
                    name="id"
                    rules={[
                      { required: true, message: "Please input your id!" },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input
                      allowClear
                      readOnly={true}
                      suffix={
                        <Typography.Paragraph
                          copyable={{ text: teacher.id }}
                          style={{ margin: 0 }}
                        ></Typography.Paragraph>
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Level"
                    name="level"
                    rules={[
                      { required: true, message: "Please select your level!" },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item
                    label="Experience"
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please input your experience!",
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item
                    label="Students Studied"
                    name="studentsStudied"
                    rules={[
                      {
                        required: true,
                        message: "Please input your students studied!",
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input allowClear />
                  </Form.Item>
                </div>
              </div>
            </Col>

            {teacher.attachments.length > 1 && (
              <Tabs
                defaultActiveKey="1"
                className="w-full mb-10"
                items={[
                  {
                    key: "1",
                    label: "Picture",
                    children: (
                      <>
                        <div className="flex gap-4 flex-wrap mb-4">
                          {teacher.attachments.map(
                            (attachment) =>
                              attachment.attachType === "PICTURE" && (
                                <Dropdown
                                  menu={{
                                    items: items(attachment.id),
                                  }}
                                  trigger={["contextMenu"]}
                                >
                                  <Image
                                    width={150}
                                    src={attachment.url.replace(
                                      "download",
                                      "view"
                                    )}
                                    alt="New Attachment"
                                    height={150}
                                    className="rounded-lg object-cover"
                                  />
                                </Dropdown>
                              )
                          )}
                          {tempAttachments.map((attachment) => (
                            <Dropdown
                              menu={{
                                items: items(attachment.id),
                              }}
                              trigger={["contextMenu"]}
                            >
                              <Image
                                width={150}
                                src={attachment.url.replace("download", "view")}
                                alt="New Attachment"
                                height={150}
                                className="rounded-lg object-cover"
                              />
                            </Dropdown>
                          ))}
                        </div>

                        <Upload
                          name="image"
                          listType="picture"
                          showUploadList={false}
                          beforeUpload={(file) => handleUpload(file, "image")}
                        >
                          <Button icon={<UploadOutlined />}>
                            Upload Image
                          </Button>
                        </Upload>
                      </>
                    ),
                    icon: <PictureOutlined />,
                  },
                  {
                    key: "2",
                    label: "Video",
                    children: (
                      <>
                        <div className="">
                          <div className="flex gap-4 flex-wrap mb-4">
                            {teacher.attachments.map(
                              (attachment) =>
                                attachment.attachType === "VIDEO" && (
                                  <Dropdown
                                    menu={{
                                      items: items(attachment.id),
                                    }}
                                    trigger={["contextMenu"]}
                                  >
                                    <video
                                      controls
                                      width={300}
                                      height={150}
                                      style={{
                                        maxWidth: "350px",
                                        maxHeight: "150px",
                                      }}
                                    >
                                      <source
                                        className="object-cover w-full h-full"
                                        src={attachment.url}
                                        type="video/mp4"
                                      />
                                    </video>
                                  </Dropdown>
                                )
                            )}
                          </div>

                          <Upload
                            name="video"
                            listType="video"
                            showUploadList={false}
                            beforeUpload={(file) => handleUpload(file, "video")}
                          >
                            <Button icon={<UploadOutlined />}>
                              Upload Video
                            </Button>
                          </Upload>
                        </div>
                      </>
                    ),
                    icon: <VideoCameraOutlined />,
                  },
                ]}
              />
            )}
            <Col sm={24} lg={24}>
              <div className="flex gap-4">
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                  style={{ flex: 1 }}
                >
                  <Input allowClear />
                </Form.Item>
              </div>
            </Col>
            <Col sm={24} lg={24}>
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
            <Col sm={24} lg={24}>
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
            <Col sm={24} lg={24}>
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
              onConfirm={deleteTeacher}
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
