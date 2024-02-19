import { Button } from 'antd';
import './Booking.css';
import { BookingData } from '../../constant/constant';
import React, { useMemo } from 'react';
interface BtnProps {
  name: string;
  data: BookingData | undefined;
  handleSelectAction: (data: BookingData) => void;
  defaultType: boolean;
  disabled: boolean | null;
}
const BtnAccept: React.FC<BtnProps> = ({
  name,
  handleSelectAction,
  data,
  defaultType,
  disabled,
}) => {
  const buttonStyle = useMemo(() => {
    return {
      backgroundColor:
        data?.status !== null && data?.status ? 'green' : '#ece1f6',
      color: data?.status ? 'white' : 'black',
    };
  }, [data?.status]);
  return (
    <Button
      type='text'
      disabled={disabled ? true : false}
      style={defaultType ? {} : buttonStyle}
      className='btn-action btn__accept'
      onClick={() => handleSelectAction(data!)}
    >
      {name}
    </Button>
  );
};

export default BtnAccept;
