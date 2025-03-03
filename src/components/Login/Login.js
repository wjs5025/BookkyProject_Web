import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SocialGoogle from "./SocialGoogle";
import { useSelector } from "react-redux";

// LoginModal - 로그인 View 구성
function Login({ modalOpen, updateUser }) {
  // 변수 선언
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autologin, setAutoLogin] = useState(false);
  const dispatch = useDispatch();
  const [, setCookie] = useCookies();
  const state = useSelector((state) => state);
  const baseURL = state.baseURL.url;

  // 체크박스 Checked 여부
  const checked = (autologin) => {
    if (autologin === true) {
      return true;
    } else {
      return false;
    }
  };

  // 로그인 버튼 클릭 시
  function SendLogin(email, password, autologin) {
    // 자동로그인 체크했을 때,
    if (autologin === true) {
      setCookie("autologin", true);
    } else {
      setCookie("autologin", false);
    }

    // 통신 - 데이터 (이메일, 비밀번호)
    const params = JSON.stringify({
      email: email,
      pwToken: password,
      loginMethod: 0,
    });

    // 통신 - 로그인 데이터 전송
    axios
      .post(baseURL + "user/signin", params, {})
      .then((res) => {
        console.log(res);
        // 로그인 통신 성공 시
        if (res.data.success === true) {
          // 통신에 성공했을 때, 쿠키의 만료시간 생성 (만료시간 == 1시간)
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 60);
          // autologin이 true일 때만, 로컬스토리지에 로그인 정보 저장
          if (autologin === true) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            localStorage.setItem("loginMethod", 0);
          }
          // 로그인 유지를 위한 로그인 정보 쿠키 저장 (만료시간 == 1시간)
          setCookie("email", email, {
            expires: expires,
          });
          setCookie("password", password, {
            expires: expires,
          });
          setCookie("loginMethod", 0, {
            expires: expires,
          });
          setCookie("refresh_token", res.data.result.refresh_token);
          // Redux - 현재 유저 정보 업데이트
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
          modalOpen(false);
        }
      })
      // 로그인 통신 실패 시
      .catch((error) => {
        console.log(error.response.data);
        alert(error.response.data.errorMessage);
      });
  }

  // 로그인 View
  return (
    <LoginContainer className="nodrag">
      <div className="LogoArea">
        <img src={require("../../assets/Bookky/북키_로그인.png")} alt="" />
      </div>
      <div className="LoginArea">
        <div className="Header">로그인</div>
        <form>
          <input
            type="email"
            value={email}
            autoComplete="username"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <LoginBtn onClick={() => SendLogin(email, password, autologin)}>
          로그인
        </LoginBtn>
        <AutoLoginBtn checked={checked(autologin)}>
          <input
            className="checkbox"
            type="checkbox"
            id="autoLogin"
            onChange={() => {
              autologin ? setAutoLogin(false) : setAutoLogin(true);
            }}
          />
          <label htmlFor="autoLogin">로그인 유지하기</label>
        </AutoLoginBtn>
        <LoginOption>
          <Link to="/signup" onClick={() => modalOpen(false)}>
            회원가입
          </Link>
          <Link to="/find" onClick={() => modalOpen(false)}>
            로그인에 문제가 있나요?
          </Link>
        </LoginOption>
        <div className="SocialLogin-title">SNS 간편로그인</div>
        <SocialLogin>
          {/* <div onClick={() => alert("네이버 로그인")}>
            <img src={require("../../assets/Social_Naver.png")} alt="" />
          </div>
          <div onClick={() => alert("카카오 로그인")}>
            <img src={require("../../assets/Social_Kakao.png")} alt="" />
          </div> */}

          <SocialGoogle />
        </SocialLogin>
      </div>
    </LoginContainer>
  );
}

//////////////////////////////////////// Styled-Components
const LoginContainer = styled.div`
  display: flex;
  min-height: 512px;
  text-align: center;

  .LogoArea {
    flex-basis: 40%;
    display: flex;
    border-right: 2px solid #d9d9d9;

    img {
      width: 300px;
      margin: auto;
    }
  }

  .LoginArea {
    flex-basis: 60%;

    input {
      width: 70%;
      line-height: 50px;
      margin: 10px auto;
      padding: 0 10px;
      background-color: #f3f3f3;
      border: 3px solid #f3f3f3;
      border-radius: 5px;
      outline-color: #6c95ff;
      transition: all 0.3s;

      :focus {
        border: 3px solid #6c95ff;
      }
    }
  }

  .Header {
    width: fit-content;
    font-size: 2em;
    font-weight: 700;
    text-align: center;
    margin: 4vh auto;
    border-bottom: 3px solid #6c95ff;
    margin-bottom: 5vh;
  }

  .SocialLogin-title {
    position: relative;
    width: 50%;
    font-size: 0.8em;
    margin: 1vh auto 2vh auto;
    padding-top: 2vh;
    border-top: 1px solid #f1f1f1;
  }
`;

const LoginBtn = styled.div`
  width: 70%;
  margin: auto;
  margin-top: 20px;
  line-height: 55px;
  text-align: center;
  background-color: #6c95ff;
  border-radius: 5px;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  :hover {
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.25);
  }
`;

const AutoLoginBtn = styled.div`
  width: 70%;
  margin: 10px auto;
  text-align: initial;
  color: gray;
  font-size: 0.8em;

  .checkbox {
    margin: 5px !important;
    width: initial !important;

    :hover {
      cursor: pointer;
    }
  }

  label:hover {
    cursor: pointer;
  }
`;

const LoginOption = styled.div`
  width: 70%;
  margin: auto;
  display: flex;

  a {
    margin-top: 40px;
    font-size: 0.8em;
    flex-basis: 50%;
    color: gray;
  }
`;

const SocialLogin = styled.div`
  width: 30%;
  margin: 10px auto;
  display: flex;

  div {
    line-height: 40px;
    margin: auto;
    cursor: pointer;

    img {
      width: 36px;
      margin: auto;
    }
  }
`;

export default Login;
