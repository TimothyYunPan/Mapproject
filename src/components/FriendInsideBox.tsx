// import React, { useEffect, useState, useRef } from "react";
// import { db } from "../utils/firebaseConfig";
// import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType } from "../App";
// import { doc, setDoc, updateDoc, deleteDoc} from "firebase/firestore";
// import styled from "styled-components";
// import {IconBtnStyle, EditFriendBtn, AddFriendPicInput, AddFriendPicLabel, FriendProfileNoPic} from "../WorldMap"
// import trashCan from "./components/trashCan.png";
// import trashCanHover from "./components/trashCanHover.png";
// import okIcon from "./components/okIcon.png";

// const FriendInsideBox = styled.div`
//   background-color: rgba(42, 61, 78);

//   position: relative;
//   /* top: 10%; */
//   /* right: -240px; */
//   /* height: 100%; */
//   align-items: center;
//   width: 200px;
//   /* height: 450px; */
//   margin: 20px 20px 20px 0;
//   border: 1px solid white;
//   /* border-radius: 2%; */
//   display: flex;
//   flex-direction: column;
//   padding: 20px 10px 45px 10px;

//   /* z-index: 1000; */
//   /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
// `;
// const FriendMask = styled.div`
//   position: absolute;
//   width: 190px;
//   height: 390px;
//   /* background-color: rgba(225, 225, 225, 0.5); */
// `;

// const FriendSet = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 10px;
// `;

// const FriendUpdateBtn = styled(IconBtnStyle)`
//   background-image: url(${okIcon});
//   right: 45px;
//   bottom: 19px;
//   :hover {
//     bottom: 21px;
//   }
// `;

// const DeleteFriendBtn = styled(IconBtnStyle)`
//   background-image: url(${trashCan});
//   :hover {
//     background-image: url(${trashCanHover});
//   }
// `;

// const FriendFormdiv = styled.div`
//   width: 150px;
//   height: 40px;
//   line-height: 19px;
//   font-size: 16px;
//   margin-bottom: 8px;
//   /* color: rgb(42, 61, 78); */
//   display: block;
//   color: white;
//   overflow: scroll;
//   display: flex;
//   flex-direction: column;

//   :nth-last-child(1) {
//     height: 150px;
//   }
//   /* text-shadow: -1px -1px 0 rgb(42, 61, 78), 0px 0px 0 #000, 0px 0px 0 #000, 0px 0px 0 #000; */
// `;

// const FriendFormInput = styled.input`
//   width: 150px;
//   height: 40px;
//   outline: none;
//   border: none;
//   background-color: inherit;
//   color: white;
// `;

// const FriendFormTitle = styled.h2`
//   width: 159px;
//   height: 50px;
//   padding-top: 20px;
//   /* line-height: 65px; */
//   font-size: 20px;
//   margin-bottom: 20px;
//   margin: 0 auto;
//   text-align: center;
//   overflow: scroll;

//   /* text-shadow: -1px -1px 0 rgb(42, 61, 78), 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; */
// `;

// const FriendProfilePic = styled.img`
//   height: 80px;
//   width: 80px;
//   border: 1px solid white;
//   border-radius: 50%;
//   object-fit: cover;
// `;

// const FriendFormInfo = styled.input`
//   width: 50%;
// `;

// const FriendFormTextarea = styled.textarea`
//   width: 100%;
//   height: 100px;
//   resize: none;
//   background-color: inherit;
//   border: none;
//   outline: none;
//   color: white;
// `;
// type friendInsideBoxType = {
//   uid: string;
//   friendList: friendListType[];
//   setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
//   friendsList: friendListType[];
//   setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
//   haveFriendList: haveFriendListType[];
//   setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
//   setImageUpload: React.Dispatch<React.SetStateAction<File | null>>;
//   friend:{ imgUrl: string; name: string; city: string; insta: string; notes: string }
//   countryId: string;
//   index: number
// }

// function FriendBox({ uid, friendList, setFriendList, friendsList, haveFriendList, setHaveFriendList, setFriendsList, setImageUpload, friend, countryId, index }:friendInsideBoxType) {
//   const CityRef = useRef<HTMLInputElement>(null);
//   const InstaRef = useRef<HTMLInputElement>(null);
//   const NotesRef = useRef<HTMLInputElement>(null);
//   const [isEditingFriend, setIsEditingFriend] = useState<boolean>(false);
//   async function deleteFriend(index: number) {
//     console.log(friendList[index]);

