import { Form, Select, DatePicker, Input, Button, FormInstance } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { useEffect, useState } from 'react';
import { formatMonth, formatMonthDayjs } from '../../ultils/ultils';

interface Room {
  room_id: number;
  room_name: string;
  description: string | null;
  is_blocked: boolean;
}

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

interface TypeSubmit {
  onSubmit: (values: any) => void;
  getTime: () => {
    timeStart: moment.Moment | null;
    timeEnd: moment.Moment | null;
  };
  rooms: Room[];
  onCancel: () => void;
  users: DataType[] | null;
  form: FormInstance;
  loading: boolean;
}

const ReusableForm: React.FC<TypeSubmit> = ({
  onSubmit,
  onCancel,
  getTime,
  rooms,
  users,
  form,
  loading,
}) => {
  const { timeStart, timeEnd } = getTime();
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(null);
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    getTime();
    form.resetFields();
  }, [timeStart, timeEnd]);

  const handleTimeStartChange = (value: dayjs.Dayjs | null) => {
    const valueTime = value ? dayjs(value) : null;
    setStartTime(valueTime);
  };

  const handleTimeEndChange = (value: dayjs.Dayjs | null) => {
    const valueTime = value ? dayjs(value) : null;
    setEndTime(valueTime);
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      time_start: startTime
        ? formatMonthDayjs(startTime)
        : formatMonth(timeStart),
      time_end: endTime ? formatMonthDayjs(endTime) : formatMonth(timeEnd),
    };
    onSubmit(formattedValues);
    setStartTime(null);
    setEndTime(null);
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      preserve={false}
      disabled={loading}
      labelCol={{ span: 5 }}
      labelAlign='left'
      initialValues={{
        time_start: startTime
          ? dayjs(startTime)
          : dayjs(timeStart as dayjs.Dayjs),
        time_end: endTime ? dayjs(endTime) : dayjs(timeEnd as dayjs.Dayjs),
      }}
      wrapperCol={{ flex: 4 }}
    >
      <Form.Item
        name='room_id'
        label='Room'
        rules={[{ required: true, message: 'Room is not empty' }]}
      >
        <Select placeholder='Select a room'>
          {rooms.map(room => (
            <Select.Option key={room.room_id} value={room.room_id}>
              {room.room_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='user_ids'
        label='Employees'
        rules={[{ required: true, message: 'Employees is not empty' }]}
      >
        <Select
          mode='multiple'
          placeholder='Select employees'
          optionLabelProp='label'
        >
          {users?.map(user => (
            <Select.Option
              key={user.user_id}
              value={user.user_id}
              label={user.user_name}
            >
              {user.user_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='time_start'
        label='Start Time'
        rules={[{ required: true, message: 'Time start is not empty' }]}
      >
        <DatePicker
          showTime
          format='YYYY-MM-DD HH:mm'
          placeholder='Select start time'
          picker='date'
          allowClear={true}
          value={startTime}
          onChange={handleTimeStartChange}
        />
      </Form.Item>
      <Form.Item
        name='time_end'
        label='End Time'
        rules={[{ required: true, message: 'Time end is not empty' }]}
      >
        <DatePicker
          showTime
          format='YYYY-MM-DD HH:mm'
          placeholder='Select end time'
          picker='date'
          allowClear={true}
          value={endTime}
          onChange={handleTimeEndChange}
        />
      </Form.Item>
      <Form.Item
        name='title'
        label='Title'
        rules={[{ required: true, message: 'Title is not empty' }]}
      >
        <Input type='text' />
      </Form.Item>
      <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button htmlType='button' onClick={handleCancel} className='button'>
          Cancel
        </Button>
        <Button type='primary' htmlType='submit' loading={loading}>
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ReusableForm;
