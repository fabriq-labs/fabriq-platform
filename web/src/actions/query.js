// Query Edit
import ActionTypes from "../action-types";

export function updateQuery(payload) {
  return {
    type: ActionTypes.UPDATE_QUERY_SHARE,
    payload
  };
}

export function updateQueryObj(payload) {
  return {
    type: ActionTypes.UPDATE_QUERY,
    payload
  };
}
