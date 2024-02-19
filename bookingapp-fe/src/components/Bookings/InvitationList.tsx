import { Card, Col, List, Modal, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  BookingData,
  ChangePageSize,
  DataType,
  HEADER,
} from "../../constant/constant";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import DetailInvitation from "./DetailInvitation";
import InfoInvitation from "./InfoInvitation";
import { getCookie } from "../../helper/Cookie";
import "./Booking.css";
import BtnReject from "./BtnReject";
import ConfirmAction from "./ConfirmAction";
import BtnAccept from "./BtnAccept";
import BtnDetail from "./BtnDetail";
import { get, put } from "../../ultils/request";
import { useSelector } from "react-redux";

const InvitationList = () => {
  const [listInvitation, setListInvitation] = useState<BookingData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectInvite, setSelectInvite] = useState<BookingData>();
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false);
  const [isModalAction, setIsModalAction] = useState<boolean>(false);
  const shouldRender = useSelector(
    (state: any) => state.shouldRender.shouldRender
  );

  useEffect(() => {
    getDataInvitation();
  }, [shouldRender]);
  useEffect(() => {
    getDataInvitation();
  }, [currentPage, perPage]);
  const formatData = (data: any) => {
    const userId = parseInt(getCookie("id"), 10);
    const updatedData = data.map((item: BookingData) => {
      const user = item.booking_users.find(
        (user: DataType) => user.user_id === userId
      ) as unknown as DataType;
      return { ...item, status: user ? user.is_attending : null };
    });
    setListInvitation(updatedData);
  };
  const getDataInvitation = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await get(`/v1/user/view_list_invite`, {
        page: currentPage,
        per_page: perPage,
      });
      if (response) {
        formatData(response.list_bookings);
        setTotalItems(response.total_items);
        setPerPage(response.per_page);
      }
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (key: string, item: BookingData) => {
    if (item) {
      try {
        setLoading(true);
        const response = await put(
          `/v1/user/bookings/${item.booking_id}/${key}`,
          {}
        );
        if (response) {
          handleSuccessShow(response);
          getDataInvitation();
        }
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: ChangePageSize,
  };
  const handelModalViewDetail = (status: boolean) => {
    setIsModalDetail(status);
  };
  const handleModalAction = (status: boolean) => {
    setIsModalAction(status);
  };
  const handleShowModalAction = (booking: BookingData, key: string) => {
    setSelectInvite(booking);
    if (key === "view") {
      handelModalViewDetail(true);
    } else {
      handleModalAction(true);
      const message: string = `Are you sure to ${key} this booking?`;
      ConfirmAction(key, isModalAction, message, handleAction, booking);
    }
  };
  return (
    <>
      <div className="header-component">
        <h2 className="component-name">List of invitations</h2>
      </div>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="spin-loading"
      >
        <List
          dataSource={listInvitation}
          pagination={pagination}
          renderItem={(item: BookingData) => (
            <List.Item>
              <Card
                className="item-booked"
                key={item.title}
                title={<div className="item-booked-title">{item.title}</div>}
              >
                <div className="item-booked-info">
                  <InfoInvitation data={item} />
                  <Row className="container-btn">
                    <Col xxl={8} xl={8} sm={13}>
                      <BtnDetail
                        selectBooking={item}
                        handleSelectAction={async () =>
                          handleShowModalAction(item, "view")
                        }
                      />
                    </Col>
                    <Col xxl={8} xl={8} sm={13}>
                      <BtnAccept
                        name="CONFIRM"
                        data={item}
                        handleSelectAction={async () =>
                          handleShowModalAction(item, "confirm")
                        }
                        defaultType={false}
                        disabled={item.status}
                      />
                    </Col>
                    <Col xxl={8} xl={8} sm={13}>
                      <BtnReject
                        name="DECLINE"
                        data={item}
                        handleSelectAction={async () =>
                          handleShowModalAction(item, "decline")
                        }
                        defaultType={false}
                        disabled={item.status}
                      />
                    </Col>
                  </Row>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Spin>

      <Modal
        open={isModalDetail}
        onCancel={() => handelModalViewDetail(false)}
        width={"80%"}
        footer={[]}
      >
        <DetailInvitation selectInvite={selectInvite} />
      </Modal>
    </>
  );
};

export default InvitationList;
