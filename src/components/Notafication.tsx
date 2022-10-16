import styled from "styled-components";
import { notificationInfoType } from "../App";

const NotificationBox = styled.div<{ notificationInfo: notificationInfoType }>`
  position: absolute;
  height: 50px;
  top: 85px;
  right: 26px;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  padding: ${(props) => (props.notificationInfo.status ? "0 20px" : "0")};
  border-radius: 8px;
  text-align: center;
  padding-top: 14px;
  background-color: rgba(225, 225, 225, 0.5);
  color: white;
  width: ${(props) => (props.notificationInfo.status ? 500 : 0)}px;
  transition: 1s ease;
  z-index: 1100;
  @media (max-width: 700px) {
    width: ${(props) => (props.notificationInfo.status ? 308 : 0)}px;
    white-space: wrap;
    font-size: 14px;
  }
`;

type NotificationType = {
  notificationInfo: notificationInfoType;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
};

function Notification({ notificationInfo }: NotificationType) {
  return (
    <>
      <NotificationBox notificationInfo={notificationInfo}>{notificationInfo.text}</NotificationBox>
    </>
  );
}

export default Notification;
