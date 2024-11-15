import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import {
  theme,
  Table,
  Image,
  Tooltip,
  Spin,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Upload,
  notification,
} from "antd";
import newsAPI from "../../service/News/news";
import attachmentsAPI from "../../service/Attachments/attachments";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [attachmentData, setAttachmentData] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchNews = async () => {
      try {
        const response = await newsAPI.getNewsAll();
        // Olingan ma'lumotlarni kamayish tartibida saralash
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        setNewsData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };
    fetchNews();
  }, []);

  const columns = [
    {
      title: "ID",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Title (UZ)",
      dataIndex: "title_uz",
      key: "title_uz",
    },
    {
      title: "Title (RU)",
      dataIndex: "title_ru",
      key: "title_ru",
    },
    {
      title: "Title (EN)",
      dataIndex: "title_en",
      key: "title_en",
    },
    {
      title: "Description (UZ)",
      dataIndex: "description_uz",
      key: "description_uz",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 15 ? `${text.substring(0, 15)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (RU)",
      dataIndex: "description_ru",
      key: "description_ru",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 15 ? `${text.substring(0, 15)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (EN)",
      dataIndex: "description_en",
      key: "description_en",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 15 ? `${text.substring(0, 15)}...` : text}
        </Tooltip>
      ),
    },
  ];
  const navigate = useNavigate();

  const createNews = async (newsData) => {
    try {
      const data = {
        title_uz: newsData.title_uz,
        title_ru: newsData.title_ru,
        title_en: newsData.title_en,
        description_uz: newsData.description_uz,
        description_ru: newsData.description_ru,
        description_en: newsData.description_en,
        attachments: attachmentData,
      };
      const response = await newsAPI.createNews(data);
      notification.success({
        message: "Success",
        description: "News created successfully",
      });
      setOpenCreate(false);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating news:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "News creation failed",
      });
    }
  };

  return (
    <section>
      <Spin spinning={loading}>
        <Content
          style={{
            margin: "24px 16px",
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
              dataSource={newsData}
              rowKey="id"
              className="w-full"
              rowClassName="row-hover cursor-pointer"
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/newsDetails/${record.id}`, {
                      state: { news: record },
                    });
                  },
                };
              }}
            />
          </div>
        </Content>
      </Spin>

      <Modal
        title="Create News"
        width={800}
        visible={openCreate}
        okButtonProps={{ type: "link" }}
        cancelButtonProps={{ type: "link", danger: true }}
        onCancel={() => setOpenCreate(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              createNews(values);
            })
            .catch((info) => {
              notification.error({
                message: "Validate Failed:",
                description: info,
              });
            });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title_uz"
            label="Title (UZ)"
            rules={[
              { required: true, message: "Please input the title in Uzbek!" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="title_ru"
            label="Title (RU)"
            rules={[
              { required: true, message: "Please input the title in Russian!" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="title_en"
            label="Title (EN)"
            rules={[
              { required: true, message: "Please input the title in English!" },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="description_uz"
            label="Description (UZ)"
            rules={[
              {
                required: true,
                message: "Please input the description in Uzbek!",
              },
            ]}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <Form.Item
            name="description_ru"
            label="Description (RU)"
            rules={[
              {
                required: true,
                message: "Please input the description in Russian!",
              },
            ]}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <Form.Item
            name="description_en"
            label="Description (EN)"
            rules={[
              {
                required: true,
                message: "Please input the description in English!",
              },
            ]}
          >
            <Input.TextArea allowClear />
          </Form.Item>
          <Form.Item
            name="upload"
            label="Upload Files"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload
              name="files"
              listType="picture"
              multiple
              beforeUpload={async (file) => {
                try {
                  const formData = new FormData();
                  formData.append("multipartFile", file);
                  const response = await attachmentsAPI.saveAttachment(
                    formData
                  );

                  const data = response.data;
                  setAttachmentData((prevData) => [...(prevData || []), data]);
                } catch (error) {
                  console.error("Error uploading file:", error);
                }

                return false;
              }}
              accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default index;
