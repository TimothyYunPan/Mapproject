import React, { useState, useRef } from "react";
import styled from "styled-components";
import countries from "../../utils/countries";
import continent from "../icon/continents1.png";
import search from "../icon/search.png";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "../../App";
import Login from "./Login";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import sortDown from "../icon/sortDown.png";
import addIcon from "../icon/addIcon.png";
import editIcon from "../icon/edit.png";
import editHoverIcon from "../icon/editHover.png";
import deleteIcon from "../icon/trashCan.png";
import deleteHoverIcon from "../icon/trashCanHover.png";
import okIcon from "../icon/okIcon.png";
import ChangeMapBtn from "./ChangeMapBtn";
import OverlapSet from "./OverlapSet";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import userProfile from "../icon/userProfile.png";
const Logo = styled.div<{ mapState: number }>`
  margin-top: ${(props) => (props.mapState === -1 ? "20px" : "0px")};
  width: ${(props) => (props.mapState === -1 ? "100px" : "70px")};
  height: ${(props) => (props.mapState === -1 ? "100px" : "70px")};
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
    margin-top: 10px;
  }
`;

export const MapNameInput = styled.input`
  height: 30px;
  width: 200px;
  margin-top: 10px;
  padding-left: 10px;
  cursor: pointer;
  word-spacing: 6px;
  font-size: 16px;
  color: white;
  text-align: left;
  outline: none;
  border: 1px solid white;
  border-radius: 8px;
  background-color: rgba(225, 225, 225, 0.2);
  backdrop-filter: blur(100px);
  &:nth-child(1) {
  }

  :hover {
    color: rgb(236, 174, 72);
  }
`;

const MapNameInputFirst = styled(MapNameInput)`
  margin-top: 0;
`;

export const ChangeMapBtnSet = styled.div`
  display: flex;
  align-items: center;
  position: relative;
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
`;

const HeaderBtnStyle = styled.div`
  margin-top: 20px;
  height: 14px;
  width: 14px;
  background-position: center;
  background-size: cover;
  cursor: pointer;
`;

const AddMapBtn = styled(HeaderBtnStyle)<{ isChangingMap: boolean }>`
  background-image: url(${addIcon});
  display: ${(props) => (props.isChangingMap ? "block" : "none")};
`;

export const EditMapBtn = styled(HeaderBtnStyle)`
  background-image: url(${editIcon});
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
  :hover {
    top: 18px;
  }
`;

const CurrentMap = styled.div<{ mapState: number }>`
  height: 60px;
  width: 220px;
  padding-bottom: 16px;
  padding-top: 20px;
  word-spacing: 6px;
  font-size: 19px;
  color: white;
  text-align: left;
  cursor: pointer;
  :hover {
    color: rgb(236, 174, 72);
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
`;

const MapBlockSet = styled.div<{ isChangingMap: boolean }>`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  max-height: ${(props) => (props.isChangingMap ? 484 : 0)}px;
  transition: 0.4s;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  width: 220px;
`;

const AllMapSelections = styled.div<{ isChangingMap: boolean }>`
  width: 220px;
  position: absolute;
  top: 45px;
  /* height: ${(props) => (props.isChangingMap ? 200 : 0)}px; */
  overflow: ${(props) => (props.isChangingMap ? "visible" : "hidden")};
  transition: 0.4s;
  @media (max-width: 1020px) {
    left: 0px;
  }
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
  @media (max-width: 550px) {
    height: 28px;
    width: 28px;
    top: 20px;
    border-radius: 50%;
    border: 1px solid white;
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const LoginBtn = styled.div<{ userImage: string }>`
  height: 42px;
  width: 42px;
  padding-top: 21px;
  margin: 10px -12px 14px 0px;
  font-size: 16px;
  border-radius: 50%;
  border: ${(props) => (props.userImage ? "1px solid white" : "none")};
  cursor: pointer;
  color: white;
  background-image: ${(props) => (props.userImage ? `url(${props.userImage})` : `url(${userProfile})`)};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: 0.5s;
  :hover {
  }
  @media (max-width: 550px) {
    margin: 20px 5px 0 0;
    height: 28px;
    width: 28px;
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
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void } | { (index: number): void })[]>>;
  deleteMap: string;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  currentMapName: string;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingMap: boolean;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  setUserImg: React.Dispatch<React.SetStateAction<string>>;
};

