import { Descriptions } from "antd";
import { formatDate, formatTime } from "../../ultils/ultils";
import { BookingData } from "../../constant/constant";
import React from "react";
import "./Booking.css";
interface InfoInvitationProps {
  data: BookingData | undefined;
}
const customLabelStyle = {
  fontWeight: "bold",
  marginRight: "8px",
  color: "black",
};
const customContentStyle = {
  display: "flex",
  justifyContent: "end",
  marginRight: 50,
};

const InfoInvitation: React.FC<InfoInvitationProps> = ({ data }) => {
  return (
    <Descriptions
      className="detail-booked"
      layout="horizontal"
      column={{ xxl: 3, xl: 3, lg: 2, md: 2 }}
    >
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="ROOM"
      >
        {data!.room_name}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="DATE"
      >
        {formatDate(data!.time_start)}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="CREATOR"
      >
        {data!.creator_name}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="PARTICIPATIONS"
      >
        {data!.user_ids.length}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="TIME START"
      >
        {formatTime(data!.time_start)}
      </Descriptions.Item>
      <Descriptions.Item
        labelStyle={customLabelStyle}
        contentStyle={customContentStyle}
        label="TIME END"
      >
        {formatTime(data!.time_end)}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default InfoInvitation;
