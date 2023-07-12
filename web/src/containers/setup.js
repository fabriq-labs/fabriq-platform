// Setup

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Setup } from "../pages/Setup";
import { updateActiveMenu } from "../actions/sidebar";
import { updateHomeDashboard } from "../actions/home";
import { updateDestinations } from "../actions/pipeline_edit";

const mapStateToProps = (state) => {
  const {
    sidebar: { activeMenu },
    home: { homeDashboard }
  } = state;

  return {
    activeMenu,
    homeDashboard
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateActiveMenu,
      updateHomeDashboard,
      updateDestinations
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
