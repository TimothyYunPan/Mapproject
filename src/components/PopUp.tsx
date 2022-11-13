import styled from "styled-components";

const PopUpBlock = styled.div<{ isShowingPopUp: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: ${(props) => (props.isShowingPopUp ? 250 : 0)}px;
  width: 500px;
  border: ${(props) => (props.isShowingPopUp ? 1 : 0)}px solid white;
  visibility: ${(props) => (props.isShowingPopUp ? "visible" : "hidden")};
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  @media (max-width: 570px) {
    width: 300px;
  }
`;

const PopUpSet = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  text-align: center;
  @media (max-width: 570px) {
    padding: 0 30px;
  }
`;

const PopUpText = styled.div<{ isShowingPopUp: boolean }>`
  font-size: 24px;
  color: #222;
  opacity: ${(props) => (props.isShowingPopUp ? 1 : 0)};
  transition: 0.3s;
  @media (max-width: 570px) {
    font-size: 18px;
  }
`;

const PopUpBtn = styled.div<{ isShowingPopUp: boolean }>`
  width: 100px;
  opacity: ${(props) => (props.isShowingPopUp ? 1 : 0)};
  transition: 0.1s;
  cursor: pointer;
  text-align: center;
  margin-top: 60px;
  border: 1px solid #222;
  padding: 5px 10px;
  border-radius: 16px;

  :hover {
    background-color: rgb(240, 243, 244);
    color: #222;
  }
`;

const PopUpBg = styled.div<{ isShowingPopUp: boolean; toLogIn: boolean }>`
  position: absolute;
  width: ${(props) => (props.isShowingPopUp || props.toLogIn ? 100 : 0)}%;
  height: ${(props) => (props.isShowingPopUp || props.toLogIn ? 100 : 0)}%;
  background-color: rgba(128, 128, 128, 0.5);
  z-index: 900;
`;

const PopupBtnSet = styled.div`
  display: flex;
  justify-content: space-around;
`;

type PopUpType = {
  isShowingPopUp: boolean;
  setIsShowingPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  popUpMsg: (string | { (): void } | { (index: number): void })[];
  setIsShowingPointNotes: React.Dispatch<React.SetStateAction<boolean>>;
  setPointIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingMap: React.Dispatch<React.SetStateAction<boolean>>;
};
function PopUp({
  isShowingPopUp,
  setIsShowingPopUp,
  setLoginStatus,
  toLogIn,
  setToLogIn,
  popUpMsg,
  setIsShowingPointNotes,
  setIsEditing,
  setPointIndex,
  setIsChangingMap,
}: PopUpType) {
  return (
    <>
      <PopUpBg isShowingPopUp={isShowingPopUp} toLogIn={toLogIn} />
      <PopUpBlock isShowingPopUp={isShowingPopUp}>
        <PopUpSet>
          <PopUpText isShowingPopUp={isShowingPopUp}>{popUpMsg[0] as string}</PopUpText>
          <PopupBtnSet>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                switch (popUpMsg[4]) {
                  case "signin":
                    setLoginStatus("login");
                    setToLogIn(true);
                    break;
                  case "deletepin":
                    setIsShowingPointNotes(false);
                    setPointIndex(-1);
                    let deletePinFunc = popUpMsg[5] as () => void;
                    deletePinFunc();
                    break;
                  case "deletefriend":
                    let deleteFriendFunc = popUpMsg[5] as (index: number) => void;
                    let i = parseInt(popUpMsg[3] as string);
                    deleteFriendFunc(i);
                    break;
                  case "deletemap":
                    let deleteMapFunc = popUpMsg[5] as () => void;
                    deleteMapFunc();
                    break;
                  case "goback":
                    setIsEditing(false);
                    break;
                  case "closenote":
                    setIsShowingPointNotes(false);
                    setPointIndex(-1);
                    break;
                }
                setIsShowingPopUp(false);
              }}>
              {popUpMsg[1] as string}
            </PopUpBtn>
            <PopUpBtn
              isShowingPopUp={isShowingPopUp}
              onClick={() => {
                if (popUpMsg[4] === "signin") {
                  setLoginStatus("register");
                  setToLogIn(true);
                }
                setIsShowingPopUp(false);
                setIsChangingMap(false);
              }}>
              {popUpMsg[2] as string}
            </PopUpBtn>
          </PopupBtnSet>
        </PopUpSet>
      </PopUpBlock>
    </>
  );
}

export default PopUp;
