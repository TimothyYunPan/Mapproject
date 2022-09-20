import React, { useEffect, useState } from "react";
import styled from "styled-components";
import countries from "../utils/countries";
import continent from "./continents1.png";
import search from "./search.png";
import { countryListType } from "../App";
import Login from "./Login";

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
const LoginSet = styled.div`
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
const ChangeMapBtnSet = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const SearchBtn = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  top: 25px;
  right: 90px;
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
  right: 130px;
  border-radius: 5%;
  top: 20px;
  z-index: 100;
  color: rgb(42, 60, 77);
`;
const LoginBtn = styled.div`
  height: 40px;
  width: 80px;
  padding-top: 10px;
  font-size: 16px;
  margin-top: 15px;
  cursor: pointer;
  color: white;
  :hover {
    border-bottom: 1px solid white;
  }
`;
type HeaderType = {
  mapState: number;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  isShowingPoint: boolean;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setUid: React.Dispatch<React.SetStateAction<string>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ mapState, setMapState, isShowingPoint, setIsShowingPoint, uid, setUid, toLogIn, setToLogIn, countryList, setCountryList, isLoggedIn, setIsLoggedIn }: HeaderType) {
  const [searchCountry, setSearchCountry] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  function searchCountries() {
    const result = countries.filter(function (obj) {
      return obj.name == searchValue;
    });
    console.log(result);
    let a = result[0].code;
    // setSearchCountry(a);
    if (a) {
      // document.getElementById(a)!.style.scale = "2px";
      document.getElementById(a)!.style.fill = "rgb(236,174,72)";
    }
    // countries.forEach((country)=>{

    // })
  }

  return (
    <Wrapper>
      <ChangeMapBtnSet>
        <Logo
          mapState={mapState}
          onClick={() => {
            setMapState(1);
          }}></Logo>
        {mapState && mapState === -1 ? (
          <></>
        ) : (
          <>
            <ChangeMapBtn
              onClick={() => {
                setMapState(1);
                setIsShowingPoint(false);
              }}>
              Visited
            </ChangeMapBtn>
            <br />
            <ChangeMapBtn
              onClick={() => {
                if (!uid) {
                  setToLogIn(true);
                } else {
                  setMapState(2);
                }
              }}>
              Friends{" "}
            </ChangeMapBtn>
            <br />
            <ChangeMapBtn
              onClick={() => {
                if (!uid) {
                  setToLogIn(true);
                } else {
                  setMapState(3);
                  setIsShowingPoint(true);
                }
              }}>
              My Map
            </ChangeMapBtn>
          </>
        )}

        {/* <ChangeMapBtn>Overlap</ChangeMapBtn> */}
      </ChangeMapBtnSet>
      <LoginSet>
        {(mapState && mapState === -1) || mapState === 4 ? (
          <></>
        ) : (
          <>
            <SearchInput
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
      </LoginSet>

      {toLogIn && toLogIn ? (
        <>
          <Login setMapState={setMapState} uid={uid} toLogIn={toLogIn} setToLogIn={setToLogIn} countryList={countryList} setCountryList={setCountryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Login>
          <Back
            onClick={() => {
              setToLogIn(false);
            }}>
            X
          </Back>{" "}
        </>
      ) : (
        <></>
      )}
    </Wrapper>
  );
}

export default Header;
