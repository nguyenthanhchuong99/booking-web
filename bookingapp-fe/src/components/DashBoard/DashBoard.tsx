import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import "./dashboard.css";
import { handleErrorShow } from "../../ultils/ultilsApi";
import { Space, Spin } from "antd";
import { get } from "../../ultils/request";
import TotalCard from "./TotalCard";
import {
  CheckCircleOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
const Dashboard = () => {
  interface DataUserType {
    user_name: string;
    phone_number: string;
    email: string;
  }
  interface DataBookingType {
    booking_id: number;
    room_id: number;
    room_name: string;
  }
  interface DataRoomType {
    room_id: number;
    room_name: string;
  }
  const [listUsers, setListusers] = useState<DataUserType[]>([]);
  const [totalUser, setTotalUser] = useState<number>();
  const [listBooking, setListBooking] = useState<DataBookingType[]>([]);
  const [totalBooking, setTotalBooking] = useState<number>();
  const [listRoom, setListRoom] = useState<DataRoomType[]>([]);
  const [totalRoom, setTotalRoom] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);

  const getDataBooking = async () => {
    setLoading(false);
    try {
      const response = await get(`/v1/admin/view_booking_pending`);
      if (response) {
        setListBooking(response.list_bookings);
        setTotalBooking(response.total_items);
      }
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const getDataUsers = async () => {
    setLoading(false);
    try {
      const response = await get(`/v1/users`);
      if (response) {
        setListusers(response.users);
        setTotalUser(response.total_items);
      }
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const getDataRooms = async () => {
    setLoading(false);
    try {
      const response = await get(`/v1/rooms`);
      if (response) {
        setListRoom(response.rooms);
        setTotalRoom(response.total_items);
      }
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataBooking();
    getDataUsers();
    getDataRooms();
  }, []);
  const columns: ColumnsType<DataUserType> = [
    {
      align: "center",
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      align: "center",
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      align: "center",
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
  ];
  return (
    <>
      <h2 className="component-name">Dashboard</h2>
      <Spin
        size="large"
        spinning={loading}
        tip="Loading..."
        className="spin-loading"
      >
        <Space
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TotalCard
            value={totalBooking}
            link="bookingmanager"
            backgroundCard="#ebe1f6"
            title="Booking pending"
            icon={
              <CheckCircleOutlined
                className="custom-icon"
                style={{ color: "blue", backgroundColor: "rgba(0,0,255,0.25)" }}
              />
            }
          />
          <TotalCard
            value={totalUser}
            link="usermanager"
            backgroundCard="pink"
            title="Users"
            icon={
              <UserOutlined
                className="custom-icon"
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                }}
              />
            }
          />
          <TotalCard
            value={totalRoom}
            link="roommanager"
            backgroundCard="#f7dce2"
            title="Rooms"
            icon={
              <HomeOutlined
                className="custom-icon"
                style={{ color: "red", backgroundColor: "rgba(255,0,0,0.25)" }}
              />
            }
          />
        </Space>
        <Table
          style={{ position: "relative" }}
          dataSource={listUsers}
          columns={columns}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
        />
      </Spin>
    </>
  );
};

export default Dashboard;
