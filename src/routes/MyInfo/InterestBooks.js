import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../../components/Cards/BookCard";
import axios from "axios";
import { updateInterests } from "../../redux-modules/books";
import { useEffect } from "react";

// SideBar - 내 관심도서
function Interests() {
  // 변수 정의
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const baseURL = state.baseURL.url;
  const user = state.userData;
  const mybooks = state.books.interests;
  const SideNavState = state.SideNavState;

  // getBooks() : 서버로부터 사용자의 관심도서를 받아 redux-store에 저장
  function getBooks() {
    if (user.accessToken) {
      console.log("성공");
      axios
        .get(baseURL + "user/favoritebook/0", {
          headers: {
            "access-token": user.accessToken,
          },
        })
        .then((res) => {
          console.log(res);
          dispatch(updateInterests(res.data.result.favoriteBookList));
        });
    }
  }

  // 최초 로드시, 도서 정보 업데이트
  useEffect(getBooks, [user, dispatch]);

  // 관심도서 View
  return (
    <InterstsContainer width={SideNavState.width}>
      <MainHeader>
        <Title className="nodrag">
          <p>
            <span className="name">{user.nickname}</span>
            {user.accessToken ? " 님" : ""}의 관심도서입니다
          </p>
          <p className="sub">
            총 <span>{mybooks.length}권</span>의 관심도서가 있네요 !
          </p>
        </Title>
      </MainHeader>
      <ContentArea>
        {mybooks.map((book) => {
          return (
            <BookCard
              key={book.TBID}
              className="nodrag"
              title={book.TITLE}
              thumnail={book.thumbnailImage}
              author={book.AUTHOR}
              publisher={book.PUBLISHER}
            />
          );
        })}
      </ContentArea>
    </InterstsContainer>
  );
}

//////////////////////////////////////// Styled-Components
const ContentArea = styled.div`
  width: ${(props) => props.width};
  margin: 3vh 4vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-template-rows: repeat(auto-fit, 250px);
  justify-content: start;
  column-gap: 1vw;
  row-gap: 3vh;
`;

const InterstsContainer = styled.div`
  width: ${(props) => props.width};
`;

const MainHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 15px;
  max-height: 250px;
  height: 180px;
  background-color: var(--main-color);
  margin: 5px 10px;
`;

const Title = styled.div`
  color: #f5f5f5;
  font-size: 2em;
  color: white;
  padding-left: 72px;

  .name {
    color: #ffd86d;
  }
  .sub {
    margin-top: 5px;
    color: #e9e9e9;
    font-size: 0.65em;
  }
`;

export default Interests;
