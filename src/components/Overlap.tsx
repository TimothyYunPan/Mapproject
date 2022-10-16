import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NoteImgUploadBtn from "../WorldMap";
import { Point, PointNotes, PointSet, PointSole, PointNotesTitle, PointNote, PointNotesTextImg } from "../WorldMap";
import { pointListType } from "../App";
import parse from "html-react-parser";
import { LittleCloseBtn } from "../WorldMap";

const ViewModeMsg = styled.div`
  font-size: 14px;
  color: rgba(225, 225, 225, 0.7);
  margin: 250px 0 10px -10px;
  text-align: left;
  cursor: default;
  /* right: 25px; */
  bottom: 10px;
  position: absolute;
  /* padding: 0 20px; */
`;

type OverlapType = {
  pointList: pointListType[];
  isShowingPointNotes: boolean;
  pointIndex: number;
  previewImgUrl: string;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  mapState: number;
  setPointPhoto: React.Dispatch<React.SetStateAction<File | null>>;
  setNotePhoto: React.Dispatch<React.SetStateAction<string>>;
  // isShowingPoint: isShowingPointType
};
function Overlap({ mapState, pointList, isShowingPointNotes, pointIndex, previewImgUrl, setPointIndex, setIsShowingPointNotes, setCountryId, setPointPhoto, setNotePhoto }: OverlapType) {
  return (
    <>
      {/* <Map
        onClick={(e) => {
          const target = e.target as HTMLInputElement;
          if (target.tagName !== "path") {
            return;
          }
          getUserMap3Points(target.id);
          setCountryId(target.id);
          setIsShowingPointNotes(false);

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
          setPointList([...pointList, newObj]);
        }}> */}
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
                  const target = e.target as HTMLInputElement;
                  // setX(pointInfo.x);
                  // setY(pointInfo.y);
                  setPointPhoto(null);
                  setPointIndex(index);
                  setNotePhoto(pointInfo.imgUrl);
                  e.stopPropagation();
                  setIsShowingPointNotes(true);
                  // setIsEditing(false);
                  setCountryId(target.id);
                  // setNotePhoto(pointInfo.imgUrl);
                }}></Point>
              <PointSole></PointSole>
            </PointSet>
          </>
        );
      })}
      {isShowingPointNotes && isShowingPointNotes ? (
        <PointNotes>
          <PointNotesTitle>{pointList[pointIndex]?.title}</PointNotesTitle>
          {previewImgUrl && previewImgUrl ? <PointNotesTextImg src={previewImgUrl} /> : <PointNotesTextImg src={pointList[pointIndex]?.imgUrl} />}

          <PointNote>{pointList && parse(pointList[pointIndex]?.notes)}</PointNote>
          <LittleCloseBtn
            onClick={() => {
              setIsShowingPointNotes(false);
              setPointIndex(-1);
            }}></LittleCloseBtn>
          <ViewModeMsg>View mode</ViewModeMsg>
        </PointNotes>
      ) : (
        <></>
      )}

      {/* </Map> */}
    </>
  );
}

export default Overlap;
