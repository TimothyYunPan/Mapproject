import React, { useState } from "react";
import styled from "styled-components";
import regions from "../utils/regions";
import countries from "../utils/countries";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { countryListType } from "../App";
const CountrySelection = styled.div`
  position: absolute;
  bottom: 8px;
  width: 20%;
  color: rgb(232, 233, 234);
  @media (max-width: 1279px) {
    display: none;
  }
`;
const CountryRegions = styled.div`
  margin-left: 20px;
  height: 50px;
  display: flex;
  align-items: center;
`;
const CountryRegion = styled.p`
  color: rgb(232, 233, 234);
  font-size: 16px;
  margin: 0 10%;
  cursor: pointer;
  white-space: nowrap;
  :hover {
    color: rgb(236, 174, 72);
  }
`;
const CountrySelectListSet = styled.div`
  margin-left: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 510px;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const CountrySelectList = styled.div`
  display: flex;
`;
const CountrySelectCheck = styled.input`
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 1px;
  margin: 2px 10px;
`;

const CountrySelectName = styled.label`
  margin-right: 20px;
  cursor: pointer;
  margin: 1px 0;
  vertical-align: middle;
`;

type countryCollectionArrType = {
  countryName: string;
  countryId: string;
  countryRegion: string;
};

type CountryCheckListType = {
  countryList: countryListType[];
  setCountryList: React.Dispatch<React.SetStateAction<countryListType[]>>;
  writeUserMap1Data: (country: string) => Promise<void>;
  uid: string;
};

function CountryCheckList({ setCountryList, countryList, writeUserMap1Data, uid }: CountryCheckListType) {
  const [isShowingCountry, setIsShowingCountry] = useState<boolean>(false);
  const [countryCollection, setCountryCollection] = useState<countryCollectionArrType[]>([]);

  function getCountriesCollection(regionCode: string) {
    let countryCollectionArr: countryCollectionArrType[] = [];
    countries.forEach((countryObj) => {
      let a = { countryName: countryObj.name, countryId: countryObj.code, countryRegion: countryObj.region };
      if (countryObj.region === regionCode) {
        countryCollectionArr.push(a);
      }
    });
    setCountryCollection(countryCollectionArr);
  }

  function editCheckedToMap(target: HTMLInputElement) {
    let targetValue = target.value;
    countries.forEach((countryObj) => {
      if (countryObj.name === targetValue) {
        let code = countryObj.code;
        targetValue = code;
      }
    });
    if (target.checked) {
      if (!uid) {
        countryList.push({ countryId: targetValue, visited: true });
        const newCountryList = [...countryList];

        setCountryList(newCountryList);
      } else {
        writeUserMap1Data(targetValue);
        countryList.push({ countryId: targetValue, visited: true });
        const newCountryList = [...countryList];
        setCountryList(newCountryList);
      }
    } else {
      if (!uid) {
        const newCountryList = countryList.filter((obj: countryListType) => obj.countryId !== targetValue);
        setCountryList(newCountryList);
      } else {
        updateUserMap1Data(targetValue);
        const newCountryList = countryList.filter((obj: countryListType) => obj.countryId !== targetValue);
        setCountryList(newCountryList);
      }
    }
  }
  async function updateUserMap1Data(country: string) {
    await deleteDoc(doc(db, "user", uid, "visitedCountries", country));
  }

  function isCountrySelected(country: countryCollectionArrType) {
    if (countryList.find((a) => a.countryId === country.countryId)) {
      return true;
    }
  }
  return (
    <CountrySelection>
      {isShowingCountry && (
        <CountrySelectListSet>
          {countryCollection.map((country: countryCollectionArrType) => {
            return (
              <CountrySelectList key={country.countryName}>
                <span>
                  <CountrySelectCheck
                    type="checkbox"
                    vertical-align="middle"
                    checked={isCountrySelected(country)}
                    style={{ accentColor: "rgb(236,174,72)" }}
                    value={country.countryName}
                    id={country.countryName}
                    onChange={(e) => {
                      editCheckedToMap(e.target);
                    }}
                  />
                  <CountrySelectName htmlFor={country.countryName} vertical-align="middle">
                    {country.countryName}
                  </CountrySelectName>
                </span>
              </CountrySelectList>
            );
          })}
        </CountrySelectListSet>
      )}
      <CountryRegions>
        {regions.map((region) => {
          return (
            <CountryRegion
              onClick={() => {
                if (isShowingCountry) {
                  if (countryCollection[0].countryRegion === region.code) {
                    setIsShowingCountry(false);
                  }
                } else {
                  setIsShowingCountry(true);
                }
                getCountriesCollection(region.code);
              }}>
              {region.name}
            </CountryRegion>
          );
        })}
      </CountryRegions>
    </CountrySelection>
  );
}

export default CountryCheckList;
