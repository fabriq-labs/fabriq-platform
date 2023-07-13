// Header
import ActionTypes from "../action-types/header";

export const initialState = {
  activeTab: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_ACTIVETAB:
      return {
        ...state,
        activeTab: action.payload
      };
    case ActionTypes.REFRESH_ACTIVETAB:
      return { ...initialState };
    default:
      return state;
  }
}
