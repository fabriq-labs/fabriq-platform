// Pipeline List

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Viewer } from "../pages/Pipelines/Viewer";
import {
  updatePipelineFilter,
  updateConnections,
  updateRouteKey
} from "../actions/pipeline_list";

const mapStateToProps = (state) => {
  const {
    pipeline_list: { filter, connections, routeKey }
  } = state;

  return {
    filter,
    connections,
    routeKey
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updatePipelineFilter,
      updateConnections,
      updateRouteKey
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
