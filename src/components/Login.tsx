import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import app from "../utils/firebaseConfig";
import userProfileGrey from "./userProfileGrey.png";

// import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { countryListType, friendListType, haveFriendListType, pointListType, mapNameType, notificationInfoType } from "../App";
import edit from "./edit.png";
import editHover from "./editHover.png";
import okIcon from "./okIcon.png";
import { PointNotesTitleInput } from "../WorldMap";
import back from "./back.png";
import noIcon from "./noIcon.png";
import closeGrey from "./closeGrey.png";
import okGrey from "./okGrey.png";
import editGrey from "./editGrey.png";
import editGreyHover from "./editGreyHover.png";

const storage = getStorage(app);
const validEmail = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
// import getJwtToken from '../../utils/getJwtToken';

const auth = getAuth(app);

const Wrapper = styled.div<{ toLogIn: boolean }>`
  position: fixed;
  /* background-color: ${(props) => (props.toLogIn ? "rgba(128, 128, 128, 0.5)" : "inherit")}; */
  width: 100vw;
  height: 100vh;
  /* width: ${(props) => (props.toLogIn ? "100vw" : 0)}; */
  height: ${(props) => (props.toLogIn ? "100vh;" : 0)};
  /* overflow: hidden; */
  /* padding: 100px 20px; */
  top: 0%;
  left: 0%;

  /* transform: translate(-50%, -50%); */
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
  z-index: -150;
  /* z-index: 1000; */
`;

const LogginPopUp = styled.div<{ toLogIn: boolean }>`
  display: flex;
  border-radius: 2px;
  /* border: 32px solid rgb(42, 61, 78); */
  ${"" /* flex-direction: column; */} justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  /* min-height: calc(100vh - 255px); */
  @media (max-width: 1279px) {
    min-height: calc(100vh - 148px);
    flex-direction: column;
  }
`;

const ProfilePanel = styled.div<{ toLogIn: boolean }>`
  position: relative;
  width: ${(props) => (props.toLogIn ? "330px" : 0)};
  /* height: ${(props) => (props.toLogIn ? "auto" : 0)}; */
  /* height: 100%; */
  /* height: ${(props) => (props.toLogIn ? 330 : 520)}px; */

  /* width: 330px; */
  ${"" /* height: 520px; */}
  padding: ${(props) => (props.toLogIn ? "40px" : 0)};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.5s;
  border: ${(props) => (props.toLogIn ? " solid 1px white" : "none")};
  /* transition-delay: 1s; */
  /* background-color: rgba(255, 255, 255, 0.05); */
  /* border: solid 1px white; */
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  /* transition: 0.1s; */
  overflow: hidden;
`;

const MemberInfoLine = styled.div`
  width: 100%;
  border-top: 0.5px solid #9d9d9d;
  margin-top: 11px;
  margin-bottom: 11px;
`;

const ProfileTitle = styled.div<{ toLogIn: boolean }>`
  opacity: ${(props) => (props.toLogIn === true ? 1 : 0)};
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
  /* margin-bottom: 16px; */
`;
const ProfileUserInfoImg = styled.img<{ toLogIn: boolean }>`
  /* margin-top: 16px; */
  /* background-color: #fff; */
  /* border: solid 1px white; */
  width: 150px;
  height: 150px;
  border-radius: 50%;
  /* overflow: hidden; */
  border: 1px solid white;
  object-fit: cover;
  object-position: center center;
  /* transition: 0.5s; */
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
  /* margin-bottom: 32px; */
  /* background-image: url(https://graph.facebook.com/5610881185597352/picture?type=large); */
`;

const AddProfilePicLabel = styled.label`
  justify-content: center;
  margin-bottom: 60px;

  /* cursor: pointer; */
`;
const AddProfilePicInput = styled.input`
  display: none;
  /* opacity: 1; */
`;
const ProfileNoPic = styled.div<{ toLogIn: boolean; isEditingProfile: boolean }>`
  width: 150px;
  height: 150px;
  padding: 10px;
  border-radius: 50%;
  /* margin-bottom: 32px; */

  /* object-fit: cover; */
  background-image: url(${userProfileGrey});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: ${(props) => (props.isEditingProfile ? "pointer" : "default")};
  /* cursor: pointer; */
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
`;

