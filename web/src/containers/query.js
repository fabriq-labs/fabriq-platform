// Query Page

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { QueryPage } from "../pages/Query";
import { updateQueryObj, updateIsQuery } from "../actions/query";

const mapStateToProps = (state) => {
  const {
    explore: { item, isQuery }
  } = state;

  return {
    item,
    isQuery
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryObj,
      updateIsQuery
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QueryPage);
