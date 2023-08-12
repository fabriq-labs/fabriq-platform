// Explore - Dashboard
import ActionTypes from "../action-types/explore";

export const initialState = {
  query_isShared: false,
  dashboard_isShared: false,
  item: null,
  isQuery: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_QUERY_SHARE:
      return {
        ...state,
        query_isShared: action.payload
      };
    case ActionTypes.UPDATE_DASHBOARD_SHARE:
      return {
        ...state,
        dashboard_isShared: action.payload
      };
    case ActionTypes.UPDATE_QUERY:
      return {
        ...state,
        item: action.payload
      };
    case ActionTypes.UPDATE_QUERYINFO:
      return {
        ...state,
        isQuery: action.payload
      };
    default:
      return state;
  }
}
