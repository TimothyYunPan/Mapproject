import React, { Dispatch, useEffect, useState } from "react";
import styled from "styled-components";
import regions from "../utils/regions";
import countries from "../utils/countries";
import { doc, setDoc, collection, getFirestore, getDoc, getDocs, deleteField, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { countryListType } from "../App";

const CountrySelectSet = styled.div`
  position: absolute;
  bottom: 0px;
  margin-top: 20px;
  width: 20%;
  color: rgb(232, 233, 234);
`;
const CountryRegions = styled.div`
  margin-left: 20px;
  height: 50px;
  display: flex;
  align-items: center;
`;
const CountryRegion = styled.p`
  /* width: 200px; */
  color: rgb(232, 233, 234);
  font-size: 16px;
  margin: 0 10%;
  cursor: pointer;
  white-space: nowrap;
  /* padding: 0 20px; */
`;
const CountrySelectListSet = styled.div`
  margin-left: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 510px;
  overflow: scroll;
  /* justify-content: flex-end; */
`;
const CountrySelectList = styled.div`
  display: flex;
`;
const CountrySelectCheck = styled.input`
  margin: 2px 10px;
`;

const CountrySelectName = styled.div`
  /* width: 100px; */
  margin-right: 20px;
`;
const CountryText = styled.p`
  color: #666;
`;
const CountryVisitedCount = styled.input`
  width: 40px;
  margin: 0 10px;
`;

type CountryCheckListType = {
  countryCollection: string[];
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  setCountryCollection: React.Dispatch<React.SetStateAction<string[]>>;
  writeUserMap1Data: (country: string) => Promise<void>;
};

function CountryCheckList({ countryCollection, setCountryList, setCountryCollection, countryList, writeUserMap1Data }: CountryCheckListType) {
  function getCountriesCollection(regionCode: string) {
    let countryCollectionArr: string[] = [];
    countries.forEach((countryObj) => {
      if (countryObj.region === regionCode) {
        countryCollectionArr.push(countryObj.name);
      }
    });
    setCountryCollection(countryCollectionArr);
  }

  function editCheckedToMap(target: HTMLInputElement) {
    // console.log(e.target.value)
    let targetValue = target.value;
    countries.forEach((countryObj) => {
      if (countryObj.name === targetValue) {
        let code = countryObj.code;
        targetValue = code;
      }
    });
    if (target.checked) {
      writeUserMap1Data(targetValue);
      countryList.push({ countryId: targetValue, visited: true });
      const newCountryList = [...countryList];
      setCountryList(newCountryList);
    } else {
      updateUserMap1Data(targetValue);
      const newCountryList = countryList.map((object: countryListType) => {
        // console.log(targetValue)
        // console.log(object.countryId)
        if (object.countryId === targetValue) {
          return { ...object, visited: false };
        }
        return object;
      });
      setCountryList(newCountryList);
      // let newArr = [...countryList]
    }
  }
  async function updateUserMap1Data(country: string) {
    // console.log("delete")
    await updateDoc(doc(db, "user", "5Ch2PkVdhfngwXkX0y0h", "visitedCountries", country), {
      visited: false,
    });
  }

  async function deleteUserMap1Data(country: string) {
    console.log("delete");
    await updateDoc(doc(db, "user", "5Ch2PkVdhfngwXkX0y0h", "visitedCountries", country), {
      visited: deleteField(),
    });
  }

  return (
    <CountrySelectSet>
      <CountrySelectListSet>
        {countryCollection.map((country: string) => {
          return (
            <CountrySelectList key={country}>
              <CountrySelectCheck
                type="checkbox"
                value={country}
                onChange={(e) => {
                  editCheckedToMap(e.target);
                }}></CountrySelectCheck>
              <CountrySelectName>{country}</CountrySelectName>
              {/* <CountryText>visited times</CountryText> */}
              {/* <CountryVisitedCount></CountryVisitedCount> */}
            </CountrySelectList>
          );
        })}
      </CountrySelectListSet>
      <CountryRegions>
        {regions.map((region) => {
          return (
            <CountryRegion
              onClick={() => {
                getCountriesCollection(region.code);
              }}>
              {region.name}
            </CountryRegion>
          );
        })}
      </CountryRegions>
    </CountrySelectSet>
  );
}

export default CountryCheckList;
