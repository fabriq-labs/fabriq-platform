// Home -

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Home } from "../pages/Home";
import { updateDestinations } from "../actions/pipeline_edit";
import { updateActiveTab } from "../actions/header";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateDestinations,
      updateActiveTab
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
