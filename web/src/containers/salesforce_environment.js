// Pipeline

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SalesforceEnvironment } from "../pages/Pipelines/Creator";

const mapStateToProps = (state) => {
  const {
    pipeline_edit: { pipelineId, redirect_url }
  } = state;

  return {
    pipelineId,
    redirect_url
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesforceEnvironment);
