import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import AddBooksCard from "../../Cards/AddBooksCard";
import PageHeader from "../../PageHeader";
import { ReactComponent as Close } from "../../../assets/icons/community/cross.svg"; // 모달 닫기 버튼
import { useSelector } from "react-redux";

// 게시글 작성 - 도서 첨부 시의 모달 창 Inner
const AddBooksModal = ({
  setAddBooksModal,
  setBookTitle,
  setBookAuthor,
  setSelect,
  setThumbnail,
  setTBID,
}) => {
  // 변수 선언
  const [input, setInput] = useState("");
  const state = useSelector((state) => state);
  const baseURL = state.baseURL.url;

  // 검색 결과 도서[] 배열 형태
  const [bookList, setBookList] = useState([
    { TBID: 0, TITLE: "", AUTHOR: "", PUBLISHER: "" },
  ]);

  // getBooks() : 서버로부터 검색 결과 받아오기   무한스크롤 또는 페이지네이션 추가해야 함.
  function getBooks() {
    console.log(input);
    axios
      .get(baseURL + "community/post/book", {
        params: {
          keyword: input,
          quantity: 10,
          page: 1,
        },
      })
      .then((res) => {
        console.log("검색 결과", res);
        setBookList(res.data.result.searchData);
      });
  }

  // 도서 추가 View
  return (
    <AddBooksModalContainer>
      {/* Header */}
      <PageHeader
        title="도서 추가"
        subTitle=" 원하는 도서를 게시글에 추가하세요"
      />

      {/* 모달 닫기 버튼 */}
      <Close className="close-btn" onClick={() => setAddBooksModal(false)} />

      {/* 검색바 - input */}
      <input
        type="text"
        placeholder="제목 또는 태그로 도서 검색"
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={() => {
          if (window.event.keyCode === 13) getBooks();
        }}
      />

      {/* 도서 목록 출력 */}
      {bookList.length <= 0 ? (
        // 검색 결과가 없을 때
        <div className="default-book-list">검색 결과가 없습니다.</div>
      ) : // 최초 안내 문구
      bookList[0].TBID === 0 ? (
        <div className="default-book-list">여기에 도서 목록이 출력됩니다.</div>
      ) : (
        bookList.map((el) => (
          <AddBooksCard
            key={el.TBID}
            TBID={el.TBID}
            TITLE={el.TITLE}
            AUTHOR={el.AUTHOR}
            PUBLISHER={el.PUBLISHER}
            thumbnailImage={el.thumbnailImage}
            setBookTitle={setBookTitle}
            setAddBooksModal={setAddBooksModal}
            setBookAuthor={setBookAuthor}
            setSelect={setSelect}
            setThumbnail={setThumbnail}
            setTBID={setTBID}
          />
        ))
      )}
    </AddBooksModalContainer>
  );
};

//////////////////////////////////////// Styled-Components
const AddBooksModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .close-btn {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 0;
    top: 2vh;

    :hover {
      cursor: pointer;
    }
  }

  input {
    border-radius: 5px;
    background-color: #f9f9f9;
    width: 80%;
    margin: 10px 50px;
    height: 40px;
    padding-left: 10px;

    :focus {
      outline: 2px solid var(--main-color);
    }
  }

  .default-book-list {
    color: var(--main-color);
    font-weight: bold;
    margin: 10px;
  }
`;

export default AddBooksModal;
