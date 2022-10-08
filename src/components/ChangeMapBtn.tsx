import React, { useEffect, useState, useRef } from "react";
import { MapNameInput, ChangeMapBtnSet, OkIcon, DeleteMapBtn, EditMapBtn } from "./Header";
import { pointListType, mapNameType } from "../App";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

type ChangeMapBtnType = {
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  pointList: pointListType[];
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  mapId: string;
  setMapId: React.Dispatch<React.SetStateAction<string>>;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  mapName: { id: string; name: string };
  isEditingMap: number;
  setIsEditingMap: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  mapNames: mapNameType[];
  setMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  uid: string;
  setOverlapName: React.Dispatch<React.SetStateAction<string>>;
  deleteMap: string;
  setDeleteMap: React.Dispatch<React.SetStateAction<string>>;
  setPopUpMsg: React.Dispatch<React.SetStateAction<any[]>>;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChangeMapBtn({ setIsShowingPointNotes, setPointList, setIsChangingMap, setMapId, setMapState, setIsShowingPoint, setCurrentMapName, mapName, isEditingMap, setIsEditingMap, index, uid, mapNames, setMapNames, setOverlapName, mapId, deleteMap, setDeleteMap, setPopUpMsg, setIsShowingPopUp, pointList }: ChangeMapBtnType) {
  // const [isEditingNewMap, setIsEditingNewMap] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const CurrentMapIdRef = useRef<any>(null);
  const MapNameRef = useRef<HTMLInputElement>(null);

  async function updateNewMapName(mapId: string) {
    let newMapNames = [...mapNames];
    newMapNames[index].name = MapNameRef.current!.value;
    setMapNames(newMapNames);

    await setDoc(doc(db, "user", uid), { names: newMapNames }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    // setOriginalMapNames(newNames);
  }

  async function deleteNewMap() {
    console.log("有");
    console.log(CurrentMapIdRef.current);
    let newMapList = mapNames.filter((obj) => {
      console.log(obj.id);
      return obj.id !== CurrentMapIdRef.current;
    });

    setMapNames(newMapList);
    console.log(newMapList);

    await setDoc(doc(db, "user", uid), { names: newMapList }, { merge: true });
    console.log("有嗎");
    setDeleteMap("no");
    // console.log(deleteMap);
  }
  useEffect(() => {
    MapNameRef.current!.value = mapName.name;
  }, [mapName.name]);

  // useEffect(() => {
  //   console.log(deleteMap);
  //   if (deleteMap === "yes" && CurrentMapIdRef.current !== null) {
  //     console.log("kk");
  //     deleteNewMap();
  //   }
  //   // console.log(CurrentMapIdRef.current);
  // }, [deleteMap]);

  // console.log(MapNameRef.current?.value, "value");
  return (
    <ChangeMapBtnSet>
      <MapNameInput
        ref={MapNameRef}
        defaultValue={mapName.name}
        readOnly={isReadOnly}
        onClick={() => {
          setIsShowingPointNotes(false);
          if (isEditing === true) {
            setIsChangingMap(true);
          } else {
            if (mapId !== mapName.id) {
              setPointList([]);
            }
            setIsChangingMap(false);
            setMapState(3);
            setCurrentMapName(mapName.name);
            setOverlapName(mapName.name);

            setMapId(mapName.id);
          }
          setIsShowingPoint(true);

          // if (!uid) {
          //   setIsShowingPopUp(true);
          //   // setToLogIn(true);
          // } else {
          //   setMapState(3);
          //   setIsShowingPoint(true);
          // }
        }}>
        {/* {mapName.name} */}
      </MapNameInput>
      {isEditing === true ? (
        <>
          <OkIcon
            onClick={() => {
              if (MapNameRef.current!.value.trim() !== "") {
                setIsEditing(false);
                setIsReadOnly(true);
                updateNewMapName(mapName.id);
                // setMapId(mapName.id);
                if (mapId === mapName.id) {
                  setCurrentMapName(MapNameRef.current!.value);
                  setOverlapName(MapNameRef.current!.value);
                }
              } else {
                console.log("popup");
              }
            }}></OkIcon>
          <DeleteMapBtn
            // ref={CurrentMapIdRef}
            onClick={() => {
              CurrentMapIdRef.current = mapName.id;
              setIsShowingPopUp(true);
              setPopUpMsg([`Are you sure you want to delete the map "${mapName.name}" ?`, "Yes", "No", "", "deletemap", deleteNewMap]);
              setIsEditing(false);

              // console.log(index);
            }}></DeleteMapBtn>
        </>
      ) : (
        <EditMapBtn
          onClick={(e) => {
            setIsReadOnly(false);
            setIsEditing(true);
          }}></EditMapBtn>
      )}
    </ChangeMapBtnSet>
  );
}

export default ChangeMapBtn;
