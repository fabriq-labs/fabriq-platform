/* eslint-disable react/static-property-placement */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-mixed-spaces-and-tabs */
import { isMatch, map, find, sortBy } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import {
  MappingType,
  ParameterMappingListInput,
  parameterMappingsToEditableMappings,
  editableMappingsToParameterMappings,
  synchronizeWidgetTitles
} from "../../../pages/Query/parameter_component/ParameterMappingInput";
import { withTranslation } from "react-i18next";
import { wrap as wrapDialog, DialogPropType } from "../DialogWrapper";
import notification from "../../../api/notification";

export function getParamValuesSnapshot(mappings, dashboardParameters) {
  return map(
    sortBy(mappings, (m) => m.name),
    (m) => {
      let param;
      switch (m.type) {
        case MappingType.StaticValue:
          return [m.name, m.value];
        case MappingType.WidgetLevel:
          return [m.name, m.param.value];
        case MappingType.DashboardAddNew:
        case MappingType.DashboardMapToExisting:
          param = find(dashboardParameters, (p) => p.name === m.mapTo);
          return [m.name, param ? param.value : null];
        // no default
      }
    }
  );
}

class EditParameterMappingsDialog extends React.Component {
  static propTypes = {
    dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dialog: DialogPropType.isRequired
  };

  originalParamValuesSnapshot = null;

  constructor(props) {
    super(props);

    const parameterMappings = parameterMappingsToEditableMappings(
      props.widget.options.parameterMappings,
      props.widget.query.getParametersDefs(),
      map(this.props.dashboard.getParametersDefs(), (p) => p.name)
    );

    this.originalParamValuesSnapshot = getParamValuesSnapshot(
      parameterMappings,
      this.props.dashboard.getParametersDefs()
    );

    this.state = {
      saveInProgress: false,
      parameterMappings
    };
  }

  saveWidget() {
    const { widget, t } = this.props;

    this.setState({ saveInProgress: true });

    const newMappings = editableMappingsToParameterMappings(
      this.state.parameterMappings
    );
    widget.options.parameterMappings = newMappings;

    const valuesChanged = !isMatch(
      this.originalParamValuesSnapshot,
      getParamValuesSnapshot(
        this.state.parameterMappings,
        this.props.dashboard.getParametersDefs()
      )
    );

    const widgetsToSave = [
      widget,
      ...synchronizeWidgetTitles(
        widget.options.parameterMappings,
        this.props.dashboard.widgets
      )
    ];

    Promise.all(map(widgetsToSave, (w) => w.save()))
      .then(() => {
        this.props.dialog.close(valuesChanged);
      })
      .catch(() => {
        notification.error(t("redash:editparametermappingdailog.widget_error"));
      })
      .finally(() => {
        this.setState({ saveInProgress: false });
      });
  }

  updateParamMappings(parameterMappings) {
    this.setState({ parameterMappings });
  }

  render() {
    const { dialog } = this.props;
    return (
      <Modal
        {...dialog.props}
        title="Parameters"
        onOk={() => this.saveWidget()}
        okButtonProps={{ loading: this.state.saveInProgress }}
        width={700}
      >
        {this.state.parameterMappings.length > 0 && (
          <ParameterMappingListInput
            mappings={this.state.parameterMappings}
            existingParams={this.props.dashboard.getParametersDefs()}
            onChange={(mappings) => this.updateParamMappings(mappings)}
          />
        )}
      </Modal>
    );
  }
}

export default wrapDialog(EditParameterMappingsDialog);
