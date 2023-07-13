import React from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

export default function EditVisualizationButton(props) {
  return (
    <Button
      data-test="EditVisualization"
      className="edit-visualization"
      onClick={() => props.openVisualizationEditor(props.selectedTab)}
    >
      <i class="fa fa-edit" />
      <span className="hidden-xs hidden-s hidden-m edit-ttl">
        Edit Visualization
      </span>
    </Button>
  );
}

EditVisualizationButton.propTypes = {
  openVisualizationEditor: PropTypes.func.isRequired,
  selectedTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

EditVisualizationButton.defaultProps = {
  selectedTab: ""
};
