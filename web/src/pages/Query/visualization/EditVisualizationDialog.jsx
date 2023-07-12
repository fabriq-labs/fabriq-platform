/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import {
  isEqual,
  extend,
  map,
  sortBy,
  findIndex,
  filter,
  pick,
  omit,
  find
} from "lodash";
import React, { useState, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal, Select, Input, Button } from "antd";
import getOptions from "./getOptions";
import { getDefaultFormatOptions } from "./helper";

import {
  registeredVisualizations,
  getDefaultVisualization,
  newVisualization,
  VisualizationType
} from "@redash/viz/lib";
import {
  wrap as wrapDialog,
  DialogPropType
} from "../tags-control/dialog_wrapper";
import Filters, { filterData } from "../editor-components/filters";
import useQueryResultData from "../lib/useQueryResultData";
import { Renderer, Editor } from "../editor-components/visualization_component";
import { Icon } from "../../../components/Icon";
import { Checkbox } from "antd";
import notification from "../../../api/notification";
import Visualization from "../../../api/visualization";
import recordEvent from "../../../api/record_event";

const ModalWrapper = styled(Modal)`
  position: absolute;
  left: 15px;
  top: 15px;
  right: 15px;
  bottom: 15px;
  width: auto !important;
  height: auto !important;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;

  .modebar-group {
    display: flex !important;
  }

  .modebar {
    display: none;
  }

  .visualization-settings {
    padding-right: 12px;
    width: 40%;
    overflow: auto;
  }

  .visualization-preview {
    padding-left: 12px;
    width: 60%;
    overflow: auto;

    .counter-visualization-container {
      &.trend-positive .counter-visualization-value {
        color: #5cb85c;
      }

      &.trend-negative .counter-visualization-value {
        color: #d9534f;
      }
      .counter-visualization-content {
        margin: 0;
        padding: 0;
        font-size: 50px;
        line-height: normal;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .counter-visualization-value,
        .counter-visualization-target {
          font-size: 1em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .counter-visualization-label {
          font-size: 0.5em;
          display: block;
        }

        .counter-visualization-target {
          color: #ccc;
        }

        .counter-visualization-label {
          font-size: 0.5em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .m-b-15,
  .visualization-editor-control-label {
    margin-bottom: 15px !important;
    display: flex;
    flex-direction: column;
  }

  .ant-tabs-tab {
    margin-right: 28px !important;
  }

  .column-div {
    background-color: #fafafa;
    border: 0;
    margin-top: 6px;
    padding: 10px;
  }

  .flex {
    display: flex;
    width: 100%;

    .flex-start {
      flex-grow: 1;
    }

    .icon-div {
      cursor: pointer;
      margin-top: 5px;
    }
  }

  .input-row {
    margin-top: 10px;
  }

  .ant-collapse-extra {
    display: flex;
    margin-top: 4px;
  }

  .ant-table-column-title {
    display: flex !important;
  }

  .ant-table-column-sorter {
    margin-top: 3px;
    align-items: center;
  }
`;

function updateQueryVisualizations(query, visualization) {
  const index = findIndex(
    query.visualizations,
    (v) => v.id === visualization.id
  );
  if (index > -1) {
    query.visualizations[index] = visualization;
  } else {
    // new visualization
    query.visualizations.push(visualization);
  }
  query.visualizations = [...query.visualizations]; // clone array
}

function saveVisualization(visualization) {
  if (visualization.id) {
    recordEvent("update", "visualization", visualization.id, {
      type: visualization.type
    });
  } else {
    recordEvent("create", "visualization", null, { type: visualization.type });
  }
  return Visualization.save(visualization)
    .then((result) => {
      const { data } = result;
      notification.success("Visualization saved");
      return data;
    })
    .catch((error) => {
      notification.error("Visualization could not be saved");
      return Promise.reject(error);
    });
}

