import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { GlobalStyleComponent } from "styled-components";
import countries from "./utils/countries";
import MapSVG from "./components/MapSVG";
import Login from "./components/Login";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs, deleteField, updateDoc } from "firebase/firestore";
import { EventType } from "@testing-library/react";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll} from "firebase/storage"
import app from "./utils/firebaseConfig";
import { db } from "./utils/firebaseConfig";
import CountryCheckList from "./components/CountryCheckList";
const storage = getStorage(app)



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
`


const Map = styled.div`
  position: relative;
  /* height:100%;
  width: 100%; */
  /* height: 200px; */
`

const ChangeMapBtn = styled.button`
  height: 20px;
  width: 80px;
  
`
const LoginBtn = styled.button`
  height: 20px;
  width: 80px;
  margin-top: 20px;
`


const ShowName = styled.div<{
  mousePlace:{
    x?: number | undefined;
    y?: number | undefined;
  }}>`
  /* width: 50px; */
  /* height: 50px; */
  font-size:16px;
  position: absolute;

  top:  ${(props) => props.mousePlace.y}px;
  left: ${(props) => props.mousePlace.x}px;
  /* top:0; */
  /* left:0 */
  transform:translate(-50%,-150%)
`
function getMousePos(event:any) {
  const e = event || window.event;
  return {'x':e.clientX,'y':e.clientY}
}

export interface countryListType {
  countryId: string,
  visited: boolean
}
//map2

const FriendBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0%, 0%, 0%, 0.05)
  /* background: lidnear-gradient(to right, #2BC0E4 0%, #EAECC6 100%); */

  /* opacity: 0.5; */
  
`

const FriendBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 800px;
  height: 500px;
  border: 1px solid black;
  display: flex;
  /* overflow: scroll; */

  /* z-index: 100; */
  /* box-shadow: 0 0 0 10000px rgba(0,0,0,0.5) */
  
`
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

`
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

`
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

`

const AddFriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  
`
const AddFriendFormLabel = styled.label`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block; 

`

const AddFriendFormInput = styled.input`
  width: 100%;
  
`

const AddFriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  
`
const FriendMiddleBox = styled.div`
  display: flex;
  overflow: scroll;

`

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

`

const FriendSet = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  
`
const FriendFormdiv = styled.div`
  width: 110px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block; 

`

const FriendFormInfo = styled.input`
  width: 50%;
  
`

const FriendFormTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  
`

const FriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid black;
  border-radius: 50%;

`


const AddFriendSentBtn = styled.button`
  margin-top: 24px;
  text-align: center;
  width:100%;
  cursor: pointer;
`

const addFriendFormGroups = [
  {label: 'Name', key: 'name' },
  {label: 'City', key: 'city' },
  {label: 'Insta', key: 'insta' },
  {label: 'Notes', key: 'notes' },

  
]



const AddFriendProfilePic = styled.img`
  height: 80px;
  width: 80px;
  border: 1px solid black;
  border-radius: 50%;

`

// const AddCityInput = styled.input`
//   width: 90%
  
// `

// const AddSocialMediaInput = styled.input`
  
// `
// const AddNoteInput = styled.input`
  
// `


function WorldMap(){
  const [mapState, setMapState] = useState<number>(0)
  console.log(mapState)
  const [isHovering, setIsHovering]= useState<boolean>(false)
  // const [isClicked, setIsClicked]= useState<boolean>(false)
  const [countryName, setCountryName] = useState<string>("")
  console.log(countryName)
  // const [useTarget, setUseTarget] = useState<any>("")
  const [isColored,setIsColored] = useState<boolean>(false)
  const [countryList, setCountryList] = useState<countryListType[]>([])
  const [isShowingFriends, setIsShowingFriends] = useState<boolean>(false)
  // console.log(countryList)
  const [countryCollection, setCountryCollection] = useState<string[]>([])
  // console.log(countryCollection)
  const [imageUpload, setImageUpload] = useState(null)
  const [imageList, setImageList] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn)
  // console.log(imageList)
  const [countryId, setCountryId] = useState<string>("")
  console.log(countryId)
  const imageListRef = ref(storage, "images/")
  const [friendsList, setFriendsList] = useState([])
  const [friendList, setFriendList] = useState([])
  console.log(friendList)
  const [havefriendList, setHaveFriendList] = useState([])
  console.log(havefriendList)
  const [isAddingFriend, setIsAddingFriend] = useState<boolean>(false)
  console.log(friendsList)
  const [uid, setUid] = useState<string>("")
  console.log(uid)
  // const [visitedCountries, setVisitedCountries] = useState<boolean>(false)
  const [ mousePlace, setMousePlace] = useState<{
    x?: number | undefined;
    y?: number | undefined;
  }>({})

  type AddFriendType = {
    name: string;
    // country: string;
    city: string,
    insta: string;
    notes: any;
  }
  const initialAddFriendState ={
    name: '',
    // country: '',
    city: '',
    insta: '',
    notes: '',
  }
  const [addFriendState, setAddFriendState] = useState<AddFriendType>(initialAddFriendState)

  useEffect(()=>{
    getUserMap1Data()
    // getUserMap2Data()
    setMapState(2)
    getUserMap2Data()
    listAll(imageListRef).then((response)=>{
      const urlArr = []
      response.items.forEach((item)=>{
        getDownloadURL(item).then((url)=>{
          urlArr.push(url)
          setImageList(urlArr)
        })
      })
    })
  },[uid,friendList])
  
