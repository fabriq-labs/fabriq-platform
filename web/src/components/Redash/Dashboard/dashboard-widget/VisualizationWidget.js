/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { compact, isEmpty, invoke } from "lodash";
import { markdown } from "markdown";
import { Menu, Icon, Spin } from "antd";
import HtmlContent from "@redash/viz/lib/components/HtmlContent";

import ExpandedWidgetDialog from "../ExpandedWidgetDialog";
import EditParameterMappingsDialog from "../EditParameterMappingsDialog";
import QueryLink from "../../../../containers/querylink";
import { FiltersType } from "../../../../pages/Query/editor-components/filters";
import VisualizationRenderer from "../../../../pages/Query/editor-components/vizualization_renderer";
import TimeAgo from "../../../../pages/Query/editor-components/timeago";
import { Moment } from "../../../../pages/Query/editor-components/proptypes";
import Parameters from "../../../../pages/Query/parameter_component/parameters";
import { formatDateTime } from "../../../../pages/Query/lib/utils";
import recordEvent from "../../../../api/record_event";
import Widget from "./Widget";

function visualizationWidgetMenuOptions({
  widget,
  canEditDashboard,
  onParametersEdit
}) {
  const canViewQuery = true;
  const canEditParameters =
    canEditDashboard && !isEmpty(invoke(widget, "query.getParametersDefs"));
  const widgetQueryResult = widget.getQueryResult();
  const isQueryResultEmpty =
    !widgetQueryResult ||
    !widgetQueryResult.isEmpty ||
    widgetQueryResult.isEmpty();

  const downloadLink = (fileType) =>
    widgetQueryResult.getLink(widget.getQuery().id, fileType);
  const downloadName = (fileType) =>
    widgetQueryResult.getName(widget.getQuery().name, fileType);
  return compact([
    <Menu.Item key="download_csv" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a
          href={downloadLink("csv")}
          download={downloadName("csv")}
          target="_self"
        >
          Download as CSV File
        </a>
      ) : (
        "Download as CSV File"
      )}
    </Menu.Item>,
    <Menu.Item key="download_tsv" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a
          href={downloadLink("tsv")}
          download={downloadName("tsv")}
          target="_self"
        >
          Download as TSV File
        </a>
      ) : (
        "Download as TSV File"
      )}
    </Menu.Item>,
    <Menu.Item key="download_excel" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a
          href={downloadLink("xlsx")}
          download={downloadName("xlsx")}
          target="_self"
        >
          Download as Excel File
        </a>
      ) : (
        "Download as Excel File"
      )}
    </Menu.Item>,
    (canViewQuery || canEditParameters) && <Menu.Divider key="divider" />,
    canViewQuery && (
      <Menu.Item key="view_query">
        <a href={widget.getQuery().getUrl(true, widget.visualization.id)}>
          View Query
        </a>
      </Menu.Item>
    ),
    canEditParameters && (
      <Menu.Item key="edit_parameters" onClick={onParametersEdit}>
        Edit Parameters
      </Menu.Item>
    )
  ]);
}

// function RefreshIndicator({ refreshStartedAt }) {
// 	return (
// 		<div className="refresh-indicator">
// 			{/* <div className="refresh-icon">
//       <i className="fa fa-refresh fa-spin" />
// 			</div> */}
// 			<Timer from={refreshStartedAt} />
// 		</div>
// 	);
// }

// RefreshIndicator.propTypes = { refreshStartedAt: Moment };
// RefreshIndicator.defaultProps = { refreshStartedAt: null };

function VisualizationWidgetHeader({
  widget,
  refreshStartedAt,
  parameters,
  onParametersUpdate
}) {
  const canViewQuery = true;

  return (
    <>
      {/* <RefreshIndicator refreshStartedAt={refreshStartedAt} /> */}
      <div className="t-header widget clearfix">
        <div className="th-title">
          <p>
            <QueryLink
              query={widget.getQuery()}
              visualization={widget.visualization}
              readOnly={!canViewQuery}
            />
          </p>
          {!isEmpty(widget.getQuery().description) && (
            <HtmlContent className="text-muted markdown query--description">
              {markdown.toHTML(widget.getQuery().description || "")}
            </HtmlContent>
          )}
        </div>
      </div>
      {!isEmpty(parameters) && (
        <div className="m-b-10">
          <Parameters
            parameters={parameters}
            onValuesChange={onParametersUpdate}
          />
        </div>
      )}
    </>
  );
}

VisualizationWidgetHeader.propTypes = {
  widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  refreshStartedAt: Moment,
  parameters: PropTypes.arrayOf(PropTypes.object),
  onParametersUpdate: PropTypes.func
};

VisualizationWidgetHeader.defaultProps = {
  refreshStartedAt: null,
  onParametersUpdate: () => {},
  parameters: []
};

