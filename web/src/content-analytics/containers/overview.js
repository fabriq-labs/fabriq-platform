// Overview

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Overview } from "../../content-analytics/pages/Overview";
import { updateActiveTab } from "../../actions/header";

const mapStateToProps = (state) => {
  const {
    header: { activeTab }
  } = state;

  return {
    activeTab
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateActiveTab
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
