import WorldMap from "./WorldMap";
import Header from "./components/Header";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components";
import Notification from "./components/Notafication";

// import ReactHover, { Trigger, Hover } from 'react-hover'
// import TriggerComponent from './components/TriggerComponent'
// import HoverComponent from './components/HoverComponent'

const GlobalStyleComponent = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* font-weight: 800; */
    font-family: 'Noto Sans TC', sans-serif;
    font-family: 'Oswald', sans-serif;
    
    
    /* display: flex;
    justify-content: center;
    flex-direction: column; */
    /* border:1px solid black */
    /* outline:1px solid black; */
    /* margin: 20px; */
    /* background-color: red; */
  }
  
  /* ::-webkit-scrollbar-track {
	background-color: #F5F5F5;
  }

    ::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
  }

    ::-webkit-scrollbar-thumb {
    background-color: #000000;
  } */
`;
export interface countryListType {
  countryId: string;
  visited: boolean;
}
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
  // console.log(countryList);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // console.log(isLoggedIn);
  const [mapState, setMapState] = useState<number>(0);
  const [isShowingPoint, setIsShowingPoint] = useState<boolean>(false);
  const [toLogIn, setToLogIn] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  const [isShowingPointNotes, setIsShowingPointNotes] = useState<boolean>(false);
  const [friendsList, setFriendsList] = useState<friendListType[]>([]);
  const [friendList, setFriendList] = useState<friendListType[]>([]);
  // console.log(friendList);
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
  // console.log(mapId);
  const [deleteMap, setDeleteMap] = useState<string>("no");
  const [mapNames, setMapNames] = useState<mapNameType[]>([]);
  const [popUpMsg, setPopUpMsg] = useState<any[]>([]);
  // console.log(popUpMsg);
  const [notificationInfo, setNotificationInfo] = useState<notificationInfoType>({ text: "", status: false });
  // console.log(notificationInfo);
  const [currentMapName, setCurrentMapName] = useState<string>("");
  const [originalMapNames, setOriginalMapNames] = useState<mapNameType[]>([
    { id: "visitedCountries", name: "Visited Countries Map" },
    { id: "friendsLocatedCountries", name: "Friends Located Map" },
    { id: "custimizedMapCountries", name: "My Bucket List" },
  ]);
  // console.log(originalMapNames);
  // console.log(pointList);
  // console.log(mapNames);
  // console.log(isShowingPoint);
  // console.log(haveFriendList);
  // console.log(countryId);
  // console.log(friendList);
  // console.log(friendsList);
  function getCountryFriends(id: string) {
    const countryFriendList: friendListType[] = [];
    // console.log(id);

    friendsList.forEach((friend) => {
      // console.log(friend);
      if (friend.countryId === id) {
        countryFriendList.push(friend);
      }
    });
    // console.log(countryFriendList);
    setFriendList(countryFriendList);
    // console.log(friendsList);
  }
  // console.log(toLogIn);

  return (
    <>
      {/* <Reset /> */}
      <GlobalStyleComponent />
      <Header
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
        isShowingFriends={isShowingFriends}
        setIsShowingFriends={setIsShowingFriends}
        setCountryId={setCountryId}
        setCountryName={setCountryName}
        friendsList={friendsList}
        setFriendsList={setFriendsList}
        setHaveFriendList={setHaveFriendList}
        setFriendList={setFriendList}
        setPointList={setPointList}
        setIsShowingPopUp={setIsShowingPopUp}
        isShowingPopUp={isShowingPopUp}
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
        deleteMap={deleteMap}
        setDeleteMap={setDeleteMap}
        pointList={pointList}
        setNotificationInfo={setNotificationInfo}
        setCurrentMapName={setCurrentMapName}
        currentMapName={currentMapName}
      />
      <WorldMap
        isLoggedIn={isLoggedIn}
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
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
        setUserName={setUserName}
        setUserImg={setUserImg}
        mapId={mapId}
        setMapNames={setMapNames}
        mapNames={mapNames}
        setOriginalMapNames={setOriginalMapNames}
        popUpMsg={popUpMsg}
        setPopUpMsg={setPopUpMsg}
        setDeleteMap={setDeleteMap}
        setNotificationInfo={setNotificationInfo}
        setCurrentMapName={setCurrentMapName}
      />
      <Notification setNotificationInfo={setNotificationInfo} notificationInfo={notificationInfo}></Notification>
    </>
  );
}

export default App;
