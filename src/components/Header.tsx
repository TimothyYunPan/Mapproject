import React, { useEffect, useState, useRef, SetStateAction } from "react";
import styled from "styled-components";
import countries from "../utils/countries";
import continent from "./continents1.png";
import search from "./search.png";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType } from "../App";
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
import Overlap from "./Overlap";

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
`;

export const MapNameInput = styled.input`
  height: 30px;
  width: 100%;
  /* margin-top: 0 10px; */
  /* padding-bottom: 16px; */
  /* padding-left: 10px; */
  /* padding-top: 20px; */
  cursor: pointer;
  word-spacing: 6px;
  font-size: 16px;
  color: white;
  text-align: left;
  outline: none;
  border: none;
  /* line-height: 5px; */
  background-color: inherit;
  /* border: 1px solid white; */
  :hover {
    color: rgb(236, 174, 72);
    /* border-bottom: 1px solid white; */
  }
`;

export const ChangeMapBtnSet = styled.div`
  display: flex;
  align-items: center;
  /* width: 100%; */
  /* margin-top: 20px; */
`;

const CheckMapsBtn = styled.div`
  height: 12px;
  width: 12px;
  position: absolute;
  left: 325px;
  top: 28px;
  background-position: center;
  background-size: cover;
  background-image: url(${sortDown});
  cursor: pointer;
`;

const CheckOverLapBtn = styled.div`
  height: 12px;
  width: 12px;
  margin-top: 28px;
  background-position: center;
  background-size: cover;
  background-image: url(${sortDown});
  cursor: pointer;
  z-index: 200;
  /* margin-right: 10px; */
`;

const OverlapSet = styled.div`
  display: flex;
  /* align-items: center; */
  width: 110px;
  justify-content: space-between;
`;

const AddMapBtn = styled.div`
  /* margin: 0 auto; */
  margin-top: 20px;
  height: 14px;
  width: 14px;
  /* padding-left: 5px; */
  background-position: center;
  background-size: cover;
  background-image: url(${addIcon});
  cursor: pointer;
`;

export const EditMapBtn = styled(AddMapBtn)`
  background-image: url(${editIcon});
  /* margin-left: 20px; */
  margin-top: 0px;
  :hover {
    background-image: url(${editHoverIcon});
    margin-top: 0px;
  }
`;

export const DeleteMapBtn = styled(AddMapBtn)`
  background-image: url(${deleteIcon});
  /* margin-left: 20px; */
  margin-top: 0px;
  :hover {
    background-image: url(${deleteHoverIcon});
    margin-top: 0px;
  }
`;
export const OkIcon = styled(AddMapBtn)`
  background-image: url(${okIcon});
  margin-top: 0px;
  margin-right: 10px;
`;

const CurrentMap = styled.div`
  height: 40px;
  width: 220px;
  /* margin: 0 10px; */
  padding-bottom: 16px;
  padding-top: 20px;
  word-spacing: 6px;
  font-size: 19px;
  color: white;
  text-align: left;
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
`;
const HeaderRightSet = styled.div`
  width: 450px;
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

const MapBlockSet = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const SearchBtn = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  top: 22px;
  right: 100px;
  z-index: 150;
  border-radius: 5%;
  line-height: 24px;
  cursor: pointer;
  padding-top: 8px;
  background-image: url(${search});
  background-size: cover;
`;
const SearchInput = styled.input`
  position: absolute;
  height: 30px;
  width: 180px;
  right: 140px;
  border-radius: 20px;
  top: 18px;
  z-index: 100;
  color: rgb(42, 60, 77);
  border: 1px solid white;
  padding-left: 10px;
  background-color: inherit;
  color: white;
`;
const LoginBtn = styled.div`
  height: 50px;
  width: 80px;
  padding-top: 21px;
  padding-bottom: 14px;
  font-size: 16px;
  /* margin-top: 15px; */
  cursor: pointer;
  color: white;
  :hover {
    border-bottom: 1px solid white;
  }
