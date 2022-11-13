import React, { useState, MouseEvent, forwardRef } from "react";
import MapSVG from "./MapSVG";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Map, CloseBtn, LittleCloseBtn, Flag, ShowName } from "../WorldMap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import FriendBox from "./FriendBox";
import { countryListType, friendListType, haveFriendListType, pointListType, notificationInfoType } from "../App";
import { mousePosType } from "../WorldMap";
import Overlap from "./Overlap";
import { uuidv4 } from "@firebase/util";
import { db } from "../utils/firebaseConfig";
import app from "../utils/firebaseConfig";
import userProfile from "./icon/userProfile.png";

const storage = getStorage(app);

const MapCover = styled.div`
  height: 100%;
  width: 100%;
`;

const FriendBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  z-index: 100;
`;

const FriendOutsideBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  border: 1px solid white;
  background-color: rgba(225, 225, 225, 0.5);
  border-radius: 20px;
  display: flex;
  color: white;
`;

const AddFriendBtn = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 50px;
  width: 50px;
  border: 1px solid white;
  border-radius: 50%;
  text-align: center;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
  color: white;
  background-color: rgba(42, 60, 77, 0.3);
`;

const FriendsCountry = styled.div`
  position: absolute;
  bottom: -40px;
  left: 62px;
  font-weight: 700;
  line-height: 20px;
`;

const AddFriendBox = styled.div`
  position: absolute;
  right: -240px;
  width: 200px;
  height: 500px;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: rgb(42, 61, 78);
`;

const AddFriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const AddFriendFormLabel = styled.label`
  line-height: 19px;
  font-size: 16px;
  padding-left: 2px;
  display: block;
  color: white;
  margin-top: 3px;
`;

const AddFriendFormInput = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  color: white;
`;

const AddFriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 2px;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  margin-top: 6px;
  outline: none;
`;
const FriendMiddleBox = styled.div`
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  margin: 0 28px 0 20px;
`;
const AddFriendTip = styled.div`
  width: 100%;
  margin-top: 450px;
  margin-left: 445px;
  height: 20px;
  bottom: 20px;
  right: 20px;
  text-align: right;
  cursor: default;
`;

const AddFriendSentBtn = styled.div`
  margin-top: 20px;
  text-align: center;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  line-height: 23px;
  height: 25px;
  :hover {
    background-color: rgb(211, 211, 211);
    color: rgba(42, 61, 78);
  }
`;

const addFriendFormGroups = [
  { label: "Friend's name", key: "name" },
  { label: "City", key: "city" },
  { label: "Instagram", key: "insta" },
  { label: "Notes", key: "notes" },
];

const AddFriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
`;

export const FriendProfileNoPic = styled.div`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  background-image: url(${userProfile});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
`;

export const AddFriendPicLabel = styled.label`
  justify-content: center;
`;
export const AddFriendPicInput = styled.input`
  display: none;
`;
type AddFriendType = {
  name: string;
  // country: string;
  city: string;
  insta: string;
  notes: string;
};
type friendsMapType = {
  mapState: number;
  isShowingPoint: boolean;
  uid: string;
  countryList: countryListType[];
  isShowingPointNotes: boolean;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  getCountryFriends: (id: string) => void;
  friendList: friendListType[];
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  friendsList: friendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  isShowingFriends: boolean;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  countryId: string;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  countryName: string;
  haveFriendList: haveFriendListType[];
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  pointList: pointListType[];
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
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
};

