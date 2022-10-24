import React, { useState, useRef } from "react";
import { db } from "../utils/firebaseConfig";
import { friendListType, haveFriendListType, notificationInfoType } from "../App";
import { doc, setDoc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import styled from "styled-components";
import { AddFriendPicInput, AddFriendPicLabel, FriendProfileNoPic } from "./FriendsMap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import trashCan from "./icon/trashCan.png";
import trashCanHover from "./icon/trashCanHover.png";
import okIcon from "./icon/okIcon.png";
import app from "../utils/firebaseConfig";
import edit from "./icon/edit.png";
import editHover from "./icon/editHover.png";
const storage = getStorage(app);

const IconBtnStyle = styled.div`
  width: 20px;
  height: 20px;
  bottom: 20px;
  right: 15px;
  background-size: cover;
  position: absolute;
  cursor: pointer;
`;
const FriendInsideBox = styled.div`
  background-color: rgba(42, 61, 78);

  position: relative;
  align-items: center;
  width: 200px;
  margin: 20px 20px 20px 0;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  padding: 20px 10px 45px 10px;
`;
const FriendMask = styled.div`
  position: absolute;
  width: 190px;
  height: 390px;
`;

const FriendSet = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditFriendBtn = styled.div`
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
const FriendUpdateBtn = styled(IconBtnStyle)`
  background-image: url(${okIcon});
  right: 45px;
  bottom: 19px;
  :hover {
    bottom: 21px;
  }
`;

const DeleteFriendBtn = styled(IconBtnStyle)`
  background-image: url(${trashCan});
  :hover {
    background-image: url(${trashCanHover});
  }
`;

const FriendFormdiv = styled.div`
  width: 150px;
  height: 40px;
  line-height: 19px;
  font-size: 16px;
  margin-bottom: 8px;
  display: block;
  color: white;
  line-height: 25px;
  display: flex;
  flex-direction: column;

  :nth-last-child(1) {
    height: 153px;
  }
`;

const FriendFormInput = styled.input<{ isEditingFriend: boolean }>`
  width: 150px;
  height: 40px;
  outline: none;
  border: none;
  background-color: inherit;
  color: white;
  border-bottom: ${(props) => (props.isEditingFriend ? "1px solid rgba(225,225,225,0.5)" : "none")};
`;

const FriendFormTitle = styled.input<{ isEditingFriend: boolean }>`
  width: 159px;
  height: 50px;
  font-size: 20px;
  margin-bottom: 20px;
  margin: 0 auto;
  text-align: center;
  overflow-x: scroll;
  overflow-y: hidden;
  background-color: inherit;
  border: none;
  outline: none;
  color: white;
`;

const FriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  object-fit: cover;
`;

const FriendFormTextarea = styled.textarea<{ isEditingFriend: boolean }>`
  width: 100%;
  height: 128px;
  resize: none;
  background-color: inherit;
  border: none;
  outline: none;
  color: white;
`;
type friendInsideBoxType = {
  uid: string;
  friendList: friendListType[];
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  friendsList: friendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  haveFriendList: haveFriendListType[];
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  friend: { imgUrl: string; name: string; city: string; insta: string; notes: string };
  countryId: string;
  index: number;
  countryName: string;
  setPopUpMsg: React.Dispatch<React.SetStateAction<(string | { (): void } | { (index: number): void })[]>>;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
};

function FriendBox({ uid, friendList, setFriendList, friendsList, haveFriendList, setHaveFriendList, setFriendsList, friend, countryId, index, countryName, setPopUpMsg, setIsShowingPopUp, setNotificationInfo }: friendInsideBoxType) {
  const NameRef = useRef<HTMLInputElement>(null);
  const CityRef = useRef<HTMLInputElement>(null);
  const InstaRef = useRef<HTMLInputElement>(null);
  const NotesRef = useRef<HTMLTextAreaElement>(null);
  const [isEditingFriend, setIsEditingFriend] = useState<boolean>(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const previewFriendNewImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : "";
  const [friendOriginalPhoto, setFrienOriginalPhoto] = useState<string>("");
  const imageListRef = ref(storage, "images/");

  async function updateFriendInfo(index: number, newObj: friendListType) {
    friendList[index] = newObj;
    let newfriendsList = friendsList.filter((friends) => {
      return friends.countryId !== countryId;
    });
    newfriendsList = [...newfriendsList, ...friendList];
    setFriendsList(newfriendsList);
    await setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: friendList }, { merge: true });
    setNotificationInfo({ text: "Successfully update your friend profile!", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 2000);
  }

  function sendEditFriendInfo(index: number, newObj: friendListType) {
    if (imageUpload == null) {
      newObj.imgUrl = friendOriginalPhoto;
      updateFriendInfo(index, newObj);
    } else {
      const imageRef = ref(storage, `${uid}/friendMap/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          newObj.imgUrl = url;
          updateFriendInfo(index, newObj);
        });
      });
    }
  }
  async function deleteFriend(index: number) {
    let newFriendsList = friendsList.filter((friend) => {
      return friend.key !== friendList[index].key;
    });
    setFriendsList(newFriendsList);
    let newFriendList = friendList.filter((friend, i) => {
      return i !== index;
    });
    setFriendList(newFriendList);
    let newHaveFriendNum = friendList.length - 1;

    let newHaveFriendList = haveFriendList.map((obj) => {
      if (obj.countryId === countryId) {
        obj.haveFriend = obj.haveFriend - 1;
      }
      return obj;
    });

    let newNewHaveFriendList = [];
    newNewHaveFriendList = newHaveFriendList.filter((obj) => {
      return obj.haveFriend !== 0;
    });
    setHaveFriendList(newNewHaveFriendList);
    if (newFriendList.length) {
      await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
    } else {
      await deleteDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId));
    }
    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), {
      friends: arrayRemove(friendList[index]),
      haveFriend: friendList.length - 1,
    });
    setNotificationInfo({ text: "This friend has been successfully removed 😈 ", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }
  return (
    <>
      <FriendInsideBox>
        {isEditingFriend ? <></> : <FriendMask></FriendMask>}
        <DeleteFriendBtn
          onClick={(e) => {
            setIsShowingPopUp(true);
            setPopUpMsg([`Are you sure you want to remove "${friendList[index].name}" from your friend list? 😭`, "Yes", "No", `${index}`, `deletefriend`, deleteFriend]);
          }}></DeleteFriendBtn>
        {isEditingFriend ? (
          <FriendUpdateBtn
            onClick={() => {
              if (NameRef.current!.value.trim() !== "") {
                let key = friendList[index].key;
                let newObj = {
                  city: CityRef.current!.value,
                  country: countryName,
                  countryId: countryId,
                  imgUrl: "",
                  insta: InstaRef.current!.value,
                  name: NameRef.current!.value,
                  notes: NotesRef.current!.value,
                  key: key,
                };
                sendEditFriendInfo(index, newObj);
                setIsEditingFriend(false);
              } else {
                setNotificationInfo({ text: `Friend's name could not be blank `, status: true });
                setTimeout(() => {
                  setNotificationInfo({ text: "", status: false });
                }, 3000);
              }
            }}></FriendUpdateBtn>
        ) : (
          <EditFriendBtn
            onClick={() => {
              setFrienOriginalPhoto(friend.imgUrl);
              setIsEditingFriend(true);
            }}></EditFriendBtn>
        )}
        <AddFriendPicLabel htmlFor={`addFriendPic-${index}`}>{previewFriendNewImgUrl ? <FriendProfilePic src={previewFriendNewImgUrl}></FriendProfilePic> : friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}></FriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>}</AddFriendPicLabel>
        <AddFriendPicInput
          id={`addFriendPic-${index}`}
          accept="image/png, image/gif, image/jpeg, image/svg"
          type="file"
          onChange={(e) => {
            setImageUpload(e.target.files![0]);
          }}></AddFriendPicInput>
        <FriendFormTitle maxLength={15} isEditingFriend={isEditingFriend} ref={NameRef} defaultValue={friend.name}></FriendFormTitle>
        <FriendSet>
          <FriendFormdiv>
            City: <br />
            <FriendFormInput maxLength={21} isEditingFriend={isEditingFriend} ref={CityRef} defaultValue={friend.city}></FriendFormInput>
          </FriendFormdiv>
          <FriendFormdiv>
            Instagram: <br />
            <FriendFormInput maxLength={21} isEditingFriend={isEditingFriend} ref={InstaRef} defaultValue={friend.insta}></FriendFormInput>
          </FriendFormdiv>
          <FriendFormdiv>
            Notes: <br />
            <FriendFormTextarea maxLength={125} isEditingFriend={isEditingFriend} ref={NotesRef} defaultValue={friend.notes}></FriendFormTextarea>
          </FriendFormdiv>
        </FriendSet>
      </FriendInsideBox>
    </>
  );
}

export default FriendBox;
