import React from "react";
import styled from "styled-components";
import { friendListType } from "../App";

const SearchResultBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 95px;
  width: 170px;
  right: 94px;
  top: 60px;
  z-index: 100;
  background-color: inherit;
  color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: 0.5s;
  @media (max-width: 550px) {
    right: 0px;
    top: 110px;
    width: 122%;
  }
`;

const SearchResultFriend = styled.div`
  width: 100%;
  height: 30px;
  margin-bottom: 4px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const SearchResultName = styled.div`
  font-size: 14px;

  :hover {
    color: rgba(225, 225, 225, 0.9);
  }
  transition: 0.2s;
`;
const SearchResultCountry = styled.div`
  padding-right: 4px;
  font-size: 13.5px;
  color: rgba(225, 225, 225, 0.5);
`;

type SearchResultType = {
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  getCountryFriends: (id: string) => void;
  setIsShowingFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setCountryId: React.Dispatch<React.SetStateAction<string>>;
  setCountryName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMapName: React.Dispatch<React.SetStateAction<string>>;
  setSearchNameResult: React.Dispatch<React.SetStateAction<friendListType[]>>;
  searchNameResult: friendListType[];
  setIsShowingSearchResult: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  inputElement: HTMLInputElement | null;
  setIsShowingSearchBarMB: React.Dispatch<React.SetStateAction<boolean>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

function SearchResult({ inputElement, searchNameResult, setIsShowingSearchResult, setMapState, setCurrentMapName, setCountryId, setIsShowingFriends, setCountryName, getCountryFriends, setIsShowingPointNotes, setSearchNameResult, setIsShowingSearchBarMB, setPointIndex }: SearchResultType) {
  return (
    <SearchResultBox>
      {searchNameResult[0] &&
        searchNameResult.map((result) => (
          <SearchResultFriend
            onClick={() => {
              setCountryId(result.countryId);
              setIsShowingFriends(true);
              setCountryName(result.country);
              getCountryFriends(result.countryId);
              setIsShowingSearchResult(false);
              inputElement!.value = "";
              setSearchNameResult([]);
              setMapState(2);
              setCurrentMapName("Friends Located Map");
              setIsShowingSearchBarMB(false);
              setIsShowingPointNotes(false);
              setPointIndex(-1);
            }}>
            <SearchResultName>{result.name}</SearchResultName>
            <SearchResultCountry>{result.country}</SearchResultCountry>
          </SearchResultFriend>
        ))}
    </SearchResultBox>
  );
}

export default SearchResult;
