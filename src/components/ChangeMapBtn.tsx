import React, { useEffect, useState, useRef } from "react";
import { MapNameInput, ChangeMapBtnSet, OkIcon, DeleteMapBtn, EditMapBtn } from "./Header";
import { pointListType, mapNameType, notificationInfoType } from "../App";
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
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void })[]>>;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function ChangeMapBtn({ setIsShowingPointNotes, setPointList, setIsChangingMap, setMapId, setMapState, setIsShowingPoint, setCurrentMapName, mapName, isEditingMap, setIsEditingMap, index, uid, mapNames, setMapNames, setOverlapName, mapId, deleteMap, setDeleteMap, setPopUpMsg, setIsShowingPopUp, pointList, setNotificationInfo, setPointIndex }: ChangeMapBtnType) {
  // const [isEditingNewMap, setIsEditingNewMap] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // const CurrentMapIdRef = useRef<string>(null);
  const MapNameRef = useRef<HTMLInputElement>(null);
  let currentMapId: string;
  async function updateNewMapName(mapId: string) {
    let newMapNames = [...mapNames];
    newMapNames[index].name = MapNameRef.current!.value;
    setMapNames(newMapNames);

    await setDoc(doc(db, "user", uid), { names: newMapNames }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    // setOriginalMapNames(newNames);
  }

  async function deleteNewMap() {
    let newMapList = mapNames.filter((obj) => {
      return obj.id !== currentMapId;
    });

    setMapNames(newMapList);

    await setDoc(doc(db, "user", uid), { names: newMapList }, { merge: true });
    setDeleteMap("no");
    setNotificationInfo({ text: `Map has been successfully deleted`, status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }
  useEffect(() => {
    MapNameRef.current!.value = mapName.name;
  }, [mapName.name]);

  return (
    <ChangeMapBtnSet>
      <MapNameInput
        maxLength={18}
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
            console.log("CMB");
            setMapState(3);
            setCurrentMapName(mapName.name);
            setOverlapName(mapName.name);

            setMapId(mapName.id);
          }
          setIsShowingPoint(true);
          setPointIndex(-1);
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
                setNotificationInfo({ text: `Successfully update your map name `, status: true });
                setTimeout(() => {
                  setNotificationInfo({ text: "", status: false });
                }, 3000);
              } else {
                setNotificationInfo({ text: `Map name cannot be blank`, status: true });
                setTimeout(() => {
                  setNotificationInfo({ text: "", status: false });
                }, 3000);
              }
            }}></OkIcon>
          <DeleteMapBtn
            // ref={CurrentMapIdRef}
            onClick={() => {
              currentMapId = mapName.id;
              setIsShowingPopUp(true);
              setPopUpMsg([`Are you sure you want to delete the map "${mapName.name}"?`, "Yes", "No", "", "deletemap", deleteNewMap]);
              setIsEditing(false);
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