const FriednsMap = forwardRef<SVGSVGElement, friendsMapType>(
  (
    {
      allCountries,
      setIsHovering,
      previewImgUrl,
      hoverAddCountryName,
      setPointPhoto,
      isColorHovering,
      setNotePhoto,
      getPosition,
      currentPos,
      isHovering,
      setIsColorHovering,
      mapState,
      isShowingPoint,
      uid,
      countryList,
      setIsShowingPointNotes,
      isShowingPointNotes,
      getCountryFriends,
      friendList,
      setFriendList,
      friendsList,
      setFriendsList,
      isShowingFriends,
      setIsShowingFriends,
      countryId,
      setCountryId,
      countryName,
      haveFriendList,
      setHaveFriendList,
      pointList,
      setIsShowingPopUp,
      setPopUpMsg,
      setNotificationInfo,
      setIsChangingMap,
      pointIndex,
      setPointIndex,
    },
    mouseRef
  ) => {
    const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const previewFriendImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : "";
    const initialAddFriendState = {
      name: "",
      // country: '',
      city: "",
      insta: "",
      notes: "",
    };
    const [addFriendState, setAddFriendState] = useState<AddFriendType>(initialAddFriendState);

    const sentNewFriendInfo = () => {
      if (imageUpload == null) {
        const url = "";
        if (friendList.length === 0) {
          writeUserMap2Data(url);
        } else {
          updateUserMap2Data(url);
        }
      } else {
        const imageRef = ref(storage, `${uid}/friendsMap/${imageUpload.name}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            if (friendList.length === 0) {
              writeUserMap2Data(url);
            } else {
              updateUserMap2Data(url);
            }
          });
        });
      }
    };

    function writeUserMap2Data(url: string) {
      const key = uuidv4();
      const newFriendList = [];
      const newFriend = {
        countryId: countryId,
        name: addFriendState.name,
        city: addFriendState.city,
        country: countryName,
        insta: addFriendState.insta,
        imgUrl: url,
        notes: addFriendState.notes,
        key,
      };
      newFriendList.push(newFriend);
      setFriendList(newFriendList);
      const newHaveFriendList = [...haveFriendList, { countryId, haveFriend: 1 }];
      setHaveFriendList(newHaveFriendList);
      const newFriendsList = [...friendsList, newFriend];
      setFriendsList(newFriendsList);
      setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: 1 });
      setNotificationInfo({ text: `Congrats for making your first friend in ${countryName}! 😍 `, status: true });
      setTimeout(() => {
        setNotificationInfo({ text: "", status: false });
      }, 4000);
    }
    async function updateUserMap2Data(url: string) {
      let newFriendList = [];
      const newFriend = {
        countryId: countryId,
        name: addFriendState.name,
        city: addFriendState.city,
        country: countryName,
        insta: addFriendState.insta,
        imgUrl: url,
        notes: addFriendState.notes,
        key: uuidv4(),
      };
      newFriendList = [...friendList, newFriend];
      let newHaveFriendNum = friendList.length + 1;
      await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
      setFriendList(newFriendList);
      const newHaveFriendList = haveFriendList.map((countryFriend) => {
        if (countryFriend.countryId === countryId) {
          let a = countryFriend.haveFriend + 1;
          return { ...countryFriend, haveFriend: a };
        }
        return countryFriend;
      });
      setHaveFriendList(newHaveFriendList);
      let newFriendsList = [];
      newFriendsList = [...friendsList, newFriend];
      setFriendsList(newFriendsList);
      setNotificationInfo({ text: "Congrats for making another new friend! 😃 ", status: true });
      setTimeout(() => {
        setNotificationInfo({ text: "", status: false });
      }, 4000);
    }

    return (
      <Map
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          setIsChangingMap(false);
          const target = e.target as HTMLInputElement;
          if (target.tagName !== "path") {
            return;
          }
          setCountryId(target.id);
          setIsShowingFriends(true);
          getCountryFriends(target.id);
          setIsShowingPointNotes(false);
          setPointIndex(-1);
        }}>
        <MapCover
          onMouseMove={(e) => {
            getPosition(e);
          }}>
          <MapSVG
            setIsColorHovering={setIsColorHovering}
            isColorHovering={isColorHovering}
            countryId={countryId}
            ref={mouseRef}
            hoverAddCountryName={hoverAddCountryName}
            setIsHovering={setIsHovering}
            allCountries={allCountries}
            countryList={countryList}
            mapState={mapState}
            haveFriendList={haveFriendList}
          />
        </MapCover>
        {isShowingFriends && (
          <FriendBg>
            <FriendOutsideBox>
              <FriendMiddleBox>
                <>
                  {friendList.length < 1 ? (
                    <AddFriendTip>add your first friend in this country</AddFriendTip>
                  ) : (
                    <>
                      {friendList.map((friend: { imgUrl: string; name: string; city: string; insta: string; notes: string; key: string }, index) => {
                        return (
                          <FriendBox
                            setNotificationInfo={setNotificationInfo}
                            setIsShowingPopUp={setIsShowingPopUp}
                            setPopUpMsg={setPopUpMsg}
                            key={friend.key}
                            countryName={countryName}
                            index={index}
                            countryId={countryId}
                            friend={friend}
                            uid={uid}
                            friendList={friendList}
                            setFriendList={setFriendList}
                            friendsList={friendsList}
                            haveFriendList={haveFriendList}
                            setHaveFriendList={setHaveFriendList}
                            setFriendsList={setFriendsList}
                          />
                        );
                      })}
                    </>
                  )}
                </>
              </FriendMiddleBox>
              <LittleCloseBtn
                onClick={() => {
                  setIsShowingFriends(false);
                  setIsAddingFriend(false);
                }}
              />
              <AddFriendBtn
                onClick={() => {
                  setIsAddingFriend(true);
                  setImageUpload(null);
                }}>
                +
              </AddFriendBtn>
              <Flag src={`/flags/${countryId.toLowerCase()}.svg`} />
              <FriendsCountry>{countryName}</FriendsCountry>
              {isAddingFriend && (
                <AddFriendBox>
                  <AddFriendPicLabel htmlFor="addFriendPic">
                    {previewFriendImgUrl ? <AddFriendProfilePic src={previewFriendImgUrl} /> : <FriendProfileNoPic />}
                  </AddFriendPicLabel>
                  <AddFriendPicInput
                    id="addFriendPic"
                    accept="image/png, image/gif, image/jpeg, image/svg"
                    type="file"
                    onChange={(e) => {
                      setImageUpload(e.target.files![0]);
                    }}
                  />
                  {addFriendFormGroups.map(({ label, key }) => (
                    <AddFriendSet key={key}>
                      <AddFriendFormLabel>{label}</AddFriendFormLabel>
                      {key === "notes" ? (
                        <AddFriendFormTextarea
                          maxLength={125}
                          onChange={(e) =>
                            setAddFriendState({
                              ...addFriendState,
                              [key]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <AddFriendFormInput
                          maxLength={21}
                          onChange={(e) =>
                            setAddFriendState({
                              ...addFriendState,
                              [key]: e.target.value,
                            })
                          }
                        />
                      )}
                    </AddFriendSet>
                  ))}
                  <AddFriendSentBtn
                    onClick={() => {
                      if (addFriendState.name.trim() !== "") {
                        sentNewFriendInfo();
                        setIsAddingFriend(false);
                        setAddFriendState({
                          name: "",
                          city: "",
                          insta: "",
                          notes: "",
                        });
                      } else {
                        setNotificationInfo({ text: `Friend's name could not be blank `, status: true });
                        setTimeout(() => {
                          setNotificationInfo({ text: "", status: false });
                        }, 3000);
                      }
                    }}>
                    Create
                  </AddFriendSentBtn>
                  <CloseBtn
                    onClick={() => {
                      setIsAddingFriend(false);
                    }}
                  />
                </AddFriendBox>
              )}
            </FriendOutsideBox>
          </FriendBg>
        )}
        {isHovering && <ShowName currentPos={currentPos}>{countryName}</ShowName>}
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

export default FriednsMap;
