import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import React, { useState } from "react";
import axios from "axios";
import "./UserManager.css";

import { url } from "../../ultils/urlApi";
import { DataType, HEADER } from "../../constant/constant";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import { post } from "../../ultils/request";
interface FormAddProps {
  onModalAddUser: (status: boolean) => void;
  onAddUser: (addUser: DataType) => void;
}

const FormAdd: React.FC<FormAddProps> = ({ onModalAddUser, onAddUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (value: any) => {
    try {
      setLoading(true);
      const response = await post("/v1/users", value);
      if (response) {
        onAddUser(value);
        handleSuccessShow(response);
        onModalAddUser(false);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const validateConfirmPassword = (rule: any, value: any) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject("Not match with password!");
    }
    return Promise.resolve();
  };

  return (
    <div style={{ padding: 20 }}>
      <Form
        name="validateOnly"
        labelCol={{ flex: "150px" }}
        labelAlign="left"
        preserve={false}
        form={form}
        onFinish={handleSubmit}
        wrapperCol={{ flex: 1 }}
        className="form-info"
      >
        <Form.Item
          label="User Name"
          name="user_name"
          rules={[
            { required: true, message: "Name is required" },
            { whitespace: true },
          ]}
        >
          <Input placeholder="Enter User Name" />
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
          <Input placeholder="Email" />
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
          <Input placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input password!" },
            { whitespace: true, message: "Please input password!" },
            { min: 8, message: "Password has at least 8 letters" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirm_password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please input password!" },
            { whitespace: true, message: "Please input password!" },
            { min: 8, message: "Password has at least 8 numbers" },
            { validator: validateConfirmPassword },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
          hasFeedback
        >
          <Checkbox.Group>
            <Row>
              <Col span={12}>
                <Checkbox value={2} style={{ lineHeight: "32px" }}>
                  User
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value={1} style={{ lineHeight: "32px" }}>
                  Admin
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <div className="footer-modal">
          <Button
            className="btn-modal"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormAdd;
