import React, { useEffect, useState, useRef, MouseEvent } from "react";
import styled from "styled-components";
import countries from "./utils/countries";
import MapSVG from "./components/MapSVG";
import { doc, setDoc, collection, getDoc, getDocs, deleteField, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import app from "./utils/firebaseConfig";
import { db } from "./utils/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CountryCheckList from "./components/CountryCheckList";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "./App";
import trashCan from "./components/trashCan.png";
import trashCanHover from "./components/trashCanHover.png";
import edit from "./components/edit.png";
import editHover from "./components/editHover.png";
import imageIcon from "./components/imageIcon.png";
import imageHover from "./components/imageHover.png";
import noIcon from "./components/noIcon.png";
import okIcon from "./components/okIcon.png";
import Tiptap from "./Tiptap";
import parse from "html-react-parser";
import backIcon from "./components/backIcon.png";
import Overlap from "./components/Overlap";
import userProfile from "./components/userProfile.png";
import PopUp from "./components/PopUp";
import FriendBox from "./components/FriendBox";
import { uuidv4 } from "@firebase/util";
import wallPaper1 from "./components/wallpaper1.png";
import wallPaper2 from "./components/wallpaper2.png";
import wallPaper3 from "./components/wallpaper3.png";

const storage = getStorage(app);

const IconBtnStyle = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 15px;
  background-size: cover;
  position: absolute;
  cursor: pointer;
`;

const Wrapper = styled.div<{ mapState: number }>`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(42, 61, 78);
  overflow-y: scroll;
`;

const Mask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0.5;
`;

const Map = styled.div`
  position: relative;
  margin-top: 80px;
  margin: 80px auto 0 auto;
`;
const HomePage = styled.div`
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

type mousePlaceType = {
  x?: number | null | undefined;
  y?: number | null | undefined;
};

const ShowName = styled.div<{
  currentPos: mousePlaceType;
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
function getMousePos(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const e = event || window.event;
}

//map2

const MapCover = styled.div`
  height: 100%;
  width: 100%;
`;

const FriendBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  z-index: 100;
`;

const FriendOutsideBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  border: 1px solid white;
  background-color: rgba(225, 225, 225, 0.5);
  border-radius: 20px;
  display: flex;
  color: white;
`;

const FriendNum = styled.div`
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

const AddFriendBtn = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 50px;
  width: 50px;
  border: 1px solid white;
  border-radius: 50%;
  text-align: center;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
  color: white;
  background-color: rgba(42, 60, 77, 0.3);
`;

const FriendsCountry = styled.div`
  position: absolute;
  bottom: -40px;
  left: 62px;
  font-weight: 700;
  line-height: 20px;
`;

const Flag = styled.img`
  position: absolute;
  bottom: -50px;
  left: 10px;
  height: 40px;
  width: 40px;
  object-fit: contain;
  max-width: 100%;
`;

const NoteFlag = styled(Flag)`
  bottom: 20px;
  left: 20px;
  object-fit: contain;
  max-width: 100%;
`;
const CloseBtn = styled(IconBtnStyle)`
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
const AddFriendBox = styled.div`
  position: absolute;
  right: -240px;
  width: 200px;
  height: 500px;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgb(42, 61, 78);
`;

const AddFriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const AddFriendFormLabel = styled.label`
  line-height: 19px;
  font-size: 16px;
  padding-left: 2px;
  display: block;
  color: white;
  margin-top: 3px;
`;

const AddFriendFormInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  color: white;
`;

const AddFriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 2px;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  margin-top: 6px;
  outline: none;
`;
const FriendMiddleBox = styled.div`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 28px 0 20px;
`;
const AddFriendTip = styled.div`
  width: 100%;
  margin-top: 450px;
  margin-left: 445px;
  height: 20px;
  bottom: 20px;
  right: 20px;
  text-align: right;
  cursor: default;
`;

export const EditFriendBtn = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 45px;
  background-image: url(${edit});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${editHover});
    width: 24px;
    height: 24px;
    bottom: 15px;
  }
`;

export const FriendProfileNoPic = styled.div`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  background-image: url(${userProfile});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
`;

const AddFriendSentBtn = styled.div`
  margin-top: 20px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  line-height: 23px;
  height: 25px;
  :hover {
    background-color: rgb(211, 211, 211);
    color: rgba(42, 61, 78);
  }