//why??
  async function writeUserMap1Data(country:string) {
    console.log(country)
    await setDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited:true
    });
    // console.log("我有寫啦")
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }
//
  // async function deleteUserMap1Data(country:string){
  //   console.log("delete")
  //   await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
  //     visited: deleteField()
  //   });
  // }
  
  async function updateUserMap1Data(country:string){
    // console.log("delete")
    await updateDoc(doc(db, "user", uid, "visitedCountries", country), {
      visited: false
    });
  }

  async function getUserMap1Data(){
    const q = collection(db, "user", uid, "visitedCountries");
    const querySnapshot = await getDocs(q);
    let newCountryList:any[]=[]
    querySnapshot.forEach((country)=>{
      // console.log(country.data())
      // console.log(country.id, '=>' ,country.data())
      let t = {countryId: country.id, visited:country.data().visited}
      newCountryList.push(t)
      setCountryList(newCountryList)
    })
  }
  async function getUserMap2Data(){
    const q = collection(db, "user", uid, "friendsLocatedCountries");
    const querySnapshot = await getDocs(q);
    let newHaveFriendList:any[]=[]
    let newFriendsList:any = []
    querySnapshot.forEach((country)=>{
      let newHaveFriendObj = {countryId: country.id, haveFriend:country.data().haveFriend}
      newHaveFriendList.push(newHaveFriendObj)
      setHaveFriendList(newHaveFriendList)
      country.data().friends.forEach((friend)=>{
        let newFriendObj = {
          countryId: country.id,
          name: friend.name,
          // country: "",
          city: friend.city,
          country: friend.country,
          insta: friend.insta,
          imgUrl: friend.imgUrl,
          notes: friend.notes,
        }
        newFriendsList.push(newFriendObj)
      })
      setFriendsList(newFriendsList)
    })

  }

  function getUserMap2FriendData(id){
    const nf = []
    console.log(id)

    friendsList.forEach((friend)=>{
      console.log(friend)
      if(friend.countryId === id){
        nf.push(friend)
      }
    })
    console.log(nf)
    setFriendList(nf)
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


  async function updateUserMap2Data(url:string){
    // console.log("delete")
    let newFriendList = []
    const newFriend = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
    }
    newFriendList = [...friendList, newFriend]
    await updateDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), {friends:newFriendList});
    setFriendList(newFriendList)
    // console.log(addFriendState)
    console.log("write")
  }




  function hoverAddCountryName(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
    const target = e.target as HTMLInputElement; 
    const result = countries.filter(function(obj){return obj.code == target.id })
    setMousePlace(getMousePos(e))
    setCountryName(result[0].name)
    setIsHovering(true)
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
    if(imageUpload == null) {
      const url = ""
      if(friendList.length === 0){
        console.log("我是write")
        writeUserMap2Data(url)
      }else{
        console.log("我是update")

        updateUserMap2Data(url)
      }
    }else{
    const imageRef = ref(storage,`images/${imageUpload.name}`)
    uploadBytes(imageRef,imageUpload).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url)=>{
        // writeUserMap2Data(url)
        if(friendList.length === 0){
          writeUserMap2Data(url)
        }else{
          updateUserMap2Data(url)
        }
      })
    })}
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

  function writeUserMap2Data(url:any) {
    let newFriendList = []
    const data = {
      friends:[
        { 
          name: addFriendState.name,
          // country: "",
          city: addFriendState.city,
          country: countryName,
          insta: addFriendState.insta,
          imgUrl: url,
          notes: addFriendState.notes,
          
        }
      ],
      haveFriend:"true"
    }
    setDoc(doc(db, "user", uid, "friendsLocatedCountries", countryId), data)  
    const data2 = {
      countryId: countryId,
      name: addFriendState.name,
      // country: "",
      city: addFriendState.city,
      country: countryName,
      insta: addFriendState.insta,
      imgUrl: url,
      notes: addFriendState.notes,
    }
    newFriendList.push(data2)
    setFriendList(newFriendList)
    // console.log(addFriendState)
    console.log("write")
    let newHaveFriendList:any[]=[]
    let newHaveFriendObj = {countryId: countryId, haveFriend:true}
      newHaveFriendList.push(newHaveFriendObj)
      setHaveFriendList(newHaveFriendList)
    
  }


  return(
    <>
      <Wrapper>
        <ChangeMapBtn onClick={()=>{
          setMapState(1);
            }}>Visited </ChangeMapBtn><br/>
        <ChangeMapBtn onClick={()=>{setMapState(2)}}>Friends </ChangeMapBtn><br/>
        <ChangeMapBtn onClick={()=>{setMapState(3)}}>my Map</ChangeMapBtn>
        <LoginBtn onClick={()=>{setMapState(4)}}>Login</LoginBtn>
        {mapState && mapState === 1 ?(
        <>
        <Map onMouseOver={(e) => { 
          hoverAddCountryName(e)
          }} 
          onMouseLeave={(e)=> { setIsHovering(false)}}
          onClick={(e) => { 
            const target = e.target as HTMLInputElement;
            if(target.tagName !== "path"){
              return
            }
            // setUseTarget(target.id)
            // const result = countries.filter(function(obj){return obj.code == target.id })
            // setIsClicked(true)
            let ColorChange = "rgb(77, 128, 230)"
            let ColorOrigin = "rgb(206, 226, 245)"
            // target.style.fill = "#4D80E6"
            // console.log(target.style)
            // console.log(target.style.fill)
            // console.log(ColorOrigin)
            // console.log(ColorChange)
            if (target.style.fill == "") {
              target.style.fill = ColorChange
              console.log(target.id)
              writeUserMap1Data(target.id)
              console.log('空去過')
              countryList.push({countryId: target.id, visited: true})
              const newCountryList = [...countryList]
              setCountryList(newCountryList)


            } else if(target.style.fill === ColorOrigin){
              target.style.fill = ColorChange
              writeUserMap1Data(target.id)
              console.log('去過')
              countryList.push({countryId: target.id, visited: true})
              const newCountryList = [...countryList]
              setCountryList(newCountryList)

              
            } else if (target.style.fill === ColorChange) {
              // console.log(123, target.style)
              target.style.fill = ColorOrigin
              updateUserMap1Data(target.id)
              const newCountryList = countryList.map(object =>{
                // console.log(targetValue)
                // console.log(object.countryId)
                if(object.countryId === target.id){
                  return{...object, visited: false}
                }
                return object
                })
              setCountryList(newCountryList)
              console.log('沒去過')
            }
            
          }}>
          {isHovering ? (<ShowName mousePlace={mousePlace}>{countryName}</ShowName>) : (<></>)}
          <MapSVG countryList={countryList} mapState={mapState} haveFriendList={havefriendList}/>
        </Map>
        <CountryCheckList writeUserMap1Data={writeUserMap1Data} countryCollection={countryCollection} setCountryList={setCountryList} setCountryCollection={setCountryCollection} countryList={countryList}></CountryCheckList>
        </>
        ): mapState === 2 ? (
        <Map onMouseOver={(e) => { 
          hoverAddCountryName(e)
          }} 
          onMouseLeave={(e)=> { setIsHovering(false)}}
          onClick ={(e)=>{
            const target = e.target as HTMLInputElement;
            console.log(target.tagName)
            if(target.tagName !== "path" ){
              return
            }
            setCountryId(e.target.id)
            setIsShowingFriends(true)
            getUserMap2FriendData(e.target.id)
            setIsHovering(false)
          }}>
          <MapSVG countryList={countryList} mapState={mapState} haveFriendList={havefriendList} />
          {isShowingFriends && isShowingFriends === true ?  
            <FriendBg>
              <FriendBox> 
                <FriendMiddleBox>
                {friendList.map((friend:{imgUrl:string,name:string,city:string,insta:string,notes:string})=>(
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
                <CloseBtn onClick={()=>{setIsShowingFriends(false);setIsAddingFriend(false)}}>X</CloseBtn>
                <AddFriendBtn onClick={()=>{setIsAddingFriend(true)}}>+</AddFriendBtn>
                {isAddingFriend && isAddingFriend ? 
                <AddFriendBox>
                  <AddFriendProfilePic src={imageList[0]}></AddFriendProfilePic>
                  <input type="file" onChange={(e)=>{setImageUpload(e.target.files[0])}}></input>
                  {addFriendFormGroups.map(({label,key})=>(
                    <AddFriendSet key={key}>
                      <AddFriendFormLabel>{label}</AddFriendFormLabel>
                      {key === "notes" ? (
                      <AddFriendFormTextarea onChange={(e)=> setAddFriendState({...addFriendState, [key]:e.target.value})}/>
                      ):(
                      <AddFriendFormInput onChange={(e)=> setAddFriendState({...addFriendState, [key]:e.target.value})}/>
                      )}
                
                    </AddFriendSet>
                  ))}
                  <AddFriendSentBtn onClick={()=>{ sentNewFriendInfo(); setIsAddingFriend(true); alert("Congrats for making a new friend")}}>SEND</AddFriendSentBtn>
                  <CloseBtn onClick={()=>{setIsAddingFriend(false)}}>X</CloseBtn>
                </AddFriendBox>
                :<></>}
                
              </FriendBox>
            </FriendBg>
          : <></>
          }
          {isHovering ? (<ShowName mousePlace={mousePlace}>{countryName}</ShowName>) : (<></>)}
        </Map>
        ): mapState === 3 ?(
        <Map>
          <MapSVG countryList={countryList} mapState={mapState} haveFriendList={havefriendList}/>
        </Map>
        ): mapState === 4 ?(
          <>
            <Login setUid={setUid} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Login>
          </>
        ): 
        <></>
        }
        
      </Wrapper>
    </>
  )

}

export default WorldMap