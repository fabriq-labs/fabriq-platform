// Onboard

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { OnBoarding } from "../pages/OnBoarding";
import { updateDestinations } from "../actions/pipeline_edit";

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
      updateDestinations
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
