import React, { useEffect, useState, useRef, SetStateAction } from "react";
import styled from "styled-components";
import { mapNameType } from "../App";
import sortDown from "./sortDown.png";
import eyeOpened from "../components/eyeOpened.png";
import eyeClosed from "../components/eyeClosed.png";

const ShowOverLapBtn = styled.div<{ isShowingPoint: boolean }>`
  height: 20px;
  width: 20px;
  position: absolute;
  left: -35px;
  top: 22px;
  background-position: center;
  background-size: cover;
  /* background-image: url(${eyeOpened}); */
  cursor: pointer;
  background-image: ${(props) => (props.isShowingPoint ? `url(${eyeOpened})` : `url(${eyeClosed})`)};
  transition: 0.3s;
  :hover {
    /* background-image: url(${eyeClosed}); */
  }
  @media (max-width: 700px) {
    height: 28px;
    width: 28px;
    background-size: 20px;
    background-repeat: no-repeat;

    border: 1px solid white;
    border-radius: 50%;
    /* padding: 20px; */
    left: 5px;
  }
`;

const OverlapSetBox = styled.div`
  display: flex;
  /* align-items: center; */
  width: 150px;
  justify-content: space-between;
`;

const OverlapBtn = styled.div<{ isShowingPoint: boolean; mapState: number }>`
  position: relative;
  /* top: 3px;
  right: 330px; */
  /* height: 50px; */
  width: 150px;
  /* padding-bottom: 16px; */
  margin-bottom: 10px;
  padding-left: 10px;
  border: 1px solid white;
  border-radius: 8px;
  /* text-align: center; */
  /* background-color: rgba(0, 0, 0, 0.5); */
  /* filter: (3px); */
  backdrop-filter: blur(100px);
  background-color: rgba(225, 225, 225, 0.2);
  /* background-color: ${(props) => (props.mapState === 2 ? "rgba(0,0,0,0.4)" : "rgba(225, 225, 225, 0.2)")}; */

  cursor: pointer;
  font-size: 16px;
  text-align: left;
  /* font-weight: ${(props) => (props.isShowingPoint === true ? "400" : "900")}; */
  color: white;
  /* color: ${(props) => (props.isShowingPoint === true ? "rgb(236,174,72)" : "white")}; */

  :hover {
    /* color: ${(props) => (props.mapState === 2 ? "rgba(102,255,229,.8)" : "rgb(236, 174, 72)")}; */
    color: rgb(236, 174, 72);
    /* border-bottom: 1px solid white; */
  }
`;

const OverlapList = styled.div<{ isShowingOverlapBtn: boolean }>`
  /* width: 80px; */
  position: absolute;
  height: ${(props) => (props.isShowingOverlapBtn === true ? "200" : "0")}px;
  display: flex;
  flex-direction: column;
  top: 60px;
  overflow: ${(props) => (props.isShowingOverlapBtn === true ? "scroll" : "hidden")};
  transition: 0.3s;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const CurrentOverlap = styled.div<{ isShowingPoint: boolean }>`
  width: 100%;
  font-size: 16px;
  backdrop-filter: blur(100px);
  border: 1px solid white;
  border-radius: 8px;
  background-color: rgba(225, 225, 225, 0.2);
  margin-top: 20px;
  padding-left: 10px;
  height: 25px;
  cursor: pointer;
  text-align: left;
  color: white;
  @media (max-width: 700px) {
    display: none;
  }
`;

const CheckOverLapBtn = styled.div<{ isShowingOverlapBtn: boolean }>`
  position: absolute;
  left: 160px;
  height: 12px;
  width: 12px;
  margin-top: 28px;
  background-position: center;
  background-size: cover;
  background-image: url(${sortDown});
  cursor: pointer;
  z-index: 200;
  transform: ${(props) => (props.isShowingOverlapBtn ? "rotate(180deg)" : "rotate(0deg)")};
  transition: 0.3s;
  @media (max-width: 700px) {
    left: 50px;
  }
  /* transform: rotate(180deg); */
  /* margin-right: 10px; */
