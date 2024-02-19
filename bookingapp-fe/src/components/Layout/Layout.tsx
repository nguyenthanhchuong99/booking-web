import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import HeaderComponent from "./Header";
import SiderComponent from "./Sider";
import "./Layout.css";
const { Content } = Layout;
const LayoutApp = () => {
  return (
    <Layout>
      <HeaderComponent />
      <Layout>
        <SiderComponent />
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
