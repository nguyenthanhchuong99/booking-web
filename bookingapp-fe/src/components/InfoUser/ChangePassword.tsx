import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { url } from "../../ultils/urlApi";
import { HEADER } from "../../constant/constant";
import "./ChangePass.css";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import { put } from "../../ultils/request";

interface ChangePasswordProps {
  onChange: (status: boolean) => void;
}
const ChangePassword: React.FC<ChangePasswordProps> = ({ onChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const handleChangepassword = async (value: any) => {
    try {
      setLoading(true);
      const response = await put("/v1/users/change_password", value);
      if (response) {
        handleSuccessShow(response);
        onChange(false);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-change">
        <Form
          name="validateOnly"
          labelCol={{ flex: "200px" }}
          labelAlign="left"
          form={form}
          wrapperCol={{ flex: 1 }}
          preserve={false}
          colon={false}
          onFinish={handleChangepassword}
        >
          <Form.Item
            label="Enter old password"
            name="current_password"
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Current Password" />
          </Form.Item>
          <Form.Item
            label="Enter new password"
            name="new_password"
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="New Password" />
          </Form.Item>
          <Form.Item
            label="Repeat new password"
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please input password!" },
              { whitespace: true, message: "Please input password!" },
              { min: 8, message: "Password has at least 8 numbers" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Not match with new password!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Repeat new Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
