import React, { useState, useRef, MouseEvent, forwardRef } from "react";
import MapSVG from "./MapSVG";
import { Map, LittleCloseBtn, ShowName } from "../WorldMap";
import styled from "styled-components";
import { doc, setDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../utils/firebaseConfig";
import { db } from "../utils/firebaseConfig";
import { countryListType, haveFriendListType, pointListType, notificationInfoType } from "../App";
import { mousePosType } from "../WorldMap";
import okIcon from "./icon/okIcon.png";
import Tiptap from "./tiptap/Tiptap";
import edit from "./icon/edit.png";
import editHover from "./icon/editHover.png";
import parse from "html-react-parser";
import backIcon from "./icon/backIcon.png";
import imageIcon from "./icon/imageIcon.png";
import imageHover from "./icon/imageHover.png";
import trashCan from "./icon/trashCan.png";
import trashCanHover from "./icon/trashCanHover.png";
const storage = getStorage(app);

const NotesFlex = styled.div``;

const NoteEditBtn = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 45px;
  background-image: url(${edit});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${editHover});
    width: 24px;
    height: 24px;
    bottom: 15px;
  }
`;
const IconBtnStyle = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 15px;
  background-size: cover;
  position: absolute;
  cursor: pointer;
`;
const Flag = styled.img`
  position: absolute;
  bottom: -50px;
  left: 10px;
  height: 40px;
  width: 40px;
  object-fit: contain;
  max-width: 100%;
`;
const NoteDeleteBtn = styled(IconBtnStyle)`
  background-image: url(${trashCan});
  :hover {
    background-image: url(${trashCanHover});
  }
`;

const NoteImgUploadBtn = styled.div`
  width: 24px;
  height: 24px;
  bottom: 16px;
  right: 70px;
  background-image: url(${imageIcon});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${imageHover});
    width: 24px;
    height: 24px;
    bottom: 17px;
  }
`;

const NoteAddBtn = styled(IconBtnStyle)`
  background-image: url(${okIcon});
  bottom: 19px;
  :hover {
    bottom: 21px;
  }
`;

const NoteCancelBtn = styled(IconBtnStyle)`
  height: 22px;
  width: 22px;
  background-image: url(${backIcon});
  bottom: 19px;
  right: 45px;
  :hover {
    bottom: 21px;
  }
`;

const NotesPhotoInput = styled.input`
  display: none;
`;

const PointNoteTip = styled.div`
  font-size: 16px;
  color: rgba(225, 225, 225, 0.7);
  margin: 250px 0 10px -10px;
  text-align: left;
  cursor: default;
`;

const PointNotesTextArea = styled.div`
  margin-top: 20px;
  width: 90%;
  color: white;
  background-color: inherit;
  height: auto;
`;

const NoteFlag = styled(Flag)`
  bottom: 20px;
  left: 20px;
  object-fit: contain;
  max-width: 100%;
`;

const NotesPhotoLabel = styled.label``;

export const PointSet = styled.div<{ pointInfo: pointListType; isJumping: boolean }>`
  position: absolute;
  top: ${(props) => {
    return props.pointInfo.y - 100 + "px";
  }};
  left: ${(props) => {
    return props.pointInfo.x - 4 + "px";
  }};
  display: flex;
  flex-direction: column;
  align-items: center;

  animation: ${(props) => props.isJumping && "jumping 1s infinite"};
  @keyframes jumping {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
export const Point = styled.div<{ mapState: number }>`
  height: ${(props) => (props.mapState == 1 ? "8.5px" : props.mapState == 2 ? "8.5px" : "7px")};
  width: ${(props) => (props.mapState == 1 ? "8.5px" : props.mapState == 2 ? "8.5px" : "7px")};
  cursor: pointer;
  border-radius: 50%;
  border: ${(props) => (props.mapState == 1 ? "0.2px solid white" : props.mapState == 2 ? "0.7px solid rgb(77,81,86)" : "")};
  background-color: ${(props) => (props.mapState == 1 ? "#6495ED" : props.mapState == 2 ? "white" : "rgb(236, 174, 72)")};
  z-index: 1;
