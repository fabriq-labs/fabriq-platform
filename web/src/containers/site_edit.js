// User Edit

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SiteProfile from "../pages/Setup/site_edit";
import { updateActiveMenu } from "../actions/sidebar";

const mapStateToProps = (state) => {
  const {
    sidebar: { activeMenu }
  } = state;

  return {
    activeMenu
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateActiveMenu
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SiteProfile);
