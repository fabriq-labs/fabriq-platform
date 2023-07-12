import ActionTypes from "../action-types";

export function updateHomeDashboard(payload) {
  return {
    type: ActionTypes.UPDATE_HOMEDASHBOARD,
    payload
  };
}

export function refreshActiveTab() {
  return {
    type: ActionTypes.REFRESH_HOMEDASHBOARD
  };
}
