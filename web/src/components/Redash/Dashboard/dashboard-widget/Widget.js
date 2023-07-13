/* eslint-disable jsx-a11y/anchor-is-valid */
// Widget
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styled from "styled-components";
import { isEmpty } from "lodash";
import { Dropdown, Modal, Menu, Icon } from "antd";
import recordEvent from "../../../../api/record_event";
import { Moment } from "../../../../pages/Query/editor-components/proptypes";

// Wrapper
const Wrapper = styled.div`
	.editing-mode {
		.refresh-indicator {
			transition-duration: 0s;
	
			.rd-timer {
				display: none;
			}
	
			.refresh-indicator-mini();
		}
	}

	.refresh-indicator-mini() {
		font-size: 13px;
		transition-delay: 0s;
		color: #bbbbbb;
		transform: translateY(-4px);

		.refresh-icon:before {
			transition-delay: 0s;
			opacity: 0;
		}

		.rd-timer {
			transition-delay: 0s;
			opacity: 1;
			transform: translateX(0);
		}
	}

	.refresh-indicator {
		font-size: 18px;
		color: #86a1af;
		transition: all 100ms linear;
		transition-delay: 150ms; // waits for widget-menu to fade out before moving back over it
		transform: translateX(22px);
		position: absolute;
		right: 29px;
		top: 8px;
		display: flex;
		flex-direction: row-reverse;
	  
		.refresh-icon {
		  position: relative;
	  
		  &:before {
			content: "";
			position: absolute;
			top: 0px;
			right: 0;
			width: 24px;
			height: 24px;
			background-color: #e8ecf0;
			border-radius: 50%;
			transition: opacity 100ms linear;
			transition-delay: 150ms;
		  }
	  
		  i {
			height: 24px;
			width: 24px;
			display: flex;
			justify-content: center;
			align-items: center;
		  }
		}
	  
		.rd-timer {
		  font-size: 13px;
		  display: inline-block;
		  font-variant-numeric: tabular-nums;
		  opacity: 0;
		  transform: translateX(-6px);
		  transition: all 100ms linear;
		  transition-delay: 150ms;
		  color: #bbbbbb;
		  background-color: rgba(255, 255, 255, 0.9);
		  padding-left: 2px;
		  padding-right: 1px;
		  margin-right: -4px;
		  margin-top: 2px;
		}
	  
		.widget-visualization[data-refreshing="false"] & {
		  display: none;
		}
	  }

		.widget-actions {
			display: flex;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 1;
			align-items: center;

			.action {
				font-size: 24px;
				cursor: pointer;
				line-height: 100%;
				display: block;
				padding: 4px 10px 3px;
			}

			.action:hover {
				background-color: rgba(0, 0, 0, 0.1);
			}
			.btn-sm {
				margin-right: 5px;
			}
		}

		.parameter-container {
			margin: 0 15px;
		}

		.body-container {
			display: flex;
			flex-direction: column;
			align-items: stretch;

			.body-row {
				flex: 0 1 auto;
				background-color: #fff;
			}

			.body-row-auto {
				background-color: #fff;
				flex: 1 1 auto;
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

			.p-15 {
				padding: 15px !important;
			}
		}

		.anticon svg {
			margin-bottom: 5px;
		}

		.spinner-container {
			position: relative;

			.spinner {
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
		}

		.scrollbox:empty {
			padding: 0 !important;
			font-size: 1px !important;
		}

		.widget-text {
			:first-child {
				margin-top: 0;
			}
			:last-child {
				margin-bottom: 0;
			}
		}
	}

	.editing-mode {
		.widget-menu-remove {
			display: block;
		}
	}

	.query-link {
		cursor: pointer;
		font-size: 15px;
		font-weight: 500;

		&:hover {
			color: #40a9ff;
		}

		.th-title {
			cursor: move;
		}
	}

	.tile {
	.btn__refresh {
		opacity: 0 !important;
		transition: opacity 0.35s ease-in-out;
	}

	.t-header {
		.th-title {
			padding-right: 23px; // no overlap on RefreshIndicator

			a {
				color: fade(rgba(0, 0, 0, 1), 80%);
				font-size: 15px;
				font-weight: 500;
			}
		}

		.query--description {
			font-size: 14px;
			line-height: 1.5;
			font-style: italic;

			p {
				margin-bottom: 0;
			}
		}
	}

	.t-header.widget {
		background-color: #fff;
		font-size: 12px;
		padding: 15px;
	}

	.ant-table-column-has-actions, .display-as-number {
		width: 10%;
	}
	
	.ant-table-column-title {
		display: flex;
	}
	
	.ant-table-column-sorter {
		align-self: center;
	}

	&:hover {
		.widget-menu-regular,
		.btn__refresh {
			opacity: 1 !important;
			transition: opacity 0.35s ease-in-out;
		}

		.refresh-indicator {
			.refresh-indicator-mini();
		}
	}

	.body-row-auto {
		overflow: auto;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.tile__bottom-control {
		background-color: #fff;
		font-size: 12px;
		padding: 1px 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.btn-transparent {
			&:first-child {
				margin-left: -10px;
			}

			&:last-child {
				margin-right: -10px;
			}
		}

		a {
			color: fade(rgba(0, 0, 0, 1), 65%);

			&:hover {
				color: fade(rgba(0, 0, 0, 1), 95%);
			}
		}
	}
`;

