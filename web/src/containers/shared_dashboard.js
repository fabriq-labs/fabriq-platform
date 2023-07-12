// My Dashboard

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SharedDashboard } from "../pages/Dashboard";
import { updateQueryActiveMenu } from "../actions/sidebar";
import { updateDashboardShare } from "../actions/dashboard";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, queryFolder }
  } = state;

  return {
    queryActiveMenu,
    queryFolder
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateDashboardShare
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SharedDashboard);