function VisualizationWidgetFooter({ widget, isPublic, onRefresh, onExpand }) {
  const widgetQueryResult = widget.getQueryResult();
  const updatedAt = invoke(widgetQueryResult, "getUpdatedAt");
  const [refreshClickButtonId, setRefreshClickButtonId] = useState();

  const refreshWidget = (buttonId) => {
    if (!refreshClickButtonId) {
      setRefreshClickButtonId(buttonId);
      onRefresh().finally(() => setRefreshClickButtonId(null));
    }
  };

  return widgetQueryResult ? (
    <>
      <span>
        {!isPublic && !!widgetQueryResult && (
          <a
            className="refresh-button hidden-print btn btn-sm btn-default btn-transparent"
            onClick={() => refreshWidget(1)}
            data-test="RefreshButton"
          >
            <Icon type="reload" /> <TimeAgo date={updatedAt} />
          </a>
        )}
        <span className="visible-print">
          <i className="zmdi zmdi-time-restore" /> {formatDateTime(updatedAt)}
        </span>
        {isPublic && (
          <span className="small hidden-print">
            <i className="zmdi zmdi-time-restore" />{" "}
            <TimeAgo date={updatedAt} />
          </span>
        )}
      </span>
      <span className="flex-refresh" style={{ width: "0" }}>
        <a
          className="btn btn-sm btn-default hidden-print btn-transparent"
          onClick={onExpand}
        >
          <i className="fa fa-expand" />
        </a>
      </span>
    </>
  ) : null;
}

VisualizationWidgetFooter.propTypes = {
  widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isPublic: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired
};

VisualizationWidgetFooter.defaultProps = { isPublic: false };

class VisualizationWidget extends React.Component {
  static propTypes = {
    widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    filters: FiltersType,
    isPublic: PropTypes.bool,
    isLoading: PropTypes.bool,
    canEdit: PropTypes.bool,
    onLoad: PropTypes.func,
    onRefresh: PropTypes.func,
    onDelete: PropTypes.func,
    onParameterMappingsChange: PropTypes.func
  };

  static defaultProps = {
    filters: [],
    isPublic: false,
    isLoading: false,
    canEdit: false,
    onLoad: () => {},
    onRefresh: () => {},
    onDelete: () => {},
    onParameterMappingsChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      localParameters: props.widget.getLocalParameters(),
      refreshClickButtonId: 0
    };
  }

  componentDidMount() {
    const { widget, onLoad } = this.props;
    recordEvent("view", "query", widget.visualization.query.id, {
      dashboard: true
    });
    recordEvent("view", "visualization", widget.visualization.id, {
      dashboard: true
    });
    onLoad();
  }

  expandWidget = () => {
    ExpandedWidgetDialog.showModal({ widget: this.props.widget });
  };

  editParameterMappings = () => {
    const { widget, dashboard, onRefresh, onParameterMappingsChange } =
      this.props;
    EditParameterMappingsDialog.showModal({
      dashboard,
      widget
    }).onClose((valuesChanged) => {
      // refresh widget if any parameter value has been updated
      if (valuesChanged) {
        onRefresh();
      }
      onParameterMappingsChange();
      this.setState({ localParameters: widget.getLocalParameters() });
    });
  };

  renderVisualization() {
    const { widget, filters } = this.props;
    const widgetQueryResult = widget.getQueryResult();
    const widgetStatus = widgetQueryResult && widgetQueryResult.getStatus();
    switch (widgetStatus) {
      case "failed":
        return (
          <div className="body-row-auto scrollbox">
            {widgetQueryResult.getError() && (
              <div className="alert alert-danger m-5">
                Error running query:{" "}
                <strong>{widgetQueryResult.getError()}</strong>
              </div>
            )}
          </div>
        );
      case "done":
        return (
          <div className="body-row-auto scrollbox">
            <VisualizationRenderer
              visualization={widget.visualization}
              queryResult={widgetQueryResult}
              filters={filters}
              dashboard
              context="widget"
            />
          </div>
        );
      default:
        return (
          <div className="body-row-auto spinner-container">
            <div className="spinner">
              <Spin
                indicator={
                  <Icon type="loading" style={{ fontSize: 24 }} spin />
                }
              />
            </div>
          </div>
        );
    }
  }

  render() {
    const { widget, isLoading, isPublic, canEdit, onRefresh } = this.props;

    const { localParameters, refreshClickButtonId } = this.state;
    const widgetQueryResult = widget.getQueryResult();
    const isRefreshing =
      isLoading && !!(widgetQueryResult && widgetQueryResult.getStatus());
    const refreshWidget = (buttonId) => {
      if (!refreshClickButtonId) {
        this.setState({ refreshClickButtonId: buttonId });
        onRefresh().finally(() =>
          this.setState({ refreshClickButtonId: null })
        );
      }
    };

    return (
      <Widget
        {...this.props}
        className="widget-visualization"
        menuOptions={visualizationWidgetMenuOptions({
          widget,
          canEditDashboard: canEdit,
          onParametersEdit: this.editParameterMappings
        })}
        header={
          <VisualizationWidgetHeader
            widget={widget}
            refreshStartedAt={isRefreshing ? widget.refreshStartedAt : null}
            parameters={localParameters}
            onParametersUpdate={onRefresh}
          />
        }
        footer={
          <VisualizationWidgetFooter
            widget={widget}
            isPublic={isPublic}
            onRefresh={onRefresh}
            onExpand={this.expandWidget}
          />
        }
        tileProps={{ "data-refreshing": isRefreshing }}
        refreshWidget={refreshWidget}
        refreshClickButtonId={refreshClickButtonId}
      >
        {this.renderVisualization()}
      </Widget>
    );
  }
}

export default VisualizationWidget;
