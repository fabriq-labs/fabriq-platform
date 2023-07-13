/* eslint-disable max-len */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/static-property-placement */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import PropTypes from "prop-types";
import { chain, cloneDeep, find } from "lodash";
import styled from "styled-components";
import cx from "classnames";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  VisualizationWidget,
  TextboxWidget,
  RestrictedWidget
} from "./dashboard-widget";
import cfg from "./dashboard-grid-options";
import { WidgetTypeEnum } from "../../../api/widget";
import { FiltersType } from "../../../pages/Query/editor-components/filters";
import AutoHeightController from "./AutoHeightController";

import "react-grid-layout/css/styles.css";

// Wrapper
const Wrapper = styled.div`
	flex-grow: 1;
	margin-bottom: 70px;

	.layout {
		margin: -15px -15px 0;
	}

  .flex-refresh {
    display: flex;
    justify-content: space-between;
    width: 4%;
  }

	.tile {
		display: flex;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		width: auto;
		height: auto;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.pivot-table-visualization-container > table,
	.visualization-renderer > .visualization-renderer-wrapper {
		overflow: visible;
	}

	&.preview-mode {
		.widget-menu-regular {
			display: block;
		}
		.widget-menu-remove {
			display: none;
		}
	}

	&.editing-mode {
		/* Y axis lines */
		background: linear-gradient(to right, transparent, transparent 1px, #f6f8f9 1px, #f6f8f9),
		linear-gradient(to bottom, #b3babf, #b3babf 1px, transparent 1px, transparent);
		background-size: 5px 50px;
		background-position-y: -8px;

		/* X axis lines */
		&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 85px;
		right: 15px;
		background: linear-gradient(to bottom, transparent, transparent 2px, #f6f8f9 2px, #f6f8f9 5px),
			linear-gradient(to left, #b3babf, #b3babf 1px, transparent 1px, transparent);
		background-size: calc((100vw - 15px) / 6) 5px;
		background-position: -7px 1px;
		}
	}

	.widget-auto-height-enabled {
		.spinner {
		position: static;
		}

		.scrollbox {
		overflow-y: hidden;
		}
	}
	}

	.react-grid-layout {
		&.disable-animations {
			& > .react-grid-item {
			transition: none !important;
			}
		}
	}

	.dashboard-wrapper .dashboard-widget-wrapper:not(.widget-auto-height-enabled),
	.query-fixed-layout {
	.visualization-renderer {
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;

		> .visualization-renderer-wrapper {
		flex-grow: 1;
		position: relative;
		}

		> .filters-wrapper {
		flex-grow: 0;
		}
	}

	.sunburst-visualization-container,
	.sankey-visualization-container,
	.map-visualization-container,
	.word-cloud-visualization-container,
	.box-plot-deprecated-visualization-container,
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

	.counter-visualization-content {
		position: absolute;
		left: 10px;
		top: 15px;
		right: 10px;
		bottom: 15px;
		height: auto;
		overflow: hidden;
		padding: 0;
	}
	}

	// react-grid-layout overrides
	.react-grid-item {
	touch-action: initial !important; // react-draggable disables touch by default

	&.react-draggable {
		touch-action: none !important;
	}

	// placeholder color
	&.react-grid-placeholder {
		border-radius: 3px;
		background-color: #e0e6eb;
		opacity: 0.5;
	}

	// resize placeholder behind widget, the lib's default is above 🤷‍♂️
	&.resizing {
		z-index: 3;
	}

	// auto-height animation
	&.cssTransforms:not(.resizing) {
		transition-property: transform, height; // added ", height"
	}

	// resize handle size
	& > .react-resizable-handle {
		background: none;
		&:after {
		width: 11px;
		height: 11px;
		right: 5px;
		bottom: 5px;
		}
	}

	.ant-table-tbody {
		a {
			color: #40a9ff;
		}
	}
`;

const ResponsiveGridLayout = WidthProvider(Responsive);

