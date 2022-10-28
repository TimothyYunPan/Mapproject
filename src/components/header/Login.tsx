import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import app from "../../utils/firebaseConfig";
import userProfileGrey from "../icon/userProfileGrey.png";
import styled from "styled-components";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "../../App";
import { PointNotesTitleInput } from "../CustomizedMap";
import closeGrey from "../icon/closeGrey.png";
import okGrey from "../icon/okGrey.png";
import editGrey from "../icon/editGrey.png";
import editGreyHover from "../icon/editGreyHover.png";

const storage = getStorage(app);
const auth = getAuth(app);

const Wrapper = styled.div<{ toLogIn: boolean }>`
  position: fixed;
  width: 100vw;
  height: 100vh;
  height: ${(props) => (props.toLogIn ? "100vh;" : 0)};
  top: 0%;
  left: 0%;
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
  z-index: -150;
`;

const LogginPopUp = styled.div<{ toLogIn: boolean }>`
  display: flex;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  @media (max-width: 1279px) {
    min-height: calc(100vh - 148px);
    flex-direction: column;
  }
`;

const ProfilePanel = styled.div<{ toLogIn: boolean }>`
  position: relative;
  width: ${(props) => (props.toLogIn ? "330px" : 0)};
  padding: ${(props) => (props.toLogIn ? "40px" : 0)};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s;
  border: ${(props) => (props.toLogIn ? " solid 1px white" : "none")};
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
`;

const ProfileTitle = styled.div<{ toLogIn: boolean }>`
  opacity: ${(props) => (props.toLogIn ? 1 : 0)};
  color: #222;
  margin-top: 8px;
  margin-bottom: 40px;
  font-size: 24px;
  white-space: nowrap;
`;

const ProfileUserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 300px;
`;
const ProfileUserInfoImg = styled.img<{ toLogIn: boolean }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid white;
  object-fit: cover;
  object-position: center center;
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
`;

const AddProfilePicLabel = styled.label`
  justify-content: center;
  margin-bottom: 60px;
`;
const AddProfilePicInput = styled.input`
  display: none;
`;
const ProfileNoPic = styled.div<{ toLogIn: boolean; isEditingProfile: boolean }>`
  width: 150px;
  height: 150px;
  padding: 10px;
  border-radius: 50%;
  background-image: url(${userProfileGrey});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: ${(props) => (props.isEditingProfile ? "pointer" : "default")};
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
`;

const ProfileLogInSet = styled.div<{ toLogIn: boolean }>`
  opacity: ${(props) => (props.toLogIn ? 1 : 0)};
  width: 100%;
`;

const ProfileInputSet = styled.label`
  color: rgb(211, 211, 211);
  width: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #222;
  position: relative;
`;

const AccountWord = styled.p`
  white-space: nowrap;
`;
const WarningWord = styled(AccountWord)`
  position: absolute;
  bottom: -3px;
  padding-left: 2px;
  font-size: 12px;
  color: rgb(231, 70, 70);
`;

const ProfileInput = styled.input`
  box-sizing: border-box;
  margin-top: 10px;
  padding: 0 8px;
  width: 100%;
  border: solid 1px #222;
  background-color: inherit;
  border-radius: 4px;
  height: 32px;
  color: #222;
  outline: none;
`;

const ProfileCheckSet = styled.div`
  margin-top: 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;

const ProfileCheckboxSet = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  box-sizing: border-box;
`;

const ProfileNoAcount = styled.div`
  text-decoration: none;
  color: #222;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    font-weight: 600;
  }
`;
const ProfileWithAcount = styled.div`
  text-decoration: none;
  color: #222;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    font-weight: 600;
  }
`;

const ProfileLoginBtn = styled.button`
  font-weight: bold;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 32px;
  cursor: pointer;
  color: #222;
  white-space: nowrap;

  background-color: inherit;
  border: none;
  transition: background-color 0.1s;
  &:hover {
    background-color: rgb(211, 211, 211);
    color: rgb(42, 61, 78);
  }
`;
const ProfileRegisterBtn = styled.button`
  color: #222;
  font-weight: bold;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 32px;
  cursor: pointer;
  background-color: inherit;
  border: none;
  transition: background-color 0.1s;
  &:hover {
    background-color: rgb(211, 211, 211);
    color: rgb(42, 61, 78);
  }
`;

