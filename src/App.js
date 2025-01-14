import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import TopNav from "./components/Navigation/TopNav";
import SideNav from "./components/Navigation/SideNav";
import Routes from "./routes/Routes";
import { useCookies } from "react-cookie";
import axios from "axios";
import { updateAccessToken, updateUser } from "./redux-modules/userData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideNavFoldBtn from "./components/Navigation/SideNavFoldBtn";

// App() : 최상위 컴포넌트
function App() {
  // 변수 정의
  const cookies = useCookies();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [loginMethod, setLoginMethod] = useState(undefined);
  const state = useSelector((state) => state);
  const baseURL = state.baseURL.url;
  const SideNavState = state.SideNavState;

  // 최초 email, pwToken 설정
  const Init = () => {
    // Case 1 : 자동로그인이 true 일 때는 로컬스토리지의 email, pwToken 사용
    if (cookies[0].autologin === "true") {
      setEmail(localStorage.getItem("email"));
      setPassword(localStorage.getItem("password"));
      setLoginMethod(localStorage.getItem("loginMethod"));
    }

    // Case 2 : 다른 경우에는 쿠키의 email, pwToken 사용
    else if (cookies[0].email !== "" && cookies[0].password !== "") {
      setEmail(cookies[0].email);
      setPassword(cookies[0].password);
      setLoginMethod(cookies[0].loginMethod);
    }
  };

  // 자동로그인 통신
  const AutoLogin = () => {
    // email, pwToken, loginMethod !== undefined 일때만 통신 (불필요한 통신 방지)
    if (
      email !== undefined &&
      password !== undefined &&
      loginMethod !== undefined
    ) {
      // 통신 - 로그인 시도 (이메일, 비밀번호)
      axios
        .post(
          baseURL + "user/signin",
          JSON.stringify({
            email: email,
            pwToken: password,
            loginMethod: loginMethod,
          })
        )
        .then((res) => {
          // 로그인 통신 성공 시
          if (res.data.success === true) {
            console.log("자동로그인 성공", res);
            dispatch(
              updateUser(
                res.data.result.access_token,
                res.data.result.userData.email,
                res.data.result.userData.loginMethod,
                res.data.result.userData.nickname,
                password,
                res.data.result.userData.tag_array,
                res.data.result.userData.thumbnail
              )
            );
          }
          // 로그인 통신 실패 시
          else {
            console.log("로그인 실패");
          }
        })
        .catch((error) => console.log(error));
    }
  };

  // 최초 렌더링 시, Init() AutoLogin()
  useEffect(Init, [cookies]);

  // 자동 로그인
  useEffect(AutoLogin, [email, password, loginMethod, dispatch, baseURL]);

  // App View
  return (
    <>
      <GlobalStyle />
      <Router>
        <TopNav />
        <FlexDiv>
          <SideNavFoldBtn />
          {SideNavState.isfold ? <></> : <SideNav />}
          <Routes />
        </FlexDiv>
      </Router>
    </>
  );
}

//////////////////////////////////////// Styled-Components
const FlexDiv = styled.div`
  display: flex;
  position: relative;
`;

const GlobalStyle = createGlobalStyle`

  :root {
    --main-color : #6e95ff;
    --sub-color : #FFA24D;
    --bright-base-bg-color : #ffffff;
    --dark-base-bg-color : #000000;
    --bright-base-font-color : #000000;
    --dark-base-font-color : #ffffff;
    --none-folded-width : calc(100vw - 160px);
    --folded-width : calc(100vw);
    line-height: 1;
    font-family: "KoddiUD";    
  }
  
  ::-webkit-scrollbar {
  display: none;
}

	body {
    margin : 0;
    padding : 0;
    background-color: var(--bright-base-bg-color);
    

  /* 스크롤바 hidden */

  .nodrag {
    /* 드래그 방지 CSS */
    -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}}
`;
export default App;