//     let newFriendsList = friendsList.filter((friend) => {
//       return friend !== friendList[index];
//     });
//     console.log(newFriendsList);
//     setFriendsList(newFriendsList);
//     let newFriendList = friendList.filter((friend, i) => {
//       return i !== index;
//     });
//     setFriendList(newFriendList);
//     let newHaveFriendNum = friendList.length - 1;
//     // setHaveFriendList()

//     let newHaveFriendList = haveFriendList.map((obj) => {
//       console.log(obj.countryId === countryId);
//       if (obj.countryId === countryId) {
//         obj.haveFriend = obj.haveFriend - 1;
//       }
//       return obj;
//     });
//     // console.log(newHaveFriendList);
//     // setHaveFriendList(newHaveFriendList);

//     let newNewHaveFriendList = [];
//     newNewHaveFriendList = newHaveFriendList.filter((obj) => {
//       return obj.haveFriend !== 0;
//     });
//     setHaveFriendList(newNewHaveFriendList);

//     // let newHaveFriendList = haveFriendList
//     //   .reduce((acc,curr) => {
//     //     let index = acc.findIndex(country => country.Id = countryId)
//     //     acc[index].friend -= 1
//     //     (acc[index].friend !== 0)
//     //     console.log(obj.countryId === countryId);
//     //     if (obj.countryId === countryId) {
//     //       obj.haveFriend = obj.haveFriend - 1;
//     //     }
//     //     return obj;
//     //   })
//     //   .filter((obj) => {
//     //     return obj.haveFriend !== 0;
//     //   });
//     // console.log(newFriendList);

//     console.log(newHaveFriendList);
//     // console.log(newNewHaveFriendList);

//     // let newHaveFriendList = haveFriendList.filter((obj) => obj.countryId === countryId);
//     // console.log(newHaveFriendList[0].haveFriend - 1);
//     // console.log(newHaveFriendList);
//     // setHaveFriendList(newHaveFriendList);

//     if (newFriendList.length) {
//       await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
//     } else {
//       await deleteDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId));
//     }
//     // await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), {
//     //   friends: arrayRemove(friendList[index]),
//     //   haveFriend: friendList.length - 1,
//     // });
//   }
//   return (
//     <>
//       <FriendInsideBox>
//         {isEditingFriend ? <></> : <FriendMask></FriendMask>}
//         <DeleteFriendBtn
//           onClick={(e) => {
//             deleteFriend(index);
//           }}></DeleteFriendBtn>
//         {isEditingFriend ? (
//           <FriendUpdateBtn
//             onClick={() => {
//               setIsEditingFriend(false);
//             }}></FriendUpdateBtn>
//         ) : (
//           <EditFriendBtn
//             onClick={() => {
//               setIsEditingFriend(true);
//             }}></EditFriendBtn>
//         )}
//         <AddFriendPicLabel htmlFor="addFriendPic">{friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}></FriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>}</AddFriendPicLabel>

//         <AddFriendPicInput
//           id="addFriendPic"
//           accept="image/png, image/gif, image/jpeg, image/svg"
//           type="file"
//           onChange={(e) => {
//             setImageUpload(e.target.files![0]);
//           }}></AddFriendPicInput>

//         {/* {friend.imgUrl ? <FriendProfilePic src={friend.imgUrl}></FriendProfilePic> : <FriendProfileNoPic></FriendProfileNoPic>} */}
//         <FriendFormTitle>{friend.name}</FriendFormTitle>

//         <FriendSet>
//           <FriendFormdiv>
//             City: <br />
//             <FriendFormInput ref={CityRef} defaultValue={friend.city}></FriendFormInput>
//           </FriendFormdiv>
//           <FriendFormdiv>
//             Instagram: <br />
//             <FriendFormInput ref={InstaRef} defaultValue={friend.insta}></FriendFormInput>
//           </FriendFormdiv>
//           <FriendFormdiv>
//             Notes: <br />
//             <FriendFormTextarea ref={NotesRef} defaultValue={friend.notes}></FriendFormTextarea>
//           </FriendFormdiv>
//         </FriendSet>
//       </FriendInsideBox>
//     </>
//   );
// }

// export default FriendBox;
