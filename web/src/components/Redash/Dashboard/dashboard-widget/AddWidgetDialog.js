/* eslint-disable max-len */
/* eslint-disable no-shadow */
import { map, includes, groupBy, first, find } from "lodash";
import styled from "styled-components";
import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import {
  MappingType,
  ParameterMappingListInput
} from "../../../../pages/Query/parameter_component/ParameterMappingInput";
import QuerySelector from "../../../../pages/Query/editor-components/query_selector";
import { wrap as wrapDialog, DialogPropType } from "../../DialogWrapper";
import notification from "../../../../api/notification";
import { Query } from "../../../../api/queries";

const SelectItem = styled.div`
  .form-group {
    flex-direction: column;
    display: flex;
  }
`;

function VisualizationSelect({ query, visualization, onChange }) {
  const visualizationGroups = useMemo(
    () => (query ? groupBy(query.visualizations, "type") : {}),
    [query]
  );

  const handleChange = useCallback(
    (visualizationId) => {
      const selectedVisualization = query
        ? find(query.visualizations, { id: visualizationId })
        : null;
      onChange(selectedVisualization || null);
    },
    [query, onChange]
  );

  if (!query) {
    return null;
  }

  return (
    <SelectItem>
      <div className="form-group">
        <label htmlFor="choose-visualization">Choose Visualization</label>
        <Select
          id="choose-visualization"
          className="w-100"
          value={visualization ? visualization.id : undefined}
          onChange={handleChange}
        >
          {map(visualizationGroups, (visualizations, groupKey) => (
            <Select.OptGroup key={groupKey} label={groupKey}>
              {map(visualizations, (visualization) => (
                <Select.Option
                  key={`${visualization.id}`}
                  value={visualization.id}
                >
                  {visualization.name}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </div>
    </SelectItem>
  );
}

VisualizationSelect.propTypes = {
  query: PropTypes.object,
  visualization: PropTypes.object,
  onChange: PropTypes.func
};

VisualizationSelect.defaultProps = {
  query: null,
  visualization: null,
  onChange: () => {}
};

function AddWidgetDialog({ dialog, dashboard }) {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedVisualization, setSelectedVisualization] = useState(null);
  const [parameterMappings, setParameterMappings] = useState([]);
  const { t } = useTranslation();

  const selectQuery = useCallback(
    (queryId) => {
      // Clear previously selected query (if any)
      setSelectedQuery(null);
      setSelectedVisualization(null);
      setParameterMappings([]);

      if (queryId) {
        Query.get({ id: queryId }).then((query) => {
          const { data } = query;
          const newQuery = new Query(data);
          if (newQuery) {
            const existingParamNames = map(
              dashboard.getParametersDefs(),
              (param) => param.name
            );
            setSelectedQuery(newQuery);
            setParameterMappings(
              map(newQuery.getParametersDefs(), (param) => ({
                name: param.name,
                type: includes(existingParamNames, param.name)
                  ? MappingType.DashboardMapToExisting
                  : MappingType.DashboardAddNew,
                mapTo: param.name,
                value: param.normalizedValue,
                title: "",
                param
              }))
            );
            if (newQuery.visualizations.length > 0) {
              setSelectedVisualization(first(newQuery.visualizations));
            }
          }
        });
      }
    },
    [dashboard]
  );

  const saveWidget = useCallback(() => {
    dialog
      .close({ visualization: selectedVisualization, parameterMappings })
      .catch(() => {
        notification.error(t("redash:addwidgetdialog.widgetAdded_error"));
      });
  }, [dialog, selectedVisualization, parameterMappings]);

  const existingParams = dashboard.getParametersDefs();

  return (
    <Modal
      {...dialog.props}
      title="Add Widget"
      onOk={saveWidget}
      okButtonProps={{
        ...dialog.props.okButtonProps,
        disabled: !selectedQuery || dialog.props.okButtonProps.disabled
      }}
      okText="Add to Dashboard"
      width={700}
    >
      <div data-test="AddWidgetDialog">
        <QuerySelector
          onChange={(query) => selectQuery(query ? query.id : null)}
        />
        {selectedQuery && (
          <VisualizationSelect
            query={selectedQuery}
            visualization={selectedVisualization}
            onChange={setSelectedVisualization}
          />
        )}
        {parameterMappings.length > 0 && [
          <label key="parameters-title" htmlFor="parameter-mappings">
            Parameters
          </label>,
          <ParameterMappingListInput
            key="parameters-list"
            id="parameter-mappings"
            mappings={parameterMappings}
            existingParams={existingParams}
            onChange={setParameterMappings}
          />
        ]}
      </div>
    </Modal>
  );
}

AddWidgetDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  dashboard: PropTypes.object.isRequired
};

export default wrapDialog(AddWidgetDialog);