function confirmDialogClose(isDirty) {
  return new Promise((resolve, reject) => {
    if (isDirty) {
      Modal.confirm({
        title: "Visualization Editor",
        content: "Are you sure you want to close the editor without saving?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => resolve(),
        onCancel: () => reject()
      });
    } else {
      resolve();
    }
  });
}
function EditVisualizationDialog({
  dialog,
  visualization,
  query,
  queryResult
}) {
  const errorHandlerRef = useRef();

  const isNew = !visualization;

  const data = useQueryResultData(queryResult);
  const [filters, setFilters] = useState(data.filters);

  const filteredData = useMemo(
    () => ({
      columns: data.columns,
      rows: filterData(data.rows, filters)
    }),
    [data, filters]
  );

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  const defaultState = useMemo(() => {
    const config = visualization
      ? registeredVisualizations[visualization.type]
      : getDefaultVisualization();
    const options = config.getOptions(isNew ? {} : visualization.options, data);
    if (options && !options.columns) {
      const columns = filteredData.columns;
      options.columns = columns.map((col, idx) =>
        getDefaultFormatOptions(col, idx)
      );
    }

    return {
      type: config.type,
      name: isNew ? config.name : visualization.name,
      options,
      originalOptions: options
    };
  }, [data, isNew, visualization]);

  const [type, setType] = useState(defaultState.type);
  const [name, setName] = useState(defaultState.name);
  const [nameChanged, setNameChanged] = useState(false);
  const [customTooltip, setCustomToolTip] = useState(
    defaultState && defaultState.options
      ? defaultState.options.customTooltip
      : false
  );
  const [options, setOptions] = useState(defaultState.options);
  let xAxisValue = "";
  let item = null;
  if (visualization && visualization.type === "CHART") {
    xAxisValue = getKeyByValue(options.columnMapping, "x");
    if (options && options.columns && options.columns.length > 0) {
      item = find(options.columns, (f) => f.name === xAxisValue);
    }
  }
  const [content, setContent] = useState({
    title: xAxisValue,
    isOpen: false,
    linkUrlTemplate: "{{ @ }}",
    ...item
  });

  const [saveInProgress, setSaveInProgress] = useState(false);

  useEffect(() => {
    if (errorHandlerRef.current) {
      errorHandlerRef.current.reset();
    }
  }, [data, options]);

  const onClickCreate = (isOpen) => {
    setContent((prevState) => ({
      ...prevState,
      isOpen: isOpen
    }));
  };

  function onTypeChanged(newType) {
    setType(newType);

    const config = registeredVisualizations[newType];
    if (!nameChanged) {
      setName(config.name);
    }

    setOptions(config.getOptions(isNew ? {} : visualization.options, data));
  }

  function onNameChanged(newName) {
    setName(newName);
    setNameChanged(newName !== name);
  }

  function onLinkChanged(value) {
    setContent((prevState) => ({
      ...prevState,
      linkUrlTemplate: value
    }));
  }

  function onClickSave() {
    const config = registeredVisualizations[type];
    const list =
      visualization.options && visualization.options.columns
        ? visualization.options
        : options;
    const newOptions = getOptions(list, filteredData, content);
    setContent((prevState) => ({
      ...prevState,
      isOpen: false
    }));
    setOptions(config.getOptions(newOptions, data));
  }

  function onOptionsChanged(newOptions) {
    const config = registeredVisualizations[type];
    setOptions(config.getOptions(newOptions, data));
  }

  function handleCustomTooltip(e) {
    const config = registeredVisualizations[type];
    const newOptions = options;
    setCustomToolTip(e.target.checked);
    newOptions.customTooltip = e.target.checked;
    setOptions(config.getOptions(newOptions, data));
  }

  function save() {
    setSaveInProgress(true);
    let visualizationOptions = options;
    if (type === "TABLE") {
      visualizationOptions = omit(visualizationOptions, ["paginationSize"]);
    }

    const visualizationData = extend(newVisualization(type), visualization, {
      name,
      options: visualizationOptions,
      query_id: query.id
    });
    saveVisualization(visualizationData).then((savedVisualization) => {
      updateQueryVisualizations(query, savedVisualization);
      dialog.close(savedVisualization);
    });
  }

  function dismiss() {
    const optionsChanged = !isEqual(options, defaultState.originalOptions);
    confirmDialogClose(nameChanged || optionsChanged).then(dialog.dismiss);
  }

  // When editing existing visualization chart type selector is disabled, so add only existing visualization's
  // descriptor there (to properly render the component). For new visualizations show all types except of deprecated
  const availableVisualizations = isNew
    ? filter(
        sortBy(registeredVisualizations, ["name"]),
        (vis) => !vis.isDeprecated
      )
    : pick(registeredVisualizations, [type]);

  return (
    <ModalWrapper
      {...dialog.props}
      wrapClassName="ant-modal-fullscreen"
      title="Visualization Editor"
      okText="Save"
      okButtonProps={{
        loading: saveInProgress,
        disabled: saveInProgress
      }}
      onOk={save}
      onCancel={dismiss}
      wrapProps={{ "data-test": "EditVisualizationDialog" }}
    >
      <Wrapper>
        <div className="visualization-settings">
          <div className="m-b-15">
            <label htmlFor="visualization-type">Visualization Type</label>
            <Select
              data-test="VisualizationType"
              id="visualization-type"
              className="w-100"
              disabled={!isNew}
              value={type}
              onChange={onTypeChanged}
            >
              {map(availableVisualizations, (vis) => (
                <Select.Option
                  key={vis.type}
                  data-test={`VisualizationType.${vis.type}`}
                >
                  {vis.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="m-b-15">
            <label htmlFor="visualization-name">Visualization Name</label>
            <Input
              data-test="VisualizationName"
              id="visualization-name"
              className="w-100"
              value={name}
              onChange={(event) => onNameChanged(event.target.value)}
            />
          </div>
          {type === "CHART" && content.title && (
            <div className="m-b-15">
              <label htmlFor="Columns">Add Url template</label>
              <div className="column-div">
                <div className="flex">
                  <div className="flex-start">{content.title}</div>
                  <div className="flex-end">
                    <div
                      className="icon-div"
                      onClick={() => onClickCreate(!content.isOpen)}
                    >
                      <Icon
                        name={content.isOpen ? "arrowUp" : "arrowDown"}
                        fill="#000"
                        width={12}
                        height={12}
                      />
                    </div>
                  </div>
                </div>
                {content && content.isOpen && (
                  <div>
                    <div className="input-row">
                      <label htmlFor="column-name">Column Name</label>
                      <Input className="w-100" value={content.title} disabled />
                    </div>
                    <div className="input-row">
                      <label htmlFor="url-template">URL template</label>
                      <Input
                        className="w-100"
                        value={content.linkUrlTemplate}
                        onChange={(event) => onLinkChanged(event.target.value)}
                      />
                    </div>
                    <div className="input-row">
                      <Button type="primary" onClick={onClickSave}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div data-test="VisualizationEditor">
            <Editor
              type={type}
              data={data}
              options={options}
              visualizationName={name}
              onOptionsChange={onOptionsChanged}
            />
          </div>
          <Checkbox checked={customTooltip} onChange={handleCustomTooltip}>
            Custom Tooltip
          </Checkbox>
        </div>
        <div className="visualization-preview">
          <label
            htmlFor="visualization-preview"
            className="invisible hidden-xs"
          >
            Preview
          </label>
          <Filters filters={filters} onChange={setFilters} />
          <div className="scrollbox" data-test="VisualizationPreview">
            <Renderer
              type={type}
              data={filteredData}
              options={options}
              visualizationName={name}
              onOptionsChange={onOptionsChanged}
            />
          </div>
        </div>
      </Wrapper>
    </ModalWrapper>
  );
}

EditVisualizationDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  visualization: VisualizationType,
  queryResult: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

EditVisualizationDialog.defaultProps = {
  visualization: null
};

export default wrapDialog(EditVisualizationDialog);
