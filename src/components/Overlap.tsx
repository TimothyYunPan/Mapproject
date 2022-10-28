import React from "react";
import styled from "styled-components";
import { Point, PointNotes, PointSet, PointSole, PointNotesTitle, PointNote, PointNotesTextImg } from "./CustomizedMap";
import { pointListType } from "../App";
import parse from "html-react-parser";
import { LittleCloseBtn } from "../WorldMap";

const ViewModeMsg = styled.div`
  font-size: 14px;
  color: rgba(225, 225, 225, 0.7);
  margin: 250px 0 10px -10px;
  text-align: left;
  cursor: default;
  bottom: 10px;
  position: absolute;
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
};
function Overlap({
  mapState,
  pointList,
  isShowingPointNotes,
  pointIndex,
  previewImgUrl,
  setPointIndex,
  setIsShowingPointNotes,
  setCountryId,
  setPointPhoto,
  setNotePhoto,
}: OverlapType) {
  return (
    <>
      {pointList.map((pointInfo, index) => {
        return (
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
                setPointPhoto(null);
                setPointIndex(index);
                setNotePhoto(pointInfo.imgUrl);
                e.stopPropagation();
                setIsShowingPointNotes(true);
                setCountryId(target.id);
              }}
            />
            <PointSole />
          </PointSet>
        );
      })}
      {isShowingPointNotes && (
        <PointNotes>
          <PointNotesTitle>{pointList[pointIndex]?.title}</PointNotesTitle>
          {previewImgUrl && previewImgUrl ? <PointNotesTextImg src={previewImgUrl} /> : <PointNotesTextImg src={pointList[pointIndex]?.imgUrl} />}
          <PointNote>{pointList && parse(pointList[pointIndex]?.notes)}</PointNote>
          <LittleCloseBtn
            onClick={() => {
              setIsShowingPointNotes(false);
              setPointIndex(-1);
            }}
          />
          <ViewModeMsg>View mode</ViewModeMsg>
        </PointNotes>
      )}
    </>
  );
}

export default Overlap;
