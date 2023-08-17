// Query View Page

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QueryEdit } from "../pages/Query";
import { updateQueryActiveMenu, updateMainMenu } from "../actions/sidebar";
import { updateQueryObj, updateIsQuery } from "../actions/query";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, mainMenu, queryFolder },
    explore: { item, isQuery }
  } = state;

  return {
    queryActiveMenu,
    mainMenu,
    item,
    queryFolder,
    isQuery
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateMainMenu,
      updateQueryObj,
      updateIsQuery
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QueryEdit);