const ProfileLogoutBtn = styled.button<{ toLogIn: boolean }>`
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};

  width: 251px;
  height: 40px;
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  cursor: pointer;
  color: #222;
  box-sizing: border-box;
  background-color: inherit;
  border: none;
  transition: 0.02s;
  font-size: 16px;
  overflow: hidden;
  &:hover {
    background-color: rgb(211, 211, 211);
    color: rgb(42, 61, 78);
  }
`;
const EditProfileBtn = styled.div`
  width: 20px;
  height: 20px;
  top: 20px;
  right: 0px;
  background-image: url(${editGrey});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${editGreyHover});
    width: 24px;
    height: 24px;
    bottom: 15px;
  }
`;
const UpdateProfileBtn = styled.div`
  width: 20px;
  height: 20px;
  right: 0px;
  background-size: cover;
  position: absolute;
  cursor: pointer;
  background-image: url(${okGrey});
  top: 18px;
  :hover {
    top: 16px;
  }
`;

const ProfileTitleInput = styled(PointNotesTitleInput)`
  font-size: 28px;
  width: 70%;
  margin-top: 8px;
  margin-bottom: 40px;
  font-size: 24px;
  color: #222;
  border-bottom: 1px solid #222;
`;

const Back = styled.div<{ toLogIn: boolean }>`
  height: 16px;
  width: 16px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background-image: url(${closeGrey});
  background-size: cover;
  cursor: pointer;
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
`;

