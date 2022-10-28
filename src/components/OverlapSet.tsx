import React from "react";
import styled from "styled-components";
import { mapNameType, pointListType } from "../App";
import sortDown from "./icon/sortDown.png";
import eyeOpened from "./icon/eyeOpened.png";
import eyeClosed from "./icon/eyeClosed.png";

const ShowOverLapBtn = styled.div<{ isShowingPoint: boolean }>`
  height: 20px;
  width: 20px;
  position: absolute;
  left: -35px;
  top: 22px;
  background-position: center;
  background-size: cover;
  cursor: pointer;
  background-image: ${(props) => (props.isShowingPoint ? `url(${eyeOpened})` : `url(${eyeClosed})`)};
  transition: 0.3s;
  @media (max-width: 700px) {
    height: 28px;
    width: 28px;
    background-size: 20px;
    background-repeat: no-repeat;

    border: 1px solid white;
    border-radius: 50%;
    left: 5px;
  }
`;

const OverlapSetBox = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const OverlapBtn = styled.div<{ isShowingPoint: boolean; mapState: number }>`
  position: relative;
  width: 150px;
  margin-bottom: 10px;
  padding: 2px 0 2px 10px;
  border: 1px solid white;
  border-radius: 8px;
  backdrop-filter: blur(100px);
  background-color: rgba(225, 225, 225, 0.2);
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  color: white;

  :hover {
    color: rgb(236, 174, 72);
  }
`;

const OverlapList = styled.div<{ isShowingOverlapBtn: boolean }>`
  position: absolute;
  height: ${(props) => (props.isShowingOverlapBtn === true ? "308" : "0")}px;
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
  margin-top: 18px;
  padding: 2px 0 2px 10px;
  height: 28px;
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
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void } | { (index: number): void })[]>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingOverlapBtn: boolean;
  setIsShowingOverlapBtn: React.Dispatch<React.SetStateAction<boolean>>;
  overlapName: string;
  setOverlapName: React.Dispatch<React.SetStateAction<string>>;
  setIsShowingSearchBarMB: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowingSearchResult: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  pointList: pointListType[];
};

function OverlapSet({ mapState, setPopUpMsg, uid, setIsShowingPoint, isShowingOverlapBtn, setIsShowingOverlapBtn, setIsChangingMap, overlapName, mapNames, setMapId, setOverlapName, setIsShowingPointNotes, isShowingPoint, setIsShowingPopUp, setIsShowingSearchBarMB, setIsShowingSearchResult, setPointIndex, pointList }: OverlapSetType) {
  return (
    <OverlapSetBox>
      {mapState && mapState <= 2 && mapState !== -1 && (
        <>
          <ShowOverLapBtn
            isShowingPoint={isShowingPoint}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                setIsShowingPoint(!isShowingPoint);
                setIsShowingSearchBarMB(false);
                setIsShowingSearchResult(false);
              }
            }}></ShowOverLapBtn>
          <CurrentOverlap
            isShowingPoint={isShowingPoint}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
              } else {
                if (isShowingOverlapBtn) {
                  setIsShowingOverlapBtn(false);
                } else {
                  setIsShowingOverlapBtn(true);
                }
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
                  setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
                } else {
                  setMapId("custimizedMap");
                  setOverlapName("My Bucket List");
                  setIsShowingOverlapBtn(false);
                  setIsShowingPoint(true);
                  setIsShowingPointNotes(false);
                  setPointIndex(-1);
                }
              }}>
              My Bucket List
              {/* {Map1NameRef.current.value} */}
            </OverlapBtn>
            {mapNames &&
              mapNames.map((mapName, index) => {
                return (
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
                );
              })}
          </OverlapList>
          <CheckOverLapBtn
            isShowingOverlapBtn={isShowingOverlapBtn}
            onClick={() => {
              if (!uid) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Sign up to start your map journey 😋 ", "Sign In", "Sign Up", "", "signin"]);
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
      )}
    </OverlapSetBox>
  );
}

export default OverlapSet;
