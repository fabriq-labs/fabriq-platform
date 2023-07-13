// Query View Page

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QueryViewPage } from "../pages/Query";
import { updateQueryActiveMenu, updateMainMenu } from "../actions/sidebar";
import { updateQueryObj } from "../actions/query";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, mainMenu, queryFolder },
    explore: { query_isShared, item }
  } = state;

  return {
    queryActiveMenu,
    mainMenu,
    query_isShared,
    item,
    queryFolder
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateMainMenu,
      updateQueryObj
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QueryViewPage);
