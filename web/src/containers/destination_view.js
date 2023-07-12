// Destination Edit

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Destination } from "../pages/Destination";
import { updateDestinations } from "../actions/pipeline_edit";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateDestinations
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Destination);
