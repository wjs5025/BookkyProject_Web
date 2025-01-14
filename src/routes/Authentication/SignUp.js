import { useEffect, useState } from "react";
import styled from "styled-components";
import PageHeader from "../../components/PageHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux-modules/userData";

// 회원가입 (일반 회원가입 시)
function SignUp() {
  // 변수 선언
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verifiNumber, setVerifiNumber] = useState();
  const navigate = useNavigate();
  const [sendEmail, setsendEmail] = useState(0);
  const [isVerified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const [, setCookie] = useCookies();
  const state = useSelector((state) => state);
  const baseURL = state.baseURL.url;
  const SideNavState = state.SideNavState;
  const [nicknameMessage, setNicknameMessage] =
    useState("사용할 수 있는 닉네임입니다.");

  // 회원가입 버튼 클릭 시
  function SendSignUp(nickName, email, password) {
    if (isVerified === true) {
      // 통신 - 데이터 (이메일, 닉네임, 비밀번호)
      const params = JSON.stringify({
        email: email,
        nickname: nickName,
        pwToken: password,
        loginMethod: 0,
      });

      // 통신 - 회원가입 데이터 전송
      axios
        .post(baseURL + "v1/user/signup", params, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          if (res.data.success === true) {
            // 통신에 성공했을 때, 쿠키의 만료시간 생성 (만료시간 == 1시간)
            const expires = new Date();
            expires.setMinutes(expires.getMinutes() + 60);

            // 로그인 유지를 위한 로그인 정보 쿠키 저장 (만료시간 == 1시간)
            setCookie("email", email, {
              expires: expires,
            });
            setCookie("pwToken", password, {
              expires: expires,
            });
            setCookie("LoginMethod", 0, {
              expires: expires,
            });
            setCookie("refresh_token", res.data.refresh_token);
            // Redux - 현재 유저 정보 업데이트
            dispatch(
              updateUser(
                res.data.result.access_token,
                res.data.result.userData.email,
                res.data.result.userData.loginMethod,
                res.data.result.userData.nickname,
                password,
                res.data.result.userData.tagArray
              )
            );
            navigate("/");
          }
        });
    } else {
      alert("회원가입에 실패했습니다.");
    }
  }

  // 닉네임 검사
  function checkNickname() {
    axios
      .get(baseURL + "v1/user/nickname", {
        params: {
          nickname: nickName,
        },
      })
      .then((res) => {
        console.log(res.data.success);
        if (res.data.success === true) {
          setNicknameMessage("사용할 수 있는 닉네임입니다.");
        }
        console.log("실패 !");
      })
      .catch((error) => {
        if (error.response.data.success === false)
          setNicknameMessage("이미 사용 중인 닉네임입니다.");
      });
  }

  // 인증번호 받기 버튼 클릭 시
  function SendEmailVerifi(email) {
    const params = {
      params: {
        email: email,
      },
    };

    // 통신 - 인증 이메일 전송 요청 (이메일)
    axios
      .get(baseURL + "v1/user/email", params)
      .then((res) => {
        if (res.data.success === true) {
          alert("인증번호가 전송되었습니다");
          setsendEmail(1);
        } else {
          alert(res.data.errorMessage);
        }
      })
      .catch((error) => console.log(error));
  }

  // 인증번호 확인 버튼 클릭 시
  function SendVerifiNumber(email, verifiNumber) {
    const params = JSON.stringify({
      email: email,
      code: verifiNumber,
    });

    // 통신 - 인증정보 전송 (이메일, 입력된 인증번호)
    axios
      .post(baseURL + "v1/user/check", params, {
        "Content-Type": "application/json",
      })
      .then((res) => {
        if (res.data.success === true) {
          alert("인증에 성공하였습니다");
          setsendEmail(0);
          setVerified(true);
        } else {
          alert("인증에 실패하였습니다");
          console.log(res.data.errorMessage);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  // 이메일 전송여부에 따른 인증번호 input의 출력
  const Verifi = () => {
    // 이메일 전송에 성공했을 때
    if (sendEmail) {
      return (
        <VerifiNumberArea>
          <p>인증번호</p>
          <input
            className="verifiNumber"
            type="text"
            value={verifiNumber}
            maxLength="8"
            onChange={(e) => {
              setVerifiNumber(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => SendVerifiNumber(email, verifiNumber)}
          >
            인증번호 확인
          </button>
        </VerifiNumberArea>
      );
    }
    // 이메일 전송에 실패했을 때
    else {
      return <></>;
    }
  };

  // 닉네임 입력 값 변화에 따른 중복 검사 호출
  useEffect(checkNickname, [nickName]);

  // 회원가입 View
  return (
    <SignUpContainer width={SideNavState.width}>
      <PageHeader title="회원가입" subTitle="지금 바로, 북키와 함께하세요 !" />
      <Frame>
        <InputArea>
          <form>
            <div className="Header">환영합니다 !</div>
            <p>
              닉네임 (10자 이내)
              {nickName.length > 0 ? (
                <span onChange={checkNickname}>{nicknameMessage}</span>
              ) : (
                <></>
              )}
            </p>
            <input
              type="text"
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
            <p>이메일</p>
            <EmailVerifiArea>
              <input
                type="email"
                value={email}
                disabled={isVerified ? true : false} // 인증이 되었으면 disabled
                maxLength="35"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {isVerified ? (
                <></>
              ) : (
                <button type="button" onClick={() => SendEmailVerifi(email)}>
                  인증번호 받기
                </button>
              )}
            </EmailVerifiArea>
            <Verifi />
            <p>비밀번호</p>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <p>비밀번호 확인</p>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
            <SignUpBtn onClick={() => SendSignUp(nickName, email, password)}>
              회원가입
            </SignUpBtn>
          </form>
        </InputArea>

        <img src={require("../../assets/Bookky/북키_회원가입.png")} alt="" />
      </Frame>
    </SignUpContainer>
  );
}

//////////////////////////////////////// Styled-Components
const SignUpContainer = styled.div`
  position: relative;
  width: ${(props) => props.width};
  display: flex;
  flex-direction: column;
`;

const InputArea = styled.div`
  position: relative;
  min-width: 400px;
  margin: auto;
  margin-right: 5vw;
  min-height: 70vh;
  min-width: 400px;

  .Header {
    width: fit-content;
    font-size: 2em;
    font-weight: 700;
    text-align: center;
    margin: auto;
    border-bottom: 3px solid var(--main-color);
    margin-bottom: 6vh;
  }

  p {
    font-size: 0.9em;
    line-height: 1em;
    font-weight: bold;
    padding: 0 0 5px 10px;

    span {
      position: absolute;
      margin-left: 5px;
      color: #03c75a;
      font-size: 0.8em;
    }
  }

  input {
    width: 22vw;
    min-width: 400px;
    height: 45px;
    margin-bottom: 20px;
    padding: 0 10px;
    background-color: #f3f3f3;
    border: 3px solid #f3f3f3;
    border-radius: 5px;
    outline-color: var(--main-color);

    :focus {
      border: 3px solid var(--main-color);
    }
  }
`;

const SignUpBtn = styled.div`
  position: absolute;
  width: 22vw;
  min-width: 400px;
  line-height: 55px;
  bottom: 30px;
  text-align: center;
  background-color: var(--main-color);
  border-radius: 4px;
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  :hover {
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.25);
  }
`;

const EmailVerifiArea = styled.div`
  position: relative;

  button {
    display: ${(props) => props.display};
    font-size: 0.8em;
    position: absolute;
    width: 100px;
    line-height: 30px;
    top: 10%;
    right: 2%;
    color: white;
    background-color: var(--main-color);
    border: 1px solid var(--main-color);
    border-radius: 5px;
  }
`;

const VerifiNumberArea = styled.div`
  position: relative;

  button {
    font-size: 0.8em;
    position: absolute;
    width: 100px;
    line-height: 30px;
    top: 32.5%;
    right: 9px;
    color: white;
    background-color: var(--main-color);
    border: 1px solid var(--main-color);
    border-radius: 5px;
  }
`;

const Frame = styled.div`
  min-height: 75vh;
  display: flex;

  img {
    width: 468px;
    margin: 5vh auto 5vh 0;
  }
`;

export default SignUp;
