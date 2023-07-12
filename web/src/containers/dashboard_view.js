// Dashboard View Page

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Dashboard } from "../pages/Dashboard";
import { updateQueryActiveMenu, updateMainMenu } from "../actions/sidebar";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, mainMenu }
  } = state;

  return {
    queryActiveMenu,
    mainMenu
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateMainMenu
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
