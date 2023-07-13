// Pipeline - Creator view

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { CreaterView } from "../pages/Pipelines/Creator";
import {
  updatePipelineMenu,
  updateDestinations,
  updatePipelineId,
  updateRedirectUrl
} from "../actions/pipeline_edit";

const mapStateToProps = (state) => {
  const {
    pipeline_edit: { destinations }
  } = state;

  return {
    destinations
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updatePipelineMenu,
      updateDestinations,
      updateRedirectUrl,
      updatePipelineId
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CreaterView);
