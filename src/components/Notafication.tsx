import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { notificationInfoType } from "../App";

const NotificationBox = styled.div<{ notificationInfo: notificationInfoType }>`
  position: absolute;
  /* width: 100%; */
  height: 50px;
  top: 85px;
  right: 26px;
  /* top: 100px;
  right: 40px; */
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
  @media (max-width: 700px) {
    width: ${(props) => (props.notificationInfo.status ? 308 : 0)}px;
    white-space: wrap;
    font-size: 14px;

    /* height: auto; */
    /* overflow: auto; */
  }
`;

// const Box = styled.div`
//   position: fixed;
//   max-width: 500px;
//   top: 100px;
//   right: 40px;
// `;

type NotificationType = {
  notificationInfo: notificationInfoType;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  // isShowingPopUp: boolean;
  // setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  // setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  // setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  // toLogIn: boolean;
  // setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  // isShowingPopUp, setIsShowingPopUp, setIsLoggedIn, setLoginStatus, toLogIn, setToLogIn
};

function Notification({ notificationInfo, setNotificationInfo }: NotificationType) {
  // useEffect(() => {
  //   setTimeout(() => {
  //     setNotificationInfo({ text: "", status: false });
  //   }, 5000);
  // }, []);
  return (
    <>
      <NotificationBox notificationInfo={notificationInfo}>{notificationInfo.text}</NotificationBox>
      {/* <button
        onClick={() => {
          setNotificationInfo({ text: "cjhdvciuekrjbhvuekr", status: true });
        }}>
        jhuk
      </button> */}
    </>
  );
}

export default Notification;
