import { useEffect, useState } from 'react';
import { Typography, Spin, Space, Form } from 'antd';
import moment from 'moment';
import './Booking.css';
import { useSelector } from 'react-redux';
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { handleErrorShow, handleSuccessShow } from '../../ultils/ultilsApi';
import ReusableForm from './ResaubleForm';
import { getCookie } from '../../helper/Cookie';
import {
  formatMonth,
  formatDate,
  timeStartWeek,
  timeEndWeek,
} from '../../ultils/ultils';
import Autocomplete from './SearchRoomBooking';
import FooterBooking from './FooterBooking';
import FormEditBooking from './FormEditBooking';
import ListBooking from './ListBooking';
import {
  BookingDataCalendar,
  BookingDataApi,
  DataType,
  Room,
} from '../../constant/constant';
import ActionBooking from './ActionBooking';
import ModalConfirm from './ModalConfirm';
import { get, post, put, del } from '../../ultils/request';
import { useDispatch } from 'react-redux';
const { Title } = Typography;
const CalendarBooking = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const [users, setUsers] = useState<DataType[]>();
  const [bookingData, setBookingData] = useState<BookingDataCalendar[]>([]);
  const [selectedBookingData, setSelectedBookingData] =
    useState<BookingDataCalendar | null>(null);
  const [modalShow, setModalShow] = useState<Boolean>(false);
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [isDeleted, setIsDeleted] = useState<Boolean>(false);
  const [startDate, setStartDate] = useState<string>(
    moment().startOf('week').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf('week').format('YYYY-MM-DD')
  );
  const [formEdit] = Form.useForm();
  const [formAdd] = Form.useForm();
  const roles: string[] = getCookie('roles');
  const checkAdmin: boolean = roles.includes('admin');
  const [timeStartAdd, setTimeStartAdd] = useState<moment.Moment | null>(null);
  const [timeEndAdd, setTimeEndAdd] = useState<moment.Moment | null>(null);
  const [updateModal, setUpdateModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const shouldRender = useSelector(
    (state: any) => state.shouldRender.shouldRender
  );

  useEffect(() => {
    fetchBookingData(startDate, endDate);
  }, [shouldRender]);

  useEffect(() => {
    fetchBookingData(startDate, endDate);
    fetchRooms();
    fetchUser();
    getTime();
    handleSelectedBookingData();
  }, [startDate, endDate, selectedBookingData, timeEndAdd, timeStartAdd]);

  useEffect(() => {
    setStartDate(timeStartWeek);
    setEndDate(timeEndWeek);
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await get('/v1/rooms', { per_page: -1 });
      if (response?.rooms) {
        setRooms(response.rooms);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await get('/v1/users', { per_page: -1 });
      if (response?.users) {
        setUsers(response.users);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookingData = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      if (
        startDate === moment(startDate).format('YYYY-MM-DD') &&
        endDate === moment(endDate).format('YYYY-MM-DD')
      ) {
        const urlCallApi = roles.includes('admin')
          ? `/v1/bookings`
          : `/v1/user/bookings`;
        const response = await get(urlCallApi, {
          start_date: startDate,
          end_date: endDate,
        });
        const updatedData = response.map((booking: BookingDataApi) => {
          const { time_end, time_start, is_accepted, ...rest } = booking;
          return {
            ...rest,
            is_accepted: is_accepted,
            start: time_start,
            end: time_end,
            backgroundColor: is_accepted ? '#009900' : '#ff9933',
          };
        });
        setBookingData(updatedData);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectedBookingData = () => {
    return selectedBookingData || null;
  };
  const handleEventClick = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;
    const selectedData: BookingDataCalendar = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      backgroundColor: event.backgroundColor,
      is_accepted: event.extendedProps.is_accepted,
      start: moment(event.start).format(),
      end: moment(event.end).format(),
      user_ids: event.extendedProps.user_ids,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_names: event.extendedProps.user_names,
      creator_name: event.extendedProps.creator_name,
      creator_id: event.extendedProps.creator_id,
    };
    setSelectedBookingData(selectedData);
    setModalShow(true);
  };

  const handleCloseShow = () => {
    setSelectedBookingData(null);
    setModalShow(false);
  };
  const eventContent = (eventInfo: EventContentArg) => {
    const { event, view } = eventInfo;
    const content =
      view.type === 'timeGridWeek' ? (
        <div className='time-grid-week'>{event.title}</div>
      ) : (
        <div
          className='time-grid-week'
          style={{ backgroundColor: event.backgroundColor }}
        >
          <Title level={2}>{event.title}</Title>
        </div>
      );

    return content;
  };
  const handleDateSelect = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const startTime = moment(start);
    const endTime = moment(end);
    setTimeStartAdd(startTime);
    setTimeEndAdd(endTime);
    visibleModal('add', true);
  };

  const visibleModal = (action: string, visible: boolean) => {
    switch (action) {
      case 'add':
        setUpdateModal(visible);
        break;
      case 'edit':
        setIsEditing(visible);
        break;
      case 'delete':
        setIsDeleted(visible);
        break;
    }
  };

  const handleAddBooking = async (values: BookingDataApi) => {
    try {
      setLoading(true);
      const urlCallApi: string = roles.includes('admin')
        ? `/v1/bookings`
        : `/v1/user/bookings`;
      const response = await post(urlCallApi, {
        ...values,
        room_id: values.room_id,
        user_ids: values.user_ids,
        title: values.title,
        time_start: values.time_start,
        time_end: values.time_end,
      });
      if (response) {
        visibleModal('add', false);
        fetchBookingData(startDate, endDate);
        handleSuccessShow(response);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    const { start, end } = arg;
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    setStartDate(startDate);
    setEndDate(endDate);

    fetchBookingData(startDate, endDate);
  };

  const handleUpdate = async (values: BookingDataApi) => {
    const formattedBookingData = {
      ...values,
      booking_id: values.booking_id
        ? values.booking_id
        : selectedBookingData?.booking_id,
      user_ids: values.user_ids
        ? values.user_ids
        : selectedBookingData?.user_ids,
      room_id: values.room_id ? values.room_id : selectedBookingData?.room_id,
      time_start: formatMonth(values.time_start),
      time_end: formatMonth(values.time_end),
    };
    try {
      if (
        formattedBookingData.time_start ===
          formatMonth(formattedBookingData.time_start) &&
        formattedBookingData.time_end ===
          formatMonth(formattedBookingData.time_end)
      ) {
        setLoading(true);
        const response = await put(
          `/v1/bookings/${formattedBookingData.booking_id}`,
          { ...formattedBookingData }
        );
        if (response) {
          fetchBookingData(startDate, endDate);
          visibleModal('edit', false);
          handleSuccessShow(response);
          setModalShow(false);
        }
      }
    } catch (error: any) {
      handleErrorShow(error);
      fetchBookingData(startDate, endDate);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    try {
      setLoading(true);
      const response = await del(
        `/v1/bookings/${selectedBookingData?.booking_id}`
      );
      if (response) {
        fetchBookingData(startDate, endDate);
        handleSuccessShow(response);
        visibleModal('delete', false);
        setModalShow(false);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventDrop = (eventInfo: EventClickArg) => {
    const { event } = eventInfo;
    const selectedData: BookingDataApi = {
      title: event.title,
      booking_id: event.extendedProps.booking_id || null,
      is_accepted: event.extendedProps.is_accepted,
      time_start: formatMonth(event.start),
      time_end: formatMonth(event.end),
      user_ids: event.extendedProps.user_ids,
      room_id: event.extendedProps.room_id,
      room_name: event.extendedProps.room_name,
      user_names: event.extendedProps.user_names,
      creator_name: event.extendedProps.creator_name,
      creator_id: event.extendedProps.creator_id,
    };
    handleUpdate(selectedData);
  };
  const handleSearchRoom = async (values: number) => {
    try {
      setLoading(true);
      const response = await get(`/v1/bookings/search_room/${values}`, {
        start_date: startDate,
        end_date: endDate,
      });
      const updatedData = response.map((booking: BookingDataApi) => {
        const { time_end, time_start, is_accepted, ...rest } = booking;
        return {
          ...rest,
          is_accepted: is_accepted,
          start: time_start,
          end: time_end,
          backgroundColor: is_accepted ? '#009900' : '#ff9933',
        };
      });
      setBookingData(updatedData);
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: number) => {
    if (values) {
      handleSearchRoom(values);
    } else {
      fetchBookingData(startDate, endDate);
    }
  };

  const getTime = (): {
    timeStart: moment.Moment | null;
    timeEnd: moment.Moment | null;
  } => {
    return {
      timeStart: timeStartAdd,
      timeEnd: timeEndAdd,
    };
  };
  const handleAction = async (key: string) => {
    try {
      setLoading(true);
      const response = await put(
        `/v1/bookings/${selectedBookingData?.booking_id}/${key}`,
        {}
      );
      fetchBookingData(startDate, endDate);
      handleSuccessShow(response);
      setModalShow(false);
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='search'>
        <Autocomplete options={rooms ?? []} onSelect={handleSearch} />
      </div>

      <div>
        <div className='action'>
          <Spin
            size='large'
            tip='Loading...'
            spinning={loading}
            className='loading'
          />
        </div>
        <div className='full-calendar'>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView='timeGridWeek'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listWeek',
            }}
            events={bookingData}
            eventClick={handleEventClick}
            eventContent={eventContent}
            fixedWeekCount={true}
            showNonCurrentDates={false}
            selectable={true}
            selectMirror={true}
            select={handleDateSelect}
            datesSet={handleDatesSet}
            editable={roles.includes('admin') ? true : false}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
          />
        </div>
      </div>

      <ModalConfirm
        title={selectedBookingData?.title}
        visible={!!modalShow}
        onCancel={handleCloseShow}
        footer={
          checkAdmin ? (
            <div>
              <Space className='space'>
                <ActionBooking
                  is_accepted={selectedBookingData?.is_accepted ?? false}
                  loading={loading}
                  action={handleAction}
                  visible={visibleModal}
                />
              </Space>
            </div>
          ) : null
        }
      >
        {selectedBookingData && (
          <ListBooking selectedBookingData={selectedBookingData} />
        )}
      </ModalConfirm>

      <ModalConfirm
        title='Add Booking'
        visible={!!updateModal}
        onCancel={() => visibleModal('add', false)}
        footer={null}
      >
        <ReusableForm
          onSubmit={handleAddBooking}
          onCancel={() => setUpdateModal(false)}
          loading={loading}
          form={formAdd}
          getTime={getTime}
          rooms={rooms ?? []}
          users={users ?? []}
        />
      </ModalConfirm>

      <ModalConfirm
        title={
          <div className='modal-confirm'>
            <Typography.Title level={2} className='title-modal'>
              Update Booking
            </Typography.Title>
            <div className='modal-container-title'>
              <label className='modal-label'>Title:</label>
              <Space className='modal-value'>
                {selectedBookingData?.title}
              </Space>
            </div>
            <div className='modal-container-title'>
              <label className='modal-label'>Room Name:</label>
              <Space className='modal-value'>
                {selectedBookingData?.room_name}
              </Space>
            </div>
          </div>
        }
        visible={!!isEditing}
        onCancel={() => visibleModal('edit', false)}
        footer={null}
      >
        <FormEditBooking
          users={users ?? []}
          loading={loading}
          onCancel={() => setIsEditing(false)}
          getInitialValues={handleSelectedBookingData}
          form={formEdit}
          onFinish={handleUpdate}
        />
      </ModalConfirm>

      <ModalConfirm
        title='Delete Booking'
        visible={!!isDeleted}
        onCancel={() => visibleModal('delete', false)}
        footer={
          <FooterBooking
            onDelete={handleDeleteBooking}
            onCancel={() => visibleModal('delete', false)}
            id={selectedBookingData?.booking_id!}
          />
        }
      >
        <p>Are you sure you want to delete this booking?</p>
      </ModalConfirm>
    </>
  );
};
export default CalendarBooking;
