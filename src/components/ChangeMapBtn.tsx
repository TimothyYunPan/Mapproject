import React, { useEffect, useState, useRef } from "react";
import { MapNameInput, ChangeMapBtnSet, OkIcon, DeleteMapBtn, EditMapBtn } from "./Header";
import { pointListType, mapNameType } from "../App";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

type ChangeMapBtnType = {
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  mapId: string;
  setMapId: React.Dispatch<React.SetStateAction<string>>;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPoint: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentMap: React.Dispatch<React.SetStateAction<string>>;
  mapName: { id: string; name: string };
  isEditingMap: number;
  setIsEditingMap: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  mapNames: mapNameType[];
  setMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  uid: string;
  setOverlapName: React.Dispatch<React.SetStateAction<string>>;
};

function ChangeMapBtn({ setIsShowingPointNotes, setPointList, setIsChangingMap, setMapId, setMapState, setIsShowingPoint, setCurrentMap, mapName, isEditingMap, setIsEditingMap, index, uid, mapNames, setMapNames, setOverlapName, mapId }: ChangeMapBtnType) {
  // const [isEditingNewMap, setIsEditingNewMap] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const MapNameRef = useRef<HTMLInputElement>(null);

  async function updateNewMapName(mapId: string) {
    let newMapNames = [...mapNames];
    newMapNames[index].name = MapNameRef.current!.value;
    setMapNames(newMapNames);

    await setDoc(doc(db, "user", uid), { names: newMapNames }, { merge: true });
    // let newMap = { id: newId, name: "new Map" };
    // setOriginalMapNames(newNames);
  }

  async function deleteNewMap(mapId: string) {
    console.log("有");
    let newMapList = mapNames.filter((obj) => {
      console.log(obj.id);
      return obj.id !== mapId;
    });
    setMapNames(newMapList);
    console.log(newMapList);

    await setDoc(doc(db, "user", uid), { names: newMapList }, { merge: true });
    console.log("有嗎");
  }
  useEffect(() => {
    MapNameRef.current!.value = mapName.name;
  }, [mapName.name]);

  console.log(MapNameRef.current?.value, "value");
  return (
    <ChangeMapBtnSet>
      <MapNameInput
        ref={MapNameRef}
        defaultValue={mapName.name}
        readOnly={isReadOnly}
        onClick={() => {
          if (mapId !== mapName.id) {
            setPointList([]);
          }
          setMapId(mapName.id);
          setIsShowingPointNotes(false);
          if (isEditing === true) {
            setIsChangingMap(true);
          } else {
            setIsChangingMap(false);
          }
          setOverlapName(mapName.name);
          setMapState(3);
          setCurrentMap(mapName.name);
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
              setIsEditing(false);
              setIsReadOnly(true);
              updateNewMapName(mapName.id);
            }}></OkIcon>
          <DeleteMapBtn
            onClick={() => {
              setIsEditing(false);
              console.log(index);
              deleteNewMap(mapName.id);
            }}></DeleteMapBtn>
        </>
      ) : (
        <EditMapBtn
          onClick={() => {
            setIsReadOnly(false);
            setIsEditing(true);
          }}></EditMapBtn>
      )}
    </ChangeMapBtnSet>
  );
}

export default ChangeMapBtn;
