// Redux - Index
import { combineReducers } from "redux";

import header from "./header";
import sidebar from "./sidebar";
import home from "./home";
import pipeline_edit from "./pipeline_edit";
import explore from "./explore";
import pipeline_list from "./pipeline_list";

export default combineReducers({
  header,
  sidebar,
  home,
  pipeline_edit,
  explore,
  pipeline_list
});