type LoginType = {
  setUid: Dispatch<SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  countryList: countryListType[];
  setCountryList: Dispatch<SetStateAction<countryListType[]>>;
  toLogIn: boolean;
  setToLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string;
  setMapState: React.Dispatch<React.SetStateAction<number>>;
  setFriendsList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  setHaveFriendList: React.Dispatch<React.SetStateAction<haveFriendListType[]>>;
  setFriendList: React.Dispatch<React.SetStateAction<friendListType[]>>;
  setPointList: React.Dispatch<React.SetStateAction<pointListType[]>>;
  loginStatus: string;
  setLoginStatus: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userImage: string;
  setUserImg: React.Dispatch<React.SetStateAction<string>>;
  originalMapNames: mapNameType[];
  setMapNames: React.Dispatch<React.SetStateAction<mapNameType[]>>;
  setNotificationInfo: React.Dispatch<React.SetStateAction<notificationInfoType>>;
};
function Login({
  setUid,
  isLoggedIn,
  setIsLoggedIn,
  countryList,
  setCountryList,
  toLogIn,
  setToLogIn,
  uid,
  setMapState,
  setFriendsList,
  setHaveFriendList,
  setFriendList,
  setPointList,
  loginStatus,
  setLoginStatus,
  userName,
  setUserName,
  userImage,
  originalMapNames,
  setMapNames,
  setNotificationInfo,
  setUserImg,
}: LoginType) {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const previewProfileImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : userImage ? userImage : "";
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const [nameInputValue, setNameInputValue] = useState("");
  const [accountInputValue, setAccountInputValue] = useState("Welcome@gmail.com");
  const [passwordInputValue, setPasswordInputValue] = useState("enjoy your day!");
  const userNameInputRef = useRef<HTMLInputElement>(null);

  async function writeOriginMapToData(uid: string) {
    await setDoc(doc(db, "user", uid), { originalMap: originalMapNames }, { merge: true });
  }

  useEffect(() => {
    if (userNameInputRef.current !== null) {
      userNameInputRef.current!.value = userName;
    }
  }, []);
  function onSubmit() {
    if (loginStatus === "register") {
      createUserWithEmailAndPassword(auth, accountInputValue, passwordInputValue)
        .then((userCredential) => {
          const user = userCredential.user;
          setToLogIn(false);
          setUid(user.uid);
          writeUserMap1Data(user.uid);
          writeUserNameToData(user.uid);
          writeOriginMapToData(user.uid);
          setErrorMsg([]);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
            setErrorMsg(["2", "* email is already registered"]);
          } else if (errorMessage === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            setErrorMsg(["6", "* password should be at least 6 characters"]);
          } else if (errorMessage === "Firebase: Error (auth/invalid-email).") {
            setErrorMsg(["7", "* this is not a valid email"]);
          }
        });
    } else if (loginStatus === "login") {
      signInWithEmailAndPassword(auth, accountInputValue, passwordInputValue)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUid(user.uid);
          setToLogIn(false);
          setNotificationInfo({ text: "Welcome Back!", status: true });
          setTimeout(() => {
            setNotificationInfo({ text: "", status: false });
          }, 3000);
          setErrorMsg([]);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage === "Firebase: Error (auth/wrong-password).") {
            setErrorMsg(["3", "* password is wrong"]);
          } else if (errorMessage === "Firebase: Error (auth/user-not-found).") {
            setErrorMsg(["4", "* account not found"]);
          } else if (
            errorMessage ===
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
          ) {
            setErrorMsg(["5", "* too many attempts, please try again later"]);
          } else if (errorMessage === "Firebase: Error (auth/invalid-email).") {
            setErrorMsg(["7", "* this is not a valid email"]);
          }
        });
    }
  }
  function LogOut() {
    signOut(auth)
      .then(() => {
        setUid("");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  async function writeUserMap1Data(uid: string) {
    countryList.map(async (country) => {
      await setDoc(
        doc(db, "user", uid, "visitedCountries", country.countryId),
        {
          visited: true,
        },
        { merge: true }
      );
    });
  }

  async function writeUserNameToData(uid: string) {
    await setDoc(doc(db, "user", uid), {
      userName: nameInputValue,
      imgUrl: "",
    });
    setNotificationInfo({ text: `Hi, ${nameInputValue}. Welcome to Maphub!`, status: true });
    setTimeout(() => {
      setNotificationInfo({ text: "", status: false });
    }, 3000);
  }

  async function updateProfileInfo(uid: string) {
    if (imageUpload == null) {
      const url = userImage;
      await setDoc(
        doc(db, "user", uid),
        {
          userName: userNameInputRef.current!.value,
          imgUrl: url,
        },
        { merge: true }
      );
      setIsEditingProfile(false);
    } else {
      const imageRef = ref(storage, `${uid}profile/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          await setDoc(
            doc(db, "user", uid),
            {
              userName: userNameInputRef.current !== null ? userNameInputRef.current!.value : userName,
              imgUrl: url,
            },
            { merge: true }
          );
          setIsEditingProfile(false);
          setUserImg(url);
        });
      });
    }
  }

  return (
    <Wrapper toLogIn={toLogIn}>
      <LogginPopUp toLogIn={toLogIn}>
        <ProfilePanel toLogIn={toLogIn}>
          {isLoggedIn === false && loginStatus === "login" && <ProfileTitle toLogIn={toLogIn}>Welcome Back</ProfileTitle>}
          {isLoggedIn === false && loginStatus === "register" && <ProfileTitle toLogIn={toLogIn}>Let's Map the World</ProfileTitle>}

          {isLoggedIn && (
            <ProfileUserInfo>
              {isEditingProfile ? (
                <ProfileTitleInput defaultValue={userName} ref={userNameInputRef} />
              ) : (
                <ProfileTitle toLogIn={toLogIn}>{userName}</ProfileTitle>
              )}
              <AddProfilePicLabel htmlFor="addProfilePic">
                {previewProfileImgUrl ? (
                  <ProfileUserInfoImg src={previewProfileImgUrl} toLogIn={toLogIn} />
                ) : userImage && userImage ? (
                  <ProfileUserInfoImg src={userImage} toLogIn={toLogIn} />
                ) : (
                  <ProfileNoPic isEditingProfile={isEditingProfile} toLogIn={toLogIn} />
                )}
              </AddProfilePicLabel>

              {isEditingProfile ? (
                <>
                  <AddProfilePicInput
                    id="addProfilePic"
                    type="file"
                    accept="image/png, image/gif, image/jpeg, image/svg"
                    onChange={(e) => {
                      setImageUpload(e.target.files![0]);
                    }}
                  />
                  <UpdateProfileBtn
                    onClick={() => {
                      updateProfileInfo(uid);

                      setUserName(userNameInputRef.current !== null ? userNameInputRef.current!.value : userName);
                    }}
                  />
                </>
              ) : (
                <EditProfileBtn
                  onClick={() => {
                    setIsEditingProfile(true);
                  }}
                />
              )}
            </ProfileUserInfo>
          )}

          {isLoggedIn === false && (
            <ProfileLogInSet toLogIn={toLogIn}>
              {loginStatus === "register" && (
                <ProfileInputSet>
                  <AccountWord>Name</AccountWord>
                  <ProfileInput value={nameInputValue} onChange={(e) => setNameInputValue(e.target.value)} />
                  {errorMsg[0] === "1" && <WarningWord>{errorMsg[1]}</WarningWord>}
                </ProfileInputSet>
              )}
              <ProfileInputSet>
                <AccountWord>Email</AccountWord>
                <ProfileInput value={accountInputValue} onChange={(e) => setAccountInputValue(e.target.value)} />
                {errorMsg[0] === "2" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : errorMsg[0] === "4" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : errorMsg[0] === "7" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : (
                  <></>
                )}
              </ProfileInputSet>
              <ProfileInputSet>
                <AccountWord>Password</AccountWord>
                <ProfileInput type={"password"} value={passwordInputValue} onChange={(e) => setPasswordInputValue(e.target.value)} />
                {errorMsg[0] === "3" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : errorMsg[0] === "5" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : errorMsg[0] === "6" ? (
                  <WarningWord>{errorMsg[1]}</WarningWord>
                ) : (
                  <></>
                )}
              </ProfileInputSet>

              <ProfileCheckSet>
                <ProfileCheckboxSet />
                {loginStatus === "login" && (
                  <ProfileNoAcount
                    onClick={() => {
                      setLoginStatus("register");
                      setErrorMsg([]);
                      setPasswordInputValue("");
                      setAccountInputValue("");
                    }}>
                    sign up?
                  </ProfileNoAcount>
                )}
                {loginStatus === "register" && (
                  <ProfileWithAcount
                    onClick={() => {
                      setLoginStatus("login");
                      setErrorMsg([]);
                      setAccountInputValue("Welcome@gmail.com");
                      setPasswordInputValue("enjoy your day!");
                    }}>
                    sign in?
                  </ProfileWithAcount>
                )}
              </ProfileCheckSet>
              {loginStatus === "login" && (
                <ProfileLoginBtn
                  onClick={() => {
                    onSubmit();
                  }}>
                  SIGN IN
                </ProfileLoginBtn>
              )}
              {loginStatus === "register" && (
                <ProfileRegisterBtn
                  onClick={() => {
                    if (nameInputValue.trim() !== "") {
                      onSubmit();
                    } else {
                      setErrorMsg(["1", "* name required"]);
                    }
                  }}>
                  SIGN UP
                </ProfileRegisterBtn>
              )}
            </ProfileLogInSet>
          )}

          {isLoggedIn && (
            <ProfileLogoutBtn
              toLogIn={toLogIn}
              onClick={() => {
                setIsLoggedIn(false);
                LogOut();
                setMapState(-1);
                setCountryList([]);
                setHaveFriendList([]);
                setFriendsList([]);
                setFriendList([]);
                setPointList([]);
                setMapNames([]);
                setUserImg("");
                setNotificationInfo({ text: "Successfully sign out!", status: true });
                setTimeout(() => {
                  setNotificationInfo({ text: "", status: false });
                }, 2000);
              }}>
              SIGN OUT
            </ProfileLogoutBtn>
          )}
          <Back
            toLogIn={toLogIn}
            onClick={() => {
              setToLogIn(false);
              setIsEditingProfile(false);
            }}
          />
        </ProfilePanel>
      </LogginPopUp>
    </Wrapper>
  );
}

export default Login;
