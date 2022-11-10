import WorldMap from "./WorldMap";
import Header from "./components/header/Header";
import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import Notification from "./components/Notafication";
import "typeface-quicksand";

const GlobalStyleComponent = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Oswald', sans-serif, 'Noto Sans TC', sans-serif;
    ::-webkit-scrollbar {
    display: none;
    }
  }
`;
export type countryListType = {
  countryId: string;
  visited: boolean;
};
export type friendListType = {
  countryId: string;
  name: string;
  city: string;
  country: string;
  insta: string;
  imgUrl: string;
  notes: string;
  key: string;
};
export type haveFriendListType = {
  countryId: string;
  haveFriend: number;
};
export type pointListType = {
  title?: string;
  countryId: string;
  y: number;
  x: number;
  imgUrl: string;
  notes: string;
};
export type mapNameType = {
  name: string;
  id: string;
};

export type notificationInfoType = {
  text: string;
  status: boolean;
};

function App() {
  const [countryList, setCountryList] = useState<countryListType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mapState, setMapState] = useState<number>(0);
  const [isShowingPoint, setIsShowingPoint] = useState<boolean>(false);
  const [toLogIn, setToLogIn] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [isShowingPointNotes, setIsShowingPointNotes] = useState<boolean>(false);
  const [friendsList, setFriendsList] = useState<friendListType[]>([]);
  const [friendList, setFriendList] = useState<friendListType[]>([]);
  const [isShowingFriends, setIsShowingFriends] = useState<boolean>(false);
  const [countryId, setCountryId] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [haveFriendList, setHaveFriendList] = useState<haveFriendListType[]>([]);
  const [pointList, setPointList] = useState<pointListType[]>([]);
  const [isShowingPopUp, setIsShowingPopUp] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState("login");
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImg] = useState<string>("");
  const [mapId, setMapId] = useState<string>("custimizedMap");
  const [deleteMap, setDeleteMap] = useState<string>("no");
  const [mapNames, setMapNames] = useState<mapNameType[]>([]);
  const [popUpMsg, setPopUpMsg] = useState<(string | { (): void } | { (index: number): void })[]>([]);
  const [isChangingMap, setIsChangingMap] = useState<boolean>(false);
  const [notificationInfo, setNotificationInfo] = useState<notificationInfoType>({ text: "", status: false });
  const [currentMapName, setCurrentMapName] = useState<string>("");
  const [pointIndex, setPointIndex] = useState<number>(-1);
  const [originalMapNames, setOriginalMapNames] = useState<mapNameType[]>([
    { id: "visitedCountries", name: "Visited Countries Map" },
    { id: "friendsLocatedCountries", name: "Friends Located Map" },
    { id: "custimizedMapCountries", name: "My Bucket List" },
  ]);

  function getCountryFriends(id: string) {
    const countryFriendList: friendListType[] = [];

    friendsList.forEach((friend) => {
      if (friend.countryId === id) {
        countryFriendList.push(friend);
      }
    });
    setFriendList(countryFriendList);
  }
  return (
    <>
      <GlobalStyleComponent />
      <Header
        setPointIndex={setPointIndex}
        toLogIn={toLogIn}
        setToLogIn={setToLogIn}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        countryList={countryList}
        setCountryList={setCountryList}
        uid={uid}
        setUid={setUid}
        mapState={mapState}
        setMapState={setMapState}
        isShowingPoint={isShowingPoint}
        setIsShowingPoint={setIsShowingPoint}
        setIsShowingPointNotes={setIsShowingPointNotes}
        getCountryFriends={getCountryFriends}
        setIsShowingFriends={setIsShowingFriends}
        setCountryId={setCountryId}
        setCountryName={setCountryName}
        friendsList={friendsList}
        setFriendsList={setFriendsList}
        setHaveFriendList={setHaveFriendList}
        setFriendList={setFriendList}
        setPointList={setPointList}
        setIsShowingPopUp={setIsShowingPopUp}
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
        userName={userName}
        setUserName={setUserName}
        userImage={userImage}
        mapId={mapId}
        setMapId={setMapId}
        mapNames={mapNames}
        setMapNames={setMapNames}
        originalMapNames={originalMapNames}
        setOriginalMapNames={setOriginalMapNames}
        setPopUpMsg={setPopUpMsg}
        setDeleteMap={setDeleteMap}
        setNotificationInfo={setNotificationInfo}
        setCurrentMapName={setCurrentMapName}
        currentMapName={currentMapName}
        isChangingMap={isChangingMap}
        setIsChangingMap={setIsChangingMap}
        setUserImg={setUserImg}
      />
      <WorldMap
        setIsLoggedIn={setIsLoggedIn}
        countryList={countryList}
        setCountryList={setCountryList}
        uid={uid}
        setUid={setUid}
        toLogIn={toLogIn}
        setToLogIn={setToLogIn}
        mapState={mapState}
        setMapState={setMapState}
        isShowingPoint={isShowingPoint}
        setIsShowingPoint={setIsShowingPoint}
        isShowingPointNotes={isShowingPointNotes}
        setIsShowingPointNotes={setIsShowingPointNotes}
        getCountryFriends={getCountryFriends}
        friendsList={friendsList}
        setFriendsList={setFriendsList}
        friendList={friendList}
        setFriendList={setFriendList}
        isShowingFriends={isShowingFriends}
        setIsShowingFriends={setIsShowingFriends}
        countryId={countryId}
        setCountryId={setCountryId}
        countryName={countryName}
        setCountryName={setCountryName}
        haveFriendList={haveFriendList}
        setHaveFriendList={setHaveFriendList}
        pointList={pointList}
        setPointList={setPointList}
        isShowingPopUp={isShowingPopUp}
        setIsShowingPopUp={setIsShowingPopUp}
        setLoginStatus={setLoginStatus}
        setUserName={setUserName}
        setUserImg={setUserImg}
        mapId={mapId}
        setMapNames={setMapNames}
        popUpMsg={popUpMsg}
        setPopUpMsg={setPopUpMsg}
        setDeleteMap={setDeleteMap}
        setNotificationInfo={setNotificationInfo}
        setCurrentMapName={setCurrentMapName}
        setIsChangingMap={setIsChangingMap}
        pointIndex={pointIndex}
        setPointIndex={setPointIndex}
      />
      <Notification setNotificationInfo={setNotificationInfo} notificationInfo={notificationInfo} />
    </>
  );
}

export default App;
