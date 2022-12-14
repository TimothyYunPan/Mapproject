import React, { MouseEvent, forwardRef } from "react";
import MapSVG from "./MapSVG";
import { Map } from "../WorldMap";
import { ShowName } from "../WorldMap";
import { doc, deleteDoc } from "firebase/firestore";
import { countryListType, haveFriendListType, pointListType } from "../App";
import { mousePosType } from "../WorldMap";
import Overlap from "./Overlap";
import { db } from "../utils/firebaseConfig";

type visitedMapType = {
  mapState: number;
  isShowingPoint: boolean;
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  isShowingPointNotes: boolean;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  countryId: string;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  countryName: string;
  haveFriendList: haveFriendListType[];
  pointList: pointListType[];
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  pointIndex: number;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  writeUserMap1Data: (country: string) => void;
  setIsColorHovering: React.Dispatch<React.SetStateAction<boolean>>;
  isHovering: boolean;
  currentPos: mousePosType;
  getPosition: (e: MouseEvent) => void;
  setNotePhoto: React.Dispatch<React.SetStateAction<string>>;
  isColorHovering: boolean;
  setPointPhoto: React.Dispatch<React.SetStateAction<File | null>>;
  hoverAddCountryName: (e: React.MouseEvent<SVGSVGElement>) => void;
  previewImgUrl: string;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  allCountries: string[];
  ref: SVGSVGElement;
  uid: string;
};

const VisitedMap = forwardRef<SVGSVGElement, visitedMapType>(
  (
    {
      uid,
      allCountries,
      setIsHovering,
      hoverAddCountryName,
      previewImgUrl,
      setPointPhoto,
      isColorHovering,
      currentPos,
      setNotePhoto,
      getPosition,
      isHovering,
      setIsColorHovering,
      mapState,
      isShowingPoint,
      countryList,
      setCountryList,
      setIsShowingPointNotes,
      isShowingPointNotes,
      countryId,
      setCountryId,
      countryName,
      haveFriendList,
      pointList,
      setIsShowingPopUp,
      setIsChangingMap,
      pointIndex,
      setPointIndex,
      writeUserMap1Data,
    },
    ref
  ) => {
    async function updateUserMap1Data(country: string) {
      await deleteDoc(doc(db, "user", uid, "visitedCountries", country));
    }
    return (
      <Map
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          setIsChangingMap(false);
          const target = e.target as HTMLInputElement;
          if (target.tagName !== "path") {
            return;
          }
          setIsShowingPopUp(false);
          let ColorChange = "rgb(236, 174, 72)";
          let ColorOrigin = "rgb(148, 149, 154)";
          if (target.style.fill == "") {
            target.style.fill = ColorChange;
            writeUserMap1Data(target.id);
            // console.log("?????????");
            countryList.push({ countryId: target.id, visited: true });
            const newCountryList = [...countryList];
            setCountryList(newCountryList);
          } else if (target.style.fill === ColorOrigin) {
            target.style.fill = ColorChange;
            writeUserMap1Data(target.id);
            // console.log("??????");
            countryList.push({ countryId: target.id, visited: true });
            const newCountryList = [...countryList];
            setCountryList(newCountryList);
          } else if (target.style.fill === ColorChange) {
            target.style.fill = ColorOrigin;
            updateUserMap1Data(target.id);
            setIsColorHovering(false);
            const newCountryList = countryList.filter((object) => {
              return object.countryId !== target.id;
            });
            setCountryList(newCountryList);
            // console.log("?????????");
          }
        }}>
        {isHovering && <ShowName currentPos={currentPos}>{countryName}</ShowName>}
        <div
          onMouseMove={(e) => {
            getPosition(e);
          }}>
          <MapSVG
            setIsColorHovering={setIsColorHovering}
            isColorHovering={isColorHovering}
            countryId={countryId}
            ref={ref}
            hoverAddCountryName={hoverAddCountryName}
            setIsHovering={setIsHovering}
            allCountries={allCountries}
            countryList={countryList}
            mapState={mapState}
            haveFriendList={haveFriendList}
          />
        </div>
        {isShowingPoint && (
          <Overlap
            setNotePhoto={setNotePhoto}
            setPointPhoto={setPointPhoto}
            mapState={mapState}
            pointList={pointList}
            isShowingPointNotes={isShowingPointNotes}
            pointIndex={pointIndex}
            previewImgUrl={previewImgUrl}
            setPointIndex={setPointIndex}
            setIsShowingPointNotes={setIsShowingPointNotes}
            setCountryId={setCountryId}
          />
        )}
      </Map>
    );
  }
);

export default VisitedMap;
