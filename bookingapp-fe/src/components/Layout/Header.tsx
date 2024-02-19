import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, MenuProps, Modal, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getCookie } from "../../helper/Cookie";
import ChangePassword from "../InfoUser/ChangePassword";
import "./Layout.css";
import { handleErrorShow } from "../../ultils/ultilsApi";
import { get, post } from "../../ultils/request";
import { DataType } from "../../constant/constant";

const HeaderComponent = () => {
  const role = getCookie("roles");
  const name = getCookie("name");
  const id = getCookie("id");

  const navigator = useNavigate();
  const [isopen, setIsOpen] = useState(false);
  const [user, setUser] = useState<DataType>();
  const fetchLogout = async () => {
    try {
      await post("/v1/logout", {});
    } catch (error: any) {
      handleErrorShow(error);
    }
  };
  useEffect(() => {
    getData();
    console.log(user)
  }, [user]);
  const getData = async () => {
    try {
      const response = await get(`/v1/users/${id}`);
      if (response) {
        setUser(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    }
  };
  const handleLogout = async () => {
    const cookies = Cookies.get();
    await fetchLogout();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
    navigator("/login");
  };
  const handleChange = (status: boolean) => {
    setIsOpen(status);
  };
  const handleCancel = () => {
    handleChange(false);
  };
  const handleNavigate = (key: string) => {
    if (key === "logout") {
      handleLogout();
    } else if (key === "changepassword") {
      handleChange(true);
    } else {
      navigator(key);
    }
  };
  const items: MenuProps["items"] = [
    {
      label: "Infomaiton account",
      icon: <UserOutlined />,
      key: "informationaccount",
    },
    {
      label: "Change password",
      icon: <UserOutlined />,
      key: "changepassword",
    },
    {
      label: " Logout",
      icon: <LogoutOutlined />,
      key: "logout",
    },
  ];
  return (
    <>
      <Header className="header-layout">
        <h1>BookingMeetingRoom</h1>
        {!role.includes("admin") ? (
          <Menu
            className="menu"
            onClick={({ key }) => {
              navigator(key);
            }}
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["/"]}
            items={[
              {
                key: "/calendarmeeting",
                label: "Calendar",
              },
              {
                key: "/bookingroom",
                label: "Booking room",
              },
              {
                key: "/invitations",
                label: "Invitations",
              },
            ]}
          />
        ) : (
          <></>
        )}

        <div style={{ display: "flex" }}>
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  handleNavigate(key);
                }}
                selectable
                items={items}
              />
            }
            trigger={["click"]}
            arrow
          >
            <Button className="btn-account">
              <Space style={{ columnGap: 30 }}>
                <Avatar
                  style={{ marginLeft: 0 }}
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                />
                {user?.user_name}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Header>

      <Modal
        title="Change password"
        destroyOnClose={true}
        open={isopen}
        footer={[]}
        onCancel={handleCancel}
        className="small-modal"
      >
        <ChangePassword onChange={handleChange} />
      </Modal>
    </>
  );
};

export default HeaderComponent;
