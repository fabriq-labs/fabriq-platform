import { size, filter, forEach, extend } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Collapse, Icon } from "antd";

import { Parameter, createParameter } from "../../../api/parameters";
import ParameterApplyButton from "./ParameterApplyButton";
import ParameterValueInput from "./ParameterValueInput";
import location from "../../../api/location";
import EditParameterSettingsDialog from "../editor-components/parameter_setting_dialog";

const { Panel } = Collapse;

const customPanelStyle = {
  background: "#fff",
  borderRadius: 4,
  border: 0,
  marginTop: -13,
  marginBottom: -13,
  overflow: "hidden"
};

const Block = styled.div`
  display: inline-block;
  background: white;
  padding: 0 12px 6px 0;
  vertical-align: top;
  z-index: 1;
  white-space: nowrap;

  .drag-handle {
    padding: 0 5px;
    margin-left: -5px;
    height: 36px;
  }

  .parameter-container.sortable-container & {
    margin: 4px 0 0 4px;
    padding: 3px 6px 6px;
  }

  &.parameter-dragged {
    z-index: 2;
    box-shadow: 0 4px 9px -3px rgba(102, 136, 153, 0.15);
  }
`;

const DiBlock = styled.div`
  display: inline-block !important;

  .parameter-heading {
    display: flex;
    align-items: center;
    padding-bottom: 4px;
  }

  label {
    align-self: center;
    margin-bottom: 1px;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 94%;
    white-space: nowrap;

    .parameter-block[data-editable] & {
      min-width: calc(100% - 27px); // make room for settings button
      max-width: 195px - 27px;
    }
  }
`;

function updateUrl(parameters) {
  const params = extend({}, location.search);
  parameters.forEach((param) => {
    extend(params, param.toUrlParams());
  });

  // location.setSearch(params, true);
}

function toHuman(text) {
  return text.replace(/_/g, " ").replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export default class Parameters extends React.Component {
  static propTypes = {
    parameters: PropTypes.arrayOf(PropTypes.instanceOf(Parameter)),
    editable: PropTypes.bool,
    onEdit: PropTypes.func,
    isHomeSlug: PropTypes.bool,
    disableUrlUpdate: PropTypes.bool,
    onValuesChange: PropTypes.func,
    onPendingValuesChange: PropTypes.func,
    // eslint-disable-next-line no-mixed-spaces-and-tabs
    onParametersEdit: PropTypes.func
  };

  static defaultProps = {
    parameters: [],
    editable: false,
    isHomeSlug: false,
    onEdit: () => {},
    disableUrlUpdate: false,
    onValuesChange: () => {},
    onPendingValuesChange: () => {},
    onParametersEdit: () => {}
  };

  constructor(props) {
    super(props);
    const { parameters } = props;
    this.state = { parameters };
    if (!props.disableUrlUpdate) {
      updateUrl(parameters);
    }
  }

  componentDidUpdate = (prevProps) => {
    const { parameters, disableUrlUpdate } = this.props;

    const parametersChanged = prevProps.parameters !== parameters;
    const disableUrlUpdateChanged =
      prevProps.disableUrlUpdate !== disableUrlUpdate;
    if (parametersChanged) {
      this.setState({ parameters });
    }
    if ((parametersChanged || disableUrlUpdateChanged) && !disableUrlUpdate) {
      updateUrl(parameters);
    }
  };

  handleKeyDown = (e) => {
    // Cmd/Ctrl/Alt + Enter
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey || e.altKey)) {
      e.stopPropagation();
      this.applyChanges();
    }
  };

  setPendingValue = (param, value, isDirty) => {
    const { onPendingValuesChange } = this.props;
    this.setState(({ parameters }) => {
      if (isDirty) {
        param.setPendingValue(value);
      } else {
        param.clearPendingValue();
      }
      onPendingValuesChange();
      return { parameters };
    });
  };

  moveParameter = ({ oldIndex, newIndex }) => {
    const { onParametersEdit } = this.props;
    if (oldIndex !== newIndex) {
      this.setState(({ parameters }) => {
        parameters.splice(newIndex, 0, parameters.splice(oldIndex, 1)[0]);
        onParametersEdit();
        return { parameters };
      });
    }
  };

  applyChanges = () => {
    const { onValuesChange, disableUrlUpdate } = this.props;
    this.setState(({ parameters }) => {
      const parametersWithPendingValues = parameters.filter(
        (p) => p.hasPendingValue
      );
      forEach(parameters, (p) => p.applyPendingValue());
      if (!disableUrlUpdate) {
        updateUrl(parameters);
      }
      onValuesChange(parametersWithPendingValues);
      return { parameters };
    });
  };

  showParameterSettings = (parameter, index) => {
    const { onParametersEdit } = this.props;
    EditParameterSettingsDialog.showModal({ parameter }).onClose((updated) => {
      this.setState(({ parameters }) => {
        const updatedParameter = extend(parameter, updated);
        parameters[index] = createParameter(
          updatedParameter,
          updatedParameter.parentQueryId
        );
        onParametersEdit();
        return { parameters };
      });
    });
  };

  renderParameter(param, index) {
    const { editable } = this.props;
    return (
      <DiBlock
        key={param.name}
        className="di-block"
        data-test={`ParameterName-${param.name}`}
      >
        <div className="parameter-heading">
          <label>{param.title || toHuman(param.name)}</label>
          {editable && (
            <button
              className="btn btn-default btn-xs m-l-5"
              onClick={() => this.showParameterSettings(param, index)}
              data-test={`ParameterSettings-${param.name}`}
              type="button"
            >
              <i className="fa fa-cog" />
            </button>
          )}
        </div>
        <ParameterValueInput
          type={param.type}
          value={param.normalizedValue}
          parameter={param}
          enumOptions={param.enumOptions}
          queryId={param.queryId}
          onSelect={(value, isDirty) =>
            this.setPendingValue(param, value, isDirty)
          }
        />
      </DiBlock>
    );
  }

  onEdit() {
    return (
      <Icon
        type="edit"
        onClick={() => {
          if (this.props.onEdit) {
            this.props.onEdit();
          }
        }}
      />
    );
  }

  render() {
    const { parameters } = this.state;
    const { editable, isHomeSlug } = this.props;
    const dirtyParamCount = size(filter(parameters, "hasPendingValue"));
    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header="Filters"
          key="1"
          style={customPanelStyle}
          extra={isHomeSlug ? this.onEdit() : ""}
        >
          {parameters.map((param, index) => (
            <Block data-editable={editable || null}>
              {this.renderParameter(param, index)}
            </Block>
          ))}
          <ParameterApplyButton
            onClick={this.applyChanges}
            paramCount={dirtyParamCount}
          />
        </Panel>
      </Collapse>
    );
  }
}
