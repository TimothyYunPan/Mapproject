import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";

const PopUpBlock = styled.div<{ isShowingPopUp: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: ${(props) => (props.isShowingPopUp === true ? 250 : 0)}px;
  width: 500px;
  /* width: ${(props) => (props.isShowingPopUp === true ? 500 : 0)}px; */
  border: ${(props) => (props.isShowingPopUp === true ? 1 : 0)}px solid white;
  opacity: ${(props) => (props.isShowingPopUp === true ? 1 : 0)};
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  /* background-color: ${(props) => (props.isShowingPopUp === true ? "white" : "inherit")}; */
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopUpSet = styled.div`
  display: flex;
  flex-direction: column;
`;

const PopUpText = styled.div`
  font-size: 24px;
  color: #222;
`;

const PopUpBtn = styled.div<{ isShowingPopUp: boolean }>`
  width: 100px;
  /* width: ${(props) => (props.isShowingPopUp === true ? 100 : 0)}px;
  height: ${(props) => (props.isShowingPopUp === true ? "auto" : 0)}px; */
  opacity: ${(props) => (props.isShowingPopUp === true ? 1 : 0)};
  transition: 0.1s;
  cursor: pointer;
  text-align: center;
  margin-top: 60px;
  border: 1px solid #222;
  padding: 5px 10px;
  border-radius: 16px;

  :hover {
    background-color: rgb(240, 243, 244);
    color: #222;
  }
`;

const PopUpBg = styled.div<{ isShowingPopUp: boolean }>`
  position: absolute;
  width: ${(props) => (props.isShowingPopUp === true ? 100 : 0)}%;
  height: ${(props) => (props.isShowingPopUp === true ? 100 : 0)}%;
  background-color: rgba(128, 128, 128, 0.5);
  /* transition: 0.5s; */
`;

const PopupBtnSet = styled.div`
  display: flex;

  justify-content: space-around;
`;

type PopUpType = {
  isShowingPopUp: boolean;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function PopUp({ isShowingPopUp, setIsShowingPopUp, setIsLoggedIn, setLoginStatus, toLogIn, setToLogIn }: PopUpType) {
  return (
    <>
      <PopUpBg isShowingPopUp={isShowingPopUp}></PopUpBg>
      <PopUpBlock isShowingPopUp={isShowingPopUp}>
        <PopUpSet>
          <PopUpText>Sign in to explore your new map</PopUpText>
          <PopupBtnSet>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                setIsShowingPopUp(false);
                setLoginStatus("login");
                setToLogIn(true);
              }}>
              Sign In
            </PopUpBtn>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                setIsShowingPopUp(false);
                setLoginStatus("register");
                setToLogIn(true);
              }}>
              Sign Up
            </PopUpBtn>
          </PopupBtnSet>
        </PopUpSet>
      </PopUpBlock>
    </>
  );
}

export default PopUp;
