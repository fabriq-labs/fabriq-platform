import ActionTypes from "../action-types";

export function updateActiveTab(payload) {
  return {
    type: ActionTypes.UPDATE_ACTIVETAB,
    payload
  };
}

export function refreshActiveTab() {
  return {
    type: ActionTypes.REFRESH_ACTIVETAB
  };
}
