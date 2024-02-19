import { Form, Select, DatePicker, Input, Button, FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './Booking.css';
import { BookingDataCalendar, BookingDataApi } from '../../constant/constant';
import { formatMonthDayjs } from '../../ultils/ultils';

interface FormEditBooking {
  onFinish: (values: BookingDataApi) => void;
  getInitialValues: () => BookingDataCalendar | null;
  onCancel: () => void;
  users: DataType[] | null;
  loading: boolean;
  form: FormInstance;
}

interface DataType {
  user_id: number;
  role_id: number[];
  user_name: string;
  role_name: string[];
  phone_number: string;
  email: string;
}

const FormEditBooking: React.FC<FormEditBooking> = ({
  onFinish,
  onCancel,
  getInitialValues,
  loading,
  users,
  form,
}) => {
  const initialValues: BookingDataCalendar | null = getInitialValues();
  const [timeStart, setTimeStart] = useState<dayjs.Dayjs | null>(null);
  const [timeEnd, setTimeEnd] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    getInitialValues();
    form.resetFields();
    setTimeStart(initialValues?.start ? dayjs(initialValues.start) : null);
    setTimeEnd(initialValues?.end ? dayjs(initialValues.end) : null);
  }, [getInitialValues]);

  const handleCancel = () => {
    onCancel();
    setTimeStart(null);
    setTimeEnd(null);
  };

  const handleFinish = (values: any) => {
    const updatedValues = {
      ...values,
      time_start: timeStart ? formatMonthDayjs(timeStart) : null,
      time_end: timeEnd ? formatMonthDayjs(timeEnd) : null,
    };
    onFinish(updatedValues);
    setTimeStart(null);
    setTimeEnd(null);
  };

  const handleTimeStartChange = (value: dayjs.Dayjs | null) => {
    const valueTime = value ? dayjs(value) : null;
    setTimeStart(valueTime);
  };

  const handleTimeEndChange = (value: dayjs.Dayjs | null) => {
    const valueTime = value ? dayjs(value) : null;
    setTimeEnd(valueTime);
  };

  return (
    <>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={{
          user_ids: initialValues?.user_ids,
          user_names: initialValues?.user_names,
          time_start: timeStart
            ? dayjs(timeStart)
            : dayjs(initialValues?.start as unknown as dayjs.Dayjs),
          time_end: timeEnd
            ? dayjs(timeEnd)
            : dayjs(initialValues?.end as unknown as dayjs.Dayjs),
          room_id: initialValues?.room_id,
          title: initialValues?.title,
        }}
        preserve={false}
        disabled={loading}
        labelCol={{ span: 5 }}
        labelAlign='left'
        wrapperCol={{ flex: 4 }}
      >
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
          rules={[
            {
              required: true,
              message: 'Time start is not required',
            },
          ]}
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            allowClear={true}
            picker='date'
            placeholder='Select start time'
            value={timeStart}
            onChange={handleTimeStartChange}
          />
        </Form.Item>
        <Form.Item
          name='time_end'
          label='End Time'
          rules={[
            {
              required: true,
              message: 'Time end is not required',
            },
          ]}
        >
          <DatePicker
            showTime
            format='YYYY-MM-DD HH:mm'
            allowClear={true}
            picker='date'
            placeholder='Select end time'
            value={timeEnd}
            onChange={handleTimeEndChange}
          />
        </Form.Item>
        <Form.Item
          name='title'
          label='Title'
          rules={[
            {
              required: true,
              message: 'Title is not required',
            },
          ]}
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item className='modal-container-item'>
          <Button
            htmlType='button'
            onClick={handleCancel}
            className='btn-right'
          >
            Cancel
          </Button>
          <Button type='primary' htmlType='submit' loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormEditBooking;