function Header({ mapState, setMapState, isShowingPoint, setIsShowingPoint, uid, setUid, toLogIn, setToLogIn, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, getCountryFriends, isShowingFriends, setIsShowingFriends, setCountryId, setCountryName, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, userName, setUserName, userImage, setMapId, mapNames, setMapNames, originalMapNames, setOriginalMapNames, mapId, setPopUpMsg, deleteMap, setDeleteMap, pointList, setNotificationInfo, setCurrentMapName, currentMapName, isChangingMap, setIsChangingMap, setPointIndex, setUserImg }: HeaderType) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isEditingMap, setIsEditingMap] = useState<number>(-1);
  const [isShowingOverlapBtn, setIsShowingOverlapBtn] = useState<boolean>(false);
  const [overlapName, setOverlapName] = useState<string>("Overlap with...");
  const [searchNameResult, setSearchNameResult] = useState<friendListType[]>([]);
  const [isShowingSearchBarMB, setIsShowingSearchBarMB] = useState<boolean>(false);
  const [isShowSearchResult, setIsShowingSearchResult] = useState<boolean>();
  const [hasCountry, setHasCountry] = useState<boolean>(true);
  const [hasName, setHasName] = useState<boolean>(true);
  const Map1NameRef = useRef<HTMLInputElement>(null);
  const Map2NameRef = useRef<HTMLInputElement>(null);
  const Map3NameRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function checkResult() {
    if (!hasName && !hasCountry) {
      setHasCountry(true);
      setHasName(true);
      setNotificationInfo({ text: "no result", status: true });
      setTimeout(() => {
        setNotificationInfo({ text: "", status: false });
      }, 2000);
    }
  }
  function searchCountries(searchValue: string) {
    const result = countries.filter(function (obj) {
      return obj.name.toLowerCase() === searchValue.toLowerCase();
    });
    if (result[0]) {
      setCountryName(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
      let a = result[0].code;
      getCountryFriends(a);
      setCountryId(a);
      setIsShowingFriends(true);
      document.getElementById(a)!.style.fill = "rgb(236,174,72)";
      setHasCountry(true);
    } else {
      // console.log("查無資料");
      setHasCountry(false);
    }
  }

  function searchName(searchValue: string) {
    const result = friendsList.filter(function (obj) {
      return obj.name.toLowerCase() === searchValue.toLowerCase();
    });
    if (!result[0]) {
      setHasName(false);
      // console.log("查無資料");
      setIsShowingSearchResult(false);
      setSearchNameResult([]);
    } else {
      setIsShowingSearchResult(true);
      setSearchNameResult(result);
      setHasName(true);
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
      searchInputRef.current!.value = "";
    } else {
      // console.log("查無資料");
    }
    setPointIndex(-1);
  }

  async function writeNewMapToData(uid: string) {
    let newId = uuidv4();
    let name = { id: newId, name: "new Map" };
    await setDoc(doc(db, "user", uid), { names: arrayUnion(name) }, { merge: true });
    if (mapNames === undefined) {
      setMapNames([name]);
    } else {
      setMapNames([...mapNames, name]);
    }
  }
  async function updateNewMapName(i: number, mapId: string, Ref: any) {
    let newNames = [...originalMapNames];
    newNames[i].name = Ref.current!.value;
    await setDoc(doc(db, "user", uid), { originalMap: newNames }, { merge: true });
    setOriginalMapNames(newNames);
  }
  return (
    <Wrapper>
      <HeaderLeftSet>
        <Logo
          mapState={mapState}
          onClick={() => {
            setIsShowingFriends(false);
            setMapState(-1);
          }}
        />
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
          }}
        />
        <MapList>
          {mapState && mapState !== -1 && (
            <>
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
              </CurrentMap>
              <CheckMapsBtn
                isChangingMap={isChangingMap}
                onClick={() => {
                  if (isChangingMap) {
                    setIsChangingMap(false);
                  } else {
                    setIsChangingMap(true);
                  }
                  setIsShowingOverlapBtn(false);
                }}
              />
              <AllMapSelections isChangingMap={isChangingMap}>
                <MapBlockSet isChangingMap={isChangingMap}>
                  <ChangeMapBtnSet>
                    <MapNameInputFirst
                      readOnly={true}
                      ref={Map1NameRef}
                      defaultValue={originalMapNames[0].name}
                      onClick={() => {
                        if (isEditingMap === -1) {
                          setIsChangingMap(false);
                        } else {
                          setIsChangingMap(true);
                        }
                        setCurrentMapName("Visited Countries Map");
                        setMapState(1);
                        setIsShowingPopUp(false);
                        if (mapState !== 2) {
                          setPointIndex(-1);
                          setIsShowingPointNotes(false);
                          setPointIndex(-1);
                          setIsShowingPoint(false);
                        }
                      }}
                    />
                  </ChangeMapBtnSet>
                  <ChangeMapBtnSet>
                    <MapNameInput
                      ref={Map2NameRef}
                      readOnly={true}
                      defaultValue={originalMapNames[1].name}
                      onClick={() => {
                        if (!uid) {
                          setIsShowingPopUp(true);
                          setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                          // setToLogIn(true);
                        } else {
                          if (isEditingMap === -1) {
                            setIsChangingMap(false);
                          } else {
                            setIsChangingMap(true);
                          }
                          setCurrentMapName("Friends Located Map");

                          setMapState(2);
                          setIsShowingFriends(false);
                          if (mapState !== 1) {
                            setIsShowingPointNotes(false);
                            setPointIndex(-1);
                            setIsShowingPoint(false);
                          }
                        }
                      }}
                    />
                  </ChangeMapBtnSet>
                  <ChangeMapBtnSet>
                    <MapNameInput
                      ref={Map3NameRef}
                      readOnly={true}
                      defaultValue={originalMapNames[2].name}
                      onClick={() => {
                        if (!uid) {
                          setIsShowingPopUp(true);
                          setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
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
                        }
                      }}
                    />
                  </ChangeMapBtnSet>
                  {mapNames &&
                    mapNames.map((mapName, index) => {
                      return <ChangeMapBtn setPointIndex={setPointIndex} setNotificationInfo={setNotificationInfo} setIsShowingPopUp={setIsShowingPopUp} setPopUpMsg={setPopUpMsg} setDeleteMap={setDeleteMap} mapId={mapId} uid={uid} mapNames={mapNames} setMapNames={setMapNames} index={index} mapName={mapName} setIsShowingPointNotes={setIsShowingPointNotes} setPointList={setPointList} setIsChangingMap={setIsChangingMap} setMapId={setMapId} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} setCurrentMapName={setCurrentMapName} setOverlapName={setOverlapName} />;
                    })}
                </MapBlockSet>
                <AddMapBtn
                  isChangingMap={isChangingMap}
                  onClick={() => {
                    if (!uid) {
                      setIsShowingPopUp(true);
                      setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                    } else if (mapNames && mapNames.length > 6) {
                      setNotificationInfo({ text: `You have maximum of 10 maps only`, status: true });
                      setTimeout(() => {
                        setNotificationInfo({ text: "", status: false });
                      }, 3000);
                    } else {
                      writeNewMapToData(uid);
                    }
                  }}
                />
              </AllMapSelections>
            </>
          )}
        </MapList>
      </HeaderLeftSet>
      <HeaderRightSet>
        <OverlapSet pointList={pointList} setPointIndex={setPointIndex} setIsShowingSearchResult={setIsShowingSearchResult} setIsShowingSearchBarMB={setIsShowingSearchBarMB} mapState={mapState} isShowingPoint={isShowingPoint} setMapId={setMapId} setOverlapName={setOverlapName} setIsShowingOverlapBtn={setIsShowingOverlapBtn} setIsShowingPoint={setIsShowingPoint} setPopUpMsg={setPopUpMsg} uid={uid} isShowingOverlapBtn={isShowingOverlapBtn} setIsChangingMap={setIsChangingMap} overlapName={overlapName} mapNames={mapNames} setIsShowingPointNotes={setIsShowingPointNotes} setIsShowingPopUp={setIsShowingPopUp} />
        {(mapState && mapState === -1) || mapState === 4 ? (
          <></>
        ) : (
          <>
            <SearchBar checkResult={checkResult} setPointIndex={setPointIndex} isShowingSearchBarMB={isShowingSearchBarMB} ref={searchInputRef} searchNameResult={searchNameResult} setIsShowingSearchResult={setIsShowingSearchResult} setSearchValue={setSearchValue} searchName={searchName} searchCountries={searchCountries} setMapState={setMapState} setCurrentMapName={setCurrentMapName} setCountryId={setCountryId} setIsShowingFriends={setIsShowingFriends} setCountryName={setCountryName} getCountryFriends={getCountryFriends} setIsShowingPointNotes={setIsShowingPointNotes} setSearchNameResult={setSearchNameResult} />
            {isShowSearchResult && <SearchResult setPointIndex={setPointIndex} setIsShowingSearchBarMB={setIsShowingSearchBarMB} inputElement={searchInputRef.current} searchNameResult={searchNameResult} setIsShowingSearchResult={setIsShowingSearchResult} setMapState={setMapState} setCurrentMapName={setCurrentMapName} setCountryId={setCountryId} setIsShowingFriends={setIsShowingFriends} setCountryName={setCountryName} getCountryFriends={getCountryFriends} setIsShowingPointNotes={setIsShowingPointNotes} setSearchNameResult={setSearchNameResult} />}
            <SearchBtn
              onClick={(e) => {
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
              }}
            />
          </>
        )}
        {mapState && mapState !== -1 && (
          <LoginBtn
            userImage={userImage}
            onClick={() => {
              setIsShowingPopUp(false);
              if (toLogIn) {
                setToLogIn(false);
              } else {
                setToLogIn(true);
              }
              setIsChangingMap(false);
              setIsShowingOverlapBtn(false);
              setIsShowingSearchBarMB(false);
            }}
          />
        )}
      </HeaderRightSet>
      <Login setUserImg={setUserImg} setNotificationInfo={setNotificationInfo} setFriendsList={setFriendsList} setMapState={setMapState} uid={uid} toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setCountryList={setCountryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setHaveFriendList={setHaveFriendList} setFriendList={setFriendList} setPointList={setPointList} loginStatus={loginStatus} setLoginStatus={setLoginStatus} userName={userName} setUserName={setUserName} userImage={userImage} originalMapNames={originalMapNames} setMapNames={setMapNames} />
    </Wrapper>
  );
}

export default Header;
