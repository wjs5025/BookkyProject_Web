import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Login({ modalOpen, updateUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autologin, setAutoLogin] = useState(false);
  const [cookies, setCookie] = useCookies();

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
    console.log(email, password, autologin);
    console.log(autologin);

    // 자동로그인 체크했을 때,
    if (autologin === true) {
      setCookie("autologin", true);
    } else {
      setCookie("autologin", false);
    }

    const params = JSON.stringify({
      email: email,
      pwToken: password,
    });

    axios
      .post("http://203.255.3.144:8002/v1/test1", params, {
        "Content-Type": "application/json",
      })
      .then((res) => {
        console.log(res);
        console.log(
          "updateUser 완료. \n토큰 : ",
          res.data.access_token,
          "\n이메일 : ",
          res.data.result.email,
          "\n닉네임 : ",
          res.data.result.nickname
        );

        if (res.data.success === true) {
          console.log("응답", res.data.refresh_token);
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          updateUser(
            res.data.access_token,
            res.data.result.email,
            res.data.result.nickname
          );
          setCookie("refresh_token", res.data.refresh_token);
          modalOpen(false);
        } else {
          console.log("로그인 에러");
        }
      });
  }

  return (
    <LoginContainer>
      <div className="LogoArea">
        <img src={require("../assets/Bookky_Login.png")} alt="" />
      </div>
      <div className="LoginArea">
        <div className="Header">로그인</div>
        <form>
          <input
            type="checkbox"
            checked={checked(autologin)}
            onChange={() => {
              autologin ? setAutoLogin(false) : setAutoLogin(true);
            }}
          />
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
          <div onClick={() => alert("네이버 로그인")}>
            <img src={require("../assets/Social_Naver.png")} alt="" />
          </div>
          <div onClick={() => alert("카카오 로그인")}>
            <img src={require("../assets/Social_Kakao.png")} alt="" />
          </div>
          <div onClick={() => alert("구글 로그인")}>
            <img src={require("../assets/Social_Google.png")} alt="" />
          </div>
        </SocialLogin>
      </div>
    </LoginContainer>
  );
}

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
    margin: 4vh auto 2vh auto;
    padding-top: 2vh;
    border-top: 1px solid #f1f1f1;
  }
`;

const LoginBtn = styled.div`
  width: 70%;
  margin: 20px auto;
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

const LoginOption = styled.div`
  width: 70%;
  margin: auto;
  display: flex;

  a {
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