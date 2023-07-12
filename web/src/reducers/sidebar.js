// Sidebar
import ActionTypes from "../action-types/sidebar";

export const initialState = {
  activeMenu: "users",
  queryActiveMenu: "myquery",
  mainMenu: "query",
  queryFolder: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SIDEBARMENU:
      return {
        ...state,
        activeMenu: action.payload
      };
    case ActionTypes.UPDATE_QUERY_SIDEBARMENU:
      return {
        ...state,
        queryActiveMenu: action.payload
      };
    case ActionTypes.UPDATE_QUERY_SIDEBARMAINMENU:
      return {
        ...state,
        mainMenu: action.payload
      };
    case ActionTypes.QUERY_FOLDER_UPDATE:
      return {
        ...state,
        queryFolder: action.payload
      };
    case ActionTypes.REFRESH_SIDEBARMENU:
      return { ...initialState };
    default:
      return state;
  }
}
