import React, { useEffect, useState } from "react";
import styled from "styled-components";
import countries from "../utils/countries";
import continent from "./continents1.png";
import search from "./search.png";
import { countryListType, friendListType, haveFriendListType, pointListType } from "../App";
import Login from "./Login";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import PopUp from "./PopUp";

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

const ChangeMapBtn = styled.div`
  height: 40px;
  width: 80px;
  margin: 0 10px;
  /* padding-bottom: 16px; */
  padding-top: 10px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  color: white;

  :hover {
    border-bottom: 1px solid white;
  }
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
  align-items: center;
  /* justify-content: center; */
`;
const HeaderRightSet = styled.div`
  text-align: center;
  display: flex;
  position: relative;
`;

const Back = styled.div`
  position: fixed;
  top: 80px;
  right: 120px;
  z-index: 250;
`;
const HeaderLeftSet = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
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
  position: absolute;
  top: 3px;
  right: 330px;
  height: 50px;
  width: 80px;
  margin: 0 10px;
  /* padding-bottom: 16px; */
  padding-top: 18px;
  padding-bottom: 10px;

  cursor: pointer;
  font-size: 16px;
  text-align: center;
  /* font-weight: ${(props) => (props.isShowingPoint === true ? "400" : "900")}; */
  color: white;
  /* color: ${(props) => (props.isShowingPoint === true ? "rgb(236,174,72)" : "white")}; */

  :hover {
    border-bottom: 1px solid white;
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
};

function Header({ mapState, setMapState, isShowingPoint, setIsShowingPoint, uid, setUid, toLogIn, setToLogIn, countryList, setCountryList, isLoggedIn, setIsLoggedIn, setIsShowingPointNotes, getUserMap2Friends, isShowingFriends, setIsShowingFriends, setCountryId, setCountryName, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, isShowingPopUp, setIsShowingPopUp, loginStatus, setLoginStatus, userName, setUserName, userImage }: HeaderType) {
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
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

  return (
    <Wrapper>
      <HeaderLeftSet>
        <Logo
          mapState={mapState}
          onClick={() => {
            setMapState(-1);
          }}></Logo>
        {mapState && mapState === -1 ? (
          <></>
        ) : (
          <>
            <ChangeMapBtn
              onClick={() => {
                setMapState(1);
                setIsShowingPopUp(false);
              }}>
              Visited
            </ChangeMapBtn>
            <br />
            <ChangeMapBtn
              onClick={() => {
                if (!uid) {
                  setIsShowingPopUp(true);
                  // setToLogIn(true);
                } else {
                  setMapState(2);
                  setIsShowingPointNotes(false);
                  setIsShowingFriends(false);
                }
              }}>
              Friends{" "}
            </ChangeMapBtn>
            <br />
            <ChangeMapBtn
              onClick={() => {
                if (!uid) {
                  setIsShowingPopUp(true);
                  // setToLogIn(true);
                } else {
                  setMapState(3);
                  setIsShowingPoint(true);
                }
              }}>
              My Map
            </ChangeMapBtn>
            {/* names=[{ name: 'Map1', id: 'aaa' }, { name: 'Map2', id: 'bbb' }]*/}
            {/* {names.map((name) => {
              return (
                <ChangeMapBtn
                  onClick={() => {
                    setMapId(name.id)
                    // if (!uid) {
                    //   setIsShowingPopUp(true);
                    //   // setToLogIn(true);
                    // } else {
                    //   setMapState(3);
                    //   setIsShowingPoint(true);
                    // }
                  }}>
                  {name.name}
                </ChangeMapBtn>
              );
            })} */}
          </>
        )}

        {/* <ChangeMapBtn>Overlap</ChangeMapBtn> */}
      </HeaderLeftSet>
      <HeaderRightSet>
        {(mapState && mapState === 1) || mapState === 2 ? (
          <OverlapBtn
            isShowingPoint={isShowingPoint}
            onClick={() => {
              if (isShowingPoint) {
                setIsShowingPoint(false);
              } else {
                setIsShowingPoint(true);
              }
              setIsShowingPointNotes(false);
            }}>
            Overlap
          </OverlapBtn>
        ) : (
          <></>
        )}
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
      <Login friendsList={friendsList} setFriendsList={setFriendsList} setMapState={setMapState} uid={uid} toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setCountryList={setCountryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setHaveFriendList={setHaveFriendList} setFriendList={setFriendList} setPointList={setPointList} loginStatus={loginStatus} setLoginStatus={setLoginStatus} userName={userName} setUserName={setUserName} userImage={userImage}></Login>
    </Wrapper>
  );
}

export default Header;