`;
export const PointSole = styled.div`
  background-color: grey;
  height: 20px;
  width: 1.5px;
`;

export const PointNotes = styled.div`
  width: 300px;
  height: 550px;
  position: absolute;
  border: 1px solid white;
  top: 60px;
  right: -20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: rgb(124, 134, 146, 0.7);
  z-index: 1000;
  transition: 0.5s;
  @media (max-width: 1550px) {
    right: -10%;
  }
  @media (max-width: 1350px) {
    right: 10px;
  }

  @media (max-width: 700px) {
    transition: none;

    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    top: 100px;
  }
`;

export const PointNotesTitle = styled.h2`
  margin: 20px 0 10px 0;
  padding: 0 20px;
  text-align: center;
  color: white;
`;

export const PointNotesTitleInput = styled.input`
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 20px;
  margin: 25px 0;
  text-align: center;
  color: white;
  &::placeholder {
    color: rgba(225, 225, 225, 0.5);
  }
`;

export const PointNote = styled.div`
  margin-top: 15px;
  width: 255px;
  white-space: wrap;
  word-break: break-all;
  max-height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
  color: white;
  margin-bottom: 65px;

  ol {
    padding: 20px;
  }
  hr {
    margin: 10px 0;
    border-top: 1px solid rgba(225, 225, 225, 0.5);
  }
`;

const PointNoteLarge = styled(PointNote)`
  max-height: 640px;
`;

export const PointNotesTextImg = styled.img`
  max-width: 268px;
  max-height: 160px;
  object-fit: cover;
  object-position: center;
