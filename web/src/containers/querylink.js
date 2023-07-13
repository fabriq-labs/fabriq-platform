// My Query

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import QueryLink from "../components/Redash/QueryLink";
import { updateQueryActiveMenu } from "../actions/sidebar";
import { updateQuery, updateQueryObj } from "../actions/query";
import { updateActiveTab } from "../actions/header";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateQueryActiveMenu,
      updateQuery,
      updateQueryObj,
      updateActiveTab
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(QueryLink);
