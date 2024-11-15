import { Content } from "antd/es/layout/layout";
import "./style.scss";
import { theme } from "antd";

const index = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
        Home
      </Content>
    </section>
  );
};

export default index;
