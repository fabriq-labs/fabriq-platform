// My Query

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QueryListPage } from "../pages/Query";
import { updateQueryActiveMenu, updateQueryFolder } from "../actions/sidebar";
import { updateQuery, updateQueryObj } from "../actions/query";

const mapStateToProps = (state) => {
  const {
    sidebar: { queryActiveMenu, queryFolder }
  } = state;

  return {
    queryActiveMenu,
    queryFolder,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateQuery,
      updateQueryObj,
      updateQueryFolder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QueryListPage);
