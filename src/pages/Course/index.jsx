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
  notification,
} from "antd";
import courseAPI from "../../service/Course/course";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const index = () => {
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const authToken = localStorage.getItem("authToken");
      const data = {
        ...values,
      };
      courseAPI
        .createCourse(data, authToken)
        .then((response) => {
          const newRecord = {
            key: response.data.id.toString(),
            id: response.data.id.toString(),
            ...values,
          };
          setDataSource([...dataSource, newRecord]);
          setCourses([...courses, newRecord]);
          setOpenCreate(false);
        })
        .catch((error) => {
          notification.error({
            message: "Xato",
            description: error.response
              ? error.response.data.message
              : "Backenddan xatolik kelib tushdi!",
          });
        });
    });
  };

  useEffect(() => {
    setLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses();
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setCourses(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
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
    },
    {
      title: "Description (UZ)",
      dataIndex: "description_uz",
      key: "description_uz",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (RU)",
      dataIndex: "description_ru",
      key: "description_ru",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Description (EN)",
      dataIndex: "description_en",
      key: "description_en",
      render: (text) => (
        <Tooltip title={text}>
          {text && text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </Tooltip>
      ),
    },
  ];
  const navigate = useNavigate();

  const handleCancel = () => {
    setIsModalVisible(false);
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
              title="Create Course"
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
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the name!",
                    },
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
                  <Input allowClear />
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
                  <Input allowClear />
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
                  <Input allowClear />
                </Form.Item>
              </Form>
            </Modal>

            <Table
              dataSource={courses}
              columns={columns}
              className="w-full"
              rowKey="id"
              rowClassName="row-hover cursor-pointer"
              onRow={(record) => {
                return {
                  onClick: () => {
                    navigate(`/courseDetails/${record.id}`, {
                      state: { course: record },
                    });
                  },
                };
              }}
            />
          </div>
        </Content>
      </section>
    </Spin>
  );
};

export default index;
