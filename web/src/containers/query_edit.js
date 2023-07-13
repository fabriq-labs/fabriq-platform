// Query View Page

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QueryEdit } from "../pages/Query";
import { updateQueryActiveMenu, updateMainMenu } from "../actions/sidebar";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, mainMenu, queryFolder },
    explore: { item }
  } = state;

  return {
    queryActiveMenu,
    mainMenu,
    item,
    queryFolder
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

export default connect(mapStateToProps, mapDispatchToProps)(QueryEdit);