`;

const addFriendFormGroups = [
  { label: "Friend's name", key: "name" },
  { label: "City", key: "city" },
  { label: "Instagram", key: "insta" },
  { label: "Notes", key: "notes" },
];

const AddFriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
`;

export const AddFriendPicLabel = styled.label`
  justify-content: center;
`;
export const AddFriendPicInput = styled.input`
  display: none;
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

export const PointSet = styled.div<{ pointInfo: pointListType; isJumping: boolean }>`
  position: absolute;
  top: ${(props) => {
    return props.pointInfo.y - 100 + "px";
  }};
  left: ${(props) => {
    return props.pointInfo.x - 4 + "px";
  }};
  display: flex;
  flex-direction: column;
  align-items: center;

  animation: ${(props) => props.isJumping && "jumping 1s infinite"};
  @keyframes jumping {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
export const Point = styled.div<{ mapState: number }>`
  height: ${(props) => (props.mapState == 1 ? "8.5px" : props.mapState == 2 ? "8.5px" : "7px")};
  width: ${(props) => (props.mapState == 1 ? "8.5px" : props.mapState == 2 ? "8.5px" : "7px")};
  cursor: pointer;
  border-radius: 50%;
  border: ${(props) => (props.mapState == 1 ? "0.2px solid white" : props.mapState == 2 ? "0.7px solid rgb(77,81,86)" : "")};
  background-color: ${(props) => (props.mapState == 1 ? "#6495ED" : props.mapState == 2 ? "white" : "rgb(236, 174, 72)")};
  z-index: 1;
`;
export const PointSole = styled.div`
  background-color: grey;
  height: 20px;
  width: 1.5px;
`;

export const PointNotes = styled.div`
  width: 300px;
  height: 550px;
  position: absolute;
  border: 1px solid white;
  top: 60px;
  right: -20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: rgb(124, 134, 146, 0.7);
  z-index: 1000;
  transition: 0.5s;
  @media (max-width: 1550px) {
    right: -10%;
  }
  @media (max-width: 1350px) {
    right: 10px;
  }

  @media (max-width: 700px) {
    transition: none;

    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    top: 100px;
  }
`;

export const PointNotesTitle = styled.h2`
  margin: 20px 0 10px 0;
  padding: 0 20px;
  text-align: center;
  color: white;
`;

const PointNoteTip = styled.div`
  font-size: 16px;
  color: rgba(225, 225, 225, 0.7);
  margin: 250px 0 10px -10px;
  text-align: left;
  cursor: default;
`;

export const PointNotesTitleInput = styled.input`
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 20px;
  margin: 25px 0;
  text-align: center;
  color: white;
  &::placeholder {
    color: rgba(225, 225, 225, 0.5);
  }
`;

const PointNotesTextArea = styled.div`
  margin-top: 20px;
  width: 90%;
  color: white;
  background-color: inherit;
  height: auto;
`;
export const PointNote = styled.div`
  margin-top: 15px;
  width: 255px;
  white-space: wrap;
  word-break: break-all;
  max-height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: white;
  margin-bottom: 65px;

  ol {
    padding: 20px;
  }
  hr {
    margin: 10px 0;
    border-top: 1px solid rgba(225, 225, 225, 0.5);
  }
`;

const PointNoteLarge = styled(PointNote)`
  max-height: 640px;
`;

export const PointNotesTextImg = styled.img`
  max-width: 268px;
  max-height: 160px;
  object-fit: cover;
  object-position: center;
`;

const NotesFlex = styled.div``;

const NoteEditBtn = styled(EditFriendBtn)``;

const NoteDeleteBtn = styled(IconBtnStyle)`
  background-image: url(${trashCan});
  :hover {
    background-image: url(${trashCanHover});
  }
`;

const NoteImgUploadBtn = styled.div`
  width: 24px;
  height: 24px;
  bottom: 16px;
  right: 70px;
  background-image: url(${imageIcon});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${imageHover});
    width: 24px;
    height: 24px;
    bottom: 17px;
  }
`;

const NoteAddBtn = styled(IconBtnStyle)`
  background-image: url(${okIcon});
  bottom: 19px;
  :hover {
    bottom: 21px;
  }
`;

const NoteCancelBtn = styled(IconBtnStyle)`
  height: 22px;
  width: 22px;
  background-image: url(${backIcon});
  bottom: 19px;
  right: 45px;
  :hover {
    bottom: 21px;
  }
`;

const NotesPhotoInput = styled.input`
  display: none;
`;

const Block1 = styled.div`
  height: 50px;
  width: 50px;
  background-color: #008b8b;
  opacity: 1;
`;

const NotesPhotoLabel = styled.label``;

const UploadBtn = styled.div`
  margin-bottom: 20px;
`;

type mousePosType = {
  x: number | null | undefined;
  y: number | null | undefined;
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
export type countryCollectionArrType = {
  countryName: string;
  countryId: string;
  countryRegion: string;
};

function WorldMap({ mapState, setMapState, isShowingPoint, setIsShowingPoint, toLogIn, setToLogIn, uid, setUid, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, isShowingPointNotes, getCountryFriends, friendList, setFriendList, friendsList, setFriendsList, isShowingFriends, setIsShowingFriends, countryId, setCountryId, countryName, setCountryName, haveFriendList, setHaveFriendList, pointList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, setUserName, setUserImg, mapId, setMapNames, mapNames, setOriginalMapNames, popUpMsg, setPopUpMsg, setDeleteMap, setNotificationInfo, setCurrentMapName, setIsChangingMap, pointIndex, setPointIndex }: WorldMapType) {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [countryCount, setCountryCount] = useState<number>(0);
  const [countryCollection, setCountryCollection] = useState<countryCollectionArrType[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const previewFriendImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : "";
  const [imageList, setImageList] = useState<string[]>([]);
  const imageListRef = ref(storage, "images/");
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [pointNotes, setPointNotes] = useState<string>("");
  const [pointPhoto, setPointPhoto] = useState<File | null>(null);
  const [notePhoto, setNotePhoto] = useState<string>("");
  const previewImgUrl = pointPhoto ? URL.createObjectURL(pointPhoto) : notePhoto;
  const [mousePos, setMousePos] = useState<mousePosType>({ x: null, y: null });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchTitleList, setSearchTitleList] = useState<(string | undefined)[]>([]);
  const mouseRef = useRef<SVGSVGElement>(null);
  const [currentPos, setCurrentPos] = useState<mousePosType>({ x: null, y: null });
  const [largeTipTap, setLargeTipTap] = useState<boolean>(true);
  const [isColorHovering, setIsColorHovering] = useState<boolean>(true);
  const [X, setX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);
  const [mousePlace, setMousePlace] = useState<{
    x: number | undefined;
    y: number | undefined;
  }>({ x: 0, y: 0 });
  const pointTitleInputRef = useRef<HTMLInputElement>(null);
  const [allCountries, setAllCountries] = useState<string[]>([]);

  function getAllCountries() {
    let All: string[] = [];
    countries.forEach((country) => {
      All.push(country.code);
    });
    setAllCountries(All);
  }

  type AddFriendType = {
    name: string;
    // country: string;
    city: string;
    insta: string;
    notes: string;
  };
  const initialAddFriendState = {
    name: "",
    // country: '',
    city: "",
    insta: "",
    notes: "",
  };
  const [addFriendState, setAddFriendState] = useState<AddFriendType>(initialAddFriendState);

  //
  const singlePointList: pointListType[] = [];

  pointList.forEach((pointInfo) => {
    if (pointInfo.countryId === countryId) {
      singlePointList.push(pointInfo);
    }
  });

  function getPosition(e: MouseEvent) {
    let rect = mouseRef.current!.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top; //y position within the element.
    setCurrentPos({ x: x, y: y });
  }

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
  useEffect(() => {
    // window.scrollTo(500, 0);
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

  async function writeUserMap1Data(country: string) {
    await setDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: true,
    });
  }
  async function deleteUserMap1Data(country: string) {
    // console.log("delete");
    await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: deleteField(),
    });
  }

  async function writeUserMap3Data(country: string, newObj: pointListType, url: string) {
    // console.log("我準備要write");

    await setDoc(doc(db, "user", uid, mapId, country), {
      List: [
        {
          title: newObj.title,
          countryId: country,
          y: newObj.y,
          x: newObj.x,
          imgUrl: url,
          notes: newObj.notes,
        },
      ],
      searchTitle: [newObj.title],
    });
    // console.log("我有write成功");
    let newSearchTitleList = [];
    newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
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
    setNotificationInfo({ text: "Successfully remove this person from your friend list 😈 ", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }

  async function updateUserMap3Data(countryId: string, newObj: pointListType, url: string) {
    // console.log("準備更新3");
    let newSinglePointList = [];
    const newListObj = {
      title: newObj.title,
      countryId: countryId,
      y: newObj.y,
      x: newObj.x,
      imgUrl: url,
      notes: newObj.notes,
    };

    newSinglePointList = [...singlePointList];
    newSinglePointList.forEach((point, index) => {
      if (point.x === newListObj.x && point.y === newListObj.y) {
        newSinglePointList[index] = newListObj;
      }
    });
    let newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), { List: newSinglePointList, searchTitle: newSearchTitleList });

    // console.log("增加點點");
  }

  async function updateUserMap3EachData(countryId: string, newObj: pointListType, url: string) {
    let newPointList = [];
  }

  async function updateUserMap1Data(country: string) {
    await deleteDoc(doc(db, "user", uid, "visitedCountries", country));
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

  //bug here
  async function updateUserMap2Data(url: string) {
    let newFriendList = [];
    const newFriend = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
      key: uuidv4(),
    };
    newFriendList = [...friendList, newFriend];
    let newHaveFriendNum = friendList.length + 1;

    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
    setFriendList(newFriendList);
    const newHaveFriendList = haveFriendList.map((countryFriend) => {
      if (countryFriend.countryId === countryId) {
        let a = countryFriend.haveFriend + 1;
        return { ...countryFriend, haveFriend: a };
      }
      return countryFriend;
    });
    setHaveFriendList(newHaveFriendList);
    let newFriendsList = [];
    newFriendsList = [...friendsList, newFriend];
    setFriendsList(newFriendsList);
    setNotificationInfo({ text: "Congrats for making another new friend! 😃 ", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 4000);
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

  // function deleteCheckedToMap(target:HTMLInputElement){
  //
  //   let targetValue = target.value;
  //   countries.forEach(countryObj => {
  //     if(countryObj.name === targetValue){
  //       let code = countryObj.code
  //       targetValue = code
  //     }
  //   })
  //   if(target.checked){deleteUserMap1Data(targetValue)}
  // }

  const sentNewFriendInfo = () => {
    if (imageUpload == null) {
      const url = "";
      if (friendList.length === 0) {
        // console.log("我是write");
        writeUserMap2Data(url);
      } else {
        // console.log("我是update");

        updateUserMap2Data(url);
      }
    } else {
      const imageRef = ref(storage, `${uid}/friendsMap/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)
          if (friendList.length === 0) {
            writeUserMap2Data(url);
          } else {
            updateUserMap2Data(url);
          }
        });
      });
    }
  };

  function sendNewNotesInfo(country: string, newObj: pointListType) {
    if (pointPhoto == null) {
      const url = notePhoto;
      if (singlePointList.length <= 1) {
        // console.log("我是沒照片的write");
        writeUserMap3Data(country, newObj, url);
      } else {
        // console.log("我是沒照片的update");

        updateUserMap3Data(country, newObj, url);
      }
      setPointList((pre) => {
        pre[pointIndex] = {
          ...pre[pointIndex],
          title: pointTitleInputRef.current?.value || "",
          imgUrl: previewImgUrl,
          notes: pointNotes,
        };
        const newArr = [...pre];
        return newArr;
      });
    } else {
      let newTitle = pointTitleInputRef.current?.value;
      const imageRef = ref(storage, `${uid}/myMap/${pointPhoto.name}`);
      setPointList((pre) => {
        pre[pointIndex] = {
          ...pre[pointIndex],
          title: newTitle,
          notes: pointNotes,
        };
        const newArr = [...pre];
        return newArr;
      });
      uploadBytes(imageRef, pointPhoto).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)

          if (singlePointList.length <= 1) {
            // console.log("我是有照片的write");
            writeUserMap3Data(country, newObj, url);
          } else {
            // console.log("我是有照片的update");
            updateUserMap3Data(country, newObj, url);
          }
          setPointList((pre) => {
            pre[pointIndex] = {
              ...pre[pointIndex],
              imgUrl: url,
            };
            const newArr = [...pre];
            return newArr;
          });
          setNotePhoto(url);
        });
      });
    }
  }
  function updateCountryCount() {
    let newCountryCount = 0;
    countryList.filter((item) => {
      if (item.visited === true) {
        newCountryCount += 1;
      }
    });
    setCountryCount(newCountryCount);
  }
  async function deleteNote() {
    // let newPointList = pointList.filter((obj, i) => {
    //   return i !== pointIndex;
    // });

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

  function writeUserMap2Data(url: string) {
    const key = uuidv4();
    let newFriendList = [];
    const data = {
      friends: [
        {
          name: addFriendState.name,
          // country: "",
          city: addFriendState.city,
          country: countryName,
          insta: addFriendState.insta,
          imgUrl: url,
          notes: addFriendState.notes,
          key,
        },
      ],
      haveFriend: 1,
    };
    setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), data);
    const data2 = {
      countryId: countryId,
      name: addFriendState.name,
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
      key,
    };
    newFriendList.push(data2);
    setFriendList(newFriendList);
    let newHaveFriendList = [];
    let newHaveFriendObj = { countryId: countryId, haveFriend: 1 };
    newHaveFriendList = [...haveFriendList, newHaveFriendObj];
    let newFriendsList = [];
    newFriendsList = [...friendsList, data2];
    setFriendsList(newFriendsList);
    setHaveFriendList(newHaveFriendList);
    setNotificationInfo({ text: `Congrats for making your first friend in ${countryName}! 😍 `, status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 4000);
  }

  return (
    <>
      <Wrapper mapState={mapState}>
        {/* <Mask></Mask> */}

        {mapState && mapState === -1 ? (
          <>
            <HomePage>
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
            </HomePage>
          </>
        ) : mapState === 1 ? (
          <>
            <Map
              onClick={(e) => {
                setIsChangingMap(false);
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }
                setIsShowingPopUp(false);
                let ColorChange = "rgb(236, 174, 72)";
                let ColorOrigin = "rgb(148, 149, 154)";
                if (target.style.fill == "") {
                  target.style.fill = ColorChange;
                  writeUserMap1Data(target.id);
                  // console.log("空去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorOrigin) {
                  target.style.fill = ColorChange;
                  writeUserMap1Data(target.id);
                  // console.log("去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorChange) {
                  target.style.fill = ColorOrigin;
                  updateUserMap1Data(target.id);
                  setIsColorHovering(false);
                  // const newCountryList = countryList.filter((object) => {
                  //   return object.countryId !== target.id;
                  // });
                  const newCountryList = countryList.filter((object) => {
                    return object.countryId !== target.id;
                  });
                  setCountryList(newCountryList);
                  // console.log("沒去過");
                }
              }}>
              {isHovering ? <ShowName currentPos={currentPos}>{countryName}</ShowName> : <></>}
              <div
                onMouseMove={(e) => {
                  getPosition(e);
                }}>
                {" "}
                <MapSVG setIsColorHovering={setIsColorHovering} isColorHovering={isColorHovering} countryId={countryId} ref={mouseRef} hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              </div>
              {isShowingPoint ? <Overlap setNotePhoto={setNotePhoto} setPointPhoto={setPointPhoto} mapState={mapState} pointList={pointList} isShowingPointNotes={isShowingPointNotes} pointIndex={pointIndex} previewImgUrl={previewImgUrl} setPointIndex={setPointIndex} setIsShowingPointNotes={setIsShowingPointNotes} setCountryId={setCountryId}></Overlap> : <></>}
            </Map>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>

            {(countryList && countryList.length === 0) || countryList.length === 1 ? <FriendNum>You have visited {countryList.length} country / area</FriendNum> : <FriendNum>You have visited {countryList.length} countries / area</FriendNum>}
            <CountryCheckList uid={uid} writeUserMap1Data={writeUserMap1Data} countryCollection={countryCollection} setCountryList={setCountryList} setCountryCollection={setCountryCollection} countryList={countryList}></CountryCheckList>
          </>
        ) : mapState === 2 ? (
          <>
            <Map
              onClick={(e) => {
                setIsChangingMap(false);
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }
                setCountryId(target.id);
                setIsShowingFriends(true);
                getCountryFriends(target.id);
                setIsShowingPointNotes(false);
                setPointIndex(-1);
              }}>
              <MapCover>
                <div
                  onMouseMove={(e) => {
                    getPosition(e);
                  }}>
                  {" "}
                  <MapSVG setIsColorHovering={setIsColorHovering} isColorHovering={isColorHovering} countryId={countryId} ref={mouseRef} hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
                </div>
              </MapCover>
              {isShowingFriends && isShowingFriends === true ? (
                <FriendBg>
                  <FriendOutsideBox>
                    <FriendMiddleBox>
                      <>
                        {friendList.length < 1 ? (
                          <AddFriendTip>add your first friend in this country</AddFriendTip>
                        ) : (
                          <>
                            {friendList.map((friend: { imgUrl: string; name: string; city: string; insta: string; notes: string; key: string }, index) => {
                              return <FriendBox setNotificationInfo={setNotificationInfo} setIsShowingPopUp={setIsShowingPopUp} setPopUpMsg={setPopUpMsg} key={friend.key} countryName={countryName} index={index} countryId={countryId} friend={friend} uid={uid} friendList={friendList} setFriendList={setFriendList} friendsList={friendsList} haveFriendList={haveFriendList} setHaveFriendList={setHaveFriendList} setFriendsList={setFriendsList}></FriendBox>;
                            })}
                          </>
                        )}
                      </>
                    </FriendMiddleBox>
                    <LittleCloseBtn
                      onClick={() => {
                        setIsShowingFriends(false);
                        setIsAddingFriend(false);
                      }}></LittleCloseBtn>
                    <AddFriendBtn
                      onClick={() => {
                        setIsAddingFriend(true);
                        setImageUpload(null);
                      }}>
                      +
                    </AddFriendBtn>
                    <Flag src={`https://countryflagsapi.com/png/${countryId}`}></Flag>
                    <FriendsCountry>{countryName}</FriendsCountry>
                    {isAddingFriend && isAddingFriend ? (
                      <AddFriendBox>
                        <AddFriendPicLabel htmlFor="addFriendPic">{previewFriendImgUrl ? <AddFriendProfilePic src={previewFriendImgUrl}></AddFriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>}</AddFriendPicLabel>

                        <AddFriendPicInput
                          id="addFriendPic"
                          accept="image/png, image/gif, image/jpeg, image/svg"
                          type="file"
                          onChange={(e) => {
                            setImageUpload(e.target.files![0]);
                          }}></AddFriendPicInput>
                        {addFriendFormGroups.map(({ label, key }) => (
                          <AddFriendSet key={key}>
                            <AddFriendFormLabel>{label}</AddFriendFormLabel>
                            {key === "notes" ? (
                              <AddFriendFormTextarea
                                maxLength={125}
                                onChange={(e) =>
                                  setAddFriendState({
                                    ...addFriendState,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <AddFriendFormInput
                                maxLength={21}
                                onChange={(e) =>
                                  setAddFriendState({
                                    ...addFriendState,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            )}
                          </AddFriendSet>
                        ))}
                        <AddFriendSentBtn
                          onClick={() => {
                            if (addFriendState.name.trim() !== "") {
                              sentNewFriendInfo();
                              setIsAddingFriend(false);
                              setAddFriendState({
                                name: "",
                                // country: '',
                                city: "",
                                insta: "",
                                notes: "",
                              });
                            } else {
                              setNotificationInfo({ text: `Friend's name could not be blank `, status: true });
                              setTimeout(() => {
                                setNotificationInfo({ text: "", status: false });
                              }, 3000);
                            }
                          }}>
                          Create
                        </AddFriendSentBtn>
                        <CloseBtn
                          onClick={() => {
                            setIsAddingFriend(false);
                          }}></CloseBtn>
                      </AddFriendBox>
                    ) : (
                      <></>
                    )}
                  </FriendOutsideBox>
                </FriendBg>
              ) : (
                <></>
              )}
              {isHovering ? <ShowName currentPos={currentPos}>{countryName}</ShowName> : <></>}
              {isShowingPoint ? <Overlap setNotePhoto={setNotePhoto} setPointPhoto={setPointPhoto} mapState={mapState} pointList={pointList} isShowingPointNotes={isShowingPointNotes} pointIndex={pointIndex} previewImgUrl={previewImgUrl} setPointIndex={setPointIndex} setIsShowingPointNotes={setIsShowingPointNotes} setCountryId={setCountryId}></Overlap> : <></>}
            </Map>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>

            {(friendsList && friendsList.length <= 0) || friendsList.length === 1 ? (
              <FriendNum>
                You already have {friendsList.length} friend from {haveFriendList.length} country
              </FriendNum>
            ) : (
              <FriendNum>
                You already have {friendsList.length} friends from {haveFriendList.length} countries
              </FriendNum>
            )}
          </>
        ) : mapState === 3 ? (
          <>
            <Map
              onClick={(e) => {
                setIsChangingMap(false);
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }

                let ColorChange = "rgb(236, 174, 72)";
                if (target.style.fill == ColorChange) {
                  target.style.fill = "inherit";
                }
                setCountryId(target.id);
                setIsShowingPointNotes(false);
                setPointIndex(-1);
                let mousePosition = currentPos;
                setMousePos(mousePosition);
                let a = mousePosition;
                let newObj = {
                  title: "",
                  countryId: target.id,
                  imgUrl: "",
                  notes: "",
                  x: (a.x as number) + 50,
                  y: (a.y as number) + 73,
                };
                setPointList([...pointList, newObj]);
                if (pointList.length === 0) {
                  setNotificationInfo({ text: "click on the pin to add some notes!", status: true });
                  setTimeout(() => {
                    setNotificationInfo({ text: "", status: false });
                  }, 4000);
                }
              }}>
              {isShowingPoint ? (
                <>
                  {pointList.map((pointInfo, index) => {
                    return (
                      <>
                        <PointSet
                          isJumping={index === pointIndex}
                          key={index}
                          pointInfo={pointInfo}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <Point
                            mapState={mapState}
                            id={pointInfo.countryId}
                            onClick={(e) => {
                              setPointPhoto(null);
                              const target = e.target as HTMLInputElement;
                              setX(pointInfo.x);
                              setY(pointInfo.y);
                              setMousePos({ x: pointInfo.x, y: pointInfo.y });
                              setPointIndex(index);
                              e.stopPropagation();
                              setIsShowingPointNotes(true);
                              setIsEditing(false);
                              setCountryId(target.id);
                              setNotePhoto(pointInfo.imgUrl);
                              setPointNotes("");
                            }}></Point>
                          <PointSole></PointSole>
                        </PointSet>
                      </>
                    );
                  })}
                </>
              ) : (
                <></>
              )}

              {isShowingPointNotes ? (
                <PointNotes>
                  {isEditing ? <PointNotesTitleInput maxLength={20} placeholder="Title" defaultValue={pointList[pointIndex].title} ref={pointTitleInputRef}></PointNotesTitleInput> : <>{pointList && pointList[pointIndex].title ? <PointNotesTitle>{pointList[pointIndex].title}</PointNotesTitle> : <PointNoteTip>write something to save the pin</PointNoteTip>}</>}
                  {previewImgUrl ? <PointNotesTextImg src={previewImgUrl} /> : <PointNotesTextImg src={pointList[pointIndex].imgUrl} />}

                  {isEditing ? (
                    <>
                      <NotesPhotoLabel htmlFor="NotesPhotoInput">
                        {/* <button>upload images</button> */}
                        {/* <AddFriendProfilePic src={imageList[0]}></AddFriendProfilePic> */}
                        {/* <button></button> */}
                        <NoteImgUploadBtn></NoteImgUploadBtn>
                      </NotesPhotoLabel>
                      <NotesPhotoInput
                        type="file"
                        id="NotesPhotoInput"
                        accept="image/png, image/gif, image/jpeg"
                        // ref={contentImageUpload}

                        onChange={(e) => {
                          setPointPhoto(e.target.files![0]);
                          if (e.target.files![0] || pointList[pointIndex].imgUrl) {
                            setLargeTipTap(false);
                          } else {
                            setLargeTipTap(true);
                          }
                          // setImageUpload(e.target.files![0]);
                        }}></NotesPhotoInput>
                      <PointNotesTextArea
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Tiptap largeTipTap={largeTipTap} setPointNotes={setPointNotes} pointList={pointList} pointIndex={pointIndex} />
                      </PointNotesTextArea>
                    </>
                  ) : (
                    <>{previewImgUrl || pointList[pointIndex].imgUrl ? <PointNote>{pointList && parse(pointList[pointIndex].notes)}</PointNote> : <PointNoteLarge>{pointList && parse(pointList[pointIndex].notes)}</PointNoteLarge>}</>
                  )}

                  <NotesFlex>
                    {isEditing ? (
                      <NoteCancelBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShowingPopUp(true);
                          setPopUpMsg(["Are you sure you want to leave before saving changes?", "Yes", "No", "", "goback"]);
                        }}></NoteCancelBtn>
                    ) : (
                      <>
                        <NoteEditBtn
                          onClick={(e) => {
                            if (previewImgUrl || pointList[pointIndex].imgUrl) {
                              setLargeTipTap(false);
                            } else {
                              setLargeTipTap(true);
                            }
                            e.stopPropagation();
                            setIsEditing(true);
                            setPointNotes(pointList[pointIndex].notes);
                            setNotePhoto(pointList[pointIndex].imgUrl);
                          }}></NoteEditBtn>
                        <NoteDeleteBtn
                          onClick={(e) => {
                            setIsShowingPopUp(true);
                            setPopUpMsg(["Are you sure you want to delete the pin?", "Yes", "No", "", "deletepin"]);
                          }}></NoteDeleteBtn>
                      </>
                    )}
                    {isEditing ? (
                      <>
                        <NoteAddBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            let newObj: pointListType = {
                              title: pointTitleInputRef.current!.value,
                              countryId: countryId,
                              x: mousePos.x as number,
                              y: mousePos.y as number,
                              imgUrl: imageList[0],
                              notes: pointNotes,
                            };
                            if (pointTitleInputRef.current!.value.trim() !== "") {
                              sendNewNotesInfo(countryId, newObj);
                              setIsEditing(false);
                              setPointPhoto(null);
                              setPointNotes("");
                            } else {
                              setNotificationInfo({ text: `Title cannot be blank`, status: true });
                              setTimeout(() => {
                                setNotificationInfo({ text: "", status: false });
                              }, 3000);
                            }
                          }}></NoteAddBtn>
                      </>
                    ) : (
                      <></>
                    )}
                  </NotesFlex>
                  <NoteFlag src={`https://countryflagsapi.com/png/${countryId}`}></NoteFlag>
                  <LittleCloseBtn
                    onClick={() => {
                      if (isEditing) {
                        setIsShowingPopUp(true);
                        setPopUpMsg(["Are you sure you want to leave before saving changes?", "Yes", "No", "", "closenote"]);
                      } else {
                        setIsShowingPointNotes(false);
                        setPointIndex(-1);
                      }
                    }}></LittleCloseBtn>
                </PointNotes>
              ) : (
                <></>
              )}
              <div
                onMouseMove={(e) => {
                  getPosition(e);
                }}>
                <MapSVG setIsColorHovering={setIsColorHovering} isColorHovering={isColorHovering} countryId={countryId} ref={mouseRef} hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              </div>
              {isHovering ? <ShowName currentPos={currentPos}>{countryName}</ShowName> : <></>}
            </Map>
            <PopUp setIsChangingMap={setIsChangingMap} setPointIndex={setPointIndex} setIsEditing={setIsEditing} setDeleteMap={setDeleteMap} deleteFriend={deleteFriend} deleteNote={deleteNote} setIsShowingPointNotes={setIsShowingPointNotes} popUpMsg={popUpMsg} setPopUpMsg={setPopUpMsg} toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
          </>
        ) : (
          <></>
        )}
        {/* {toLogIn && toLogIn ? <Login toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Login> : <></>} */}
        {/* <Block1 />
        <Block2 />
        <Block3 />
        <Block4 /> */}
      </Wrapper>
    </>
  );
}

export default WorldMap;
