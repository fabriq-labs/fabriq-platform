// Pipeline List

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SelectRightView from "../pages/Pipelines/Creator/select_right_view";

import {
  updateConnections
} from "../actions/pipeline_list";

const mapStateToProps = (state) => {
  const {
    pipeline_list: { connections }
  } = state;

  return {
    connections,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateConnections,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SelectRightView);
