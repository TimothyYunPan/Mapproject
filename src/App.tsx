import WorldMap from "./WorldMap";
import Header from "./components/Header";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components";
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

function App() {
  const [countryList, setCountryList] = useState<countryListType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  console.log(isLoggedIn);
  const [mapState, setMapState] = useState<number>(0);
  const [isShowingPoint, setIsShowingPoint] = useState<boolean>(false);
  const [toLogIn, setToLogIn] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");

  console.log(toLogIn);

  return (
    <>
      {/* <Reset /> */}
      <GlobalStyleComponent />
      <Header toLogIn={toLogIn} setToLogIn={setToLogIn} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} countryList={countryList} setCountryList={setCountryList} uid={uid} setUid={setUid} mapState={mapState} setMapState={setMapState} isShowingPoint={isShowingPoint} setIsShowingPoint={setIsShowingPoint} />
      <WorldMap isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} countryList={countryList} setCountryList={setCountryList} uid={uid} setUid={setUid} toLogIn={toLogIn} setToLogIn={setToLogIn} mapState={mapState} setMapState={setMapState} isShowingPoint={isShowingPoint} setIsShowingPoint={setIsShowingPoint} />
    </>
  );
}

export default App;
