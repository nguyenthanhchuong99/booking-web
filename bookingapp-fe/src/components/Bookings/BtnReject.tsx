import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React, { useMemo } from "react";
interface BtnProps {
  name: string;
  data: BookingData | undefined;
  handleSelectAction: (selectBooking: BookingData) => void;
  defaultType: boolean;
  disabled: boolean | null;
}

const BtnReject: React.FC<BtnProps> = ({
  name,
  handleSelectAction,
  data,
  defaultType,
  disabled,
}) => {
  const buttonStyle = useMemo(() => {
    return {
      backgroundColor: data?.status !== null && !data?.status ? "red" : "#ece1f6",
      color: data?.status === false ? "white" : "black",
    };
  }, [data?.status]);
  return (
    <Button
      className="btn-action btn__reject"
      disabled={disabled !== false ? false : true }
      style={defaultType ? {} : buttonStyle}
      type="text"
      onClick={() => handleSelectAction(data!)}
    >
      {name}
    </Button>
  );
};

export default BtnReject;
