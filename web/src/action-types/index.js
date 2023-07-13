// ActionTypes

import HeaderActionTypes from "./header";
import SidebarActionTypes from "./sidebar";
import HomeActionTypes from "./home";
import PipelineEdit from "./pipeline_edit";
import ExploreUpdate from "./explore";
import PipelineFilter from "./pipeline_list";

export default {
  ...HeaderActionTypes,
  ...SidebarActionTypes,
  ...HomeActionTypes,
  ...PipelineEdit,
  ...ExploreUpdate,
  ...PipelineFilter
};
