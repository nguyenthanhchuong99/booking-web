import { Button } from "antd";
import "./Booking.css";
import React from "react";
import { BookingData } from "../../constant/constant";
interface BtnProps {
  selectBooking: BookingData | undefined;
  handleSelectAction: (selectBooking: BookingData) => void;
}
const BtnDetail: React.FC<BtnProps> = ({
  handleSelectAction,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn__view"
      type="text"
      onClick={() => handleSelectAction(selectBooking!)}
    >
      VIEW DETAIL
    </Button>
  );
};

export default BtnDetail;
