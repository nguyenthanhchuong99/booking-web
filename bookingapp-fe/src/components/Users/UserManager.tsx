import { Tag, Space, Modal, Button, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import axios from "axios";

import { url } from "../../ultils/urlApi";
import FormAdd from "./FormAdd";
import {
  ChangePageSize,
  DataType,
  HEADER,
  TYPE_USER,
} from "../../constant/constant";
import { DeleteTwoTone, EditTwoTone, SearchOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import FormEdit from "./FormEdit";
import { del, get } from "../../ultils/request";

const UsersManager = () => {
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType>();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);
  const getData = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await get("/v1/users", {
        page: currentPage,
        per_page: perPage,
      });
      if (response) {
        setListUsers(response.users);
        setTotalItems(response.total_items);
        setPerPage(response.per_page);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      getData();
    } else {
      try {
        setLoading(true);
        const response = await get("v1/users/search", { search: value });
        if (response) {
          setListUsers(response.users);
          setTotalItems(response.total_items);
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleEditUser = (editUser: DataType) => {
    if (selectedUser) {
      setListUsers((prevListUsers) =>
        prevListUsers.map((user) =>
          user.user_id === selectedUser.user_id
            ? { ...user, ...editUser }
            : user
        )
      );
    }
    getData();
  };
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        setLoading(true);
        const response = await del(`/v1/users/${selectedUser.user_id}`);
        if (response) {
          getData();
          handleSuccessShow(response);
          setIsModalDeleteOpen(false);
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: ChangePageSize,
  };
  const columns: ColumnsType<DataType> = [
    {
      align: "center",
      title: "Number",
      key: "index",
      dataIndex: "index",
      render: (text, listUsers, index) =>
        index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
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
      responsive: ["sm"],
    },
    {
      align: "center",
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      responsive: ["md"],
    },
    {
      align: "center",
      title: "Role Name",
      dataIndex: "role_name",
      responsive: ["lg"],
      render: (_, { role_name }) => (
        <>
          {role_name.map((role_name, key) => {
            let color = role_name === TYPE_USER.ADMIN ? "pink" : "green";
            return (
              <Tag color={color} key={key}>
                {role_name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      align: "center",
      title: "Action",
      key: "action",
      render: (_text, user) => (
        <Space size="middle">
          <EditTwoTone onClick={() => handleSelectUser(user)} />
          <DeleteTwoTone
            twoToneColor={"red"}
            onClick={() => handleToggleDelete(user)}
          />
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalDeleteOpen(false);
    handleModalEditUser(false);
    handleModalAddUser(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleAddUser = (user: DataType) => {
    getData();
  };
  const handleModalAddUser = (status: boolean) => {
    setIsModalOpen(status);
  };
  const handleModalEditUser = (status: boolean) => {
    setIsModalEditOpen(status);
  };
  const handleToggleDelete = (user: DataType) => {
    setSelectedUser(user);
    setIsModalDeleteOpen(true);
  };
  const handleSelectUser = (user: DataType) => {
    handleModalEditUser(true);
    setSelectedUser(user);
  };

  return (
    <>
      <div className="header-component">
        <h2 className="component-name">User Manager</h2>
      </div>
      <Space className="search">
        <Search
          placeholder="Search..."
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button type="primary" onClick={showModal}>
          Add New User
        </Button>
      </Space>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="spin-loading"
      >
        <Table
          columns={columns}
          dataSource={listUsers}
          pagination={pagination}
        />
      </Spin>

      <Modal
        title="User Infomation"
        className="small-modal"
        destroyOnClose={true}
        open={isModalOpen}
        footer={[]}
        onCancel={handleCancel}
      >
        <FormAdd
          onModalAddUser={handleModalAddUser}
          onAddUser={handleAddUser}
        />
      </Modal>

      <Modal
        title="Edit User Information"
        className="small-modal"
        open={isModalEditOpen}
        destroyOnClose={true}
        footer={[]}
        onCancel={handleCancel}
      >
        <FormEdit
          onModalEditUser={handleModalEditUser}
          data={selectedUser}
          onEditUser={handleEditUser}
        />
      </Modal>

      <Modal
        title="Delete"
        open={isModalDeleteOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Confirm delete this user ??</p>
      </Modal>
    </>
  );
};

export default UsersManager;
