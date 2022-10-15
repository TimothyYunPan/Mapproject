import React, { useEffect, useState, useRef, SetStateAction } from "react";
import styled from "styled-components";
import countries from "../utils/countries";
import continent from "./continents1.png";
import search from "./search.png";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "../App";
import Login from "./Login";
import { collection, query, where, getDocs, doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import PopUp from "./PopUp";
import { v4 as uuidv4 } from "uuid";
import sortDown from "./sortDown.png";
import addIcon from "./addIcon.png";
import editIcon from "./edit.png";
import editHoverIcon from "./editHover.png";
import deleteIcon from "./trashCan.png";
import deleteHoverIcon from "./trashCanHover.png";
import okIcon from "./okIcon.png";
import ChangeMapBtn from "./ChangeMapBtn";
import { ChevronsDownLeft } from "tabler-icons-react";
import eyeOpened from "../components/eyeOpened.png";
import eyeClosed from "../components/eyeClosed.png";
import OverlapSet from "./OverlapSet";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import userProfile from "./userProfile.png";
const Logo = styled.div<{ mapState: number }>`
  margin-top: ${(props) => (props.mapState === -1 ? "20px" : "0px")};
  width: ${(props) => (props.mapState === -1 ? "100px" : "70px")};
  height: ${(props) => (props.mapState === -1 ? "100px" : "70px")};
  /* border: 1px solid black; */
  margin-right: 32px;
  background-image: url(${continent});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  @media (max-width: 1020px) {
    display: none;
  }
`;
const Logo1 = styled(Logo)`
  display: none;
  @media (max-width: 1020px) {
    display: block;
    height: 50px;
    width: 50px;
    /* border: 1px solid white;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: 20px; */
    margin-top: 10px;
  }
`;

export const MapNameInput = styled.input`
  height: 30px;
  width: 200px;
  margin-top: 10px;
  /* maxlength: 11; */
  /* padding-bottom: 16px; */
  padding-left: 10px;
  /* padding-top: 20px; */
  cursor: pointer;
  word-spacing: 6px;
  font-size: 16px;
  color: white;
  text-align: left;
  outline: none;
  /* border: none; */
  /* color: rgb(42, 60, 77); */
  /* -webkit-text-stroke: 0.3px #fff; */
  border: 1px solid white;
  border-radius: 8px;
  /* text-align: center; */
  background-color: rgba(225, 225, 225, 0.2);
  /* background-color: rgba(0, 0, 0, 0.5); */
  backdrop-filter: blur(100px);
  /* line-height: 5px; */
  /* background-color: transparent; */
  /* border: 1px solid white; */
  &:nth-child(1) {
    /* margin-top: 0px; */
  }

  :hover {
    color: rgb(236, 174, 72);
    /* border-bottom: 1px solid white; */
  }
`;

const MapNameInputFirst = styled(MapNameInput)`
  margin-top: 0;
`;

export const ChangeMapBtnSet = styled.div`
  display: flex;
  align-items: center;
  /* border: 1px solid black; */
  position: relative;
  /* border-radius: 15px; */
  /* padding-left: 10px; */

  /* width: 100%; */
  /* margin-top: 20px; */
`;

const CheckMapsBtn = styled.div<{ isChangingMap: boolean }>`
  height: 12px;
  width: 12px;
  position: absolute;
  left: 325px;
  top: 28px;
  background-position: center;
  background-size: cover;
  background-image: url(${sortDown});
  cursor: pointer;
  transform: ${(props) => (props.isChangingMap ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.3s;
  @media (max-width: 1020px) {
    left: 80px;
  }
  @media (max-width: 640px) {
    display: none;
  }

  /* transform: rotate(180deg); */
`;

const HeaderBtnStyle = styled.div`
  margin-top: 20px;
  height: 14px;
  width: 14px;
  /* padding-left: 5px; */
  background-position: center;
  background-size: cover;
  cursor: pointer;
`;

const AddMapBtn = styled(HeaderBtnStyle)<{ isChangingMap: boolean }>`
  /* margin: 0 auto; */
  background-image: url(${addIcon});
  display: ${(props) => (props.isChangingMap ? "block" : "none")};
`;

export const EditMapBtn = styled(HeaderBtnStyle)`
  background-image: url(${editIcon});
  /* margin-left: 20px; */
  position: absolute;
  top: 20px;
  right: 0px;
  margin-top: 0px;
  :hover {
    background-image: url(${editHoverIcon});
    margin-top: 0px;
  }
`;

export const DeleteMapBtn = styled(HeaderBtnStyle)`
  background-image: url(${deleteIcon});
  /* margin-left: 20px; */
  margin-top: 0px;
  top: 20px;
  position: absolute;
  right: 0px;
  :hover {
    background-image: url(${deleteHoverIcon});
    margin-top: 0px;
  }
`;
export const OkIcon = styled(HeaderBtnStyle)`
  position: absolute;
  right: 30px;
  top: 20px;
  background-image: url(${okIcon});
  margin-top: 0px;
  /* margin-right: 10px; */
  :hover {
    top: 18px;
  }
`;

const CurrentMap = styled.div<{ mapState: number }>`
  height: 60px;
  width: 220px;
  /* margin: 0 10px; */
  padding-bottom: 16px;
  padding-top: 20px;
  word-spacing: 6px;
  font-size: 19px;
  color: white;
  text-align: left;
  cursor: pointer;
  :hover {
    /* color: ${(props) => (props.mapState === 2 ? "rgba(102,255,229,.8)" : "rgb(236, 174, 72)")}; */
    color: rgb(236, 174, 72);
    /* border-bottom: 1px solid white; */
  }
  @media (max-width: 1020px) {
    display: none;
  }
`;

const MapList = styled.div`
  display: flex;
  flex-direction: column;
`;

//header
const Wrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 5%;
  display: flex;
  justify-content: space-between;
  width: 90%;
  z-index: 100;
  /* align-items: center; */
  /* justify-content: center; */
  /* background-color: rgb(42, 60, 77); */
  z-index: 1000;
`;

const Nav = styled.div`
  width: 100%;
`;

const HeaderRightSet = styled.div`
  width: 480px;
  text-align: center;
  display: flex;
  position: relative;
  justify-content: space-between;
`;

const Back = styled.div`
  position: fixed;
  top: 80px;
  right: 120px;
  z-index: 250;
`;
const HeaderLeftSet = styled.div`
  display: flex;
  /* width: 100%; */
  /* align-items: center; */
  /* justify-content: center; */
`;

const MapBlockSet = styled.div<{ isChangingMap: boolean }>`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  max-height: ${(props) => (props.isChangingMap ? 350 : 0)}px;
  transition: 0.4s;
  /* background-color: rgba(42, 60, 77); */
  /* height: 100%; */
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  width: 220px;
  /* height: ; */
`;

const AllMapSelections = styled.div<{ isChangingMap: boolean }>`
  width: 220px;
  position: absolute;
  top: 45px;
  /* height: 100px; */
  /* height: ${(props) => (props.isChangingMap ? 200 : 0)}px; */
  /* height: 20px; */
  overflow: ${(props) => (props.isChangingMap ? "visible" : "hidden")};
  transition: 0.4s;
  @media (max-width: 1020px) {
    left: 0px;
  }

  /* overflow: hidden; */
`;

const SearchBtn = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  top: 22px;
  right: 60px;
  z-index: 150;
  border-radius: 5%;
  line-height: 24px;
  cursor: pointer;
  padding-top: 8px;
  background-image: url(${search});
  background-size: cover;
  /* transition: 0.5s; */
  @media (max-width: 550px) {
    height: 28px;
    width: 28px;
    /* left: 120px; */
    top: 20px;
    border-radius: 50%;
    border: 1px solid white;
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: center;

    /* right: 105px; */
    /* text-align: left; */
  }
`;

const LoginBtn = styled.div`
  height: 28px;
  width: 28px;
  padding-top: 21px;
  padding-bottom: 14px;
  font-size: 16px;
  margin-top: 17px;
  /* margin-top: 15px; */
  cursor: pointer;
  color: white;
  background-image: url(${userProfile});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  :hover {
    /* border-bottom: 1px solid white; */
  }
`;

type HeaderType = {
  mapState: number;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  isShowingPoint: boolean;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  getCountryFriends: (id: string) => void;
  isShowingFriends: boolean;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  friendsList: friendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  pointList: pointListType[];
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  isShowingPopUp: boolean;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  loginStatus: string;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userImage: string;
  mapId: string;
  setMapId: React.Dispatch<React.SetStateAction<string>>;
  mapNames: mapNameType[];
  setMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  originalMapNames: mapNameType[];
  setOriginalMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void })[]>>;
  deleteMap: string;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  currentMapName: string;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingMap: boolean;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function Header({ mapState, setMapState, isShowingPoint, setIsShowingPoint, uid, setUid, toLogIn, setToLogIn, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, getCountryFriends, isShowingFriends, setIsShowingFriends, setCountryId, setCountryName, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, userName, setUserName, userImage, setMapId, mapNames, setMapNames, originalMapNames, setOriginalMapNames, mapId, setPopUpMsg, deleteMap, setDeleteMap, pointList, setNotificationInfo, setCurrentMapName, currentMapName, isChangingMap, setIsChangingMap, setPointIndex }: HeaderType) {
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isEditingMap, setIsEditingMap] = useState<number>(-1);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isShowingOverlapBtn, setIsShowingOverlapBtn] = useState<boolean>(false);
  const [overlapName, setOverlapName] = useState<string>("Overlap with...");
  // console.log(overlapName);
  const [searchNameResult, setSearchNameResult] = useState<friendListType[]>([]);
  // console.log(searchNameResult);
  const [isShowingSearchBarMB, setIsShowingSearchBarMB] = useState<boolean>(false);
  const [isShowSearchResult, setIsShowingSearchResult] = useState<boolean>();
  const [hasCountry, setHasCountry] = useState<boolean>(true);
  const [hasName, setHasName] = useState<boolean>(true);
  console.log(hasName);
  console.log(hasCountry);
  const [map3Name, setMap3Name] = useState<string>("My Bucket List");
  const Map1NameRef = useRef<HTMLInputElement>(null);
  const Map2NameRef = useRef<HTMLInputElement>(null);
  const Map3NameRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<any>("");
  // useEffect(() => {
  //   console.log("hi");
  //   if (!hasName && !hasCountry) {
  //     console.log("hi");
  //     setHasCountry(true);
  //     setHasName(true);
  //     console.log("hi2");

  //     setNotificationInfo({ text: "no result", status: true });
  //     console.log("hi3");

  //     setTimeout(() => {
  //       setNotificationInfo({ text: "", status: false });
  //     }, 2000);
  //   }
  // }, [hasCountry]);
  function checkResult() {
    if (!hasName && !hasCountry) {
      console.log("hi");
      setHasCountry(true);
      setHasName(true);
      console.log("hi2");

      setNotificationInfo({ text: "no result", status: true });
      console.log("hi3");

      setTimeout(() => {
        setNotificationInfo({ text: "", status: false });
      }, 2000);
    }
  }
  // useEffect(() => {}, [hasName]);
  function searchCountries(searchValue: string) {
    const result = countries.filter(function (obj) {
      return obj.name.toLowerCase() === searchValue.toLowerCase();
    });
    console.log(result);
    if (result[0]) {
      setCountryName(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
      let a = result[0].code;
      getCountryFriends(a);
      setCountryId(a);
      setIsShowingFriends(true);
      // searchInputRef.current.value = "";
      // document.getElementById(a)!.style.scale = "2px";
      document.getElementById(a)!.style.fill = "rgb(236,174,72)";
      setHasCountry(true);
    } else {
      // searchName(searchValue);
      // setSearchNameResult("no result");
      // setIsShowingSearchResult;
      console.log("查無資料");
      setHasCountry(false);
    }

    // setSearchCountry(a);
  }

  function searchName(searchValue: string) {
    const result = friendsList.filter(function (obj) {
      return obj.name.toLowerCase() === searchValue.toLowerCase();
    });
    console.log(result);
    if (!result[0]) {
      setHasName(false);
      console.log("查無資料");
      setIsShowingSearchResult(false);
      setSearchNameResult([]);
    } else {
      setIsShowingSearchResult(true);
      setSearchNameResult(result);
      setHasName(true);

      // } else if (result.length === 1) {
      //   setCountryId(result[0].countryId);
      //   setIsShowingFriends(true);
      //   setCountryName(result[0].country);
      //   getCountryFriends(result[0].countryId);
      // } else {
      //   setIsShowingSearchResult(true);
      //   setSearchNameResult(result);
    }
  }

  function showOneResultFriend() {
    if (searchNameResult.length === 1) {
      setCountryId(searchNameResult[0].countryId);
      setIsShowingFriends(true);
      setCountryName(searchNameResult[0].country);
      getCountryFriends(searchNameResult[0].countryId);
      setIsShowingSearchResult(false);
      setSearchNameResult([]);
      setMapState(2);
      setCurrentMapName("Friends Located Map");
      setIsShowingPointNotes(false);
      searchInputRef.current.value = "";
    } else {
      console.log("查無資料");
    }
    setPointIndex(-1);
  }

  // async function searchName() {
  //   const countriesRef = collection(db, "user", uid, "friendsLocatedCountries");
  //   const q = query(countriesRef, where("searchName", "array-contains", searchValue));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.data());
  //     getCountryFriends(doc.id);
  //     setIsShowingFriends(true);
  //     setCountryId(doc.id);
  //     setCountryName(doc.data().friends[0].country);
  //     // console.log("hi");
  //   });
  // }
  // countries.forEach((country)=>{
  // })
  async function writeNewMapToData(uid: string) {
    let newId = uuidv4();
    // mapNames.push({ id: newId, name: "new Map" });
    let name = { id: newId, name: "new Map" };
    await setDoc(doc(db, "user", uid), { names: arrayUnion(name) }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    // console.log(mapNames);
    if (mapNames === undefined) {
      setMapNames([name]);
    } else {
      setMapNames([...mapNames, name]);
    }
  }
  async function updateNewMapName(i: number, mapId: string, Ref: any) {
    let newNames = [...originalMapNames];
    // console.log(newNames);
    newNames[i].name = Ref.current!.value;
    await setDoc(doc(db, "user", uid), { originalMap: newNames }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    setOriginalMapNames(newNames);
  }
  console.log(pointList);
  return (
    <Wrapper>
      <HeaderLeftSet>
        <Logo
          mapState={mapState}
          onClick={() => {
            setIsShowingFriends(false);
            setMapState(-1);
          }}></Logo>
        <Logo1
          mapState={mapState}
          onClick={() => {
            if (isChangingMap) {
              setIsChangingMap(false);
            } else {
              setIsChangingMap(true);
            }
            setIsShowingOverlapBtn(false);
            setIsShowingSearchBarMB(false);
            setIsShowingSearchResult(false);
          }}></Logo1>
        <MapList>
          {mapState && mapState !== -1 ? (
            <>
              {" "}
              <CurrentMap
                mapState={mapState}
                onClick={() => {
                  if (isChangingMap) {
                    setIsChangingMap(false);
                  } else {
                    setIsChangingMap(true);
                  }
                  setIsShowingOverlapBtn(false);
                }}>
                {currentMapName}
              </CurrentMap>{" "}
              <CheckMapsBtn
                isChangingMap={isChangingMap}
                onClick={() => {
                  if (isChangingMap) {
                    setIsChangingMap(false);
                  } else {
                    setIsChangingMap(true);
                  }
                  setIsShowingOverlapBtn(false);
                }}></CheckMapsBtn>
            </>
          ) : (
            <></>
          )}

          {mapState && mapState === -1 ? (
            <></>
          ) : (
            <>
              <AllMapSelections isChangingMap={isChangingMap}>
                <MapBlockSet isChangingMap={isChangingMap}>
                  <ChangeMapBtnSet>
                    <MapNameInputFirst
                      ref={Map1NameRef}
                      readOnly={isReadOnly}
                      defaultValue={originalMapNames[0].name}
                      onClick={() => {
                        if (isEditingMap === -1) {
                          setIsChangingMap(false);
                        } else {
                          setIsChangingMap(true);
                        }
                        setPointIndex(-1);
                        setCurrentMapName("Visited Countries Map");
                        setMapState(1);
                        setIsShowingPopUp(false);
                        if (mapState !== 2) {
                          setIsShowingPointNotes(false);
                          setPointIndex(-1);
                          setIsShowingPoint(false);
                        }
                      }}>
                      {/* Visited Countries Map */}
                    </MapNameInputFirst>

                    {/* {isEditingMap && isEditingMap === 1 ? (
                        <>
                          <OkIcon
                            onClick={() => {
                              updateNewMapName(0, "visitedCountries", Map1NameRef);
                              setIsReadOnly(true);
                              setIsEditingMap(-1);
                            }}></OkIcon>
                        </>
                      ) : (
                        <EditMapBtn
                          onClick={() => {
                            setIsReadOnly(false);
                            setIsEditingMap(1);
                          }}></EditMapBtn>
                      )} */}
                  </ChangeMapBtnSet>
                  <ChangeMapBtnSet>
                    <MapNameInput
                      ref={Map2NameRef}
                      readOnly={isReadOnly}
                      defaultValue={originalMapNames[1].name}
                      onClick={() => {
                        if (!uid) {
                          setIsShowingPopUp(true);
                          setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                          // setToLogIn(true);
                        } else {
                          if (isEditingMap === -1) {
                            setIsChangingMap(false);
                          } else {
                            setIsChangingMap(true);
                          }
                          setPointIndex(-1);
                          setCurrentMapName("Friends Located Map");
                          setMapState(2);
                          setIsShowingFriends(false);
                          if (mapState !== 1) {
                            setIsShowingPointNotes(false);
                            setPointIndex(-1);
                            setIsShowingPoint(false);
                          }
                        }
                      }}>
                      {/* Friends Located Map{" "} */}
                    </MapNameInput>
                    {/* {isEditingMap && isEditingMap === 2 ? (
                        <>
                          <OkIcon
                            onClick={() => {
                              updateNewMapName(1, "friendsLocatedCountries", Map2NameRef);
                              setIsReadOnly(true);
                              setIsEditingMap(-1);
                            }}></OkIcon>
                        </>
                      ) : (
                        <EditMapBtn
                          onClick={() => {
                            setIsReadOnly(false);
                            setIsEditingMap(2);
                          }}></EditMapBtn>
                      )} */}
                  </ChangeMapBtnSet>
                  <ChangeMapBtnSet>
                    <MapNameInput
                      ref={Map3NameRef}
                      readOnly={isReadOnly}
                      defaultValue={originalMapNames[2].name}
                      // onChange={(e) => {
                      //   setMap3Name(e.target.value);
                      // }}
                      onClick={() => {
                        if (!uid) {
                          setIsShowingPopUp(true);
                          setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                          // setToLogIn(true);
                        } else {
                          if (mapId !== "custimizedMap") {
                            setPointList([]);
                          }
                          setMapId("custimizedMap");
                          if (isEditingMap === -1) {
                            setIsChangingMap(false);
                          } else {
                            setIsChangingMap(true);
                          }
                          setPointIndex(-1);
                          setOverlapName("My Bucket List");
                          setCurrentMapName("My Bucket List");
                          setMapState(3);
                          setIsShowingPoint(true);
                          setIsShowingPointNotes(false);
                          setPointIndex(-1);
                          // setIsShowingPoint(false);
                        }
                      }}>
                      {/* My Map */}
                    </MapNameInput>
                    {/* {isEditingMap && isEditingMap === 3 ? (
                        <>
                          <OkIcon
                            onClick={() => {
                              updateNewMapName(2, "custimizedMapCountries", Map3NameRef);
                              setIsReadOnly(true);
                              setIsEditingMap(-1);
                            }}></OkIcon>
                        </>
                      ) : (
                        <EditMapBtn
                          onClick={() => {
                            setIsReadOnly(false);
                            setIsEditingMap(3);
                          }}></EditMapBtn>
                      )} */}
                  </ChangeMapBtnSet>

                  {mapNames &&
                    mapNames.map((mapName, index) => {
                      // console.log(mapName);
                      return (
                        <>
                          <ChangeMapBtn setPointIndex={setPointIndex} setNotificationInfo={setNotificationInfo} pointList={pointList} setIsShowingPopUp={setIsShowingPopUp} setPopUpMsg={setPopUpMsg} deleteMap={deleteMap} setDeleteMap={setDeleteMap} mapId={mapId} uid={uid} mapNames={mapNames} setMapNames={setMapNames} index={index} mapName={mapName} setIsShowingPointNotes={setIsShowingPointNotes} setPointList={setPointList} setIsChangingMap={setIsChangingMap} setMapId={setMapId} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} setCurrentMapName={setCurrentMapName} isEditingMap={isEditingMap} setIsEditingMap={setIsEditingMap} setOverlapName={setOverlapName}></ChangeMapBtn>
                        </>
                      );
                    })}
                </MapBlockSet>
                <AddMapBtn
                  isChangingMap={isChangingMap}
                  onClick={() => {
                    if (!uid) {
                      setIsShowingPopUp(true);
                      setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                      // setToLogIn(true);
                    } else if (mapNames && mapNames.length > 7) {
                      setNotificationInfo({ text: `You will only have 10 maps at the same time`, status: true });
                      setTimeout(() => {
                        setNotificationInfo({ text: "", status: false });
                      }, 3000);
                    } else {
                      writeNewMapToData(uid);
                    }
                    // setMapNames("mymap1");
                  }}></AddMapBtn>
              </AllMapSelections>
            </>
          )}
        </MapList>

        {/* <MapNameInput>Overlap</MapNameInput> */}
      </HeaderLeftSet>
      <HeaderRightSet>
        <OverlapSet pointList={pointList} setPointIndex={setPointIndex} setIsShowingSearchResult={setIsShowingSearchResult} setIsShowingSearchBarMB={setIsShowingSearchBarMB} mapState={mapState} isShowingPoint={isShowingPoint} setMapId={setMapId} setOverlapName={setOverlapName} setIsShowingOverlapBtn={setIsShowingOverlapBtn} setIsShowingPoint={setIsShowingPoint} setPopUpMsg={setPopUpMsg} uid={uid} isShowingOverlapBtn={isShowingOverlapBtn} setIsChangingMap={setIsChangingMap} overlapName={overlapName} mapNames={mapNames} setIsShowingPointNotes={setIsShowingPointNotes} setIsShowingPopUp={setIsShowingPopUp}></OverlapSet>

        {(mapState && mapState === -1) || mapState === 4 ? (
          <></>
        ) : (
          <>
            <SearchBar checkResult={checkResult} setPointIndex={setPointIndex} isShowingSearchBarMB={isShowingSearchBarMB} searchInputRef={searchInputRef} searchNameResult={searchNameResult} setIsShowingSearchResult={setIsShowingSearchResult} setSearchValue={setSearchValue} searchName={searchName} searchCountries={searchCountries} setMapState={setMapState} setCurrentMapName={setCurrentMapName} setCountryId={setCountryId} setIsShowingFriends={setIsShowingFriends} setCountryName={setCountryName} getCountryFriends={getCountryFriends} setIsShowingPointNotes={setIsShowingPointNotes} setSearchNameResult={setSearchNameResult}></SearchBar>

            {isShowSearchResult ? <SearchResult setPointIndex={setPointIndex} setIsShowingSearchBarMB={setIsShowingSearchBarMB} searchInputRef={searchInputRef} searchNameResult={searchNameResult} setIsShowingSearchResult={setIsShowingSearchResult} setMapState={setMapState} setCurrentMapName={setCurrentMapName} setCountryId={setCountryId} setIsShowingFriends={setIsShowingFriends} setCountryName={setCountryName} getCountryFriends={getCountryFriends} setIsShowingPointNotes={setIsShowingPointNotes} setSearchNameResult={setSearchNameResult}></SearchResult> : <></>}

            <SearchBtn
              // onChange={(e) => {
              //   searchCountries(e.target.value);
              // }}
              onClick={(e) => {
                // console.log("hi");
                checkResult();
                setIsShowingPointNotes(false);
                setPointIndex(-1);
                searchCountries(searchValue);
                showOneResultFriend();
                if (isShowingSearchBarMB === true && searchValue === "") {
                  setIsShowingSearchBarMB(false);
                } else {
                  setIsShowingSearchBarMB(true);
                }
              }}></SearchBtn>
          </>
        )}
        {mapState && mapState !== -1 ? (
          <LoginBtn
            onClick={() => {
              setIsShowingPopUp(false);
              if (toLogIn) {
                setToLogIn(false);
              } else {
                setToLogIn(true);
              }
            }}>
            {/* {uid && uid ? "Sign Out" : "Sign In"} */}
          </LoginBtn>
        ) : (
          <></>
        )}

        {}
      </HeaderRightSet>
      <Login setNotificationInfo={setNotificationInfo} friendsList={friendsList} setFriendsList={setFriendsList} setMapState={setMapState} uid={uid} toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setCountryList={setCountryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setHaveFriendList={setHaveFriendList} setFriendList={setFriendList} setPointList={setPointList} loginStatus={loginStatus} setLoginStatus={setLoginStatus} userName={userName} setUserName={setUserName} userImage={userImage} originalMapNames={originalMapNames} setMapNames={setMapNames}></Login>
      {/* <Nav></Nav> */}
    </Wrapper>
  );
}

export default Header;
