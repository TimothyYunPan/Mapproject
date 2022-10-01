import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { GlobalStyleComponent } from "styled-components";
import countries from "./utils/countries";
import MapSVG from "./components/MapSVG";
import Login from "./components/Login";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs, deleteField, updateDoc, DocumentData, query, where, deleteDoc, arrayRemove } from "firebase/firestore";
import { EventType } from "@testing-library/react";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import app from "./utils/firebaseConfig";
import { db } from "./utils/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CountryCheckList from "./components/CountryCheckList";
import userEvent from "@testing-library/user-event";
import Header from "./components/Header";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType } from "./App";
import trashCan from "./components/trashCan.png";
import trashCanHover from "./components/trashCanHover.png";
import edit from "./components/edit.png";
import editHover from "./components/editHover.png";
import imageIcon from "./components/imageIcon.png";
import imageHover from "./components/imageHover.png";
import noIcon from "./components/noIcon.png";
import okIcon from "./components/okIcon.png";
import Tiptap from "./Tiptap";
import addIcon from "./components/addIcon.png";
import parse from "html-react-parser";
import backIcon from "./components/backIcon.png";
import Overlap from "./components/Overlap";
import userProfile from "./components/userProfile.png";
import PopUp from "./components/PopUp";
import FriendBox from "./components/FriendBox";
import { uuidv4 } from "@firebase/util";
// import { ScrollDetect } from "./components/ScrollDetect";

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

// async function writeUserMap1Data(country:string) {
//   console.log("write")
//   await setDoc(doc(db, "user", uid, "visitedCountries", country), {
//     visited:true
//   });
//   // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
//   //   country
//   // });
// }

// async function updateUserMap1Data(country:string){
//   // console.log("delete")
//   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
//     visited: false
//   });
// }

// async function writeUserMap2Data(addFriendState:any) {
//   console.log(addFriendState)
//   console.log("write")
//   await setDoc(doc(db, "user", uid, "friendsLocatedCountries", addFriendState.country), {
//       friends:[
//         {
//           name: addFriendState.name,
//           country: "",
//           city: "",
//           insta: addFriendState.insta,
//           imageUrl: "",
//           notes: addFriendState.notes
//         }
//       ]

//   });
//   // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
//   //   country
//   // });
// }

const Wrapper = styled.div<{ mapState: number }>`
  height: 100vh;
  width: 100%;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  /* background-image: url(https://images.unsplash.com/photo-1476673160081-cf065607f449?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1772&q=80); */
  background-color: rgb(42, 61, 78);
  overflow: scroll;
  /* background-color: ${(props) => (props.mapState === 1 ? "rgb(42, 61, 78)" : "white")}; */
  /* background-image: url(https://www.sow.org.tw/sites/sow/files/u11282/wallpaper-2675683.jpg);
  background-repeat: no-repeat;
  background-position: top; */

  /* background: linear-gradient(to right, #f0f2f0 0%, #000c40 100%); * /
  /* align-items: center; */
  /* justify-content: center; */
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

  /* background-color: inherit; */
  margin-top: 80px;
  margin: 80px auto 0 auto;
  /* opacity: 0.; */
  /* height: 100px; */
  /* background-image: url(https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80); */

  /* height:100%;
  width: 100%; */
`;
const HomePage = styled.div`
  position: relative;
  /* position: absolute; */
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
  /* position: relative; */
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* z-index: 200; */
  /* cursor: pointer; */
  transition: 0.5s;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  /* display: flex; */
  /* background-color: rgb(236, 174, 72); */
  background-image: url(https://images.pexels.com/photos/1647116/pexels-photo-1647116.jpeg?cs=srgb&dl=pexels-humphrey-muleba-1647116.jpg&fm=jpg);
  :hover {
    transform: scale(1.02, 1.02);
  }
`;
const WallPaper2 = styled(WallPaper)`
  /* background-color: rgb(42, 60, 77); */
  background-image: url(https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
`;
const WallPaper3 = styled(WallPaper)`
  /* background-color: rgb(25, 102, 101); */
  background-image: url(https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg);
`;

const SelectMapText = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 40px;
  cursor: pointer;
`;

type mousePlaceType = {
  x?: number | undefined;
  y?: number | undefined;
};

const ShowName = styled.div<{
  mousePlace: mousePlaceType;
}>`
  /* width: 50px; */
  /* height: 50px; */
  font-size: 16px;
  position: absolute;
  cursor: pointer;

  top: ${(props) => (props.mousePlace.y as number) - 100}px;
  left: ${(props) => props.mousePlace.x}px;
  /* top:0; */
  /* left:0 */
  transform: translate(-50%, -150%);
  color: white;
