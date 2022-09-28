import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import app from "../utils/firebaseConfig";
import userProfileGrey from "./userProfileGrey.png";

// import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { countryListType, friendListType, haveFriendListType, pointListType } from "../App";
import edit from "./edit.png";
import editHover from "./editHover.png";
import okIcon from "./okIcon.png";
import { PointNotesTitleInput } from "../WorldMap";
import back from "./back.png";
import noIcon from "./noIcon.png";
import closeGrey from "./closeGrey.png";
const storage = getStorage(app);
// import getJwtToken from '../../utils/getJwtToken';

const auth = getAuth(app);

const Wrapper = styled.div<{ toLogIn: boolean }>`
  position: fixed;
  /* background-color: ${(props) => (props.toLogIn ? "rgba(128, 128, 128, 0.5)" : "inherit")}; */
  width: 100vw;
  height: 100vh;
  /* width: ${(props) => (props.toLogIn ? "100vw" : 0)}; */
  height: ${(props) => (props.toLogIn ? "100vh;" : 0)};

  /* padding: 100px 20px; */
  top: 0%;
  left: 0%;

  /* transform: translate(-50%, -50%); */
  visibility: ${(props) => (props.toLogIn ? "visible" : "hidden")};
  z-index: -150;
`;

const LogginPopUp = styled.div`
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
  @media (max-width: 1279px) {
    color: black;
    box-sizing: border-box;
    padding: 32px 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: #313538;
    border: none;
    border-radius: 4px;
  }
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
const ProfileNoPic = styled.div<{ toLogIn: boolean }>`
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
  cursor: pointer;
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
`;

const AccountWord = styled.p`
  white-space: nowrap;
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

const ProfileLogoutBtn = styled.button`
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
  transition: 0.1s;
  font-size: 16px;
  &:hover {
    background-color: rgb(211, 211, 211);
    color: rgb(42, 61, 78);
  }
  ${"" /* display: none; */} @media (max-width: 1279px) {
    display: none;
  }
`;
const EditProfileBtn = styled.div`
  width: 20px;
  height: 20px;
  top: 20px;
  right: 0px;
  background-image: url(${edit});
  background-size: cover;
  position: absolute;
  cursor: pointer;

  :hover {
    background-image: url(${editHover});
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
  background-image: url(${okIcon});
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
  z-index: 250;
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
};

function Login({ setUid, isLoggedIn, setIsLoggedIn, countryList, setCountryList, toLogIn, setToLogIn, uid, setMapState, friendsList, setFriendsList, setHaveFriendList, setFriendList, setPointList, loginStatus, setLoginStatus, userName, setUserName, userImage }: LoginType) {
  const [profile, setProfile] = useState();
  // console.log(loginStatus);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const previewProfileImgUrl = imageUpload ? URL.createObjectURL(imageUpload) : userImage ? userImage : "";
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  // console.log(isLoggedIn);

  const imageListRef = ref(storage, "images/");
  const [imageList, setImageList] = useState<string[]>([]);
  const [memberRole, setMemberRole] = useState("金屬會員");
  // const [ memberInfo, setMemberInfo ] = useState([])
  const [memberEmail, setMemberEmail] = useState("您尊貴的Email");
  const [nameInputValue, setNameInputValue] = useState("");
  const [accountInputValue, setAccountInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const userNameInputRef = useRef<HTMLInputElement>(null);

  // console.log(uid)

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
          console.log(userCredential.user.uid);
          console.log("登入囉");
          console.log(user.uid);
          setToLogIn(false);
          setUid(user.uid);
          writeUserMap1Data(user.uid);
          writeUserNameToData(user.uid);
          // ...
        })
        .catch((error) => {
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
          console.log("登入囉");
          setToLogIn(false);
          console.log(user.uid);
          // setIsLoggedIn(true);
          // ...
        })
        .catch((error) => {
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
    console.log("哈哈哈");
    console.log(uid);

    countryList.map(async (country) => {
      await setDoc(doc(db, "user", uid, "visitedCountries", country.countryId), {
        visited: true,
      });
    });

    console.log("我有寫啦");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  async function writeUserNameToData(uid: string) {
    await setDoc(doc(db, "user", uid), {
      userName: nameInputValue,
    });

    console.log("我有寫啦");
    // await setDoc(doc(db, "user/7LkdfIpKjPiFsrPDlsaM"), {
    //   country
    // });
  }

  async function updateProfileInfo(uid: string) {
    if (imageUpload == null) {
      const url = "";
      console.log(userNameInputRef.current);
      await setDoc(doc(db, "user", uid), {
        userName: userNameInputRef.current!.value,
        imgUrl: url,
      });
      setIsEditingProfile(false);
    } else {
      console.log(imageUpload);
      console.log(userNameInputRef.current!.value);
      const imageRef = ref(storage, `${uid}profile/${imageUpload.name}`);
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          // writeUserMap2Data(url)
          // console.log(url);
          // console.log(uid);
          // console.log(userNameInputRef);
          // console.log(userName);
          await setDoc(doc(db, "user", uid), {
            userName: userNameInputRef.current !== null ? userNameInputRef.current!.value : userName,
            imgUrl: url,
          });
          setIsEditingProfile(false);
        });
      });
    }
  }
  // console.log(memberInfo)
  // console.log(memberRole);
  console.log(userName);
  console.log(userNameInputRef.current);
  return (
    <Wrapper toLogIn={toLogIn}>
      <LogginPopUp>
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
                  <ProfileTitle toLogIn={toLogIn}>Hi {userName}</ProfileTitle>
                )}
                <AddProfilePicLabel htmlFor="addProfilePic">{previewProfileImgUrl && previewProfileImgUrl ? <ProfileUserInfoImg src={previewProfileImgUrl} toLogIn={toLogIn}></ProfileUserInfoImg> : userImage && userImage ? <ProfileUserInfoImg src={userImage} toLogIn={toLogIn}></ProfileUserInfoImg> : <ProfileNoPic toLogIn={toLogIn}></ProfileNoPic>}</AddProfilePicLabel>

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
                </ProfileInputSet>
              )}
              <ProfileInputSet>
                <AccountWord>Email</AccountWord>
                <ProfileInput value={accountInputValue} onChange={(e) => setAccountInputValue(e.target.value)} />
                {/* {console.log(accountInputValue)} */}
              </ProfileInputSet>
              <ProfileInputSet>
                <AccountWord>Password</AccountWord>
                <ProfileInput value={passwordInputValue} onChange={(e) => setPasswordInputValue(e.target.value)} />
                {/* {console.log(passwordInputValue)} */}
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
                    }}>
                    sign up?
                  </ProfileNoAcount>
                )}
                {loginStatus === "register" && (
                  <ProfileWithAcount
                    onClick={() => {
                      setLoginStatus("login");
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
                    onSubmit();
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
              }}>
              LOG OUT
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
