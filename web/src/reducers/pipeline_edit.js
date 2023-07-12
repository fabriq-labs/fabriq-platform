import ActionTypes from "../action-types/pipeline_edit";

export const initialState = {
  pipelineMenu: "connect",
  destinations: [],
  pipelineId: 0,
  redirect_url: "",
  connections: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_ACTIVEMENU:
      return {
        ...state,
        pipelineMenu: action.payload
      };
    case ActionTypes.UPDATE_DESTINATION:
      return {
        ...state,
        destinations: action.payload
      };
    case ActionTypes.UPDATE_PIPELINEID:
      return {
        ...state,
        pipelineId: action.payload
      };
    case ActionTypes.UPDATE_CONNECTIONS:
      return {
        ...state,
        connections: action.payload
      };
    case ActionTypes.UPDATE_REDIRECTURL:
      return {
        ...state,
        redirect_url: action.payload
      };
    default:
      return state;
  }
}
