// Pipeline

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PipelineView } from "../pages/Pipelines/Viewer";
import { updatePipelineMenu } from "../actions/pipeline_edit";
import { updateRouteKey } from "../actions/pipeline_list";

const mapStateToProps = (state) => {
  const {
    pipeline_edit: { connections }
  } = state;

  return {
    connections
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updatePipelineMenu,
      updateRouteKey
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PipelineView);
