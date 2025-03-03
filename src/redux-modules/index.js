import { combineReducers } from "redux";
import userData from "./userData";
import modalOpen from "./loginModal";
import SideNavState from "./sideNav";
import recommend from "./recommend";
import posts from "./posts";
import books from "./books";
import baseURL from "./init";
// Reducer를 모두 합쳐주는 combineReducers => rootReducer 정의
const rootReducer = combineReducers({
  userData,
  modalOpen,
  SideNavState,
  recommend,
  posts,
  books,
  baseURL,
});

export default rootReducer;
