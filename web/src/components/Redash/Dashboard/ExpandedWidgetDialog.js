/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "antd";
import VisualizationRenderer from "../../../pages/Query/editor-components/vizualization_renderer";
import VisualizationName from "../VisualizationName";
import { wrap as wrapDialog, DialogPropType } from "../DialogWrapper";

function ExpandedWidgetDialog({ dialog, widget }) {
  return (
    <Modal
      {...dialog.props}
      title={
        <>
          <VisualizationName visualization={widget.visualization} />{" "}
          <span>{widget.getQuery().name}</span>
        </>
      }
      width="95%"
      footer={<Button onClick={dialog.dismiss}>Close</Button>}
    >
      <VisualizationRenderer
        visualization={widget.visualization}
        queryResult={widget.getQueryResult()}
        context="widget"
      />
    </Modal>
  );
}

ExpandedWidgetDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  widget: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default wrapDialog(ExpandedWidgetDialog);
