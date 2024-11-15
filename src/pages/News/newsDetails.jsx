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
  Tabs,
  Breadcrumb,
  Dropdown,
} from "antd";

import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import newsAPI from "../../service/News/news";
import { useState, useEffect } from "react";
import attachmentsAPI from "../../service/Attachments/attachments";

const StudentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const [tempAttachments, setTempAttachments] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const { news } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (attachmentData.length > 0) {
      setTempAttachments((prev) => [...prev, ...attachmentData]);
    }
  }, [attachmentData]);

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
  const onFinish = async (values) => {
    setLoading(true);

    const data = {
      title_uz: values.title_uz,
      title_ru: values.title_ru,
      title_en: values.title_en,
      description_uz: values.description_uz,
      description_ru: values.description_ru,
      description_en: values.description_en,
      attachments: [...news.attachments, ...tempAttachments],
    };

    try {
      const token = localStorage.getItem("authToken");
      await newsAPI.editNews(news.id, data, token);
      notification.success({
        message: "Success",
        description: "News details updated successfully",
      });
      navigate("/news");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data || "Xatolik yuz berdi",
      });
      console.error("Error:", error);
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
      await newsAPI.deleteNews(news.id, token);
      notification.success({
        message: "Success",
        description: "News deleted successfully",
      });
      navigate("/news");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data,
      });
      console.error("Error deleting news:", error);
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
            <a href="/news">News</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Details</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          name="user-profile-details-form"
          layout="vertical"
          initialValues={{
            id: news.id,
            title_uz: news.title_uz,
            title_ru: news.title_ru,
            title_en: news.title_en,
            description_uz: news.description_uz,
            description_ru: news.description_ru,
            description_en: news.description_en,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
          requiredMark={false}
        >
          <Row gutter={[16, 0]} align="middle" className="mb-20">
            <Col sm={24} lg={20}>
              <Row gutter={[16, 0]}>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Id"
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
                          copyable={{ text: news.id }}
                          style={{ margin: 0 }}
                        ></Typography.Paragraph>
                      }
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Title Uz"
                    name="title_uz"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title Uz!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Title Ru"
                    name="title_ru"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title Ru!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={6}>
                  <Form.Item
                    label="Title En"
                    name="title_en"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title En!",
                      },
                    ]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={[16, 0]} align="middle" className="mb-10">
            <Tabs
              defaultActiveKey="3"
              className="w-full mb-10"
              items={[
                {
                  key: "1",
                  label: "Picture",
                  children: (
                    <>
                      <div className="flex gap-4 flex-wrap mb-4">
                        {news.attachments.map(
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
                                  alt="Teacher Attachment"
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
                        beforeUpload={async (file) => {
                          try {
                            const formData = new FormData();
                            formData.append("multipartFile", file);
                            const response =
                              await attachmentsAPI.saveAttachment(formData);

                            const data = response.data;
                            setAttachmentData([data]); // Eski array o'rniga yangi array qo'shildi
                          } catch (error) {
                            console.error("Error uploading file:", error);
                          }

                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
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
                          {news.attachments.map(
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
                          {tempAttachments.map(
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
                          beforeUpload={async (file) => {
                            try {
                              const formData = new FormData();
                              formData.append("multipartFile", file);
                              const response =
                                await attachmentsAPI.saveAttachment(formData);

                              const data = response.data;
                              setAttachmentData([data]); // Eski array o'rniga yangi array qo'shildi
                            } catch (error) {
                              notification.error({
                                message: "Error",
                                description: error.response.data,
                              });
                            }

                            return false;
                          }}
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
                {
                  key: "3",
                  label: "File",
                  children: (
                    <>
                      <div className="">
                        <div className="mb-10">
                          {news.attachments.map(
                            (attachment) =>
                              attachment.attachType === "PDF_OR_ANY" && (
                                <Dropdown
                                  menu={{
                                    items: items(attachment.id),
                                  }}
                                  trigger={["contextMenu"]}
                                >
                                  <div className="flex items-center my-1">
                                    <span>{attachment.id}. </span>
                                    <a href={attachment.url} target="_blank">
                                      {attachment.fileName
                                        .split("_")
                                        .slice(1)
                                        .join("_")}
                                    </a>
                                  </div>
                                </Dropdown>
                              )
                          )}
                          {tempAttachments.map(
                            (attachment) =>
                              attachment.attachType === "PDF_OR_ANY" && (
                                <Dropdown
                                  menu={{
                                    items: items(attachment.id),
                                  }}
                                  trigger={["contextMenu"]}
                                >
                                  <div className="flex items-center my-1">
                                    <span>{attachment.id}. </span>
                                    <a href={attachment.url} target="_blank">
                                      {attachment.fileName
                                        .split("_")
                                        .slice(1)
                                        .join("_")}
                                    </a>
                                  </div>
                                </Dropdown>
                              )
                          )}
                        </div>

                        <Upload
                          name="file"
                          listType="file"
                          showUploadList={false}
                          beforeUpload={async (file) => {
                            try {
                              const formData = new FormData();
                              formData.append("multipartFile", file);
                              const response =
                                await attachmentsAPI.saveAttachment(formData);

                              const data = response.data;
                              setAttachmentData([data]); // Eski array o'rniga yangi array qo'shildi
                            } catch (error) {
                              console.error("Error uploading file:", error);
                            }

                            return false;
                          }}
                        >
                          <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                      </div>
                    </>
                  ),
                  icon: <FileOutlined />,
                },
              ]}
            />
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