function WidgetDropdownButton({ extraOptions, showDeleteOption, onDelete }) {
  const WidgetMenu = (
    <Menu data-test="WidgetDropdownButtonMenu">
      {/* {extraOptions}
      {showDeleteOption && extraOptions && <Menu.Divider />} */}
      {showDeleteOption && (
        <Menu.Item onClick={onDelete}>Remove from Dashboard</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="widget-menu-regular">
      <Dropdown
        overlay={WidgetMenu}
        placement="bottomRight"
        trigger={["click"]}
      >
        <a className="action p-l-15 p-r-15" data-test="WidgetDropdownButton">
          <Icon type="more" />
        </a>
      </Dropdown>
    </div>
  );
}

WidgetDropdownButton.propTypes = {
  extraOptions: PropTypes.node,
  showDeleteOption: PropTypes.bool,
  onDelete: PropTypes.func
};

WidgetDropdownButton.defaultProps = {
  extraOptions: null,
  showDeleteOption: false,
  onDelete: () => {}
};

function WidgetDeleteButton({ onClick }) {
  return (
    <div className="widget-menu-remove">
      <a
        className="action"
        title="Remove From Dashboard"
        onClick={onClick}
        data-test="WidgetDeleteButton"
      >
        <Icon type="cross" />
      </a>
    </div>
  );
}

WidgetDeleteButton.propTypes = { onClick: PropTypes.func };
WidgetDeleteButton.defaultProps = { onClick: () => {} };

class Widget extends React.Component {
  static propTypes = {
    widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    children: PropTypes.node,
    header: PropTypes.node,
    footer: PropTypes.node,
    canEdit: PropTypes.bool,
    isPublic: PropTypes.bool,
    refreshStartedAt: Moment,
    menuOptions: PropTypes.node,
    tileProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onDelete: PropTypes.func
  };

  static defaultProps = {
    className: "",
    children: null,
    header: null,
    footer: null,
    canEdit: false,
    isPublic: false,
    refreshStartedAt: null,
    menuOptions: null,
    tileProps: {},
    onDelete: () => {}
  };

  componentDidMount() {
    const { widget } = this.props;
    recordEvent("view", "widget", widget.id);
  }

  deleteWidget = () => {
    const { widget, onDelete } = this.props;

    Modal.confirm({
      title: "Delete Widget",
      content:
        "Are you sure you want to remove this widget from the dashboard?",
      okText: "Delete",
      okType: "danger",
      onOk: () => widget.delete().then(onDelete),
      maskClosable: true,
      autoFocusButton: null
    });
  };

  render() {
    const {
      className,
      children,
      header,
      footer,
      canEdit,
      isPublic,
      menuOptions,
      tileProps,
      refreshWidget,
      refreshClickButtonId
    } = this.props;
    const showDropdownButton = !isPublic && (canEdit || !isEmpty(menuOptions));
    return (
      <Wrapper>
        <div className={cx("tile body-container", className)} {...tileProps}>
          <div className="widget-actions">
            {!isPublic && (
              <a
                className="btn btn-sm btn-default hidden-print btn-transparent"
                onClick={() => refreshWidget(2)}
              >
                <i
                  className={cx("fa fa-refresh", {
                    "fa fa-refresh fa-spin": refreshClickButtonId === 2
                  })}
                />
              </a>
            )}
            {showDropdownButton && (
              <WidgetDropdownButton
                extraOptions={menuOptions}
                showDeleteOption={canEdit}
                onDelete={this.deleteWidget}
              />
            )}
            {canEdit && <WidgetDeleteButton onClick={this.deleteWidget} />}
          </div>
          <div className="body-row widget-header">{header}</div>
          {children}
          {footer && (
            <div className="body-row tile__bottom-control">{footer}</div>
          )}
        </div>
      </Wrapper>
    );
  }
}

export default Widget;
