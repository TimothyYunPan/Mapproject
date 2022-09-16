import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import app from "../utils/firebaseConfig";

// import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { countryListType } from "../WorldMap";
// import getJwtToken from '../../utils/getJwtToken';

const auth = getAuth(app);

const Wrapper = styled.div`
  background-color: white;
  ${"" /* height: 540px; */} padding: 40px 20px;

  display: flex;
  ${"" /* flex-direction: column; */} justify-content: center;
  align-items: center;
  text-align: center;
  min-height: calc(100vh - 255px);
  @media (max-width: 1279px) {
    min-height: calc(100vh - 148px);
    flex-direction: column;
  }
`;
const ProfilePanel = styled.div`
  width: 400px;
  ${"" /* height: 520px; */} padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: solid 1px black;
  border-radius: 8px;
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

const InfoPanel = styled.div`
  margin-left: 45px;
  width: 500px;
  padding: 40px;
  height: 520px;
  display: flex;
  flex-direction: column;
  ${"" /* align-items: center; */} padding-top: 0px;

  @media (max-width: 1279px) {
    margin-left: 0px;
    color: black;
    box-sizing: border-box;
    padding: 32px 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    ${"" /* background-color: #313538; */};
  }
`;

const MemberStatus = styled.div`
  margin-right: auto;
  margin-bottom: 58px;
  font-size: 32px;
  color: white;
  @media (max-width: 1279px) {
    margin-left: auto;
  }
`;
const MemberInfoSet = styled.div`
  display: flex;
  height: 55px;
  width: 300px;
  align-items: center;
  text-decoration: none;
  @media (max-width: 1279px) {
    margin: 0 auto;
    justify-content: center;
  }
`;

const MemberInfoIcon = styled.div`
  height: 33px;
  width: 24px;
  margin-right: 21px;
  @media (max-width: 1279px) {
    display: none;
  }
`;

const MemberInfoText = styled.p`
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const MemberInfoLine = styled.div`
  width: 100%;
  border-top: 0.5px solid #9d9d9d;
  margin-top: 11px;
  margin-bottom: 11px;
`;

const ProfileTitle = styled.div`
  margin-bottom: 16px;
  font-size: 24px;
  color: black;
`;

const ProfileUserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 272px;
`;
const ProfileUserInfoImg = styled.div`
  margin-top: 16px;
  /* background-color: #fff; */
  /* border: solid 1px white; */
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  background-size: cover;
  background-image: url(https://graph.facebook.com/5610881185597352/picture?type=large);
`;

const ProfileLogInSet = styled.div`
  width: 100%;
`;

const ProfileInputSet = styled.label`
  color: black;
  width: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AccountWord = styled.p``;

const ProfileInput = styled.input`
  box-sizing: border-box;
  margin-top: 8px;
  padding: 0 8px;
  width: 100%;
  border: solid 1px black;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  height: 32px;
  color: black;
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
  color: black;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    font-weight: 600;
  }
`;
const ProfileWithAcount = styled.div`
  text-decoration: none;
  color: black;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    font-weight: 600;
  }
`;

const ProfileStayInput = styled.input`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const ProfileKeepLoggingIn = styled.p`
  color: black;
`;

const ProfileStayWord = styled.p`
  color: black;
`;

const ProfileLoginBtn = styled.button`
  color: rgb(58, 58, 58);
  font-weight: bold;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 32px;
  cursor: pointer;
  background-color: rgb(187, 187, 187);
  border: none;
  transition: background-color 0.1s;
  &:hover {
    background-color: #fff;
  }
  ${"" /* display:none */};
`;
const ProfileRegisterBtn = styled.button`
  color: rgb(58, 58, 58);
  font-weight: bold;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  font-size: 16px;
  border-radius: 4px;
  margin-top: 32px;
  cursor: pointer;
  background-color: rgb(187, 187, 187);
  border: none;
  transition: background-color 0.1s;
  &:hover {
    background-color: #fff;
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
  color: rgb(58, 58, 58);
  box-sizing: border-box;
  background-color: rgb(187, 187, 187);
  border: none;
  transition: 0.1s;
  font-size: 16px;
  &:hover {
    background-color: #fff;
  }
  ${"" /* display: none; */} @media (max-width: 1279px) {
    display: none;
  }
`;

const ProfileLogoutBtn2 = styled(ProfileLogoutBtn)`
  margin-top: 40px;
  display: none;
  @media (max-width: 1279px) {
    display: block;
  }
`;

const ProfileMoreInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 40px 0;
`;

const ProfileMoreInfoLine = styled.div`
  box-sizing: border-box;
  height: 1px;
  width: 100%;
  background-color: #fff;
`;

const ProfileMoreInfoText = styled.div`
  display: flex;
  padding: 0 16px;
  white-space: nowrap;
  color: white;
`;

const ProfileFbLogIn = styled.button`
  width: 251px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  color: rgb(255, 255, 255);
  box-sizing: border-box;
  background-color: #4267b2;
  border: none;
  transition: background-color 0.1s;
  ${"" /* display:none */};
`;
const ProfileFbLogInWord = styled.p`
  display: inline-block;
  padding-left: 8px;
  font-weight: bold;
  font-size: 14px;
`;

type LoginType = {
  setUid: Dispatch<SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  countryList: countryListType[];
};

function Login({ setUid, isLoggedIn, setIsLoggedIn, countryList }: LoginType) {
  const [profile, setProfile] = useState();
  const [loginStatus, setLoginStatus] = useState("login");
  // console.log(loginStatus);

  // console.log(isLoggedIn);
  const [memberRole, setMemberRole] = useState("金屬會員");
  // const [ memberInfo, setMemberInfo ] = useState([])
  const [memberName, setMemberName] = useState("Welcome back");
  const [memberEmail, setMemberEmail] = useState("您尊貴的Email");
  const [nameInputValue, setNameInputValue] = useState("");
  const [accountInputValue, setAccountInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  // console.log(uid)

  useEffect(() => {
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
          setUid(user.uid);
          writeUserMap1Data(user.uid);

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
          console.log(user.uid);
          setIsLoggedIn(true);

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
  // console.log(memberInfo)
  // console.log(memberRole);
  return (
    <Wrapper>
      <ProfilePanel>
        {isLoggedIn === false && loginStatus === "login" && <ProfileTitle>Welcome back</ProfileTitle>}
        {isLoggedIn === false && loginStatus === "register" && <ProfileTitle>You're new around here</ProfileTitle>}
        {isLoggedIn === true && <ProfileTitle>{memberName}</ProfileTitle>}
        {isLoggedIn === true && (
          <ProfileUserInfo>
            <ProfileUserInfoImg />
          </ProfileUserInfo>
        )}

        {isLoggedIn === false && (
          <ProfileLogInSet>
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
                <ProfileStayInput type="checkbox" />
                <ProfileStayWord>Stay Logged In</ProfileStayWord>
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
                  log in?
                </ProfileWithAcount>
              )}
            </ProfileCheckSet>
            {loginStatus === "login" && (
              <ProfileLoginBtn
                onClick={() => {
                  onSubmit();
                }}>
                LOGIN
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
            }}>
            LOG OUT
          </ProfileLogoutBtn>
        )}
      </ProfilePanel>

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
    </Wrapper>
  );
}

export default Login;
