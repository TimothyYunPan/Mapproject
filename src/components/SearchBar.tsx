import React, { useEffect, useState, useRef, SetStateAction } from "react";
import styled from "styled-components";
import { friendListType } from "../App";

const SearchInput = styled.input<{ isShowingSearchBarMB: boolean }>`
  position: absolute;
  height: 30px;
  width: 180px;
  right: 95px;
  border-radius: 20px;
  top: 18px;
  z-index: 100;
  color: rgb(42, 60, 77);
  border: 1px solid white;
  padding-left: 10px;
  background-color: inherit;
  color: white;
  outline: none;
  transition: 0.5s;
  @media (max-width: 550px) {
    display: ${(props) => (props.isShowingSearchBarMB ? "block" : "none")};
    top: 70px;
    right: 0;
    width: 125%;
  }
`;

type SearchBar = {
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  getCountryFriends: (id: string) => void;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  setSearchNameResult: React.Dispatch<React.SetStateAction<friendListType[]>>;
  searchInputRef: any;
  searchNameResult: friendListType[];
  setIsShowingSearchResult: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchName: (searchValue: string) => void;
  searchCountries: (searchValue: string) => void;
  isShowingSearchBarMB: boolean;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function SearchBar({ searchInputRef, searchNameResult, setIsShowingSearchResult, setSearchValue, searchName, searchCountries, setMapState, setCurrentMapName, setCountryId, setIsShowingFriends, setCountryName, getCountryFriends, setIsShowingPointNotes, setSearchNameResult, isShowingSearchBarMB, setPointIndex }: SearchBar) {
  return (
    <SearchInput
      isShowingSearchBarMB={isShowingSearchBarMB}
      ref={searchInputRef}
      placeholder="country / friend"
      onClick={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.value === searchNameResult[0].name) {
          setIsShowingSearchResult(true);
        }
        // setIsShowingSearchResult;

        setSearchValue(target.value);
      }}
      onChange={(e) => {
        setSearchValue(e.target.value);
        searchName(e.target.value);
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          const target = e.target as HTMLInputElement;
          // setSearchValue(target.value);
          // searchName(target.value);
          searchCountries(target.value);
          if (searchNameResult.length === 1) {
            setMapState(2);
            setCurrentMapName("Friends Located Map");
            setCountryId(searchNameResult[0].countryId);
            setIsShowingFriends(true);
            setCountryName(searchNameResult[0].country);
            getCountryFriends(searchNameResult[0].countryId);
            setIsShowingSearchResult(false);
            searchInputRef.current.value = "";
            setSearchNameResult([]);
            setIsShowingPointNotes(false);
          }
          setPointIndex(-1);

          // searchCountries(target.value);
        }
      }}></SearchInput>
  );
}

export default SearchBar;