const WidgetType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  options: PropTypes.shape({
    position: PropTypes.shape({
      col: PropTypes.number.isRequired,
      row: PropTypes.number.isRequired,
      sizeY: PropTypes.number.isRequired,
      minSizeY: PropTypes.number.isRequired,
      maxSizeY: PropTypes.number.isRequired,
      sizeX: PropTypes.number.isRequired,
      minSizeX: PropTypes.number.isRequired,
      maxSizeX: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
});

const SINGLE = "single-column";
const MULTI = "multi-column";

const DashboardWidget = React.memo(
  ({
    widget,
    dashboard,
    onLoadWidget,
    onRefreshWidget,
    onRemoveWidget,
    onParameterMappingsChange,
    canEdit,
    isPublic,
    isLoading,
    filters
  }) => {
    const { type } = widget;
    const onLoad = () => onLoadWidget(widget);
    const onRefresh = () => onRefreshWidget(widget);
    const onDelete = () => onRemoveWidget(widget.id);

    if (type === WidgetTypeEnum.VISUALIZATION) {
      return (
        <VisualizationWidget
          widget={widget}
          dashboard={dashboard}
          filters={filters}
          canEdit={canEdit}
          isPublic={isPublic}
          isLoading={isLoading}
          onLoad={onLoad}
          onRefresh={onRefresh}
          onDelete={onDelete}
          onParameterMappingsChange={onParameterMappingsChange}
        />
      );
    }
    if (type === WidgetTypeEnum.TEXTBOX) {
      return (
        <TextboxWidget
          widget={widget}
          canEdit={canEdit}
          isPublic={isPublic}
          onDelete={onDelete}
        />
      );
    }
    return <RestrictedWidget widget={widget} />;
  },
  (prevProps, nextProps) =>
    prevProps.widget === nextProps.widget &&
    prevProps.canEdit === nextProps.canEdit &&
    prevProps.isPublic === nextProps.isPublic &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.filters === nextProps.filters
);

class DashboardGrid extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isPublic: PropTypes.bool,
    dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    widgets: PropTypes.arrayOf(WidgetType).isRequired,
    filters: FiltersType,
    onBreakpointChange: PropTypes.func,
    onLoadWidget: PropTypes.func,
    onRefreshWidget: PropTypes.func,
    onRemoveWidget: PropTypes.func,
    onLayoutChange: PropTypes.func,
    onParameterMappingsChange: PropTypes.func
  };

  static defaultProps = {
    isPublic: false,
    filters: [],
    onLoadWidget: () => {},
    onRefreshWidget: () => {},
    onRemoveWidget: () => {},
    onLayoutChange: () => {},
    onBreakpointChange: () => {},
    onParameterMappingsChange: () => {}
  };

  static normalizeFrom(widget) {
    const {
      id,
      options: { position: pos }
    } = widget;

    return {
      i: id.toString(),
      x: pos.col,
      y: pos.row,
      w: pos.sizeX,
      h: pos.sizeY,
      minW: pos.minSizeX,
      maxW: pos.maxSizeX,
      minH: pos.minSizeY,
      maxH: pos.maxSizeY
    };
  }

  mode = null;

  autoHeightCtrl = null;

  constructor(props) {
    super(props);

    this.state = {
      layouts: {},
      disableAnimations: true
    };

    // init AutoHeightController
    this.autoHeightCtrl = new AutoHeightController(this.onWidgetHeightUpdated);
    this.autoHeightCtrl.update(this.props.widgets);
  }

  componentDidMount() {
    this.onBreakpointChange(
      document.body.offsetWidth <= cfg.mobileBreakPoint ? SINGLE : MULTI
    );
    // Work-around to disable initial animation on widgets; `measureBeforeMount` doesn't work properly:
    // it disables animation, but it cannot detect scrollbars.
    setTimeout(() => {
      this.setState({ disableAnimations: false });
    }, 50);
  }

  componentDidUpdate() {
    // update, in case widgets added or removed
    this.autoHeightCtrl.update(this.props.widgets);
  }

  componentWillUnmount() {
    this.autoHeightCtrl.destroy();
  }

  onLayoutChange = (_, layouts) => {
    // workaround for when dashboard starts at single mode and then multi is empty or carries single col data
    // fixes test dashboard_spec['shows widgets with full width']
    // TODO: open react-grid-layout issue
    if (layouts[MULTI]) {
      this.setState({ layouts });
    }

    // workaround for https://github.com/STRML/react-grid-layout/issues/889
    // remove next line when fix lands
    this.mode =
      document.body.offsetWidth <= cfg.mobileBreakPoint ? SINGLE : MULTI;
    // end workaround

    // don't save single column mode layout
    if (this.mode === SINGLE) {
      return;
    }

    const normalized = chain(layouts[MULTI])
      .keyBy("i")
      .mapValues(this.normalizeTo)
      .value();

    this.props.onLayoutChange(normalized);
  };

  onBreakpointChange = (mode) => {
    this.mode = mode;
    this.props.onBreakpointChange(mode === SINGLE);
  };

  // height updated by auto-height
  onWidgetHeightUpdated = (widgetId, newHeight) => {
    this.setState(({ layouts }) => {
      const layout = cloneDeep(layouts[MULTI]); // must clone to allow react-grid-layout to compare prev/next state
      const item = find(layout, { i: widgetId.toString() });
      if (item) {
        // update widget height
        item.h = Math.ceil((newHeight + cfg.margins) / cfg.rowHeight);
      }

      return { layouts: { [MULTI]: layout } };
    });
  };

  // height updated by manual resize
  onWidgetResize = (layout, oldItem, newItem) => {
    if (oldItem.h !== newItem.h) {
      this.autoHeightCtrl.remove(Number(newItem.i));
    }

    this.autoHeightCtrl.resume();
  };

  normalizeTo = (layout) => ({
    col: layout.x,
    row: layout.y,
    sizeX: layout.w,
    sizeY: layout.h,
    autoHeight: this.autoHeightCtrl.exists(layout.i)
  });

  render() {
    const className = cx(
      "dashboard-wrapper",
      this.props.isEditing ? "editing-mode" : "preview-mode"
    );
    const {
      onLoadWidget,
      onRefreshWidget,
      onRemoveWidget,
      onParameterMappingsChange,
      filters,
      dashboard,
      isPublic,
      widgets
    } = this.props;

    return (
      <Wrapper className={className}>
        <ResponsiveGridLayout
          className={cx("layout", {
            "disable-animations": this.state.disableAnimations
          })}
          cols={{ [MULTI]: cfg.columns, [SINGLE]: 1 }}
          rowHeight={cfg.rowHeight - cfg.margins}
          margin={[cfg.margins, cfg.margins]}
          isDraggable={this.props.isEditing}
          isResizable={this.props.isEditing}
          onResizeStart={this.autoHeightCtrl.stop}
          onResizeStop={this.onWidgetResize}
          layouts={this.state.layouts}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          breakpoints={{ [MULTI]: cfg.mobileBreakPoint, [SINGLE]: 0 }}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              data-grid={DashboardGrid.normalizeFrom(widget)}
              data-widgetid={widget.id}
              data-test={`WidgetId${widget.id}`}
              className={cx("dashboard-widget-wrapper", {
                "widget-auto-height-enabled": this.autoHeightCtrl.exists(
                  widget.id
                )
              })}
            >
              <DashboardWidget
                dashboard={dashboard}
                widget={widget}
                filters={filters}
                isPublic={isPublic}
                isLoading={widget.loading}
                canEdit={dashboard.canEdit()}
                onLoadWidget={onLoadWidget}
                onRefreshWidget={onRefreshWidget}
                onRemoveWidget={onRemoveWidget}
                onParameterMappingsChange={onParameterMappingsChange}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </Wrapper>
    );
  }
}

export default DashboardGrid;
