import React, { useEffect, useState, useRef } from "react";
import { db } from "../utils/firebaseConfig";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "../App";
import { doc, setDoc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import styled from "styled-components";
import { EditFriendBtn, AddFriendPicInput, AddFriendPicLabel, FriendProfileNoPic } from "../WorldMap";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import trashCan from "../components/trashCan.png";
import trashCanHover from "../components/trashCanHover.png";
import okIcon from "../components/okIcon.png";
import app from "../utils/firebaseConfig";
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
  /* top: 10%; */
  /* right: -240px; */
  /* height: 100%; */
  align-items: center;
  width: 200px;
  /* height: 450px; */
  margin: 20px 20px 20px 0;
  border: 1px solid white;
  /* border-radius: 2%; */
  display: flex;
  flex-direction: column;
  padding: 20px 10px 45px 10px;

  /* z-index: 1000; */
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;
const FriendMask = styled.div`
  position: absolute;
  width: 190px;
  height: 390px;
  /* background-color: rgba(225, 225, 225, 0.5); */
`;

const FriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
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
  /* color: rgb(42, 61, 78); */
  display: block;
  color: white;
  line-height: 25px;

  /* overflow: scroll; */
  display: flex;
  flex-direction: column;

  :nth-last-child(1) {
    height: 153px;
  }
  /* text-shadow: -1px -1px 0 rgb(42, 61, 78), 0px 0px 0 #000, 0px 0px 0 #000, 0px 0px 0 #000; */
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
  padding-top: 20px;
  /* line-height: 65px; */
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
  /* border-bottom: ${(props) => (props.isEditingFriend ? "1px solid rgba(225,225,225,0.5)" : "none")}; */

  /* text-shadow: -1px -1px 0 rgb(42, 61, 78), 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; */
`;

const FriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid white;
  border-radius: 50%;
  object-fit: cover;
`;

const FriendFormInfo = styled.input`
  width: 50%;
`;

const FriendFormTextarea = styled.textarea<{ isEditingFriend: boolean }>`
  width: 100%;
  height: 128px;
  resize: none;
  background-color: inherit;
  border: none;
  outline: none;
  color: white;
  /* border-bottom: ${(props) => (props.isEditingFriend ? "1px solid rgba(225,225,225,0.5)" : "none")}; */
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
  setPopUpMsg: React.Dispatch<React.SetStateAction<string[]>>;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
  // setSearchFriendList: React.Dispatch<React.SetStateAction<string[]>>;
  // searchFriendList: string[];
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
  // console.log(previewFriendNewImgUrl, CityRef.current);

  async function updateFriendInfo(index: number, newObj: friendListType) {
    // searchFriendList.splice(index, 1, newObj.name);

    // console.log(newSearhingName);
    console.log(newObj);
    friendList[index] = newObj;
    let newfriendsList = friendsList.filter((friends) => {
      // console.log(friends.countryId);
      console.log(friendsList);
      return friends.countryId !== countryId;
    });
    console.log(friendList);
    newfriendsList = [...newfriendsList, ...friendList];

    setFriendsList(newfriendsList);

    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { merge: true });
    setNotificationInfo({ text: "Successfully edit your friends info!", status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 2000);
  }

  function sendEditFriendInfo(index: number, newObj: friendListType) {
    if (imageUpload == null) {
      // console.log(pointTitleInputRef.current.value);
      newObj.imgUrl = friendOriginalPhoto;
      // const url = friendOriginalPhoto;
      updateFriendInfo(index, newObj);
      console.log("這裡");
      // friendList
      // setPointList((pre) => {
      //   pre[pointIndex] = {
      //     ...pre[pointIndex],
      //     title: pointTitleInputRef.current?.value || "",
      //     imgUrl: previewImgUrl,
      //     notes: pointNotes,
      //   };
      //   const newArr = [...pre];
      //   console.log(newArr);
      //   return newArr;
      // });
    } else {
      // let newTitle = pointTitleInputRef.current?.value;
      const imageRef = ref(storage, `${uid}/friendMap/${imageUpload.name}`);
      console.log("還是這裡");
      // setPointList((pre) => {
      //   pre[pointIndex] = {
      //     ...pre[pointIndex],
      //     title: newTitle,
      //     notes: pointNotes,
      //   };
      //   const newArr = [...pre];
      //   return newArr;
      // });
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)
          newObj.imgUrl = url;
          updateFriendInfo(index, newObj);

          // setPointList((pre) => {
          //   pre[pointIndex] = {
          //     ...pre[pointIndex],
          //     imgUrl: url,
          //   };
          //   const newArr = [...pre];
          //   return newArr;
          // });
          // setNotePhoto(url);
        });
      });
    }
    // let newHaveFriendList = haveFriendList
    //   .reduce((acc,curr) => {
    //     let index = acc.findIndex(country => country.Id = countryId)
    //     acc[index].friend -= 1
    //     (acc[index].friend !== 0)
    //     console.log(obj.countryId === countryId);
    //     if (obj.countryId === countryId) {
    //       obj.haveFriend = obj.haveFriend - 1;
    //     }
    //     return obj;
    //   })
    //   .filter((obj) => {
    //     return obj.haveFriend !== 0;
    //   });
    // console.log(newFriendList);

    // console.log(newNewHaveFriendList);

    // let newHaveFriendList = haveFriendList.filter((obj) => obj.countryId === countryId);
    // console.log(newHaveFriendList[0].haveFriend - 1);
    // console.log(newHaveFriendList);
    // setHaveFriendList(newHaveFriendList);

    // await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), {
    //   friends: arrayRemove(friendList[index]),
    //   haveFriend: friendList.length - 1,
    // });
  }
  // console.log(friendsList);
  return (
    <>
      <FriendInsideBox>
        {isEditingFriend ? <></> : <FriendMask></FriendMask>}
        <DeleteFriendBtn
          onClick={(e) => {
            setIsShowingPopUp(true);
            setPopUpMsg([`Are you sure  you want to delete the friend "${friendList[index].name}" 😭 ?`, "Yes", "No", `${index}`, `deletefriend`]);
          }}></DeleteFriendBtn>
        {isEditingFriend ? (
          <FriendUpdateBtn
            onClick={() => {
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
            }}></FriendUpdateBtn>
        ) : (
          <EditFriendBtn
            onClick={() => {
              setFrienOriginalPhoto(friend.imgUrl);
              setIsEditingFriend(true);
            }}></EditFriendBtn>
        )}
        <AddFriendPicLabel htmlFor={`addFriendPic-${index}`}>{previewFriendNewImgUrl ? <FriendProfilePic src={previewFriendNewImgUrl}></FriendProfilePic> : friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}></FriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>}</AddFriendPicLabel>
        {/* </FriendProfilePic> : friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}> */}
        <AddFriendPicInput
          id={`addFriendPic-${index}`}
          accept="image/png, image/gif, image/jpeg, image/svg"
          type="file"
          onChange={(e) => {
            setImageUpload(e.target.files![0]);
          }}></AddFriendPicInput>

        {/* {friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}></FriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>} */}

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