const ProfileLogInSet = styled.div<{ toLogIn: boolean }>`
  opacity: ${(props) => (props.toLogIn === true ? 1 : 0)};
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
  ${"" /* display:none */};
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
  ${"" /* display: ${registerBtnStatus} */};
`;

const ProfileLogoutBtn = styled.button<{ toLogIn: boolean }>`
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
  /* width: ${(props) => (props.toLogIn ? "251" : "0")}px; */
  /* font-size: ${(props) => (props.toLogIn ? "16" : "0")}px; */

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
  /* margin: 25px 0 28px 0; */
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
  friendsList: friendListType[];
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
function Login({ setUid, isLoggedIn, setIsLoggedIn, countryList, setCountryList, toLogIn, setToLogIn, uid, setMapState, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, loginStatus, setLoginStatus, userName, setUserName, userImage, originalMapNames, setMapNames, setNotificationInfo, setUserImg }: LoginType) {
  const [profile, setProfile] = useState();
  // console.log(loginStatus);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  console.log(imageUpload);
  const previewProfileImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : userImage ? userImage : "";
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  // console.log(isLoggedIn);
  const [errorMsg, setErrorMsg] = useState<string[]>([]);
  const imageListRef = ref(storage, "images/");
  const [imageList, setImageList] = useState<string[]>([]);
  // const [ memberInfo, setMemberInfo ] = useState([])
  const [nameInputValue, setNameInputValue] = useState("");
  const [accountInputValue, setAccountInputValue] = useState("Welcome@gmail.com");
  const [passwordInputValue, setPasswordInputValue] = useState("enjoy your day!");
  const userNameInputRef = useRef<HTMLInputElement>(null);
  console.log(userImage);

  //   const validate = () => {
  //     if (!validEmail.test(email)) {
  //        setEmailErr(true);
  //     }
  //     if (!validPassword.test(password)) {
  //        setPwdError(true);
  //     }
  //  };
  // console.log(uid)
  async function writeOriginMapToData(uid: string) {
    // const originalMap = [
    //   { name: "Visited Countries Map", id: "visitedCountries" },
    //   { name: "Friends Located Map", id: "friendsLocatedCountries" },
    //   { name: "My Map", id: "custimizedMapCountries" },
    // ];
    await setDoc(doc(db, "user", uid), { originalMap: originalMapNames }, { merge: true });
    // console.log("hi");
    // let newMap = { id: newId, name: "new Map" };
  }

  useEffect(() => {
    if (userNameInputRef.current !== null) {
      userNameInputRef.current!.value = userName;
    }
    // const persisState = localStorage.getItem("user") || "";
    // if (persisState) {
    //   setIsLoggedIn(true);
    //   // const a = memberInfo
    //   const memberInfo = JSON.parse(localStorage.getItem("user"));
    //   console.log(memberInfo);
    //   setMemberName(memberInfo.data.user.name);
    //   setMemberEmail(memberInfo.data.user.email);
    //   setMemberRole(memberInfo.data.user.role);
    // }
  }, []);
  function onSubmit() {
    if (loginStatus === "register") {
      // const auth = getAuth();
      createUserWithEmailAndPassword(auth, accountInputValue, passwordInputValue)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // console.log(userCredential.user.uid);
          // console.log("登入囉");
          // console.log(user.uid);
          setToLogIn(false);
          setUid(user.uid);
          writeUserMap1Data(user.uid);
          writeUserNameToData(user.uid);
          writeOriginMapToData(user.uid);
          setErrorMsg([]);
          // ...
        })
        .catch((error) => {
          if (error.message === "Firebase: Error (auth/email-already-in-use).") {
            setErrorMsg(["2", "* email is already registered"]);
          } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            setErrorMsg(["6", "* password should be at least 6 characters"]);
          } else if (error.message === "Firebase: Error (auth/invalid-email).") {
            setErrorMsg(["7", "* this is not a valid email"]);
          }
          // console.log(error.message);
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    } else if (loginStatus === "login") {
      // const auth = getAuth();
      signInWithEmailAndPassword(auth, accountInputValue, passwordInputValue)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUid(user.uid);
          // console.log("登入囉");
          setToLogIn(false);
          // console.log(user.uid);
          // setIsLoggedIn(true);
          // ...
          setNotificationInfo({ text: "Welcome Back!", status: true });
          setTimeout(() => {
            setNotificationInfo({ text: "", status: false });
          }, 3000);
          // setMapState(2);
          setErrorMsg([]);
        })
        .catch((error) => {
          if (error.message === "Firebase: Error (auth/wrong-password).") {
            setErrorMsg(["3", "* password is wrong"]);
          } else if (error.message === "Firebase: Error (auth/user-not-found).") {
            setErrorMsg(["4", "* account not found"]);
          } else if (error.message === "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
            setErrorMsg(["5", "* too many attempts, please try again later"]);
            // setNotificationInfo({ text: `* too many attempt, please try again later"`, status: true });
            // setTimeout(() => {
            //   setNotificationInfo({ text: "", status: false });
            // }, 3000);
          } else if (error.message === "Firebase: Error (auth/invalid-email).") {
            setErrorMsg(["7", "* this is not a valid email"]);
          }
          // console.log(error.message);

          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  }
  function LogOut() {
    signOut(auth)
      .then(() => {
        setUid("");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }
  async function writeUserMap1Data(uid: string) {
    // console.log("哈哈哈");
    // console.log(uid);

    countryList.map(async (country) => {
      await setDoc(
        doc(db, "user", uid, "visitedCountries", country.countryId),
        {
          visited: true,
        },
        { merge: true }
      );
    });

    // console.log("我有寫啦");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
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
    // console.log("我有寫啦");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  async function updateProfileInfo(uid: string) {
    if (imageUpload == null) {
      const url = userImage;
      // console.log(userNameInputRef.current);
      await setDoc(
        doc(db, "user", uid),
        {
          userName: userNameInputRef.current!.value,
          imgUrl: url,
        },
        { merge: true }
      );
      setIsEditingProfile(false);
      // setUserImg("");
    } else {
      // console.log(imageUpload);
      // console.log(userNameInputRef.current!.value);
      const imageRef = ref(storage, `${uid}profile/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          // writeUserMap2Data(url)
          // console.log(url);
          // console.log(uid);
          // console.log(userNameInputRef);
          // console.log(userName);
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
  // console.log(memberInfo)
  // console.log(memberRole);
  // console.log(userName);
  // console.log(userNameInputRef.current);
  // console.log(toLogIn);

  return (
    <Wrapper toLogIn={toLogIn}>
      <LogginPopUp toLogIn={toLogIn}>
        <ProfilePanel toLogIn={toLogIn}>
          {isLoggedIn === false && loginStatus === "login" && <ProfileTitle toLogIn={toLogIn}>Welcome Back</ProfileTitle>}
          {isLoggedIn === false && loginStatus === "register" && <ProfileTitle toLogIn={toLogIn}>Let's Map the World</ProfileTitle>}

          {isLoggedIn === true && (
            <>
              <ProfileUserInfo>
                {isEditingProfile ? (
                  <ProfileTitleInput
                    defaultValue={userName}
                    // defaultValue={pointList[pointIndex].title}
                    ref={userNameInputRef}
                    // onChange={(e)=>{setUserName(e.target.value)}}
                  />
                ) : (
                  <ProfileTitle toLogIn={toLogIn}>{userName}</ProfileTitle>
                )}
                <AddProfilePicLabel htmlFor="addProfilePic">{previewProfileImgUrl && previewProfileImgUrl ? <ProfileUserInfoImg src={previewProfileImgUrl} toLogIn={toLogIn}></ProfileUserInfoImg> : userImage && userImage ? <ProfileUserInfoImg src={userImage} toLogIn={toLogIn}></ProfileUserInfoImg> : <ProfileNoPic isEditingProfile={isEditingProfile} toLogIn={toLogIn}></ProfileNoPic>}</AddProfilePicLabel>

                {isEditingProfile ? (
                  <>
                    <AddProfilePicInput
                      id="addProfilePic"
                      type="file"
                      accept="image/png, image/gif, image/jpeg, image/svg"
                      onChange={(e) => {
                        setImageUpload(e.target.files![0]);
                      }}></AddProfilePicInput>
                    <UpdateProfileBtn
                      onClick={() => {
                        updateProfileInfo(uid);
                        // console.log(userNameInputRef.defaultvalue);

                        setUserName(userNameInputRef.current !== null ? userNameInputRef.current!.value : userName);
                      }}></UpdateProfileBtn>
                  </>
                ) : (
                  <EditProfileBtn
                    onClick={() => {
                      // setImageUpload(null);
                      setIsEditingProfile(true);
                    }}></EditProfileBtn>
                )}
              </ProfileUserInfo>
            </>
          )}

          {isLoggedIn === false && (
            <ProfileLogInSet toLogIn={toLogIn}>
              {loginStatus === "register" && (
                <ProfileInputSet>
                  <AccountWord>Name</AccountWord>
                  <ProfileInput value={nameInputValue} onChange={(e) => setNameInputValue(e.target.value)} />
                  {/* {console.log(nameInputValue)} */}
                  {errorMsg[0] === "1" ? <WarningWord>{errorMsg[1]}</WarningWord> : <></>}
                </ProfileInputSet>
              )}
              <ProfileInputSet>
                <AccountWord>Email</AccountWord>
                <ProfileInput value={accountInputValue} onChange={(e) => setAccountInputValue(e.target.value)} />
                {/* {console.log(accountInputValue)} */}
                {errorMsg[0] === "2" ? <WarningWord>{errorMsg[1]}</WarningWord> : errorMsg[0] === "4" ? <WarningWord>{errorMsg[1]}</WarningWord> : errorMsg[0] === "7" ? <WarningWord>{errorMsg[1]}</WarningWord> : <></>}
              </ProfileInputSet>
              <ProfileInputSet>
                <AccountWord>Password</AccountWord>
                <ProfileInput type={"password"} value={passwordInputValue} onChange={(e) => setPasswordInputValue(e.target.value)} />
                {/* {console.log(passwordInputValue)} */}
                {errorMsg[0] === "3" ? <WarningWord>{errorMsg[1]}</WarningWord> : errorMsg[0] === "5" ? <WarningWord>{errorMsg[1]}</WarningWord> : errorMsg[0] === "6" ? <WarningWord>{errorMsg[1]}</WarningWord> : <></>}
              </ProfileInputSet>

              <ProfileCheckSet>
                <ProfileCheckboxSet>
                  {/* <ProfileStayInput type="checkbox" />
                  <ProfileStayWord>Stay Logged In</ProfileStayWord> */}
                </ProfileCheckboxSet>
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

          {/* <ProfileMoreInfo>
          <ProfileMoreInfoLine />
          {isLoggedIn === true && (
            <ProfileMoreInfoText>{memberEmail}</ProfileMoreInfoText>
          )}
          <ProfileMoreInfoLine />
        </ProfileMoreInfo> */}

          {isLoggedIn === true && (
            <ProfileLogoutBtn
              toLogIn={toLogIn}
              onClick={() => {
                setIsLoggedIn(false);
                // localStorage.clear();
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
            }}></Back>
        </ProfilePanel>{" "}
        {/* {isLoggedIn === true && (
          <InfoPanel>
            <ProfileLogoutBtn2
              onClick={() => {
                setIsLoggedIn(false);
              }}
            >
              LOG OUT
            </ProfileLogoutBtn2>
          </InfoPanel>
        )} */}
      </LogginPopUp>
    </Wrapper>
  );
}

export default Login;
