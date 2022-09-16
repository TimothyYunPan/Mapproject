import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalStyleComponent } from "styled-components";
import countries from "./utils/countries";
import MapSVG from "./components/MapSVG";
import Login from "./components/Login";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs, deleteField, updateDoc, DocumentData, query, where } from "firebase/firestore";
import { EventType } from "@testing-library/react";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import app from "./utils/firebaseConfig";
import { db } from "./utils/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CountryCheckList from "./components/CountryCheckList";
const storage = getStorage(app);

// async function writeUserMap1Data(country:string) {
//   console.log("write")
//   await setDoc(doc(db, "user", uid, "visitedCountries", country), {
//     visited:true
//   });
//   // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
//   //   country
//   // });
// }
// async function deleteUserMap1Data(country:string){
//   console.log("delete")
//   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
//     visited: deleteField()
//   });
// }

// async function updateUserMap1Data(country:string){
//   // console.log("delete")
//   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
//     visited: false
//   });
// }

// async function writeUserMap2Data(addFriendState:any) {
//   console.log(addFriendState)
//   console.log("write")
//   await setDoc(doc(db, "user", uid, "friendsLocatedCountries", addFriendState.country), {
//       friends:[
//         {
//           name: addFriendState.name,
//           country: "",
//           city: "",
//           insta: addFriendState.insta,
//           imageUrl: "",
//           notes: addFriendState.notes
//         }
//       ]

//   });
//   // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
//   //   country
//   // });
// }

const Wrapper = styled.div`
  height: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
`;

const Map = styled.div`
  position: relative;
  /* height:100%;
  width: 100%; */
  /* height: 200px; */
`;

const ChangeMapBtn = styled.button`
  height: 20px;
  width: 80px;
`;
const LoginBtn = styled.button`
  height: 20px;
  width: 80px;
  margin-top: 20px;
`;

const SearchBtn = styled.button`
  position: absolute;
  height: 40px;
  width: 60px;
  top: 50px;
  right: 50px;
  z-index: 150;
`;
const SearchInput = styled.input`
  position: absolute;
  height: 40px;
  width: 200px;
  right: 50px;
  top: 50px;
  z-index: 100;
`;

type mousePlaceType = {
  x?: number | undefined;
  y?: number | undefined;
};

const ShowName = styled.div<{
  mousePlace: mousePlaceType;
}>`
  /* width: 50px; */
  /* height: 50px; */
  font-size: 16px;
  position: absolute;
  cursor: pointer;

  top: ${(props) => (props.mousePlace.y as number) - 160}px;
  left: ${(props) => props.mousePlace.x}px;
  /* top:0; */
  /* left:0 */
  transform: translate(-50%, -150%);
`;
function getMousePos(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const e = event || window.event;
  return { x: e.clientX, y: e.clientY };
}

export interface countryListType {
  countryId: string;
  visited: boolean;
}
//map2

const FriendBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0%, 0%, 0%, 0.05);
  /* background: lidnear-gradient(to right, #2BC0E4 0%, #EAECC6 100%); */

  /* opacity: 0.5; */
`;

const FriendBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  border: 1px solid black;
  display: flex;
  /* overflow: scroll; */

  /* z-index: 100; */
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;

const FriendNum = styled.div`
  width: 400px;
  height: 20px;
  position: absolute;
  left: 20px;
  top: 550px;
  z-index: 150;
  /* background-color: black; */
`;

const AddFriendBtn = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  /* transform: translate(-50%,-50%); */
  height: 50px;
  width: 50px;
  border: 1px solid black;
  border-radius: 50%;
  text-align: center;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
  /* z-index: 100; */
`;
const CloseBtn = styled.div`
  position: absolute;
  top: 10px;
  right: 1%;
  /* margin: 10px; */
  /* transform: translate(-50%,-50%); */
  height: 50px;
  width: 50px;
  /* border: 1px solid black; */
  /* border-radius: 50%; */
  text-align: center;
  font-size: 24px;
  line-height: 46px;
  cursor: pointer;
  /* z-index: 100; */
`;
const AddFriendBox = styled.div`
  position: absolute;
  /* top: 10%; */
  right: -240px;
  /* height: 100%; */
  width: 200px;
  height: 500px;

  border: 1px solid black;
  /* border-radius: 2%; */
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;

const AddFriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const AddFriendFormLabel = styled.label`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const AddFriendFormInput = styled.input`
  width: 100%;
`;

const AddFriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
`;
const FriendMiddleBox = styled.div`
  display: flex;
  overflow: scroll;
`;

const FriendInsideBox = styled.div`
  /* position: absolute; */
  /* top: 10%; */
  /* right: -240px; */
  /* height: 100%; */
  width: 200px;
  height: 450px;
  margin: 20px;
  border: 1px solid black;
  /* border-radius: 2%; */
  display: flex;
  flex-direction: column;
  padding: 20px;

  /* z-index: 1000; */
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
`;

const FriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const FriendFormdiv = styled.div`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;

const FriendFormInfo = styled.input`
  width: 50%;
`;

const FriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
`;

const FriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid black;
  border-radius: 50%;
`;

const AddFriendSentBtn = styled.button`
  margin-top: 24px;
  text-align: center;
  width: 100%;
  cursor: pointer;
`;

const addFriendFormGroups = [
  { label: "Name", key: "name" },
  { label: "City", key: "city" },
  { label: "Insta", key: "insta" },
  { label: "Notes", key: "notes" },
];

const AddFriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid black;
  border-radius: 50%;
  cursor: pointer;
`;

const AddFriendPicLabel = styled.label``;
const AddFriendPicInput = styled.input`
  display: none;
`;

const randomColor = Math.floor(Math.random() * 16777215).toString(16);
// const Point = styled.div<{svgScreenPosition:{}}>`
//   position: absolute;
//   top: ${(props)=>{return (props.svgScreenPosition.y) + "px"}};
//   left: ${(props)=>{return (props.svgScreenPosition.x) + "px" }};
//   height: 7px;
//   width: 7px;
//   cursor: pointer;
//   border-radius: 50%;
//   background-color: blue

// `
const PointSet = styled.div<{ pointInfo: pointListType }>`
  position: absolute;
  top: ${(props) => {
    return props.pointInfo.y - 161 + "px";
  }};
  left: ${(props) => {
    return props.pointInfo.x - 4 + "px";
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid black; */
`;
const Point = styled.div`
  /* position: absolute; */
  height: 7px;
  width: 7px;
  cursor: pointer;
  border-radius: 50%;
  background-color: blue;
`;
const PointSole = styled.div`
  background-color: grey;
  height: 20px;
  width: 1.5px;
  /* position: absolute; */
`;

const PointNotes = styled.div`
  width: 300px;
  height: 500px;
  /* height: 100px; */
  position: absolute;
  border: 1px solid black;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid black; */
`;

// const PointInfoBox =

const PointNotesTitle = styled.h2``;

const PointNotesTextArea = styled.textarea`
  resize: none;
  width: 90%;
  height: 80%;
`;

const PointNotesTextImg = styled.img`
  width: 200px;
  height: 120px;
`;

const NotesFlex = styled.div`
  /* display: flex; */
`;

// const AddCityInput = styled.input`
//   width: 90%

// `

// const AddSocialMediaInput = styled.input`

// `
const NotesPhotoInput = styled.input`
  display: none;
`;

const Block1 = styled.div`
  height: 50px;
  width: 50px;
  background-color: #008b8b;
  opacity: 1;
`;
const Block2 = styled(Block1)`
  opacity: 0.9;
`;
const Block3 = styled(Block1)`
  opacity: 0.7;
`;
const Block4 = styled(Block1)`
  opacity: 0.5;
`;
const NotesPhotoLabel = styled.label``;

type pointListType = {
  countryId: string;
  y: number;
  x: number;
  imgUrl: string;
  notes: string;
};

