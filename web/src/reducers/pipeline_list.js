import ActionTypes from "../action-types/pipeline_list";

export const initialState = {
  filter: "my",
  connections: [],
  routeKey: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_FILTER:
      return {
        ...state,

        filter: action.payload
      };
    case ActionTypes.UPDATE_CONNECTIONS:
      return {
        ...state,

        connections: action.payload
      };
    case ActionTypes.UPDATE_ROUTE_KEY:
      return {
        ...state,

        routeKey: action.payload
      };
    default:
      return state;
  }
}
