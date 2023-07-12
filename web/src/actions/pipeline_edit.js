import ActionTypes from "../action-types";

export function updatePipelineMenu(payload) {
  return {
    type: ActionTypes.UPDATE_ACTIVEMENU,
    payload
  };
}

export function updateDestinations(payload) {
  return {
    type: ActionTypes.UPDATE_DESTINATION,
    payload
  };
}

export function updatePipelineId(payload) {
  return {
    type: ActionTypes.UPDATE_PIPELINEID,
    payload
  };
}

export function updateRedirectUrl(payload) {
  return {
    type: ActionTypes.UPDATE_REDIRECTURL,
    payload
  };
}

export function updateConnections(payload) {
  return {
    type: ActionTypes.UPDATE_CONNECTIONS,
    payload
  };
}