`;

type OverlapSetType = {
  mapState: number;
  isShowingPoint: boolean;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setMapId: React.Dispatch<React.SetStateAction<string>>;
  mapNames: mapNameType[];
  setPopUpMsg: React.Dispatch<React.SetStateAction<any[]>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingOverlapBtn: boolean;
  setIsShowingOverlapBtn: React.Dispatch<React.SetStateAction<boolean>>;
  overlapName: string;
  setOverlapName: React.Dispatch<React.SetStateAction<string>>;
  setIsShowingSearchBarMB: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowingSearchResult: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function OverlapSet({ mapState, setPopUpMsg, uid, setIsShowingPoint, isShowingOverlapBtn, setIsShowingOverlapBtn, setIsChangingMap, overlapName, mapNames, setMapId, setOverlapName, setIsShowingPointNotes, isShowingPoint, setIsShowingPopUp, setIsShowingSearchBarMB, setIsShowingSearchResult, setPointIndex }: OverlapSetType) {
  return (
    <OverlapSetBox>
      {mapState && mapState <= 2 && mapState !== -1 ? (
        <>
          <ShowOverLapBtn
            isShowingPoint={isShowingPoint}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                if (isShowingPoint) {
                  setIsShowingPoint(false);
                } else {
                  setIsShowingPoint(true);
                }
                setIsShowingSearchBarMB(false);
                setIsShowingSearchResult(false);
              }
            }}></ShowOverLapBtn>
          <CurrentOverlap
            isShowingPoint={isShowingPoint}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                // setPointList([]);
                if (isShowingOverlapBtn) {
                  setIsShowingOverlapBtn(false);
                } else {
                  setIsShowingOverlapBtn(true);
                }
                // setIsShowingOverlapBtn(false);
                setIsChangingMap(false);
                setIsShowingPointNotes(false);
                setPointIndex(-1);
              }
            }}>
            {overlapName}
          </CurrentOverlap>
          <OverlapList isShowingOverlapBtn={isShowingOverlapBtn}>
            <OverlapBtn
              mapState={mapState}
              isShowingPoint={isShowingPoint}
              onClick={() => {
                if (!uid) {
                  setIsShowingPopUp(true);
                  setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                  // setToLogIn(true);
                } else {
                  // setPointList([]);
                  setMapId("custimizedMap");
                  setOverlapName("My Bucket List");
                  setIsShowingOverlapBtn(false);
                  setIsShowingPoint(true);
                }
              }}>
              My Bucket List
              {/* {Map1NameRef.current.value} */}
            </OverlapBtn>
            {mapNames &&
              mapNames.map((mapName, index) => {
                return (
                  <>
                    <OverlapBtn
                      mapState={mapState}
                      isShowingPoint={isShowingPoint}
                      onClick={() => {
                        // setPointList([]);
                        setMapId(mapName.id);
                        setOverlapName(mapName.name);
                        setIsShowingPointNotes(false);
                        setIsShowingOverlapBtn(false);
                        setIsShowingPoint(true);
                        setPointIndex(-1);
                      }}>
                      {mapName.name}
                    </OverlapBtn>
                    {/* <ChangeMapBtn uid={uid} mapNames={mapNames} setMapNames={setMapNames} index={index} mapName={mapName} setIsShowingPointNotes={setIsShowingPointNotes} setPointList={setPointList} setIsChangingMap={setIsChangingMap} setMapId={setMapId} setMapState={setMapState} setIsShowingPoint={setIsShowingPoint} setCurrentMapName={setCurrentMapName} isEditingMap={isEditingMap} setIsEditingMap={setIsEditingMap}></ChangeMapBtn> */}
                  </>
                );
              })}
          </OverlapList>
          <CheckOverLapBtn
            isShowingOverlapBtn={isShowingOverlapBtn}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign in to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                if (isShowingOverlapBtn) {
                  setIsShowingOverlapBtn(false);
                } else {
                  setIsShowingOverlapBtn(true);
                }
                setIsChangingMap(false);
                setIsShowingSearchBarMB(false);
                setIsShowingSearchResult(false);
              }
            }}></CheckOverLapBtn>
        </>
      ) : (
        <></>
      )}
    </OverlapSetBox>
  );
}

export default OverlapSet;
