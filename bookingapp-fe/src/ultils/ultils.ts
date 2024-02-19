import dayjs from 'dayjs';
import moment from 'moment';
export const formatTime = (time: moment.MomentInput) => {
  return moment(time).format('HH:mm');
};
export const formatDate = (time: moment.MomentInput) => {
  return moment(time).format('DD/MM/YYYY');
};

export const timeStartWeek = () => {
  return moment().startOf('week').format('YYYY-MM-DD');
};

export const timeEndWeek = () => {
  return moment().endOf('week').format('YYYY-MM-DD');
};
export const formatMonth = (time: moment.MomentInput) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};

export const formatMonthDayjs = (time: dayjs.Dayjs) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};
