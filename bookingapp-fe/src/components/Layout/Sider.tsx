import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  HomeOutlined,
  SelectOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { getCookie } from "../../helper/Cookie";

const SiderComponent = () => {
  const role = getCookie("roles");
  const navigator = useNavigate();
  return (
    <>
      {role.includes("admin") ? (
        <Sider
          style={{ marginTop: 13 }}
          breakpoint="lg"
          collapsedWidth={70}
          trigger={null}
          theme="light"
          width={"200px"}
        >
          <div className="demo-logo-vertical" />
          <Menu
            className="menu"
            onClick={({ key }) => {
              navigator(key);
            }}
            theme="light"
            mode="inline"
            defaultSelectedKeys={["/"]}
            items={[
              {
                key: "/",
                icon: <AppstoreOutlined />,
                label: "Dashboard",
              },
              {
                key: "/calendarmeeting",
                icon: <CalendarOutlined />,
                label: "Calendar Meeting",
              },
              {
                key: "/roomManager",
                icon: <HomeOutlined />,
                label: "Room Manager",
              },
              {
                key: "/usermanager",
                icon: <UserOutlined />,
                label: "User Manager",
              },
              {
                key: "/bookingmanager",
                icon: <SelectOutlined />,
                label: "Booking Manager",
              },
            ]}
          />
        </Sider>
      ) : null}
    </>
  );
};

export default SiderComponent;
