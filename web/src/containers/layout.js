// Layout

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout } from "../components/Layout";
import { updateActiveTab } from "../actions/header";
import { refreshActiveMenu } from "../actions/sidebar";

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
      updateActiveTab,
      refreshActiveMenu
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