`;
function getMousePos(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const e = event || window.event;
  return { x: e.clientX, y: e.clientY };
}

//map2

const MapCover = styled.div`
  height: 100%;
  width: 100%;
  /* background-color: rgb(42, 61, 78); */
  /* background-color: #fff; */
  /* backdrop-filter: blur(70px); */
`;

const FriendBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  z-index: 100;
  /* backdrop-filter: blur(70px); */
  /* background: lidnear-gradient(to right, #2BC0E4 0%, #EAECC6 100%); */

  /* opacity: 0.5; */
`;

// const OverlapBtn = styled.div`
//   position: absolute;
//   top: 0;
//   right: 120px;
//   height: 40px;
//   width: 80px;
//   margin: 0 10px;
//   /* padding-bottom: 16px; */
//   padding-top: 10px;
//   cursor: pointer;
//   font-size: 16px;
//   text-align: center;
//   color: white;

//   :hover {
//     border-bottom: 1px solid white;
//   }
// `;

const FriendOutsideBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  border: 1px solid white;
  background-color: rgba(225, 225, 225, 0.5);
  /* background-color: rgba(42, 61, 78, 0.7); */
  border-radius: 20px;
  display: flex;
  color: white;
  /* overflow: scroll; */
  /* z-index: 100; */
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;

const FriendNum = styled.div`
  width: 400px;
  height: 20px;
  position: absolute;
  right: 20px;
  bottom: 15px;
  /* z-index: 100; */
  color: white;
  /* background-color: black; */
`;

const AddFriendBtn = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* transform: translate(-50%,-50%); */
  height: 50px;
  width: 50px;
  border: 1px solid white;
  border-radius: 50%;
  text-align: center;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
  color: white;
  /* z-index: 100; */
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
  /* object-position: center center; */
  max-width: 100%;
`;

const NoteFlag = styled(Flag)`
  bottom: 20px;
  left: 20px;
  object-fit: contain;

  /* object-position: center center; */
  max-width: 100%;
`;
const CloseBtn = styled(IconBtnStyle)`
  position: absolute;
  top: 20px;
  right: 20px;
  /* top: 10px;
  right: 1%;
  height: 22px;
  width: 22px; */
  background-image: url(${noIcon});
`;
const AddFriendBox = styled.div`
  position: absolute;
  /* top: 10%; */
  right: -240px;
  /* height: 100%; */
  width: 200px;
  height: 500px;
  /* border-radius: 20px; */
  border: 1px solid white;
  /* border-radius: 2%; */
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgb(42, 61, 78);

  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;

const AddFriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const AddFriendFormLabel = styled.label`
  /* width: 110px; */
  line-height: 19px;
  font-size: 16px;
  padding-left: 2px;
  /* color: #3f3a3a; */
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
`;
const FriendMiddleBox = styled.div`
  display: flex;
  overflow: scroll;
  margin: 0 24px 0 20px;
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
  /* object-fit: cover; */
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
  /* border: 1px solid white; */
  line-height: 23px;
  height: 25px;
  /* border-radius: 10px; */
  :hover {
    background-color: rgb(211, 211, 211);
    color: rgba(42, 61, 78);
  }
`;

