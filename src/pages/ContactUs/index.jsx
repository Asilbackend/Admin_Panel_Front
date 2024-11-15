import { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";
import { theme, Input, Form, Button, notification } from "antd";
import useContactApi from "../../service/ContactUs/contact";

const index = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [dataSource, setDataSource] = useState({});

  const [form] = Form.useForm();

  useEffect(() => {
    useContactApi.getAllContact().then((response) => {
      const data = response;
      setDataSource(data);
      form.setFieldsValue({
        centerName: data.centerName,
        street_uz: data.address?.street_uz,
        city_uz: data.address?.city_uz,
        street_ru: data.address?.street_ru,
        city_ru: data.address?.city_ru,
        street_en: data.address?.street_en,
        city_en: data.address?.city_en,
        phone: data.phone,
        instagramLink: data.instagramLink,
        telegramLink: data.telegramLink,
      });
    });
  }, []);

  const handleSave = async (values) => {
    const data = {
      centerName: values.centerName,
      address: {
        latitude: 0,
        longitude: 0,
        street_uz: values.street_uz,
        city_uz: values.city_uz,
        street_ru: values.street_ru,
        city_ru: values.city_ru,
        street_en: values.street_en,
        city_en: values.city_en,
      },
      phone: values.phone,
      instagramLink: values.instagramLink,
      telegramLink: values.telegramLink,
      youtubeLink: "",
    };
    try {
      await useContactApi.editContact(data, dataSource.id);
      notification.success({
        message: "Success",
        description: "Contact updated successfully",
      });
    } catch (error) {
      // Xatolik bo'lsa, notification orqali chiqarish
      notification.error({
        message: "Error",
        description: `Contact update failed: ${error.message}`,
      });
      console.error("Error updating contact:", error);
    }
  };

  const handleCancel = () => {
    useContactApi.getAllContact().then((response) => {
      const data = response;
      form.setFieldsValue({
        centerName: data.centerName,
        street_uz: data.address?.street_uz,
        city_uz: data.address?.city_uz,
        street_ru: data.address?.street_ru,
        city_ru: data.address?.city_ru,
        street_en: data.address?.street_en,
        city_en: data.address?.city_en,
        phone: data.phone,
        instagramLink: data.instagramLink,
        telegramLink: data.telegramLink,
      });
    });
  };

  return (
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
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave} // Form submit bo'lganda handleSave chaqiriladi
        >
          <Form.Item
            style={{ flex: 1 }}
            label="Center Name"
            rules={[
              { required: true, message: "Please input your center name!" },
            ]}
            name="centerName"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Street (UZ)"
            rules={[
              { required: true, message: "Please input your street name!" },
            ]}
            name="street_uz"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Street (RU)"
            rules={[
              { required: true, message: "Please input your street name!" },
            ]}
            name="street_ru"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Street (EN)"
            rules={[
              { required: true, message: "Please input your street name!" },
            ]}
            name="street_en"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="City (UZ)"
            rules={[
              { required: true, message: "Please input your city name!" },
            ]}
            name="city_uz"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="City (RU)"
            rules={[
              { required: true, message: "Please input your city name!" },
            ]}
            name="city_ru"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="City (EN)"
            rules={[
              { required: true, message: "Please input your city name!" },
            ]}
            name="city_en"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
            name="phone"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Instagram Link"
            rules={[
              { required: true, message: "Please input your Instagram link!" },
            ]}
            name="instagramLink"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item
            style={{ flex: 1 }}
            label="Telegram Link"
            rules={[
              { required: true, message: "Please input your Telegram link!" },
            ]}
            name="telegramLink"
          >
            <Input type="text" allowClear />
          </Form.Item>
          <Form.Item style={{ flex: 1 }}>
            <Button type="" htmlType="submit">
              Save Changes
            </Button>
            <Button style={{ marginLeft: "8px" }} danger onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </section>
  );
};

export default index;
