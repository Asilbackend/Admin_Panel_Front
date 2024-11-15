import { useEffect, useState } from "react";
import {
  theme,
  Table,
  Tooltip,
  Spin,
  Button,
  Form,
  Modal,
  Input,
  Layout,
  Popconfirm,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import materialAPI from "../../service/Material/material";
import notification from "antd/lib/notification";
import attachmentsAPI from "../../service/Attachments/attachments";
const { Content } = Layout;
const index = () => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    materialAPI.getMaterials().then((res) => {
      setMaterials(res.data.reverse()); // Datalarni teskari tartibda chiqarish
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a
          href={record.attachment.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="O'chirishni xohlaysizmi?"
          onConfirm={() => {
            handleDelete(record.id);
            notification.success({
              message: "Success",
              description: "Element muvaffaqiyatli o'chirildi",
            });
          }}
          okText="Ha"
          cancelText="Yo'q"
          okButtonProps={{ type: "link" }}
          cancelButtonProps={{ type: "link", danger: true }}
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const [openCreate, setOpenCreate] = useState(false);
  const [attachmentData, setAttachmentData] = useState(null);
  const handleDelete = (id) => {
    setLoading(true);
    materialAPI
      .deleteMaterial(id)
      .then((res) => {
        setMaterials((prevMaterials) =>
          prevMaterials.filter((material) => material.id !== id)
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createMaterial = async (materialsData) => {
    setLoading(true);
    try {
      attachmentData;
      const data = {
        name: materialsData.name,
        attachment: attachmentData,
      };
      const response = await materialAPI.createMaterial(data);
      notification.success({
        message: "Success",
        description: "Material created successfully",
      });
      setMaterials((prevMaterials) => [...prevMaterials, response.data]); // Yangi materialni qo'shish
      setOpenCreate(false);
    } catch (error) {
      // Xatolik bo'lsa, notification chiqarish
      notification.error({
        message: "Xatolik",
        description: error.response
          ? error.response.data.message
          : "Material yaratishda xatolik yuz berdi",
      });
      console.error("Error creating material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <section>
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
              onClick={() => {
                form.resetFields();
                setOpenCreate(true);
              }}
            >
              Create
            </Button>
            <Modal
              title="Create Resource"
              centered
              open={openCreate}
              onOk={() => {
                form
                  .validateFields()
                  .then((values) => {
                    createMaterial(values);
                  })
                  .catch((info) => {
                    notification.error({
                      message: "Validate Failed:",
                      description: info,
                    });
                  });
              }}
              okButtonProps={{ type: "default" }}
              cancelButtonProps={{ danger: true }}
              onCancel={() => setOpenCreate(false)}
              width={600}
            >
              <Form form={form} layout="vertical">
                <Form.Item name="name" label="File name">
                  <Input allowClear />
                </Form.Item>
                <Form.Item name="attachment" label="Attachment">
                  <Upload
                    beforeUpload={async (file) => {
                      try {
                        const formData = new FormData();
                        formData.append("multipartFile", file);
                        const response = await attachmentsAPI.saveAttachment(
                          formData
                        );
                        const data = response.data;
                        setAttachmentData(data);
                        "attch: ", data;
                      } catch (error) {
                        console.error("Error uploading file:", error);
                      }
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <Table
              className="w-full"
              dataSource={materials}
              columns={columns}
            />
          </div>
        </Content>
      </section>
    </Spin>
  );
};

export default index;
