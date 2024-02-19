import { Row, Col, Form, Input, FormRule } from 'antd';

interface CustomFormItem {
  name: string;
  label: string;
  rules: FormRule[];
}

const CustomFormItem: React.FC<CustomFormItem> = ({ name, label, rules }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form.Item name={name} label={label} rules={rules}>
          <Input type='text' className='form-item-input' />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default CustomFormItem;
