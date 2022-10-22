import React, { useEffect, useState, useRef, MouseEvent } from "react";
import styled from "styled-components";
import countries from "./utils/countries";
import { doc, setDoc, collection, getDoc, getDocs, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import app from "./utils/firebaseConfig";
import { db } from "./utils/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CountryCheckList from "./components/CountryCheckList";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "./App";
import noIcon from "./components/icon/noIcon.png";
import PopUp from "./components/PopUp";
import HomePage from "./components/HomePage";
import VisitedMap from "./components/VisitedMap";
import FriendsMap from "./components/FriendsMap";
import CustomizedMap from "./components/CustomizedMap";
const storage = getStorage(app);

const Wrapper = styled.div<{ mapState: number }>`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(42, 61, 78);
  overflow-y: scroll;
`;

export const Map = styled.div`
  position: relative;
  margin-top: 80px;
  margin: 80px auto 0 auto;
`;

export const ShowName = styled.div<{
  currentPos: mousePosType;
}>`
  /* width: 50px; */
  /* height: 50px; */
  font-size: 16px;
  position: absolute;
  cursor: pointer;

  top: ${(props) => props.currentPos.y as number}px;
  left: ${(props) => ((props.currentPos.x as number) + 50) as number}px;
  /* top:0; */
  /* left:0 */
  transform: translate(-50%, -150%);
  color: white;
`;

const NumberCount = styled.div`
  width: 400px;
  height: 20px;
  position: absolute;
  right: 5%;
  bottom: 25px;
  color: white;
  cursor: default;
  text-align: right;

  @media (max-width: 1279px) {
    left: 5%;
    text-align: left;
    width: auto;
  }
  @media (max-width: 450px) {
    font-size: 14px;
  }
`;

export const Flag = styled.img`
  position: absolute;
  bottom: -50px;
  left: 10px;
  height: 40px;
  width: 40px;
  object-fit: contain;
  max-width: 100%;
`;
export const IconBtnStyle = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 15px;
  background-size: cover;
  position: absolute;
  cursor: pointer;
`;

export const CloseBtn = styled(IconBtnStyle)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-image: url(${noIcon});
`;

export const LittleCloseBtn = styled(CloseBtn)`
  top: 14px;
  right: 14px;
  width: 15px;
  height: 15px;
`;

export type mousePosType = {
  x?: number | null | undefined;
  y?: number | null | undefined;
};

type WorldMapType = {
  mapState: number;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  isShowingPoint: boolean;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingPointNotes: boolean;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  getCountryFriends: (id: string) => void;
  friendList: friendListType[];
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  friendsList: friendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  isShowingFriends: boolean;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  countryId: string;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  countryName: string;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  haveFriendList: haveFriendListType[];
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  pointList: pointListType[];
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  isShowingPopUp: boolean;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  loginStatus: string;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  setUserImg: React.Dispatch<React.SetStateAction<string>>;
  mapId: string;
  mapNames: mapNameType[];
  setMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  setOriginalMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  popUpMsg: (string | { (): void })[];
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void })[]>>;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  pointIndex: number;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function WorldMap({ mapState, setMapState, isShowingPoint, setIsShowingPoint, toLogIn, setToLogIn, uid, setUid, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, isShowingPointNotes, getCountryFriends, friendList, setFriendList, friendsList, setFriendsList, isShowingFriends, setIsShowingFriends, countryId, setCountryId, countryName, setCountryName, haveFriendList, setHaveFriendList, pointList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, setUserName, setUserImg, mapId, setMapNames, mapNames, setOriginalMapNames, popUpMsg, setPopUpMsg, setDeleteMap, setNotificationInfo, setCurrentMapName, setIsChangingMap, pointIndex, setPointIndex }: WorldMapType) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const imageListRef = ref(storage, "images/");
  const [pointPhoto, setPointPhoto] = useState<File | null>(null);
  const [notePhoto, setNotePhoto] = useState<string>("");
  const previewImgUrl = pointPhoto ? URL.createObjectURL(pointPhoto) : notePhoto;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const mouseRef = useRef<SVGSVGElement>(null);
  const [currentPos, setCurrentPos] = useState<mousePosType>({ x: null, y: null });
  const [isColorHovering, setIsColorHovering] = useState<boolean>(true);
  const [X, setX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);
  const [allCountries, setAllCountries] = useState<string[]>([]);

  function getAllCountries() {
    let All: string[] = [];
    countries.forEach((country) => {
      All.push(country.code);
    });
    setAllCountries(All);
  }

  const singlePointList: pointListType[] = [];
  pointList.forEach((pointInfo) => {
    if (pointInfo.countryId === countryId) {
      singlePointList.push(pointInfo);
    }
  });

  function getPosition(e: MouseEvent) {
    let rect = mouseRef.current!.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    setCurrentPos({ x: x, y: y });
  }

  useEffect(() => {
    setMapState(-1);
  }, []);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        getUserData(user.uid);
        setIsLoggedIn(true);
        getAllCountries();
        // ...
      } else {
        getAllCountries();
      }
    });
    listAll(imageListRef).then((response) => {
      const urlArr: string[] = [];
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          urlArr.push(url);
          setImageList(urlArr);
        });
      });
    });
  }, [mapId]);

  function getUserData(userUid: string) {
    getUserMap1Data(userUid);
    getUserMap2Data(userUid);
    getUserMap3Data(userUid, mapId);
    getUserName(userUid);
    getMapName(userUid);
  }

  async function getMapName(userUid: string) {
    const docRef = doc(db, "user", userUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMapNames(docSnap.data().names);
      // setOriginalMapNames(docSnap.data().originalMap);
    } else {
      // console.log("No such document!");
    }
  }

  async function writeUserMap1Data(country: string) {
    await setDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: true,
    });
  }

  async function deleteFriend(index: number) {
    let newFriendsList = friendsList.filter((friend) => {
      return friend.key !== friendList[index].key;
    });
    setFriendsList(newFriendsList);
    let newFriendList = friendList.filter((friend, i) => {
      return i !== index;
    });
    setFriendList(newFriendList);
    let newHaveFriendNum = friendList.length - 1;

    let newHaveFriendList = haveFriendList.map((obj) => {
      if (obj.countryId === countryId) {
        obj.haveFriend = obj.haveFriend - 1;
      }
      return obj;
    });

    let newNewHaveFriendList = [];
    newNewHaveFriendList = newHaveFriendList.filter((obj) => {
      return obj.haveFriend !== 0;
    });
    setHaveFriendList(newNewHaveFriendList);
    if (newFriendList.length) {
      await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
    } else {
      await deleteDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId));
    }
    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), {
      friends: arrayRemove(friendList[index]),
      haveFriend: friendList.length - 1,
    });
    setNotificationInfo({ text: "This friend has been successfully removed 😈 ", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }

  async function getUserName(userUid: string) {
    const docRef = doc(db, "user", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserImg(docSnap.data().imgUrl);
      setUserName(docSnap.data().userName);
    } else {
      console.log("No such document!");
    }
  }

  async function getUserMap1Data(userUid: string) {
    const q = collection(db, "user", userUid, "visitedCountries");
    const querySnapshot = await getDocs(q);
    let newCountryList: countryListType[] = [];
    querySnapshot.forEach((country) => {
      let t = { countryId: country.id, visited: country.data().visited };
      newCountryList.push(t);
      setCountryList(newCountryList);
    });
  }
  async function getUserMap2Data(userUid: string) {
    const q = collection(db, "user", userUid, "friendsLocatedCountries");
    const querySnapshot = await getDocs(q);
    let newHaveFriendList: haveFriendListType[] = [];
    let newFriendsList: friendListType[] = [];
    querySnapshot.forEach((country) => {
      let newHaveFriendObj = {
        countryId: country.id,
        haveFriend: country.data().haveFriend,
      };
      newHaveFriendList.push(newHaveFriendObj);
      setHaveFriendList(newHaveFriendList);
      country.data().friends.forEach((friend: friendListType) => {
        let newFriendObj = {
          countryId: country.id,
          name: friend.name,
          // country: "",
          city: friend.city,
          country: friend.country,
          insta: friend.insta,
          imgUrl: friend.imgUrl,
          notes: friend.notes,
          key: friend.key,
        };
        newFriendsList.push(newFriendObj);
      });
      setFriendsList(newFriendsList);
    });
  }
  async function getUserMap3Data(userUid: string, mapId: string) {
    const q = collection(db, "user", userUid, mapId);
    const querySnapshot = await getDocs(q);
    let newPointList: pointListType[] = [];
    setPointList([]);
    querySnapshot.forEach((country) => {
      country.data().List.forEach((point: pointListType) => {
        let newPointObj = {
          title: point.title,
          countryId: country.id,
          imgUrl: point.imgUrl,
          notes: point.notes,
          x: point.x,
          y: point.y,
        };
        newPointList.push(newPointObj);
      });
      setPointList(newPointList);
    });
  }

  function hoverAddCountryName(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as HTMLInputElement;
    const result = countries.filter(function (obj) {
      return obj.code == target.id;
    });
    // setMousePlace(currentPos);
    if (result.length > 0) {
      setCountryName(result[0].name);
    }
  }

  async function deleteNote() {
    let newPointList = pointList.filter((obj) => {
      return obj.x !== X && obj.y !== Y;
    });
    setPointList(newPointList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), {
      List: arrayRemove(singlePointList[0]),
    });

    setNotificationInfo({ text: "Your pin has been successfully deleted", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }

  return (
    <>
      <Wrapper mapState={mapState}>
        {mapState && mapState === -1 ? (
          <HomePage deleteFriend={deleteFriend} deleteNote={deleteNote} setIsEditing={setIsEditing} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} toLogIn={toLogIn} setToLogIn={setToLogIn} uid={uid} setIsLoggedIn={setIsLoggedIn} setIsShowingPointNotes={setIsShowingPointNotes} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp} setLoginStatus={setLoginStatus} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} setDeleteMap={setDeleteMap} setCurrentMapName={setCurrentMapName} setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex}></HomePage>
        ) : mapState === 1 ? (
          <>
            {/* prettier-ignore */}
            <VisitedMap
              uid={uid} ref={mouseRef} allCountries={allCountries} setIsHovering={setIsHovering} hoverAddCountryName={hoverAddCountryName} previewImgUrl={previewImgUrl} setPointPhoto={setPointPhoto} isColorHovering={isColorHovering} currentPos={currentPos} setNotePhoto={setNotePhoto} getPosition={getPosition} isHovering={isHovering} setIsColorHovering={setIsColorHovering} mapState={mapState} isShowingPoint={isShowingPoint} countryList={countryList} setCountryList={setCountryList} setIsShowingPointNotes={setIsShowingPointNotes} isShowingPointNotes={isShowingPointNotes} countryId={countryId} setCountryId={setCountryId} countryName={countryName} haveFriendList={haveFriendList} pointList={pointList} setIsShowingPopUp={setIsShowingPopUp} setIsChangingMap={setIsChangingMap} pointIndex={pointIndex} setPointIndex={setPointIndex} writeUserMap1Data={writeUserMap1Data}></VisitedMap>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
            <NumberCount>
              You have visited {countryList.length} {countryList && countryList.length <= 1 ? "country" : "countries"} / area
            </NumberCount>
            <CountryCheckList uid={uid} writeUserMap1Data={writeUserMap1Data} setCountryList={setCountryList} countryList={countryList}></CountryCheckList>
          </>
        ) : mapState === 2 ? (
          <>
            {/* prettier-ignore */}
            <FriendsMap ref={mouseRef} allCountries={allCountries} setIsHovering={setIsHovering} previewImgUrl={previewImgUrl} hoverAddCountryName={hoverAddCountryName} setPointPhoto={setPointPhoto} isColorHovering={isColorHovering} setNotePhoto={setNotePhoto} getPosition={getPosition} currentPos={currentPos} isHovering={isHovering} setIsColorHovering={setIsColorHovering} mapState={mapState} isShowingPoint={isShowingPoint} uid={uid} countryList={countryList} setIsShowingPointNotes={setIsShowingPointNotes} isShowingPointNotes={isShowingPointNotes} getCountryFriends={getCountryFriends} friendList={friendList} setFriendList={setFriendList} friendsList={friendsList} setFriendsList={setFriendsList} isShowingFriends={isShowingFriends} setIsShowingFriends={setIsShowingFriends} countryId={countryId} setCountryId={setCountryId} countryName={countryName} haveFriendList={haveFriendList} setHaveFriendList={setHaveFriendList} pointList={pointList} setIsShowingPopUp={setIsShowingPopUp} setPopUpMsg={setPopUpMsg} setNotificationInfo={setNotificationInfo} setIsChangingMap={setIsChangingMap} pointIndex={pointIndex} setPointIndex={setPointIndex}></FriendsMap>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
            <NumberCount>
              You already have {friendsList.length} {friendsList && friendsList.length <= 1 ? `friend` : `friends`} from {haveFriendList.length} {haveFriendList && haveFriendList.length <= 1 ? `country` : `countries`}
            </NumberCount>
          </>
        ) : mapState === 3 ? (
          <>
            {/* prettier-ignore */}
            <CustomizedMap setX={setX}
              ref={mouseRef} setY={setY} allCountries={allCountries} setIsHovering={setIsHovering} hoverAddCountryName={hoverAddCountryName} isHovering={isHovering} isColorHovering={isColorHovering} setIsColorHovering={setIsColorHovering} imageList={imageList} getPosition={getPosition} singlePointList={singlePointList} notePhoto={notePhoto} pointPhoto={pointPhoto} isEditing={isEditing} previewImgUrl={previewImgUrl} setNotePhoto={setNotePhoto} setIsEditing={setIsEditing} currentPos={currentPos} setPointPhoto={setPointPhoto} mapState={mapState} isShowingPoint={isShowingPoint} uid={uid} countryList={countryList} setIsShowingPointNotes={setIsShowingPointNotes} isShowingPointNotes={isShowingPointNotes} countryId={countryId} setCountryId={setCountryId} countryName={countryName} haveFriendList={haveFriendList} pointList={pointList} setPointList={setPointList} setIsShowingPopUp={setIsShowingPopUp} mapId={mapId} setPopUpMsg={setPopUpMsg} setNotificationInfo={setNotificationInfo} setIsChangingMap={setIsChangingMap} pointIndex={pointIndex} setPointIndex={setPointIndex}></CustomizedMap>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
          </>
        ) : (
          <></>
        )}
      </Wrapper>
    </>
  );
}

export default WorldMap;
