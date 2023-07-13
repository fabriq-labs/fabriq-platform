// Explore

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Explore } from "../pages/Explore";
import { refreshActiveMenu } from "../actions/sidebar";

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
      refreshActiveMenu
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
