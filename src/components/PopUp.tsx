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
  /* opacity: ${(props) => (props.isShowingPopUp === true ? 1 : 0)}; */
  visibility: ${(props) => (props.isShowingPopUp === true ? "visible" : "hidden")};
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  /* background-color: ${(props) => (props.isShowingPopUp === true ? "white" : "inherit")}; */
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopUpSet = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  text-align: center;
`;

const PopUpText = styled.div<{ isShowingPopUp: boolean }>`
  font-size: 24px;
  color: #222;
  opacity: ${(props) => (props.isShowingPopUp === true ? 1 : 0)};
  transition: 0.1s;
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

const PopUpBg = styled.div<{ isShowingPopUp: boolean; toLogIn: boolean }>`
  position: absolute;
  width: ${(props) => (props.isShowingPopUp || props.toLogIn ? 100 : 0)}%;
  height: ${(props) => (props.isShowingPopUp || props.toLogIn ? 100 : 0)}%;
  background-color: rgba(128, 128, 128, 0.5);
  z-index: 900;
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
  popUpMsg: any[];
  setPopUpMsg: React.Dispatch<React.SetStateAction<any[]>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  deleteNote: () => void;
  deleteFriend: (index: number) => void;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

function PopUp({ isShowingPopUp, setIsShowingPopUp, setIsLoggedIn, setLoginStatus, toLogIn, setToLogIn, popUpMsg, setPopUpMsg, setIsShowingPointNotes, deleteNote, deleteFriend, setDeleteMap, setIsEditing }: PopUpType) {
  return (
    <>
      <PopUpBg isShowingPopUp={isShowingPopUp} toLogIn={toLogIn}></PopUpBg>
      <PopUpBlock isShowingPopUp={isShowingPopUp}>
        <PopUpSet>
          <PopUpText isShowingPopUp={isShowingPopUp}>{popUpMsg[0]}</PopUpText>
          <PopupBtnSet>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                if (popUpMsg[4] === "signin") {
                  setLoginStatus("login");
                  setToLogIn(true);
                } else if (popUpMsg[4] === "deletepin") {
                  setIsShowingPointNotes(false);
                  deleteNote();
                } else if (popUpMsg[4] === "deletefriend") {
                  // console.log(popUpMsg);
                  deleteFriend(Number(popUpMsg[3]));
                } else if (popUpMsg[4] === "deletemap") {
                  // setDeleteMap("yes");
                  console.log("hi");
                  console.log(popUpMsg[5]);

                  popUpMsg[5]();
                } else if (popUpMsg[4] === "goback") {
                  setIsEditing(false);
                }

                setIsShowingPopUp(false);
              }}>
              {popUpMsg[1]}
            </PopUpBtn>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                if (popUpMsg[0] === "Sign in to explore your new map") {
                  setLoginStatus("register");
                  setToLogIn(true);
                }
                setIsShowingPopUp(false);
              }}>
              {popUpMsg[2]}
            </PopUpBtn>
          </PopupBtnSet>
        </PopUpSet>
      </PopUpBlock>
    </>
  );
}

export default PopUp;
