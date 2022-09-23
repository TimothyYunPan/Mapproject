import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NoteImgUploadBtn from "../WorldMap";
import { Point, PointNotes, PointSet, PointSole, PointNotesTitleInput, PointNotesTitle, PointNote, PointNotesTextImg } from "../WorldMap";
function Overlap() {
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
      {isShowingPoint && isShowingPoint ? (
        <>
          {pointList.map((pointInfo, index) => {
            // console.log(pointInfo);
            return (
              <>
                <PointSet
                  key={index}
                  pointInfo={pointInfo}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  <Point
                    id={pointInfo.countryId}
                    onClick={(e) => {
                      const target = e.target as HTMLInputElement;
                      setX(pointInfo.x);
                      setY(pointInfo.y);
                      console.log(target.id);
                      getUserMap3Points(target.id);
                      setPointIndex(index);
                      e.stopPropagation();
                      setIsShowingPointNotes(true);
                      setIsEditing(false);
                      setCountryId(target.id);
                      setNotePhoto(pointInfo.imgUrl);
                      // console.log(pointInfo.imgUrl);
                      setPointNotes("");
                    }}></Point>
                  <PointSole></PointSole>
                </PointSet>
              </>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {isShowingPointNotes && isShowingPointNotes ? (
        <PointNotes>
          {isEditing && isEditing ? (
            <PointNotesTitleInput
              defaultValue={pointList[pointIndex].title}
              // defaultValue={pointList[pointIndex].title}
              ref={pointTitleInputRef}
              // onChange={()=>{setPointNoteTitle()}}
            ></PointNotesTitleInput>
          ) : (
            <PointNotesTitle>{pointList[pointIndex].title}</PointNotesTitle>
          )}
          {previewImgUrl && previewImgUrl ? <PointNotesTextImg src={previewImgUrl} /> : <PointNotesTextImg src={pointList[pointIndex].imgUrl} />}

          <PointNote>{pointList && parse(pointList[pointIndex].notes)}</PointNote>
        </PointNotes>
      ) : (
        <></>
      )}

      {/* </Map> */}
    </>
  );
}

export default Overlap;
