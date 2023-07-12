// Pipeline - Edit view

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { EditorView } from "../pages/Pipelines/Creator";
import { updatePipelineId, updateRedirectUrl } from "../actions/pipeline_edit";

const mapStateToProps = (state) => {
  const {
    pipeline_edit: { pipelineMenu, destinations, connections }
  } = state;

  return {
    pipelineMenu,
    destinations,
    connections
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateRedirectUrl,
      updatePipelineId
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