export type haveFriendListType = {
  countryId: string;
  haveFriend: number;
};
type friendListType = {
  countryId: string;
  name: string;
  city: string;
  country: string;
  insta: string;
  imgUrl: string;
  notes: string;
};
type mousePosType = {
  x: number | null;
  y: number | null;
};

function WorldMap() {
  const [mapState, setMapState] = useState<number>(0);
  // console.log(mapState)
  const [isHovering, setIsHovering] = useState<boolean>(false);
  // const [isClicked, setIsClicked]= useState<boolean>(false)
  const [countryName, setCountryName] = useState<string>("");
  const [countryCount, setCountryCount] = useState<number>(0);
  // console.log(countryName)
  // const [useTarget, setUseTarget] = useState<any>("")
  const [isColored, setIsColored] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<countryListType[]>([]);
  // console.log(countryList);
  const [isShowingFriends, setIsShowingFriends] = useState<boolean>(false);
  // console.log(countryList)
  const [countryCollection, setCountryCollection] = useState<string[]>([]);
  // console.log(countryCollection)
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  // console.log(imageList)
  const [myMapImageList, setMyMapImageList] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log(isLoggedIn)
  const [countryId, setCountryId] = useState<string>("");
  // console.log(countryId);
  const imageListRef = ref(storage, "images/");
  const [svgPosition, setSvgPosition] = useState<{}>({});
  const [svgScreenPosition, setSvgScreenPosition] = useState<{}>({});
  // console.log(svgPosition)
  const [friendsList, setFriendsList] = useState<friendListType[]>([]);
  // console.log(friendsList);
  const [friendList, setFriendList] = useState<friendListType[]>([]);
  // console.log(friendList);
  const [haveFriendList, setHaveFriendList] = useState<haveFriendListType[]>([]);
  const [isShowingPoint, setIsShowingPoint] = useState<boolean>(false);
  // console.log(haveFriendList);
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false);
  const [uid, setUid] = useState<string>("");
  // console.log(uid);
  const [pointNotes, setPointNotes] = useState<string>("");
  // console.log(pointNotes);
  const [mousePos, setMousePos] = useState<mousePosType>({ x: null, y: null });
  // console.log(mousePos)
  const [map3Data, setMap3Data] = useState<pointListType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pointList, setPointList] = useState<pointListType[]>([]);
  const [singlePointList, setSinglePointList] = useState<pointListType[]>([]);
  // console.log(singlePointList);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchCountry, setSearchCountry] = useState<string>("");
  // console.log(searchCountry);
  // console.log(pointList);
  const [isShowingPointNotes, setIsShowingPointNotes] = useState<boolean>(false);
  // const [visitedCountries, setVisitedCountries] = useState<boolean>(false)
  const [mousePlace, setMousePlace] = useState<{
    x: number | undefined;
    y: number | undefined;
  }>({ x: 0, y: 0 });
  // console.log(mousePlace);
  const [pointIndex, setPointIndex] = useState<number>(-1);
  // console.log(pointIndex);

  type AddFriendType = {
    name: string;
    // country: string;
    city: string;
    insta: string;
    notes: string;
  };
  const initialAddFriendState = {
    name: "",
    // country: '',
    city: "",
    insta: "",
    notes: "",
  };
  const [addFriendState, setAddFriendState] = useState<AddFriendType>(initialAddFriendState);
  function getUserData(userUid: string) {
    getUserMap1Data(userUid);
    getUserMap2Data(userUid);
    getUserMap3Data(userUid);
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUid(user.uid);
        console.log("登入");
        console.log(user.uid);
        getUserData(user.uid);
        setIsLoggedIn(true);
        // ...
      } else {
        // User is signed out
        // ...
        // setTimeout(() => {
        //   alert("喜歡這個網站嗎？快速註冊打造個人專屬地圖！");
        // }, 5000);
      }
    });
    // const user = auth.currentUser;
    // console.log(auth.currentUser);
    // if (user) {
    //   console.log(user);
    //   console.log("登入");

    //   // setUid(user.uid);
    //   // getUserData(user);
    // } else {
    //   console.log("沒有登入");

    //   // No user is signed in.
    // }

    listAll(imageListRef).then((response) => {
      const urlArr: string[] = [];
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          urlArr.push(url);
          setImageList(urlArr);
        });
      });
    });
  }, []);

  async function writeUserMap1Data(country: string) {
    console.log(country);
    await setDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: true,
    });
    // console.log("我有寫啦")
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  async function writeUserMap3Data(country: string, newObj: pointListType, url: string) {
    console.log("有印到");
    console.log(country);
    console.log(newObj);

    await setDoc(doc(db, "user", uid, "custimizedMapCountries", country), {
      List: [
        {
          countryId: country,
          y: newObj.y,
          x: newObj.x,
          imgUrl: url,
          notes: newObj.notes,
        },
      ],
    });
    console.log("我有寫啦");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  // let newFriendList = [];
  // const newFriend = {
  //   countryId: countryId,
  //   name: addFriendState.name,
  //   // country: "",
  //   city: addFriendState.city,
  //   country: countryName,
  //   insta: addFriendState.insta,
  //   imgUrl: url,
  //   notes: addFriendState.notes,
  // };
  // newFriendList = [...friendList, newFriend];
  // await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList });
  // setFriendList(newFriendList);
  // // console.log(addFriendState)
  // console.log("write");

  async function updateUserMap3Data(countryId: string, newObj: pointListType, url: string) {
    console.log("嗨");
    console.log(countryId);
    console.log(pointList);
    console.log(countryId);
    let newPointList = [];
    const newList = {
      countryId: countryId,
      y: newObj.y,
      x: newObj.x,
      imgUrl: url,
      notes: newObj.notes,
    };
    newPointList = [...singlePointList, newList];

    await updateDoc(doc(db, "user", uid, "custimizedMapCountries", countryId), { List: newPointList });

    console.log("更新點點");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  // async function deleteUserMap1Data(country:string){
  //   console.log("delete")
  //   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
  //     visited: deleteField()
  //   });
  // }

  async function updateUserMap1Data(country: string) {
    // console.log("delete")
    await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: false,
    });
  }

  async function getUserMap1Data(userUid: string) {
    const q = collection(db, "user", userUid, "visitedCountries");
    const querySnapshot = await getDocs(q);
    let newCountryList: countryListType[] = [];
    // console.log(querySnapshot);
    querySnapshot.forEach((country) => {
      // console.log(country.data());
      // console.log(country.id, '=>' ,country.data())
      let t = { countryId: country.id, visited: country.data().visited };
      newCountryList.push(t);
      setCountryList(newCountryList);
    });
  }
  async function getUserMap2Data(userUid: string) {
    const q = collection(db, "user", userUid, "friendsLocatedCountries");
    const querySnapshot = await getDocs(q);
    let newHaveFriendList: haveFriendListType[] = [];
    let newFriendsList: friendListType[] = [];
    querySnapshot.forEach((country) => {
      let newHaveFriendObj = {
        countryId: country.id,
        haveFriend: country.data().haveFriend,
      };
      newHaveFriendList.push(newHaveFriendObj);
      setHaveFriendList(newHaveFriendList);
      country.data().friends.forEach((friend: friendListType) => {
        let newFriendObj = {
          countryId: country.id,
          name: friend.name,
          // country: "",
          city: friend.city,
          country: friend.country,
          insta: friend.insta,
          imgUrl: friend.imgUrl,
          notes: friend.notes,
        };
        newFriendsList.push(newFriendObj);
      });
      setFriendsList(newFriendsList);
    });
  }
  async function getUserMap3Data(userUid: string) {
    const q = collection(db, "user", userUid, "custimizedMapCountries");
    const querySnapshot = await getDocs(q);
    let newPointList: pointListType[] = [];
    // console.log(querySnapshot);
    querySnapshot.forEach((country) => {
      // console.log(country);

      console.log(country.data().List);
      country.data().List.forEach((point: pointListType) => {
        let newPointObj = {
          countryId: country.id,
          imgUrl: point.imgUrl,
          notes: point.notes,
          x: point.x,
          y: point.y,
        };
        newPointList.push(newPointObj);
        // console.log(newPointObj)
      });
      console.log(newPointList);
      setPointList(newPointList);
    });
  }

  // function getSvgP(e){
  //   const svg = document.getElementById("CtySVG")
  //   if(svg){
  //   const pt = svg.createSVGPoint();
  //   pt.x = e.clientX;
  //   pt.y = e.clientY;
  //   console.log(pt.x,pt.y)
  //   const svgP = pt.matrixTransform( svg.getScreenCTM().inverse() );
  //   console.log(svgP)
  //   setSvgPosition(svgP)
  //   return svgP
  //   }

  // }
  function searchCountries() {
    const result = countries.filter(function (obj) {
      return obj.name == searchValue;
    });
    console.log(result);
    let a = result[0].code;
    setSearchCountry(a);
    if (a) {
      document.getElementById(a)!.style.strokeWidth = "2px";
      document.getElementById(a)!.style.stroke = "gold";
    }
    // countries.forEach((country)=>{

    // })
  }

  function getUserMap2Friends(id: string) {
    const nf: friendListType[] = [];
    console.log(id);

    friendsList.forEach((friend) => {
      // console.log(friend);
      if (friend.countryId === id) {
        nf.push(friend);
      }
    });
    console.log(nf);
    setFriendList(nf);
  }

  function getUserMap3Points(id: string) {
    const newPointInfo: pointListType[] = [];
    console.log(id);

    pointList.forEach((pointInfo) => {
      console.log(pointInfo);
      if (pointInfo.countryId === id) {
        newPointInfo.push(pointInfo);
      }
    });
    console.log(newPointInfo);
    setSinglePointList(newPointInfo);
  }

  // async function getUserMap2Data(id){
  //   const q = doc(db, "user", uid, "friendsLocatedCountries", id);
  //   console.log("我是拿資料")
  //   const querySnapshot = await getDoc(q);

  //   if(querySnapshot.exists()){
  //     setFriendsList(querySnapshot.data().friends)
  //     // setHaveFriendList(querySnapshot.data().haveFriend)
  //     // console.log(querySnapshot.data())

  //   }else{
  //     setFriendsList([])
  //   }
  // }
  //bug here
  async function updateUserMap2Data(url: string) {
    // console.log("delete")
    let newFriendList = [];
    const newFriend = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
    };
    newFriendList = [...friendList, newFriend];
    const newHaveFriendNum = friendList.length + 1;
    console.log(newFriendList);
    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), { friends: newFriendList, haveFriend: newHaveFriendNum });
    setFriendList(newFriendList);
    const newHaveFriendList = haveFriendList.map((countryFriend) => {
      if (countryFriend.countryId === countryId) {
        let a = countryFriend.haveFriend + 1;
        console.log({ ...countryFriend, haveFriend: a });
        return { ...countryFriend, haveFriend: a };
      }
      return countryFriend;
    });
    setHaveFriendList(newHaveFriendList);
    let newFriendsList = [];
    newFriendsList = [...friendsList, newFriend];
    setFriendsList(newFriendsList);
    // console.log(addFriendState)
    console.log("update");
  }

  function hoverAddCountryName(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLInputElement;
    const result = countries.filter(function (obj) {
      return obj.code == target.id;
    });
    setMousePlace(getMousePos(e));
    if (result.length > 0) {
      setCountryName(result[0].name);
    }

    setIsHovering(true);
  }

  // function deleteCheckedToMap(target:HTMLInputElement){
  //   // console.log(123)
  //   let targetValue = target.value;
  //   countries.forEach(countryObj => {
  //     if(countryObj.name === targetValue){
  //       let code = countryObj.code
  //       targetValue = code
  //     }
  //   })
  //   if(target.checked){deleteUserMap1Data(targetValue)}
  // }
  // console.log(imageUpload)
  const sentNewFriendInfo = () => {
    if (imageUpload == null) {
      const url = "";
      if (friendList.length === 0) {
        console.log("我是write");
        writeUserMap2Data(url);
      } else {
        console.log("我是update");

        updateUserMap2Data(url);
      }
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)
          if (friendList.length === 0) {
            writeUserMap2Data(url);
          } else {
            updateUserMap2Data(url);
          }
        });
      });
    }
  };

  function sentNewNotesInfo(country: string, newObj: pointListType) {
    console.log(singlePointList);
    if (imageUpload == null) {
      const url = "";
      if (singlePointList.length <= 1) {
        console.log("我是write");
        writeUserMap3Data(country, newObj, url);
      } else {
        console.log("我是update");

        updateUserMap3Data(country, newObj, url);
      }
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // writeUserMap2Data(url)
          if (friendList.length === 0) {
            writeUserMap3Data(country, newObj, url);
          } else {
            updateUserMap3Data(country, newObj, url);
          }
        });
      });
    }
  }
  function updateCountryCount() {
    let newCountryCount = 0;
    countryList.filter((item) => {
      if (item.visited === true) {
        newCountryCount += 1;
      }
    });
    console.log(newCountryCount);
    setCountryCount(newCountryCount);
  }
  // function uploadImage(){
  //   if(imageUpload == null) return;
  //   const imageRef = ref(storage,`images/${imageUpload.name}`)
  //   uploadBytes(imageRef,imageUpload).then((snapshot)=>{
  //     getDownloadURL(snapshot.ref).then((url)=>{

  //       setImageList((prev)=>[...prev, url])
  //     })
  //   })
  // }

  function writeUserMap2Data(url: string) {
    let newFriendList = [];
    const data = {
      friends: [
        {
          name: addFriendState.name,
          // country: "",
          city: addFriendState.city,
          country: countryName,
          insta: addFriendState.insta,
          imgUrl: url,
          notes: addFriendState.notes,
        },
      ],
      haveFriend: 1,
    };
    setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), data);
    const data2 = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
    };
    newFriendList.push(data2);
    setFriendList(newFriendList);
    // console.log(addFriendState)
    console.log("write");
    let newHaveFriendList = [];
    let newHaveFriendObj = { countryId: countryId, haveFriend: 1 };
    newHaveFriendList = [...haveFriendList, newHaveFriendObj];
    let newFriendsList = [];
    newFriendsList = [...friendsList, data2];
    setFriendsList(newFriendsList);
    // newHaveFriendList.push(newHaveFriendObj);
    setHaveFriendList(newHaveFriendList);
  }

  return (
    <>
      <Wrapper>
        <ChangeMapBtn
          onClick={() => {
            setMapState(1);
            setIsShowingPoint(false);
          }}>
          Visited{" "}
        </ChangeMapBtn>
        <br />
        <ChangeMapBtn
          onClick={() => {
            setMapState(2);
          }}>
          Friends{" "}
        </ChangeMapBtn>
        <br />
        <ChangeMapBtn
          onClick={() => {
            setMapState(3);
            setIsShowingPoint(true);
          }}>
          my Map
        </ChangeMapBtn>
        <LoginBtn
          onClick={() => {
            setMapState(4);
          }}>
          Login
        </LoginBtn>
        <SearchInput
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setSearchValue(e.target.value);
              searchCountries();
            }
          }}></SearchInput>
        <SearchBtn
          onClick={(e) => {
            searchCountries();
          }}>
          Search
        </SearchBtn>
        {mapState && mapState === 1 ? (
          <>
            <Map
              onMouseOver={(e) => {
                hoverAddCountryName(e);
              }}
              onMouseLeave={(e) => {
                setIsHovering(false);
              }}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.tagName !== "path") {
                  return;
                }
                // setUseTarget(target.id)
                // const result = countries.filter(function(obj){return obj.code == target.id })
                // setIsClicked(true)
                let ColorChange = "rgb(77, 128, 230)";
                let ColorOrigin = "rgb(206, 226, 245)";
                if (target.style.fill == "") {
                  // target.style.fill = ColorChange;
                  console.log(target.id);
                  writeUserMap1Data(target.id);
                  console.log("空去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorOrigin) {
                  // target.style.fill = ColorChange;
                  writeUserMap1Data(target.id);
                  console.log("去過");
                  countryList.push({ countryId: target.id, visited: true });
                  const newCountryList = [...countryList];
                  setCountryList(newCountryList);
                } else if (target.style.fill === ColorChange) {
                  // console.log(123, target.style)
                  target.style.fill = ColorOrigin;
                  updateUserMap1Data(target.id);
                  const newCountryList = countryList.map((object) => {
                    // console.log(targetValue)
                    // console.log(object.countryId)
                    if (object.countryId === target.id) {
                      return { ...object, visited: false };
                    }
                    return object;
                  });
                  setCountryList(newCountryList);
                  console.log("沒去過");
                }
                // updateCountryCount();
              }}>
              {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
              <MapSVG countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
              {/* <button
                onClick={() => {
                  setIsShowingPoint(true);
                }}>
                重疊起來
              </button> */}
              <FriendNum>You've visited {countryList.length} countries</FriendNum>
            </Map>

            <CountryCheckList writeUserMap1Data={writeUserMap1Data} countryCollection={countryCollection} setCountryList={setCountryList} setCountryCollection={setCountryCollection} countryList={countryList}></CountryCheckList>
          </>
        ) : mapState === 2 ? (
          <Map
            onMouseOver={(e) => {
              hoverAddCountryName(e);
            }}
            onMouseLeave={(e) => {
              setIsHovering(false);
            }}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              // console.log(target.tagName);
              if (target.tagName !== "path") {
                return;
              }
              setCountryId(target.id);
              setIsShowingFriends(true);
              getUserMap2Friends(target.id);
              setIsHovering(false);
            }}>
            <MapSVG countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
            {isShowingFriends && isShowingFriends === true ? (
              <FriendBg>
                <FriendBox>
                  <FriendMiddleBox>
                    {friendList.map((friend: { imgUrl: string; name: string; city: string; insta: string; notes: string }) => (
                      <FriendInsideBox>
                        <FriendProfilePic src={friend.imgUrl}></FriendProfilePic>
                        <FriendSet>
                          <FriendFormdiv>{friend.name}</FriendFormdiv>
                          <FriendFormdiv>{friend.city}</FriendFormdiv>
                          <FriendFormdiv>{friend.insta}</FriendFormdiv>
                          <FriendFormdiv>{friend.notes}</FriendFormdiv>
                        </FriendSet>
                      </FriendInsideBox>
                    ))}
                  </FriendMiddleBox>
                  <CloseBtn
                    onClick={() => {
                      setIsShowingFriends(false);
                      setIsAddingFriend(false);
                    }}>
                    X
                  </CloseBtn>
                  <AddFriendBtn
                    onClick={() => {
                      setIsAddingFriend(true);
                    }}>
                    +
                  </AddFriendBtn>
                  {isAddingFriend && isAddingFriend ? (
                    <AddFriendBox>
                      <AddFriendPicLabel htmlFor="addFriendPic">
                        <AddFriendProfilePic src={imageList[0]}></AddFriendProfilePic>
                      </AddFriendPicLabel>

                      <AddFriendPicInput
                        id="addFriendPic"
                        type="file"
                        onChange={(e) => {
                          setImageUpload(e.target.files![0]);
                        }}></AddFriendPicInput>
                      {addFriendFormGroups.map(({ label, key }) => (
                        <AddFriendSet key={key}>
                          <AddFriendFormLabel>{label}</AddFriendFormLabel>
                          {key === "notes" ? (
                            <AddFriendFormTextarea
                              onChange={(e) =>
                                setAddFriendState({
                                  ...addFriendState,
                                  [key]: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <AddFriendFormInput
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
                          sentNewFriendInfo();
                          setIsAddingFriend(false);
                          alert("Congrats for making a new friend");
                        }}>
                        SEND
                      </AddFriendSentBtn>
                      <CloseBtn
                        onClick={() => {
                          setIsAddingFriend(false);
                        }}>
                        X
                      </CloseBtn>
                    </AddFriendBox>
                  ) : (
                    <></>
                  )}
                </FriendBox>
              </FriendBg>
            ) : (
              <></>
            )}
            <FriendNum>
              You've made {friendsList.length} friends located in {haveFriendList.length} countries
            </FriendNum>
            {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
          </Map>
        ) : mapState === 3 ? (
          <Map
            onMouseOver={(e) => {
              hoverAddCountryName(e);
            }}
            onMouseLeave={(e) => {
              setIsHovering(false);
            }}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.tagName !== "path") {
                return;
              }
              getUserMap3Points(target.id);
              setCountryId(target.id);

              // let a = getSvgP(e)
              // const svg = document.getElementById("CtySVG")
              // if(svg){
              // const screenP = a.matrixTransform( svg.getScreenCTM())
              // console.log(screenP)
              // setSvgScreenPosition(screenP)
              // }
              let mousePosition = getMousePos(e);
              setMousePos(mousePosition);
              let a = mousePosition;
              let newObj = {
                countryId: target.id,
                imgUrl: "",
                notes: "",
                x: a.x,
                y: a.y,
              };
              // setPointIndex(pointList.length + 1);
              setPointList([...pointList, newObj]);
            }}>
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
                          id={countryId}
                          onClick={(e) => {
                            // console.log(id)
                            // getUserMap3Points(e.target.id);
                            setPointIndex(index);
                            e.stopPropagation();
                            setIsShowingPointNotes(true);
                            // setPointNotes("");
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
                <PointNotesTitle>Journal</PointNotesTitle>
                {isEditing && isEditing ? (
                  <PointNotesTextArea
                    onChange={(e) => {
                      setPointNotes(e.target.value);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    defaultValue={pointList[pointIndex].notes}></PointNotesTextArea>
                ) : (
                  <div>{pointList[pointIndex].notes}</div>
                )}
                <PointNotesTextImg src={imageList[0]} />
                {/* <div contentEditable="true" onInput={(e) => console.log(e.currentTarget.textContent)}>
                  hi
                  <br />
                  <img src={imageList[0]}></img>
                </div> */}

                <NotesFlex>
                  <NotesPhotoLabel htmlFor="NotesPhotoInput">
                    {/* <button>upload images</button> */}
                    {/* <AddFriendProfilePic src={imageList[0]}></AddFriendProfilePic> */}
                    <div>upload images</div>
                  </NotesPhotoLabel>
                  <NotesPhotoInput
                    type="file"
                    id="NotesPhotoInput"
                    onChange={(e) => {
                      setImageUpload(e.target.files![0]);
                    }}></NotesPhotoInput>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      let newObj: pointListType = {
                        countryId: countryId,
                        x: mousePos.x as number,
                        y: mousePos.y as number,
                        imgUrl: "",
                        notes: pointNotes,
                      };
                      // let newArr = [];
                      setPointList((pre) => {
                        pre[pointIndex] = {
                          ...pre[pointIndex],
                          imgUrl: "AAA",
                          notes: pointNotes,
                        };
                        const newArr = [...pre];
                        console.log(newArr);
                        return newArr;
                      });
                      // console.log(countryId);
                      sentNewNotesInfo(countryId, newObj);
                      // writeUserMap3Data(countryId, newObj);
                      setIsEditing(false);
                    }}>
                    Done
                  </button>
                </NotesFlex>
              </PointNotes>
            ) : (
              <></>
            )}
            <MapSVG countryList={countryList} mapState={mapState} haveFriendList={haveFriendList} />
            {isHovering ? <ShowName mousePlace={mousePlace}>{countryName}</ShowName> : <></>}
          </Map>
        ) : mapState === 4 ? (
          <>
            <Login countryList={countryList} setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Login>
          </>
        ) : (
          <></>
        )}
        <Block1 />
        <Block2 />
        <Block3 />
        <Block4 />
      </Wrapper>
    </>
  );
}

export default WorldMap;
