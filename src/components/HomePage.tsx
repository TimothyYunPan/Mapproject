import React from "react";
import styled from "styled-components";
import PopUp from "./PopUp";

import wallPaper1 from "./wallpaper1.png";
import wallPaper2 from "./wallpaper2.png";
import wallPaper3 from "./wallpaper3.png";
const HomePageCom = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
`;
const HomePageContainer = styled.div`
  width: 33.333%;
  height: 100%;
`;

const WallPaperSet = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;
const WallPaper = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${wallPaper1});
  :hover {
    transform: scale(1.02, 1.02);
  }
`;
const WallPaper2 = styled(WallPaper)`
  background-image: url(${wallPaper2});
`;
const WallPaper3 = styled(WallPaper)`
  background-image: url(${wallPaper3});
`;

const SelectMapText = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 40px;
  cursor: pointer;
  text-align: center;
  @media (max-width: 996px) {
    font-size: 32px;
  }
  @media (max-width: 770px) {
    font-size: 24px;
  }
`;

const MapTitle = styled.div`
  height: 100px;
  position: absolute;
  left: 270px;
  top: 115px;
  font-size: 32px;
  text-align: center;
  transform: translate(-50%, -50%);
  color: white;
  cursor: default;
  z-index: 1000;
  transition: 0.5s;
  @media (max-width: 1250px) {
    left: 240px;
  }
  @media (max-width: 1020px) {
    left: 160px;
    top: 86px;
    font-size: 24px;
  }
`;
type homePageType = {
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingPopUp: boolean;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  popUpMsg: (string | { (): void })[];
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void })[]>>;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFriend: (index: number) => void;
  deleteNote: () => void;
};

function HomePage({ deleteFriend, deleteNote, setIsEditing, setMapState, setIsShowingPoint, toLogIn, setToLogIn, uid, setIsLoggedIn, setIsShowingPointNotes, isShowingPopUp, setIsShowingPopUp, setLoginStatus, popUpMsg, setPopUpMsg, setDeleteMap, setCurrentMapName, setIsChangingMap, setPointIndex }: homePageType) {
  return (
    <HomePageCom>
      <MapTitle>ᴍᴀᴘʜᴜʙ</MapTitle>
      <HomePageContainer>
        <WallPaperSet>
          <WallPaper
            onClick={() => {
              setMapState(1);
              setIsShowingPoint(false);
              setCurrentMapName("Visited Countries Map");
            }}></WallPaper>
          <SelectMapText
            onClick={() => {
              setMapState(1);
              setCurrentMapName("Visited Countries Map");
            }}>
            ᴠɪsɪᴛᴇᴅ ᴍᴀᴘ
          </SelectMapText>
        </WallPaperSet>
      </HomePageContainer>
      <HomePageContainer>
        <WallPaperSet>
          <WallPaper2
            onClick={(e) => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋", "Sign In", "Sign Up", "", "signin"]);
              } else {
                setMapState(2);
                setIsShowingPoint(false);
                setCurrentMapName("Friends Located Map");
              }
            }}></WallPaper2>
          <SelectMapText
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋", "Sign In", "Sign Up", "", "signin"]);
              } else {
                setMapState(2);
                setIsShowingPoint(false);
                setCurrentMapName("Friends Located Map");
              }
            }}>
            ғʀɪᴇɴᴅ ᴍᴀᴘ
          </SelectMapText>
        </WallPaperSet>
      </HomePageContainer>
      <HomePageContainer>
        <WallPaperSet>
          <WallPaper3
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                setMapState(3);
                setIsShowingPoint(true);
                setCurrentMapName("My Bucket List");
              }
            }}></WallPaper3>
          <SelectMapText
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                setMapState(3);
                setIsShowingPoint(true);
                setCurrentMapName("My Bucket List");
              }
            }}>
            ᴍʏ ᴍᴀᴘs
          </SelectMapText>
        </WallPaperSet>
      </HomePageContainer>
      <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
    </HomePageCom>
  );
}

export default HomePage;
