import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { DataType, HEADER, roles } from "../../constant/constant";
import { url } from "../../ultils/urlApi";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import "./UserManager.css";
import { put } from "../../ultils/request";
interface FormEditProps {
  onModalEditUser: (status: boolean) => void;
  data: DataType | undefined;
  onEditUser: (editUser: DataType) => void;
}
const FormEdit: React.FC<FormEditProps> = ({
  onModalEditUser,
  data,
  onEditUser,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handleUpdate = async (value: any) => {
    if (data) {
      try {
        setLoading(true);
        const urlUpdate = roles.includes("admin")
          ? `/v1/users/${data.user_id}`
          : `/v1/users/profile`;
        const response = await put(`${urlUpdate}`, value);
        if (response) {
          onEditUser(value);
          handleSuccessShow(response);
          onModalEditUser(false);
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <div style={{ padding: 20 }}>
        <Form
          name="validateOnly"
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          form={form}
          wrapperCol={{ flex: 1 }}
          preserve={false}
          colon={false}
          initialValues={data}
          onFinish={handleUpdate}
          className="form-info"
        >
          <Form.Item
            label="User Name"
            name="user_name"
            rules={[
              { required: true, message: "Please input user name!" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Invalid email format" },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: "Please input phone-number!" },
              {
                min: 10,
                message: "Phone number has at least 10 numbers",
              },
              {
                max: 10,
                message: "Phone number has at most 10 numbers",
              },
              { whitespace: true },
              {
                pattern: /^\d+$/,
                message: "Please input number!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          {roles.includes("admin") ? (
            <Form.Item
              name="role_id"
              label="Role"
              rules={[{ required: true, message: "Please select role!" }]}
              hasFeedback
            >
              <Checkbox.Group>
                <Row>
                  <Col span={12}>
                    <Checkbox value={1} style={{ lineHeight: "32px" }}>
                      Admin
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value={2} style={{ lineHeight: "32px" }}>
                      User
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          ) : null}
          <div className="footer-modal">
            <Button
              className="btn-modal"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default FormEdit;