`;

const OverlapBtn = styled.div<{ isShowingPoint: boolean }>`
  position: relative;
  /* top: 3px;
  right: 330px; */
  height: 50px;
  width: 150px;
  /* padding-bottom: 16px; */
  padding-top: 18px;
  /* padding-bottom: 10px; */

  cursor: pointer;
  font-size: 16px;
  text-align: left;
  /* font-weight: ${(props) => (props.isShowingPoint === true ? "400" : "900")}; */
  color: white;
  /* color: ${(props) => (props.isShowingPoint === true ? "rgb(236,174,72)" : "white")}; */

  :hover {
    /* border-bottom: 1px solid white; */
  }
`;

const OverlapList = styled.div`
  width: 80px;
  height: 50px;
  display: flex;
  flex-direction: column;
  margin-top: 6px;
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
  getUserMap2Friends: (id: string) => void;
  isShowingFriends: boolean;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  friendsList: friendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
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
};

function Header({ mapState, setMapState, isShowingPoint, setIsShowingPoint, uid, setUid, toLogIn, setToLogIn, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, getUserMap2Friends, isShowingFriends, setIsShowingFriends, setCountryId, setCountryName, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, userName, setUserName, userImage, setMapId, mapNames, setMapNames, originalMapNames, setOriginalMapNames, mapId }: HeaderType) {
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentMap, setCurrentMap] = useState<string>("Visited Countries Map");
  const [isChangingMap, setIsChangingMap] = useState<boolean>(false);
  const [isEditingMap, setIsEditingMap] = useState<number>(-1);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isShowingOverLapBtn, setIsShowingOverLapBtn] = useState<boolean>(false);
  const [overlapName, setOverlapName] = useState<string>("Overlap");
  const [map3Name, setMap3Name] = useState<string>("My Map");
  const Map1NameRef = useRef<HTMLInputElement | SetStateAction<string>>("Visited Countries");
  const Map2NameRef = useRef<HTMLInputElement | SetStateAction<string>>("Friends Located");
  const Map3NameRef = useRef<HTMLInputElement | SetStateAction<string>>("My Map");

  // useEffect(() => {}, [mapNames]);
  function searchCountries() {
    const result = countries.filter(function (obj) {
      return obj.name.toLowerCase() == searchValue.toLowerCase();
    });
    if (result[0]) {
      setCountryName(searchValue.charAt(0).toUpperCase() + searchValue.slice(1));
      let a = result[0].code;
      getUserMap2Friends(a);
      setCountryId(a);
      setIsShowingFriends(true);
      // document.getElementById(a)!.style.scale = "2px";
      document.getElementById(a)!.style.fill = "rgb(236,174,72)";
    } else {
      searchName();
    }

    // setSearchCountry(a);
  }
  async function searchName() {
    const countriesRef = collection(db, "user", uid, "friendsLocatedCountries");
    const q = query(countriesRef, where("searchName", "array-contains", searchValue));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      getUserMap2Friends(doc.id);
      setIsShowingFriends(true);
      setCountryId(doc.id);
      setCountryName(doc.data().friends[0].country);
      console.log("hi");
    });
  }
  // countries.forEach((country)=>{
  // })
  async function writeNewMapToData(uid: string) {
    let newId = uuidv4();
    // mapNames.push({ id: newId, name: "new Map" });
    let name = { id: newId, name: "new Map" };
    await setDoc(doc(db, "user", uid), { names: arrayUnion(name) }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    console.log(mapNames);
    if (mapNames === undefined) {
      setMapNames([name]);
    } else {
      setMapNames([...mapNames, name]);
    }
  }
  async function updateNewMapName(i: number, mapId: string, Ref: any) {
    let newNames = [...originalMapNames];
    console.log(newNames);
    newNames[i].name = Ref.current!.value;
    await setDoc(doc(db, "user", uid), { originalMap: newNames }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    setOriginalMapNames(newNames);
  }
  console.log(mapNames);
  console.log(Map1NameRef);
  return (
    <Wrapper>
      <HeaderLeftSet>
        <Logo
          mapState={mapState}
          onClick={() => {
            setMapState(-1);
          }}></Logo>
        <MapList>
          {mapState && mapState !== -1 ? (
            <>
              {" "}
              <CurrentMap>{currentMap}</CurrentMap>{" "}
              <CheckMapsBtn
                onClick={() => {
                  if (isChangingMap) {
                    setIsChangingMap(false);
                  } else {
                    setIsChangingMap(true);
                  }
                  setIsShowingOverLapBtn(false);
                }}></CheckMapsBtn>
            </>
          ) : (
            <></>
          )}
          {isChangingMap ? (
            <>
              {mapState && mapState === -1 ? (
                <></>
              ) : (
                <>
                  <MapBlockSet>
                    <ChangeMapBtnSet>
                      <MapNameInput
                        ref={Map1NameRef}
                        readOnly={isReadOnly}
                        defaultValue={originalMapNames[0].name}
                        onClick={() => {
                          if (isEditingMap === -1) {
                            setIsChangingMap(false);
                          } else {
                            setIsChangingMap(true);
                          }
                          setCurrentMap("Visited Countries Map");
                          setMapState(1);
                          setIsShowingPopUp(false);
                          if (mapState !== 2) {
                            setIsShowingPointNotes(false);
                            setIsShowingPoint(false);
                          }
                        }}>
                        {/* Visited Countries Map */}
                      </MapNameInput>

                      {isEditingMap && isEditingMap === 1 ? (
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
                      )}
                    </ChangeMapBtnSet>
                    <ChangeMapBtnSet>
                      <MapNameInput
                        ref={Map2NameRef}
                        readOnly={isReadOnly}
                        defaultValue={originalMapNames[1].name}
                        onClick={() => {
                          if (!uid) {
                            setIsShowingPopUp(true);
                            // setToLogIn(true);
                          } else {
                            if (isEditingMap === -1) {
                              setIsChangingMap(false);
                            } else {
                              setIsChangingMap(true);
                            }
                            setCurrentMap("Friends Located Map");
                            setMapState(2);
                            setIsShowingFriends(false);
                            if (mapState !== 1) {
                              setIsShowingPointNotes(false);
                              setIsShowingPoint(false);
                            }
                          }
                        }}>
                        {/* Friends Located Map{" "} */}
                      </MapNameInput>
                      {isEditingMap && isEditingMap === 2 ? (
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
                      )}
                    </ChangeMapBtnSet>
                    <ChangeMapBtnSet>
                      <MapNameInput
                        ref={Map3NameRef}
                        readOnly={isReadOnly}
                        defaultValue={originalMapNames[2].name}
                        onChange={(e) => {
                          setMap3Name(e.target.value);
                        }}
                        onClick={() => {
                          if (!uid) {
                            setIsShowingPopUp(true);
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
                            setCurrentMap(map3Name);
                            setMapState(3);
                            setIsShowingPoint(true);
                            setIsShowingPointNotes(false);
                            // setIsShowingPoint(false);
                          }
                        }}>
                        {/* My Map */}
                      </MapNameInput>
                      {isEditingMap && isEditingMap === 3 ? (
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
                      )}
                    </ChangeMapBtnSet>
                  </MapBlockSet>
                  {/* names=[{ name: 'Map1', id: 'aaa' }, { name: 'Map2', id: 'bbb' }]*/}
                  {mapNames &&
                    mapNames.map((mapName, index) => {
                      console.log(mapName);
                      return (
                        <>
                          <ChangeMapBtn mapId={mapId} uid={uid} mapNames={mapNames} setMapNames={setMapNames} index={index} mapName={mapName} setIsShowingPointNotes={setIsShowingPointNotes} setPointList={setPointList} setIsChangingMap={setIsChangingMap} setMapId={setMapId} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} setCurrentMap={setCurrentMap} isEditingMap={isEditingMap} setIsEditingMap={setIsEditingMap} setOverlapName={setOverlapName}></ChangeMapBtn>
                        </>
                      );
                    })}
                  <AddMapBtn
                    onClick={() => {
                      if (!uid) {
                        setIsShowingPopUp(true);
                        // setToLogIn(true);
                      } else {
                        writeNewMapToData(uid);
                      }
                      // setMapNames("mymap1");
                    }}></AddMapBtn>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </MapList>

        {/* <MapNameInput>Overlap</MapNameInput> */}
      </HeaderLeftSet>
      <HeaderRightSet>
        <OverlapSet>
          {mapState && mapState <= 2 && mapState !== -1 ? (
            <>
              <OverlapList>
                <OverlapBtn
                  isShowingPoint={isShowingPoint}
                  onClick={() => {
                    // if (isShowingOverLapBtn) {
                    //   setIsShowingOverLapBtn(false);
                    // } else {
                    //   setIsShowingOverLapBtn(true);
                    // }
                    setIsShowingOverLapBtn(false);
                    setIsShowingPointNotes(false);

                    if (isShowingPoint) {
                      setIsShowingPoint(false);
                    } else {
                      setIsShowingPoint(true);
                    }
                  }}>
                  {overlapName}
                </OverlapBtn>
                {isShowingOverLapBtn ? (
                  <>
                    <OverlapBtn
                      isShowingPoint={isShowingPoint}
                      onClick={() => {
                        if (!uid) {
                          setIsShowingPopUp(true);
                          // setToLogIn(true);
                        } else {
                          setMapId("custimizedMap");
                          setOverlapName(map3Name);
                          setIsShowingOverLapBtn(false);
                          setIsShowingPoint(true);
                        }
                      }}>
                      {map3Name}
                      {/* {Map1NameRef.current.value} */}
                    </OverlapBtn>
                    {mapNames &&
                      mapNames.map((mapName, index) => {
                        return (
                          <>
                            <OverlapBtn
                              isShowingPoint={isShowingPoint}
                              onClick={() => {
                                setMapId(mapName.id);
                                setOverlapName(mapName.name);
                                setIsShowingPointNotes(false);
                                setIsShowingOverLapBtn(false);
                                // if (isShowingPoint) {
                                //   setIsShowingPoint(false);
                                // } else {
                                //   setIsShowingPoint(true);
                                // }
                                setIsShowingPointNotes(false);
                                setIsShowingPoint(true);
                              }}>
                              {mapName.name}
                            </OverlapBtn>
                            {/* <ChangeMapBtn uid={uid} mapNames={mapNames} setMapNames={setMapNames} index={index} mapName={mapName} setIsShowingPointNotes={setIsShowingPointNotes} setPointList={setPointList} setIsChangingMap={setIsChangingMap} setMapId={setMapId} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} setCurrentMap={setCurrentMap} isEditingMap={isEditingMap} setIsEditingMap={setIsEditingMap}></ChangeMapBtn> */}
                          </>
                        );
                      })}{" "}
                  </>
                ) : (
                  <></>
                )}
              </OverlapList>
              <CheckOverLapBtn
                onClick={() => {
                  if (isShowingOverLapBtn) {
                    setIsShowingOverLapBtn(false);
                  } else {
                    setIsShowingOverLapBtn(true);
                  }
                  setIsChangingMap(false);
                }}></CheckOverLapBtn>
            </>
          ) : (
            <></>
          )}
        </OverlapSet>

        {(mapState && mapState === -1) || mapState === 4 ? (
          <></>
        ) : (
          <>
            {mapState === 2 ? (
              <SearchInput
                placeholder="country / friend"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    setSearchValue(target.value);
                    searchCountries();
                  }
                }}></SearchInput>
            ) : (
              <SearchInput
                placeholder="country"
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    setSearchValue(target.value);
                    searchCountries();
                  }
                }}></SearchInput>
            )}

            <SearchBtn
              onClick={(e) => {
                searchCountries();
              }}></SearchBtn>
          </>
        )}
        {uid && uid ? (
          <LoginBtn
            onClick={() => {
              // setMapState(4);
              // LogOut();

              setToLogIn(true);
            }}>
            Log Out
          </LoginBtn>
        ) : (
          <LoginBtn
            onClick={() => {
              // setMapState(4);
              setToLogIn(true);
            }}>
            Log In
          </LoginBtn>
        )}
        {}
      </HeaderRightSet>
      <Login friendsList={friendsList} setFriendsList={setFriendsList} setMapState={setMapState} uid={uid} toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setCountryList={setCountryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setHaveFriendList={setHaveFriendList} setFriendList={setFriendList} setPointList={setPointList} loginStatus={loginStatus} setLoginStatus={setLoginStatus} userName={userName} setUserName={setUserName} userImage={userImage} originalMapNames={originalMapNames} setMapNames={setMapNames}></Login>
    </Wrapper>
  );
}

export default Header;
