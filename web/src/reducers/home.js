// Home
import ActionTypes from "../action-types/home";

export const initialState = {
  homeDashboard: ""
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_HOMEDASHBOARD:
      return {
        ...state,
        homeDashboard: action.payload
      };
    case ActionTypes.REFRESH_HOMEDASHBOARD:
      return { ...initialState };
    default:
      return state;
  }
}
