import React, { useEffect, useState } from "react";
import {
  theme,
  Table,
  Tooltip,
  Spin,
  Button,
  Divider,
  Form,
  Input,
  Modal,
} from "antd";
import { Content } from "antd/es/layout/layout";
import useFaq from "../../service/Faq/faq";
import { useNavigate } from "react-router-dom";

const index = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleCreate = () => {
    form.validateFields().then((values) => {
      setLoading(true); // Loaderni yoqish
      const authToken = localStorage.getItem("authToken");
      useFaq
        .createFaq(values, authToken)
        .then((response) => {
          const newRecord = {
            ...values,
            id: response.data.id,
          };
          setFaqData([newRecord, ...faqData]);
          setLoading(false);
          setOpenCreate(false);
          notification.success({
            message: "Success",
            description: "Faq created successfully",
          });
        })
        .catch((error) => {
          console.error("Error creating faq:", error);
          notification.error({
            message: "Error",
            description: error.response
              ? error.response.data.message
              : "Failed to create faq",
          });
        });
    });
  };

  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    useFaq.getAllFaq().then((response) => {
      setLoading(true);
      const formattedData = response.data.map((item) => ({
        key: item.id.toString(),
        id: item.id.toString(),
        ...item,
      }));
      const sortedData = formattedData.sort((a, b) => b.id - a.id);
      setFaqData(sortedData);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "Savol (UZ)",
      dataIndex: "question_uz",
      key: "question_uz",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Savol (RU)",
      dataIndex: "question_ru",
      key: "question_ru",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Savol (EN)",
      dataIndex: "question_en",
      key: "question_en",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Javob (UZ)",
      dataIndex: "answer_uz",
      key: "answer_uz",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Javob (RU)",
      dataIndex: "answer_ru",
      key: "answer_ru",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Javob (EN)",
      dataIndex: "answer_en",
      key: "answer_en",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </Tooltip>
      ),
    },
  ];
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
              dataSource={faqData}
              rowKey="id"
              rowClassName="cursor-pointer"
              className="w-full"
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/faqDetails/${record.id}`, {
                      state: { faq: record },
                    });
                  },
                };
              }}
            />

            <Modal
              title={"Create Faq"}
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
                  name="question_uz"
                  label="Question (Uzbek)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the question in Uzbek!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  name="question_ru"
                  label="Question (Russian)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the question in Russian!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  name="question_en"
                  label="Question (English)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the question in English!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  name="answer_uz"
                  label="Answer (Uzbek)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the answer in Uzbek!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="answer_ru"
                  label="Answer (Russian)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the answer in Russian!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="answer_en"
                  label="Answer (English)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the answer in English!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </section>
    </Spin>
  );
};

export default index;
