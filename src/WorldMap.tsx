import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { GlobalStyleComponent } from "styled-components";
import Countries from "./utils/Countries";
import Regions from "./utils/Regions";
import MapSVG from "./components/MapSVG";
import { initializeApp } from "firebase/app";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs, deleteField, updateDoc } from "firebase/firestore";
import { EventType } from "@testing-library/react";
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
  console.log("write")
  await setDoc(doc(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries", country), {
    visited:true
  });
  // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
  //   country
  // });
}
async function deleteUserMap1Data(country:string){
  console.log("delete")
  await updateDoc(doc(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries", country), {
    visited: deleteField()
  });
}

async function updateUserMap1Data(country:string){
  // console.log("delete")
  await updateDoc(doc(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries", country), {
    visited: false
  });
}


const Wrapper = styled.div`
  height: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
`

const CountrySelectSet = styled.div`
  margin-top: 20px;
  width: 90%;

`

const CountryRegions = styled.div`
  margin-left: 20px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  

`
const CountryRegion = styled.p`
  color: #666;
  font-size: 16px;
  margin:0 20px
`
const CountrySelectListSet = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const CountrySelectList = styled.div`
  display: flex;
  

`
const CountrySelectCheck = styled.input`
  margin: 2px 10px;

`
const CountrySelectName = styled.div`
margin-right: 20px;

`
const CountryText = styled.p`
  color: #666;


`
const CountryVisitedCount = styled.input`
  width: 40px;
  margin: 0 10px;

`


const Map = styled.div`
  /* height:100%;
  width: 100%; */
  /* height: 200px; */
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

export interface countryListType {
  countryId: string,
  visited: boolean
}



function WorldMap(){
  const [mapState, setMapState] = useState<number>(1)
  const [isHovering, setIsHovering]= useState<boolean>(false)
  // const [isClicked, setIsClicked]= useState<boolean>(false)
  const [name, setName] = useState<string>("")
  // const [useTarget, setUseTarget] = useState<any>("")
  const [isColored,setIsColored] = useState<boolean>(false)
  const [countryList, setCountryList] = useState<countryListType[]>([])
  console.log(countryList)
  const [countryCollection, setCountryCollection] = useState<string[]>([])
  // const [visitedCountries, setVisitedCountries] = useState<boolean>(false)
  const [ mousePlace, setMousePlace] = useState<{
    x?: number | undefined;
    y?: number | undefined;
  }>({})

  useEffect(()=>{
    getUserMap1Data()

  },[])
  
  async function getUserMap1Data(){
    const q = collection(db, "user", "7LkdfIpKjPiFsrPDlsaM", "visitedCountries");
    const querySnapshot = await getDocs(q);
    let newCountryList:any[]=[]
    querySnapshot.forEach((country)=>{
      console.log(country.data())
      // console.log(country.id, '=>' ,country.data())
      let t = {countryId: country.id, visited:country.data().visited}
      newCountryList.push(t)
      setCountryList(newCountryList)
    })
    

  }
  
  // async function getUserMap2Data(){
  //   const q = collection(db, "user", "7LkdfIpKjPiFsrPDlsaM", "friendsLocatedCountries");
  //   const querySnapshot = await getDocs(q);
  //   let countryData:any[]=[]
  //   querySnapshot.forEach((country)=>{
  //     // console.log(country.id, '=>' ,country.data())
  //     let t = {countryId: country.id, visited:country.data().visited}
  //     countryData.push(t)
  //     setCountryList(countryData)

  //   })
  // }

  function getCountriesCollection(regionCode:string){
    let countryCollectionArr:string[] = []
    Countries.forEach(countryObj => {
      if (countryObj.region === regionCode){
        countryCollectionArr.push(countryObj.name)
      }
    });
    setCountryCollection(countryCollectionArr)
  }

  function editCheckedToMap(target:HTMLInputElement){
    // console.log(e.target.value)
    let targetValue = target.value;
    Countries.forEach(countryObj => {
      if(countryObj.name === targetValue){
        let code = countryObj.code
        targetValue = code
      }
    })
    {target.checked ? (writeUserData(targetValue)): (updateUserMap1Data(targetValue))}
  }
  // function deleteCheckedToMap(target:HTMLInputElement){
  //   // console.log(123)
  //   let targetValue = target.value;
  //   Countries.forEach(countryObj => {
  //     if(countryObj.name === targetValue){
  //       let code = countryObj.code
  //       targetValue = code
  //     }
  //   })
  //   if(target.checked){deleteUserMap1Data(targetValue)}
  // }

  console.log(Regions)
  return(
    <>
      <Wrapper>
        <ChangeMapBtn onClick={()=>{
          setMapState(1);
          // const countryInfo = countryList.map((country:any)=>{
          //   if(countryList && country.visited){
              
          //   }
          // })
          // console.log(countryList)
            }}>Visited </ChangeMapBtn><br/>
        <ChangeMapBtn onClick={()=>{setMapState(2)}}>Friends </ChangeMapBtn><br/>
        <ChangeMapBtn onClick={()=>{setMapState(3)}}>my Map</ChangeMapBtn>
        {mapState === 1 ?(
        <Map onMouseOver={(e) => { 
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
            console.log(target.style.fill)
            console.log(ColorOrigin)
            console.log(ColorChange)
            if (target.style.fill == "") {
              target.style.fill = ColorChange
              writeUserData(target.id)

            } else if(target.style.fill === ColorOrigin){
              target.style.fill = ColorChange
              writeUserData(target.id)
              
            } else if (target.style.fill === ColorChange) {
              target.style.fill = ColorOrigin
              updateUserMap1Data(target.id)
            }
            
          }}>
          {isHovering ? (<ShowName mousePlace={mousePlace}>{name}</ShowName>) : (<></>)}
          {/* <ShowName>{name}</ShowName> */}

          <MapSVG countryList={countryList} mapState={mapState}/>
        </Map>
        ): mapState === 2 ? (
        <Map>
          <MapSVG countryList={countryList} mapState={mapState}/>
        </Map>
        ): mapState === 3 ?(
        <Map>
          <MapSVG countryList={countryList} mapState={mapState}/>
        </Map>
        ):
        <></>
        }
        <CountrySelectSet>
          <CountryRegions>
            {Regions.map((region) =>{
              return(
              <CountryRegion onClick={()=>{
                getCountriesCollection(region.code)
               

              }}>{region.name}</CountryRegion>
              )
            })}
            
          </CountryRegions>
          <CountrySelectListSet>
            {countryCollection.map((country)=>{
              return(
              
              <CountrySelectList key={country}>
                <CountrySelectCheck type="checkbox" value={country} onChange={(e)=>{ editCheckedToMap(e.target)
                  }}></CountrySelectCheck>
                <CountrySelectName>{country}</CountrySelectName>
                <CountryText>visited times</CountryText>
                <CountryVisitedCount></CountryVisitedCount>
              </CountrySelectList>
              )
            })}
            
          </CountrySelectListSet>
        </CountrySelectSet>
      </Wrapper>
    </>
  )

}

export default WorldMap