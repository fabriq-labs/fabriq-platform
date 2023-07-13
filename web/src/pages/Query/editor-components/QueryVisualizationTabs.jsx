/* eslint-disable max-len */
import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { find, orderBy } from "lodash";
import styled from "styled-components";
import useMedia from "use-media";
import { Tabs, Button, Modal } from "antd";
import VisualizationRenderer from "./vizualization_renderer";

const Wrapper = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: unset !important;
  }

  .modebar {
    display: none;
  }

  .modebar-group {
    display: flex !important;
  }

  .svg-container {
    height: 250px !important;
  }

  .js-plotly-plot .plotly .modebar--hover > :not(.watermark) {
    opacity: 0;
    transition: opacity 0.3s ease 0s;
  }

  .query-results-empty-state {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 15px;

    .empty-state-content {
      max-width: 280px;
      text-align: center;
    }

    img {
      max-width: 100%;
    }
  }

  .ant-tabs-bar {
    display: flex;

    .ant-tabs-extra-content {
      order: 2;
    }
  }

  .ant-tabs-tab {
    background: #f6f8f9 !important;
    border-color: #d9d9d9 !important;
    border-bottom: 0px !important;
    border-radius: 0 !important;
    // border-width animation makes it flicker on Firefox
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), border-width 0s !important;

    &:first-child {
      border-radius: 2px 0 0 0 !important;
    }

    &:last-child {
      border-radius: 0 2px 0 0 !important;
    }

    &:not(:first-child) {
      margin-left: -1px !important;
    }

    &.ant-tabs-tab-active {
      background: white !important;
      z-index: 1;
      font-weight: normal;
      border-top: 2px solid #2196f3 !important;
    }
  }

  .ant-tabs-content {
    margin-top: -18px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    border-radius: 0px 4px 0px 0px;

    .ant-tabs-tabpane {
      padding: 16px;
      background: white;
    }
  }

  .add-visualization-button {
    span {
      color: #767676;
      margin-left: 5px;
    }
  }

  .delete-visualization-button {
    margin-left: 5px;
    cursor: pointer;
    color: #a09797;
    font-size: 11px;
    padding: 0 4px 1px;
    &:hover {
      color: white;
      background-color: #ff8080;
      border-radius: 50%;
    }
  }

  .query-fixed-layout .query-visualization-tabs .visualization-renderer {
    padding: 15px;
  }

  .visualization-renderer {
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 15px;
    left: 0;
    top: 54px;
    right: 0;
    bottom: 0;

    > .visualization-renderer-wrapper {
      flex-grow: 1;
      position: relative;

      .ant-table-content {
        overflow-y: auto;
        height: 300px;
      }
    }
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

  .chart-visualization-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    overflow: hidden;
  }

  .ant-tabs-tabpane {
    height: 390px;
  }

  .ant-table-column-has-actions,
  .display-as-number {
    width: 10%;
  }

  .ant-table-column-title {
    display: flex;
  }

  .ant-table-column-sorter {
    align-self: center;
  }
`;

const { TabPane } = Tabs;

function EmptyState({ title, message, refreshButton }) {
  return (
    <div className="query-results-empty-state">
      <div className="empty-state-content">
        <div>
          <img
            src="/static/images/illustrations/no-query-results.svg"
            alt="No Query Results Illustration"
          />
        </div>
        <h3>{title}</h3>
        <div className="m-b-20">{message}</div>
        {refreshButton}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  refreshButton: PropTypes.node
};

EmptyState.defaultProps = {
  refreshButton: null
};

function TabWithDeleteButton({
  visualizationName,
  canDelete,
  onDelete,
  ...props
}) {
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      Modal.confirm({
        title: "Delete Visualization",
        content: "Are you sure you want to delete this visualization?",
        okText: "Delete",
        okType: "danger",
        onOk: onDelete,
        maskClosable: true,
        autoFocusButton: null
      });
    },
    [onDelete]
  );

  return (
    <span {...props}>
      {visualizationName}
      {canDelete && (
        <a className="delete-visualization-button" onClick={handleDelete}>
          <i class="fa fa-close" />
        </a>
      )}
    </span>
  );
}

TabWithDeleteButton.propTypes = {
  visualizationName: PropTypes.string.isRequired,
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func
};
TabWithDeleteButton.defaultProps = { canDelete: false, onDelete: () => {} };

const defaultVisualizations = [
  {
    type: "TABLE",
    name: "Table",
    id: null,
    options: {}
  }
];

export default function QueryVisualizationTabs({
  queryResult,
  selectedTab,
  showNewVisualizationButton,
  canDeleteVisualizations,
  onChangeTab,
  onAddVisualization,
  onDeleteVisualization,
  refreshButton,
  ...props
}) {
  const visualizations = useMemo(
    () =>
      props.visualizations.length > 0
        ? props.visualizations
        : defaultVisualizations,
    [props.visualizations]
  );

  const tabsProps = {};
  if (find(visualizations, { id: selectedTab })) {
    tabsProps.activeKey = `${selectedTab}`;
  }

  if (showNewVisualizationButton) {
    tabsProps.tabBarExtraContent = (
      <Button
        className="add-visualization-button"
        data-test="NewVisualization"
        type="link"
        onClick={() => onAddVisualization()}
      >
        <i className="fa fa-plus" />
        <span className="m-l-5 hidden-xs">Add Visualization</span>
      </Button>
    );
  }

  const orderedVisualizations = useMemo(
    () => orderBy(visualizations, ["id"]),
    [visualizations]
  );
  const isFirstVisualization = useCallback(
    (visId) => visId === orderedVisualizations[0].id,
    [orderedVisualizations]
  );
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <Wrapper
      {...tabsProps}
      type="card"
      className="query-visualization-tabs"
      data-test="QueryPageVisualizationTabs"
      animated={false}
      tabBarGutter={0}
      onChange={(activeKey) => onChangeTab(+activeKey)}
      destroyInactiveTabPane
    >
      {orderedVisualizations.map((visualization) => (
        <TabPane
          key={`${visualization.id}`}
          data-test={`QueryPageVisualization${selectedTab}`}
          tab={
            <TabWithDeleteButton
              data-test={`QueryPageVisualizationTab${visualization.id}`}
              canDelete={
                !isMobile &&
                canDeleteVisualizations &&
                !isFirstVisualization(visualization.id)
              }
              visualizationName={visualization.name}
              onDelete={() => onDeleteVisualization(visualization.id)}
            />
          }
        >
          {queryResult ? (
            <VisualizationRenderer
              visualization={visualization}
              queryResult={queryResult}
              context="query"
            />
          ) : (
            <EmptyState
              title="Query Has no Result"
              message="Execute/Refresh the query to show results."
              refreshButton={refreshButton}
            />
          )}
        </TabPane>
      ))}
    </Wrapper>
  );
}

QueryVisualizationTabs.propTypes = {
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  visualizations: PropTypes.arrayOf(PropTypes.object),
  selectedTab: PropTypes.number,
  showNewVisualizationButton: PropTypes.bool,
  canDeleteVisualizations: PropTypes.bool,
  onChangeTab: PropTypes.func,
  onAddVisualization: PropTypes.func,
  onDeleteVisualization: PropTypes.func,
  refreshButton: PropTypes.node
};

QueryVisualizationTabs.defaultProps = {
  queryResult: null,
  visualizations: [],
  selectedTab: null,
  showNewVisualizationButton: false,
  canDeleteVisualizations: false,
  onChangeTab: () => {},
  onAddVisualization: () => {},
  onDeleteVisualization: () => {},
  refreshButton: null
};