`;

type customizedMapType = {
  mapState: number;
  isShowingPoint: boolean;
  uid: string;
  countryList: countryListType[];
  isShowingPointNotes: boolean;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  countryId: string;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  countryName: string;
  haveFriendList: haveFriendListType[];
  pointList: pointListType[];
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  mapId: string;
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void } | { (index: number): void })[]>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
  pointIndex: number;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
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
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  pointPhoto: File | null;
  notePhoto: string;
  singlePointList: pointListType[];
  imageList: string[];
};

const CustomizedMap = forwardRef<SVGSVGElement, customizedMapType>(({ allCountries, setIsHovering, hoverAddCountryName, isHovering, isColorHovering, setIsColorHovering, imageList, getPosition, singlePointList, notePhoto, pointPhoto, isEditing, previewImgUrl, setNotePhoto, setIsEditing, currentPos, setPointPhoto, mapState, isShowingPoint, uid, countryList, setIsShowingPointNotes, isShowingPointNotes, countryId, setCountryId, countryName, haveFriendList, pointList, setPointList, setIsShowingPopUp, mapId, setPopUpMsg, setNotificationInfo, setIsChangingMap, pointIndex, setPointIndex }, mouseRef) => {
  const [mousePos, setMousePos] = useState<mousePosType>({ x: null, y: null });
  const [largeTipTap, setLargeTipTap] = useState<boolean>(true);
  const [pointNotes, setPointNotes] = useState<string>("");
  const [searchTitleList, setSearchTitleList] = useState<(string | undefined)[]>([]);
  const [X, setX] = useState<number>(0);
  const [Y, setY] = useState<number>(0);

  const pointTitleInputRef = useRef<HTMLInputElement>(null);
  async function writeUserMap3Data(country: string, newObj: pointListType, url: string) {
    // console.log("我準備要write");

    await setDoc(doc(db, "user", uid, mapId, country), {
      List: [
        {
          title: newObj.title,
          countryId: country,
          y: newObj.y,
          x: newObj.x,
          imgUrl: url,
          notes: newObj.notes,
        },
      ],
      searchTitle: [newObj.title],
    });
    // console.log("我有write成功");
    let newSearchTitleList = [];
    newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
  }
  async function updateUserMap3Data(countryId: string, newObj: pointListType, url: string) {
    // console.log("準備更新3");
    let newSinglePointList = [];
    const newListObj = {
      title: newObj.title,
      countryId: countryId,
      y: newObj.y,
      x: newObj.x,
      imgUrl: url,
      notes: newObj.notes,
    };

    newSinglePointList = [...singlePointList];
    newSinglePointList.forEach((point, index) => {
      if (point.x === newListObj.x && point.y === newListObj.y) {
        newSinglePointList[index] = newListObj;
      }
    });
    let newSearchTitleList = [...searchTitleList, newObj.title];
    setSearchTitleList(newSearchTitleList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), { List: newSinglePointList, searchTitle: newSearchTitleList });

    // console.log("增加點點");
  }

  function sendNewNotesInfo(country: string, newObj: pointListType) {
    if (pointPhoto == null) {
      const url = notePhoto;
      if (singlePointList.length <= 1) {
        // console.log("我是沒照片的write");
        writeUserMap3Data(country, newObj, url);
      } else {
        // console.log("我是沒照片的update");

        updateUserMap3Data(country, newObj, url);
      }
      setPointList((pre) => {
        pre[pointIndex] = {
          ...pre[pointIndex],
          title: pointTitleInputRef.current?.value || "",
          imgUrl: previewImgUrl,
          notes: pointNotes,
        };
        const newArr = [...pre];
        return newArr;
      });
    } else {
      let newTitle = pointTitleInputRef.current?.value;
      const imageRef = ref(storage, `${uid}/myMap/${pointPhoto.name}`);
      setPointList((pre) => {
        pre[pointIndex] = {
          ...pre[pointIndex],
          title: newTitle,
          notes: pointNotes,
        };
        const newArr = [...pre];
        return newArr;
      });
      uploadBytes(imageRef, pointPhoto).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)

          if (singlePointList.length <= 1) {
            // console.log("我是有照片的write");
            writeUserMap3Data(country, newObj, url);
          } else {
            // console.log("我是有照片的update");
            updateUserMap3Data(country, newObj, url);
          }
          setPointList((pre) => {
            pre[pointIndex] = {
              ...pre[pointIndex],
              imgUrl: url,
            };
            const newArr = [...pre];
            return newArr;
          });
          setNotePhoto(url);
        });
      });
    }
  }

  async function deleteNote() {
    let newPointList = pointList.filter((obj) => {
      return obj.x !== X && obj.y !== Y;
    });
    setPointList(newPointList);
    await updateDoc(doc(db, "user", uid, mapId, countryId), {
      List: arrayRemove(singlePointList[0]),
    });

    setNotificationInfo({ text: "Your pin has been successfully deleted", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }
  return (
    <Map
      onClick={(e) => {
        setIsChangingMap(false);
        const target = e.target as HTMLInputElement;
        if (target.tagName !== "path") {
          return;
        }

        let ColorChange = "rgb(236, 174, 72)";
        if (target.style.fill == ColorChange) {
          target.style.fill = "inherit";
        }
        setCountryId(target.id);
        setIsShowingPointNotes(false);
        setPointIndex(-1);
        let mousePosition = currentPos;
        setMousePos(mousePosition);
        let a = mousePosition;
        let newObj = {
          title: "",
          countryId: target.id,
          imgUrl: "",
          notes: "",
          x: (a.x as number) + 50,
          y: (a.y as number) + 73,
        };
        setPointList([...pointList, newObj]);
        if (pointList.length === 0) {
          setNotificationInfo({ text: "click on the pin to add some notes!", status: true });
          setTimeout(() => {
            setNotificationInfo({ text: "", status: false });
          }, 4000);
        }
      }}>
      {isShowingPoint && (
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
                    setPointPhoto(null);
                    const target = e.target as HTMLInputElement;
                    setX(pointInfo.x);
                    setY(pointInfo.y);
                    setMousePos({ x: pointInfo.x, y: pointInfo.y });
                    setPointIndex(index);
                    e.stopPropagation();
                    setIsShowingPointNotes(true);
                    setIsEditing(false);
                    setCountryId(target.id);
                    setNotePhoto(pointInfo.imgUrl);
                    setPointNotes("");
                  }}
                />
                <PointSole />
              </PointSet>
            );
          })}
        </>
      )}

      {isShowingPointNotes && (
        <PointNotes>
          {isEditing ? <PointNotesTitleInput maxLength={20} placeholder="Title" defaultValue={pointList[pointIndex].title} ref={pointTitleInputRef} /> : <>{pointList && pointList[pointIndex].title ? <PointNotesTitle>{pointList[pointIndex].title}</PointNotesTitle> : <PointNoteTip>write something to save the pin</PointNoteTip>}</>}
          {previewImgUrl ? <PointNotesTextImg src={previewImgUrl} /> : <PointNotesTextImg src={pointList[pointIndex].imgUrl} />}

          {isEditing ? (
            <>
              <NotesPhotoLabel htmlFor="NotesPhotoInput">
                <NoteImgUploadBtn />
              </NotesPhotoLabel>
              <NotesPhotoInput
                type="file"
                id="NotesPhotoInput"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  setPointPhoto(e.target.files![0]);
                  if (e.target.files![0] || pointList[pointIndex].imgUrl) {
                    setLargeTipTap(false);
                  } else {
                    setLargeTipTap(true);
                  }
                }}
              />
              <PointNotesTextArea
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <Tiptap largeTipTap={largeTipTap} setPointNotes={setPointNotes} pointList={pointList} pointIndex={pointIndex} />
              </PointNotesTextArea>
            </>
          ) : (
            <>{previewImgUrl || pointList[pointIndex].imgUrl ? <PointNote>{pointList && parse(pointList[pointIndex].notes)}</PointNote> : <PointNoteLarge>{pointList && parse(pointList[pointIndex].notes)}</PointNoteLarge>}</>
          )}
          <NotesFlex>
            {isEditing ? (
              <NoteCancelBtn
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  setIsShowingPopUp(true);
                  setPopUpMsg(["Are you sure you want to leave before saving changes?", "Yes", "No", "", "goback"]);
                }}
              />
            ) : (
              <>
                <NoteEditBtn
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    if (previewImgUrl || pointList[pointIndex].imgUrl) {
                      setLargeTipTap(false);
                    } else {
                      setLargeTipTap(true);
                    }
                    e.stopPropagation();
                    setIsEditing(true);
                    setPointNotes(pointList[pointIndex].notes);
                    setNotePhoto(pointList[pointIndex].imgUrl);
                  }}
                />
                <NoteDeleteBtn
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    setIsShowingPopUp(true);
                    setPopUpMsg(["Are you sure you want to delete the pin?", "Yes", "No", "", "deletepin", deleteNote]);
                  }}
                />
              </>
            )}
            {isEditing && (
              <NoteAddBtn
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  let newObj: pointListType = {
                    title: pointTitleInputRef.current!.value,
                    countryId: countryId,
                    x: mousePos.x as number,
                    y: mousePos.y as number,
                    imgUrl: imageList[0],
                    notes: pointNotes,
                  };
                  if (pointTitleInputRef.current!.value.trim() !== "") {
                    sendNewNotesInfo(countryId, newObj);
                    setIsEditing(false);
                    setPointPhoto(null);
                    setPointNotes("");
                  } else {
                    setNotificationInfo({ text: `Title cannot be blank`, status: true });
                    setTimeout(() => {
                      setNotificationInfo({ text: "", status: false });
                    }, 3000);
                  }
                }}
              />
            )}
          </NotesFlex>
          <NoteFlag src={`https://countryflagsapi.com/png/${countryId}`} />
          <LittleCloseBtn
            onClick={() => {
              if (isEditing) {
                setIsShowingPopUp(true);
                setPopUpMsg(["Are you sure you want to leave before saving changes?", "Yes", "No", "", "closenote"]);
              } else {
                setIsShowingPointNotes(false);
                setPointIndex(-1);
              }
            }}
          />
        </PointNotes>
      )}
      <div
        onMouseMove={(e) => {
          getPosition(e);
        }}>
        <MapSVG setIsColorHovering={setIsColorHovering} isColorHovering={isColorHovering} countryId={countryId} ref={mouseRef} hoverAddCountryName={hoverAddCountryName} setIsHovering={setIsHovering} allCountries={allCountries} countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
      </div>
      {isHovering && <ShowName currentPos={currentPos}>{countryName}</ShowName>}
    </Map>
  );
});

export default CustomizedMap;
