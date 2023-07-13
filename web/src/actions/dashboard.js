import ActionTypes from "../action-types";

export function updateDashboardShare(payload) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD_SHARE,
    payload
  };
}
