import ActionTypes from "../action-types";

export function updatePipelineFilter(payload) {
  return {
    type: ActionTypes.UPDATE_FILTER,
    payload
  };
}

export function updateConnections(payload) {
  return {
    type: ActionTypes.UPDATE_CONNECTIONS,
    payload
  };
}

export function updateRouteKey(payload) {
  return {
    type: ActionTypes.UPDATE_ROUTE_KEY,
    payload
  };
}
