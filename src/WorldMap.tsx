import React, { useState } from "react";
import styled from 'styled-components';
// import { GlobalStyleComponent } from "styled-components";
import Countries from "./utils/Countries";
import MapSVG from "./components/MapSVG";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEcaedfGj9JVZGz4J_g5QQgk2NKh_UnEo",
  authDomain: "maphub-b1531.firebaseapp.com",
  projectId: "maphub-b1531",
  storageBucket: "maphub-b1531.appspot.com",
  messagingSenderId: "150673021987",
  appId: "1:150673021987:web:dad10a269041fb123e6596",
  measurementId: "G-1Q438SJ1WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
async function writeUserData(country:string) {
  console.log(country)
  await setDoc(doc(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries",country), {
    visited:true
  });
  // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
  //   country
  // });
}




const Wrapper = styled.div`
  height:100%;
  width: 100%;
  /* background-color: blue; */
  margin:0;
  padding:0
`

const ChangeMapBtn = styled.button`
  height: 20px;
  width: 80px;
  
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


function WorldMap(){
  const [mapState, setMapState] = useState<number>(1)
  const [isHovering, setIsHovering]= useState<boolean>(false)
  // const [isClicked, setIsClicked]= useState<boolean>(false)
  const [name, setName] = useState<string>("")
  // const [useTarget, setUseTarget] = useState<any>("")
  const [isColored,setIsColored] = useState<boolean>(false)
  const [countryList, setCountryList] = useState<any[]>([])
  // const [visitedCountries, setVisitedCountries] = useState<boolean>(false)
  // console.log(countryList)
  // console.log(isColored)
  const [ mousePlace, setMousePlace] = useState<{
    x?: number | undefined;
    y?: number | undefined;
  }>({})

  
  async function getUserData(){
    const q = collection(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries");
    const querySnapshot = await getDocs(q);
    let countryData:any[]=[]
    querySnapshot.forEach((country)=>{
      // console.log(country.id, '=>' ,country.data())
      let t = {countryId: country.id, visited:country.data().visited}
      countryData.push(t)
      setCountryList(countryData)
    })
  }
  // console.log(mousePlace)
  return(
    <>
      <ChangeMapBtn onClick={()=>{
        setMapState(1);
        getUserData();
        // const countryInfo = countryList.map((country:any)=>{
        //   if(countryList && country.visited){
            
        //   }
        // })
        // console.log(countryList)
         
         }}>Visited </ChangeMapBtn><br/>
      <ChangeMapBtn onClick={()=>{setMapState(2)}}>Friends </ChangeMapBtn><br/>
      <ChangeMapBtn onClick={()=>{setMapState(3)}}>my Map</ChangeMapBtn>
      {mapState && mapState === 1 ?(
      <Wrapper onMouseOver={(e) => { 
        const target = e.target as HTMLInputElement; 
        const result = Countries.filter(function(obj){return obj.code == target.id })
        setMousePlace(getMousePos(e))
        setName(result[0].name)
        // setHover(true)
        setIsHovering(true)}} 
        onMouseLeave={(e)=> { setIsHovering(false)}}
        onClick={(e) => { 
          const target = e.target as HTMLInputElement;
          if(target.tagName === "svg"){
            return
          }
          // setUseTarget(target.id)
          // const result = Countries.filter(function(obj){return obj.code == target.id })
          // setIsClicked(true)
          let ColorChange = "rgb(77, 128, 230)"
          let ColorOrigin = "rgb(206, 226, 245)"
          // target.style.fill = "#4D80E6"
          if (target.style.fill == "") {
            target.style.fill = ColorChange
          } else if(target.style.fill === ColorOrigin){
            target.style.fill = ColorChange
          } else if (target.style.fill === ColorChange) {
            target.style.fill = ColorOrigin
          }
          writeUserData(target.id)
        }}>
        {isHovering ? (<ShowName mousePlace={mousePlace}>{name}</ShowName>) : (<></>)}
        {/* <ShowName>{name}</ShowName> */}

        <MapSVG countryList={countryList}/>
      </Wrapper>)
      : mapState === 2 ?
      <Wrapper>
        <MapSVG countryList={countryList}/>
      </Wrapper>
      : mapState === 3 ?
      <Wrapper>
        {/* <MapSVG /> */}
      </Wrapper>
      :
      <></>
      }
    
    
    </>
  )

}

export default WorldMap