const addFriendFormGroups = [
  { label: "Name", key: "name" },
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

const randomColor = Math.floor(Math.random() * 16777215).toString(16);
// const Point = styled.div<{svgScreenPosition:{}}>`
//   position: absolute;
//   top: ${(props)=>{return (props.svgScreenPosition.y) + "px"}};
//   left: ${(props)=>{return (props.svgScreenPosition.x) + "px" }};
//   height: 7px;
//   width: 7px;
//   cursor: pointer;
//   border-radius: 50%;
//   background-color: blue

// `

const MapTitle = styled.div`
  width: 100%;
  height: 100px;
  position: absolute;
  left: 270px;
  top: 115px;
  font-size: 32px;
  text-align: center;
  transform: translate(-50%, -50%);
  color: white;
  /* background-color: rgba(225, 225, 255, 0.5); */
  z-index: 1000;
`;

export const PointSet = styled.div<{ pointInfo: pointListType }>`
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
  /* border: 1px solid black; */
`;
export const Point = styled.div<{ mapState: number }>`
  /* position: absolute; */
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
  /* position: absolute; */
`;

export const PointNotes = styled.div`
  width: 300px;
  height: 550px;
  /* height: 100px; */
  position: absolute;
  border: 1px solid white;
  top: 60px;
  right: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: rgb(124, 134, 146, 0.7);
  /* border: 1px solid black; */
`;

// const PointInfoBox =

export const PointNotesTitle = styled.h2`
  margin: 20px 0;
  color: white;
`;
export const PointNotesTitleInput = styled.input`
  border: none;
  outline: none;
  border-bottom: 1px solid #fff;
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
  /* border: 1px solid white; */
  /* border-bottom: 1px solid #fff; */
  /* height: 70%; */
`;
export const PointNote = styled.div`
  margin-top: 45px;
  max-width: 255px;
  white-space: wrap;
  /* text-align: left; */
  word-break: break-all;
  width: 90%;
  max-height: 380px;
  overflow: scroll;
  color: white;
  margin-bottom: 45px;
  /* padding: 20px; */

  ol {
    padding: 20px;
  }
`;

export const PointNotesTextImg = styled.img`
  width: 90%;
  height: auto;
`;

const NotesFlex = styled.div`
  /* display: flex; */
`;

const NoteEditBtn = styled(EditFriendBtn)`
  /* top: 20px;
  right: 20px; */
`;

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

// const AddSocialMediaInput = styled.input`

// `
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
  /* margin: 5px; */
  margin-bottom: 20px;
`;

type mousePosType = {
  x: number | null;
  y: number | null;
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
  getUserMap2Friends: (id: string) => void;
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
};
export type countryCollectionArrType = {
  countryName: string;
  countryId: string;
};

function WorldMap({ mapState, setMapState, isShowingPoint, setIsShowingPoint, toLogIn, setToLogIn, uid, setUid, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, isShowingPointNotes, getUserMap2Friends, friendList, setFriendList, friendsList, setFriendsList, isShowingFriends, setIsShowingFriends, countryId, setCountryId, countryName, setCountryName, haveFriendList, setHaveFriendList, pointList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, setUserName, setUserImg, mapId, setMapNames, mapNames, setOriginalMapNames }: WorldMapType) {
  // console.log(mapState);
  // console.log(isHovering);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  console.log(isHovering);
  const [countryCount, setCountryCount] = useState<number>(0);
  // const [useTarget, setUseTarget] = useState<any>("")
  const [isColored, setIsColored] = useState<boolean>(false);
  const [countryCollection, setCountryCollection] = useState<countryCollectionArrType[]>([]);
  // console.log(countryCollection);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const previewFriendImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : "";
  const [imageList, setImageList] = useState<string[]>([]);
  const [myMapImageList, setMyMapImageList] = useState<string[]>([]);
  const imageListRef = ref(storage, "images/");
  const [svgPosition, setSvgPosition] = useState<{}>({});
  const [svgScreenPosition, setSvgScreenPosition] = useState<{}>({});
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [pointNotes, setPointNotes] = useState<string>("");
  const [pointPhoto, setPointPhoto] = useState<File | null>(null);
  const [notePhoto, setNotePhoto] = useState<string>("");
  // console.log(pointPhoto);
  const previewImgUrl = pointPhoto ? URL.createObjectURL(pointPhoto) : notePhoto;
  // console.log(pointNotes);
  const [mousePos, setMousePos] = useState<mousePosType>({ x: null, y: null });
  const [map3Data, setMap3Data] = useState<pointListType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchFriendList, setSearchFriendList] = useState<string[]>([]);
  const [searchTitleList, setSearchTitleList] = useState<(string | undefined)[]>([]);

  // console.log(searchTitleList);
  // const [pointList1, setPointList1] = useState<pointListType[]>([]);
  // console.log(pointList1);
  // const [singlePointList, setSinglePointList] = useState<pointListType[]>([]);
  const [X, setX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);

  const [editNotes, setEditNotes] = useState<(string | undefined)[]>([]);
  // const NoteRef = useRef<HTMLInputElement>(null);

  // console.log(xy);
  // const contentImageUpload = useRef();
  // console.log(contentImageUpload.current);
  // console.log(pointList);
  // const [visitedCountries, setVisitedCountries] = useState<boolean>(false)
  const [mousePlace, setMousePlace] = useState<{
    x: number | undefined;
    y: number | undefined;
  }>({ x: 0, y: 0 });
  // console.log(mousePlace);
  const [pointIndex, setPointIndex] = useState<number>(-1);

  const [selectPointIndex, setSelectPointIndex] = useState<number>(-1);
  // console.log(selectPointIndex);
  // const [pointNoteTitle, setPointNoteTitle] = useState<string>("");
  const pointTitleInputRef = useRef<HTMLInputElement>(null);
  const [allCountries, setAllCountries] = useState<string[]>([]);

  // console.log(allCountries);
  function getAllCountries() {
    let All: string[] = [];
    countries.forEach((country) => {
      All.push(country.code);
    });
    setAllCountries(All);
  }
  // function handleClick() {
  //   // pointTitleInputRef.current!.value = "New value";
  //   console.log(pointTitleInputRef.current!.value);
  // }
  // console.log(pointIndex);

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
    console.log(pointInfo);
    if (pointInfo.countryId === countryId) {
      singlePointList.push(pointInfo);
    }
  });
  console.log(singlePointList);
  //

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
    console.log(docSnap.data());
    if (docSnap.exists()) {
      setMapNames(docSnap.data().names);
      console.log(docSnap.data().names);
      console.log(docSnap.data().originalMap);
      setOriginalMapNames(docSnap.data().originalMap);
    } else {
      console.log("No such document!");
    }
  }
  useEffect(() => {
    setMapState(-1);
  }, []);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUid(user.uid);
        console.log("登入");
        console.log(user.uid);
        getUserData(user.uid);
        setIsLoggedIn(true);
        getAllCountries();
        // ...
      } else {
        // User is signed out
        // ...
        // setTimeout(() => {
        //   alert("喜歡這個網站嗎？快速註冊打造個人專屬地圖！");
        // }, 5000);
      }
    });
    // const user = auth.currentUser;
    // console.log(auth.currentUser);
    // if (user) {
    //   console.log(user);
    //   console.log("登入");

    //   // setUid(user.uid);
    //   // getUserData(user);
    // } else {
    //   console.log("沒有登入");

    //   // No user is signed in.
    // }

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
    console.log(country);
    await setDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: true,
    });
    // console.log("我有寫啦")
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }
  async function deleteUserMap1Data(country: string) {
    console.log("delete");
    await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: deleteField(),
    });
  }

  async function writeUserMap3Data(country: string, newObj: pointListType, url: string) {
    console.log("我準備要write");
    console.log(country);
    console.log(newObj);
    console.log(mapId);

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
    console.log("我有write成功");
    let newSearchTitleList = [];
    newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  // let newFriendList = [];
  // const newFriend = {
  //   countryId: countryId,
  //   name: addFriendState.name,
  //   // country: "",
  //   city: addFriendState.city,
  //   country: countryName,
  //   insta: addFriendState.insta,
  //   imgUrl: url,
  //   notes: addFriendState.notes,
  // };
  // newFriendList = [...friendList, newFriend];
  // await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList });
  // setFriendList(newFriendList);
  // // console.log(addFriendState)
  // console.log("write");

  async function updateUserMap3Data(countryId: string, newObj: pointListType, url: string) {
    console.log("準備更新3");
    // console.log(pointList);
    let newSinglePointList = [];
    const newListObj = {
      title: newObj.title,
      countryId: countryId,
      y: newObj.y,
      x: newObj.x,
      imgUrl: url,
      notes: newObj.notes,
    };
    console.log(newListObj);

    newSinglePointList = [...singlePointList];
    newSinglePointList.forEach((point, index) => {
      if (point.x === newListObj.x && point.y === newListObj.y) {
        newSinglePointList[index] = newListObj;
      }
    });
    console.log(newSinglePointList);
    let newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), { List: newSinglePointList, searchTitle: newSearchTitleList });

    console.log("增加點點");
    // 寫的update

    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  async function updateUserMap3EachData(countryId: string, newObj: pointListType, url: string) {
    let newPointList = [];
  }

  // async function deleteUserMap1Data(country:string){
  //   console.log("delete")
  //   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
  //     visited: deleteField()
  //   });
  // }

  async function updateUserMap1Data(country: string) {
    // console.log("delete")
    await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: false,
    });
  }
  async function getUserName(userUid: string) {
    const docRef = doc(db, "user", userUid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
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
    // console.log(querySnapshot);
    querySnapshot.forEach((country) => {
      // console.log(country.data());
      // console.log(country.id, '=>' ,country.data())
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
      console.log(newFriendsList);
    });
  }
  async function getUserMap3Data(userUid: string, mapId: any) {
    const q = collection(db, "user", userUid, mapId);
    const querySnapshot = await getDocs(q);
    let newPointList: pointListType[] = [];
    // let newPhotoList: string[] = [];
    // console.log(querySnapshot);
    querySnapshot.forEach((country) => {
      // console.log(country);
      console.log(country.data());
      console.log(country.data().List);
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
        // newPhotoList.push(newPointObj.imgUrl);
        // console.log(newPointObj)
      });
      console.log(newPointList);
      setPointList(newPointList);
      // setNotePhoto(newPhotoList);
    });
  }

  // function getSvgP(e){
  //   const svg = document.getElementById("CtySVG")
  //   if(svg){
  //   const pt = svg.createSVGPoint();
  //   pt.x = e.clientX;
  //   pt.y = e.clientY;
  //   console.log(pt.x,pt.y)
  //   const svgP = pt.matrixTransform( svg.getScreenCTM().inverse() );
  //   console.log(svgP)
  //   setSvgPosition(svgP)
  //   return svgP
  //   }

  // }

  // function getUserMap2Friends(id: string) {
  //   const nf: friendListType[] = [];
  //   console.log(id);

  //   friendsList.forEach((friend) => {
  //     // console.log(friend);
  //     if (friend.countryId === id) {
  //       nf.push(friend);
  //     }
  //   });
  //   console.log(nf);
  //   setFriendList(nf);
  // }

  // async function getUserMap2Data(id){
  //   const q = doc(db, "user", uid, "friendsLocatedCountries", id);
  //   console.log("我是拿資料")
  //   const querySnapshot = await getDoc(q);

  //   if(querySnapshot.exists()){
  //     setFriendsList(querySnapshot.data().friends)
  //     // setHaveFriendList(querySnapshot.data().haveFriend)
  //     // console.log(querySnapshot.data())

  //   }else{
  //     setFriendsList([])
  //   }
  // }
  //bug here
  async function updateUserMap2Data(url: string) {
    // console.log("delete")
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
    const newHaveFriendNum = friendList.length + 1;
    console.log(newFriendList);
    let newSearchFriendList = [...searchFriendList, addFriendState.name];
    setSearchFriendList(newSearchFriendList);
    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum, searchName: newSearchFriendList });
    setFriendList(newFriendList);
    const newHaveFriendList = haveFriendList.map((countryFriend) => {
      if (countryFriend.countryId === countryId) {
        let a = countryFriend.haveFriend + 1;
        console.log({ ...countryFriend, haveFriend: a });
        return { ...countryFriend, haveFriend: a };
      }
      return countryFriend;
    });
    setHaveFriendList(newHaveFriendList);
    let newFriendsList = [];
    newFriendsList = [...friendsList, newFriend];
    setFriendsList(newFriendsList);
    // console.log(addFriendState)
    console.log("update");
  }

  function hoverAddCountryName(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLInputElement;
    const result = countries.filter(function (obj) {
      return obj.code == target.id;
    });
    setMousePlace(getMousePos(e));
    if (result.length > 0) {
      setCountryName(result[0].name);
    }
  }
  // async function getFlag() {
  //   const response = await fetch(`https://countryflagsapi.com/png/${countryId.toLowerCase()}`);
  //   console.log(response.url);

  //   return response.url;

  //   // .then((response) => {
  //   //   console.log(response);
  //   // });
  // }

  // function deleteCheckedToMap(target:HTMLInputElement){
  //   // console.log(123)
  //   let targetValue = target.value;
  //   countries.forEach(countryObj => {
  //     if(countryObj.name === targetValue){
  //       let code = countryObj.code
  //       targetValue = code
  //     }
  //   })
  //   if(target.checked){deleteUserMap1Data(targetValue)}
  // }
  // console.log(imageUpload)
  const sentNewFriendInfo = () => {
    if (imageUpload == null) {
      const url = "";
      if (friendList.length === 0) {
        console.log("我是write");
        writeUserMap2Data(url);
      } else {
        console.log("我是update");

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
    // console.log(pointTitleInputRef.current.value);
    if (pointPhoto == null) {
      // console.log(pointTitleInputRef.current.value);
      const url = notePhoto;
      console.log(url);
      if (singlePointList.length <= 1) {
        console.log("我是沒照片的write");
        writeUserMap3Data(country, newObj, url);
      } else {
        console.log("我是沒照片的update");

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
        console.log(newArr);
        return newArr;
      });
      console.log(pointList);
    } else {
      let newTitle = pointTitleInputRef.current?.value;
      console.log(pointTitleInputRef.current);
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
            console.log("我是有照片的write");
            writeUserMap3Data(country, newObj, url);
          } else {
            console.log("我是有照片的update");
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
    console.log(newCountryCount);
    setCountryCount(newCountryCount);
  }
  // function uploadImage(){
  //   if(imageUpload == null) return;
  //   const imageRef = ref(storage,`images/${imageUpload.name}`)
  //   uploadBytes(imageRef,imageUpload).then((snapshot)=>{
  //     getDownloadURL(snapshot.ref).then((url)=>{

  //       setImageList((prev)=>[...prev, url])
  //     })
  //   })
  // }
  async function deleteNote() {
    // console.log(countryId);
    // console.log(singlePointList);

    // let newPointList = pointList.filter((obj, i) => {
    //   return i !== pointIndex;
    // });

    let newPointList = pointList.filter((obj) => {
      return obj.x !== X && obj.y !== Y;
    });
    setPointList(newPointList);
    console.log(newPointList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), {
      List: arrayRemove(singlePointList[0]),
    });
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
      searchName: [addFriendState.name],
      haveFriend: 1,
    };
    setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), data);
    const data2 = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
      key,
    };
    newFriendList.push(data2);
    setFriendList(newFriendList);
    let newSearchFriendList = [];
    newSearchFriendList.push(addFriendState.name);
    setSearchFriendList(newSearchFriendList);
    // console.log(addFriendState)
    console.log("write");
    let newHaveFriendList = [];
    let newHaveFriendObj = { countryId: countryId, haveFriend: 1 };
    newHaveFriendList = [...haveFriendList, newHaveFriendObj];
    let newFriendsList = [];
    newFriendsList = [...friendsList, data2];
    setFriendsList(newFriendsList);
    // newHaveFriendList.push(newHaveFriendObj);
    setHaveFriendList(newHaveFriendList);
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
                    }}></WallPaper>
                  <SelectMapText>ᴠɪsɪᴛᴇᴅ ᴍᴀᴘ</SelectMapText>
                </WallPaperSet>
              </HomePageContainer>
              <HomePageContainer>
                <WallPaperSet>
                  <WallPaper2
                    onClick={(e) => {
                      if (!uid) {
                        // setToLogIn(true);
                        setIsShowingPopUp(true);
                      } else {
                        setMapState(2);
                        setIsShowingPoint(false);
                      }
                    }}></WallPaper2>
                  <SelectMapText>ғʀɪᴇɴᴅ ᴍᴀᴘ</SelectMapText>
                </WallPaperSet>
              </HomePageContainer>
              <HomePageContainer>
                <WallPaperSet>
                  <WallPaper3
                    onClick={() => {
                      if (!uid) {
                        setToLogIn(true);
                      } else {
                        setMapState(3);
                        setIsShowingPoint(true);
                      }
                    }}></WallPaper3>
                  <SelectMapText>ᴍʏ ᴍᴀᴘ</SelectMapText>
                </WallPaperSet>
              </HomePageContainer>
              <PopUp toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
            </HomePage>
          </>
        ) : mapState === 1 ? (
          <>
            <Map
              // onMouseMove={(e) => {
              //   setIsHovering(true);
              //   hoverAddCountryName(e);
              // }}
              // onMouseOut={(e) => {
              //   setIsHovering(false);
              // }}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }
                setIsShowingPopUp(false);
                // setUseTarget(target.id)
                // const result = countries.filter(function(obj){return obj.code == target.id })
                // setIsClicked(true)
                let ColorChange = "rgb(236,174,72)";
                let ColorOrigin = "rgb(232, 233, 234)";
                if (target.style.fill == "") {
                  // target.style.fill = ColorChange;
                  console.log(target.id);
                  writeUserMap1Data(target.id);
                  console.log("空去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorOrigin) {
                  // target.style.fill = ColorChange;
                  writeUserMap1Data(target.id);
                  console.log("去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorChange) {
                  // console.log(123, target.style)
                  // target.style.fill = ColorOrigin;
                  updateUserMap1Data(target.id);
                  const newCountryList = countryList.map((object) => {
                    // console.log(targetValue)
                    // console.log(object.countryId)
                    if (object.countryId === target.id) {
                      return { ...object, visited: false };
                    }
                    return object;
                  });
                  setCountryList(newCountryList);
                  console.log("沒去過");
                }
                // updateCountryCount();
              }}>
              {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
              <MapSVG hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              {/* <button
                onClick={() => {
                  setIsShowingPoint(true);
                }}>
                重疊起來
              </button> */}
              {isShowingPoint ? <Overlap mapState={mapState} pointList={pointList} isShowingPointNotes={isShowingPointNotes} pointIndex={pointIndex} previewImgUrl={previewImgUrl} setPointIndex={setPointIndex} setIsShowingPointNotes={setIsShowingPointNotes} setCountryId={setCountryId}></Overlap> : <></>}
            </Map>
            <PopUp toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>

            {(countryList && countryList.length === 0) || countryList.length === 1 ? <FriendNum>You've visited {countryList.length} country / area</FriendNum> : <FriendNum>You've visited {countryList.length} countries / area</FriendNum>}
            <CountryCheckList writeUserMap1Data={writeUserMap1Data} countryCollection={countryCollection} setCountryList={setCountryList} setCountryCollection={setCountryCollection} countryList={countryList}></CountryCheckList>
          </>
        ) : mapState === 2 ? (
          <>
            <Map
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                // console.log(target.tagName);
                if (target.tagName !== "path") {
                  return;
                }
                setCountryId(target.id);
                setIsShowingFriends(true);
                getUserMap2Friends(target.id);
                setIsShowingPointNotes(false);
              }}>
              <MapCover
              // onMouseOver={(e) => {
              //   setIsHovering(true);
              //   hoverAddCountryName(e);
              // }}
              // onMouseLeave={(e) => {
              //   setIsHovering(false);
              // }}
              >
                <MapSVG hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              </MapCover>
              {isShowingFriends && isShowingFriends === true ? (
                <FriendBg>
                  <FriendOutsideBox>
                    <FriendMiddleBox>
                      {friendList.map((friend: { imgUrl: string; name: string; city: string; insta: string; notes: string }, index) => {
                        console.log(friend.name);
                        return <FriendBox key={friend.key} countryName={countryName} index={index} countryId={countryId} friend={friend} uid={uid} friendList={friendList} setFriendList={setFriendList} friendsList={friendsList} haveFriendList={haveFriendList} setHaveFriendList={setHaveFriendList} setFriendsList={setFriendsList}></FriendBox>;
                        // onChange={(e)=>{setEditNotes(e.target.value)}}
                      })}
                    </FriendMiddleBox>
                    <CloseBtn
                      onClick={() => {
                        setIsShowingFriends(false);
                        setIsAddingFriend(false);
                      }}></CloseBtn>
                    <AddFriendBtn
                      onClick={() => {
                        setIsAddingFriend(true);
                        setImageUpload(null);
                      }}>
                      +
                    </AddFriendBtn>
                    {/* {getFlag()} */}
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
                                onChange={(e) =>
                                  setAddFriendState({
                                    ...addFriendState,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <AddFriendFormInput
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
                            sentNewFriendInfo();
                            setIsAddingFriend(false);
                            alert("Congrats for making a new friend");
                            setAddFriendState({
                              name: "",
                              // country: '',
                              city: "",
                              insta: "",
                              notes: "",
                            });
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
              {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
              {isShowingPoint ? <Overlap mapState={mapState} pointList={pointList} isShowingPointNotes={isShowingPointNotes} pointIndex={pointIndex} previewImgUrl={previewImgUrl} setPointIndex={setPointIndex} setIsShowingPointNotes={setIsShowingPointNotes} setCountryId={setCountryId}></Overlap> : <></>}
            </Map>
            <PopUp toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>

            {(friendsList && friendsList.length <= 0) || friendsList.length === 1 ? (
              <FriendNum>
                You've made {friendsList.length} friend located in {haveFriendList.length} country
              </FriendNum>
            ) : (
              <FriendNum>
                You've made {friendsList.length} friends located in {haveFriendList.length} countries
              </FriendNum>
            )}
          </>
        ) : mapState === 3 ? (
          <>
            <Map
              // onMouseOver={(e) => {
              //   setIsHovering(true);
              //   hoverAddCountryName(e);
              // }}
              // onMouseLeave={(e) => {
              //   setIsHovering(false);
              // }}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }
                setCountryId(target.id);
                setIsShowingPointNotes(false);

                // let a = getSvgP(e)
                // const svg = document.getElementById("CtySVG")
                // if(svg){
                // const screenP = a.matrixTransform( svg.getScreenCTM())
                // console.log(screenP)
                // setSvgScreenPosition(screenP)
                // }
                let mousePosition = getMousePos(e);
                setMousePos(mousePosition);
                let a = mousePosition;
                let newObj = {
                  title: "",
                  countryId: target.id,
                  imgUrl: "",
                  notes: "",
                  x: a.x,
                  y: a.y,
                };
                // setPointIndex(pointList.length + 1);
                setPointList([...pointList, newObj]);
              }}>
              {isShowingPoint ? (
                <>
                  {pointList.map((pointInfo, index) => {
                    // console.log(pointInfo);
                    return (
                      <>
                        <PointSet
                          key={index}
                          pointInfo={pointInfo}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}>
                          <Point
                            mapState={mapState}
                            id={pointInfo.countryId}
                            onClick={(e) => {
                              const target = e.target as HTMLInputElement;
                              setX(pointInfo.x);
                              setY(pointInfo.y);
                              setMousePos({ x: pointInfo.x, y: pointInfo.y });
                              console.log(target.id);
                              setPointIndex(index);
                              e.stopPropagation();
                              setIsShowingPointNotes(true);
                              setIsEditing(false);
                              setCountryId(target.id);
                              setNotePhoto(pointInfo.imgUrl);
                              // console.log(pointInfo.imgUrl);
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
                  {isEditing ? (
                    <PointNotesTitleInput
                      placeholder="Title"
                      defaultValue={pointList[pointIndex].title}
                      // defaultValue={pointList[pointIndex].title}
                      ref={pointTitleInputRef}
                      // onChange={()=>{setPointNoteTitle()}}
                    ></PointNotesTitleInput>
                  ) : (
                    <PointNotesTitle>{pointList[pointIndex].title}</PointNotesTitle>
                  )}
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
                        accept="image/png, image/gif, image/jpeg, image/svg"
                        // ref={contentImageUpload}

                        onChange={(e) => {
                          setPointPhoto(e.target.files![0]);
                          // setImageUpload(e.target.files![0]);
                        }}></NotesPhotoInput>
                      <PointNotesTextArea
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Tiptap setPointNotes={setPointNotes} pointList={pointList} pointIndex={pointIndex} />
                      </PointNotesTextArea>
                    </>
                  ) : (
                    <PointNote>{pointList && parse(pointList[pointIndex].notes)}</PointNote>
                  )}
                  {/* <div contentEditable="true" onInput={(e) => console.log(e.currentTarget.innerHTML)}>
                  hi
                  <br />
                  <img src={imageList[0]}></img>
                  </div> */}

                  <NotesFlex>
                    {isEditing ? (
                      <NoteCancelBtn
                        onClick={(e) => {
                          e.stopPropagation();

                          setIsEditing(false);
                        }}></NoteCancelBtn>
                    ) : (
                      <>
                        <NoteEditBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                            setPointNotes(pointList[pointIndex].notes);
                            setNotePhoto(pointList[pointIndex].imgUrl);
                          }}></NoteEditBtn>
                        <NoteDeleteBtn
                          onClick={(e) => {
                            setIsShowingPointNotes(false);
                            deleteNote();
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
                            // console.log(singlePointList);
                            // setSinglePointList([...singlePointList, newObj]);
                            // let newArr = [];
                            // console.log(countryId);
                            // setPointList((pre) => {
                            //   pre[pointIndex] = {
                            //     ...pre[pointIndex],
                            //     title: pointTitleInputRef.current!.value,
                            //     imgUrl: previewImgUrl,
                            //     notes: pointNotes,
                            //   };
                            //   const newArr = [...pre];
                            //   console.log(newArr);
                            //   return newArr;
                            // });
                            sendNewNotesInfo(countryId, newObj);

                            setPointPhoto(null);
                            // writeUserMap3Data(countryId, newObj);
                            setIsEditing(false);
                            setPointNotes("");
                          }}></NoteAddBtn>

                        {/* <NoteDeleteBtn
                        onClick={(e) => {
                          deleteNote();
                        }}></NoteDeleteBtn> */}
                      </>
                    ) : (
                      <></>
                    )}
                  </NotesFlex>
                  <NoteFlag src={`https://countryflagsapi.com/png/${countryId}`}></NoteFlag>
                </PointNotes>
              ) : (
                <></>
              )}
              <MapSVG hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
            </Map>
            <PopUp toLogIn={toLogIn} setToLogIn={setToLogIn} setLoginStatus={setLoginStatus} setIsLoggedIn={setIsLoggedIn} isShowingPopUp={isShowingPopUp} setIsShowingPopUp={setIsShowingPopUp}></PopUp>
          </>
        ) : mapState === 4 ? (
          <>{/* <Login countryList={countryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Login> */}</>
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
