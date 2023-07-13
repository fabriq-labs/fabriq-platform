import React, { useEffect, useState, useCallback } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { includes } from "lodash";
import styled from "styled-components";
import { Icon, Tooltip, Button, Dropdown, Menu } from "antd";
import Popover, { ArrowContainer } from "react-tiny-popover";
import { durationHumanize } from "../../pages/Query/lib/utils";
import EditInPlace from "../../pages/Query/editor-components/edit_input";
import { DashboardStatusEnum } from "../../pages/Query/lib/useDashboard";
import { navigate } from "@reach/router";

// Wrapper
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  position: -webkit-sticky;
  position: sticky;
  background: #f6f7f9;
  width: 100%;
  top: 0;
  margin-bottom: 10px;

  & > div {
    padding: 5px 0;
  }

  .m-r-5 {
    margin-right: 5px;
  }

  .title-with-tags {
    flex: 1 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: -5px 0;

    & > div {
      display: flex;
      padding: 5px 0;
    }

    .left-icon {
      align-self: center;
      .fa {
        cursor: pointer;
        font-size: 14px;
        margin-right: 15px;
      }
    }

    h3 {
      font-size: 23px;
      line-height: 25px;
      margin: 0;

      @media (max-width: 767px) {
        font-size: 18px;
      }
    }
  }

  @media @mobileBreakpoint {
    & {
      padding: 0 !important;
      position: static;
    }
  }

  .profile-image {
    width: 16px;
    height: 16px;
    border-radius: 100%;
    align-self: center;
    margin: 0 5px;
  }

  .ant-btn-group {
    margin-right: 5px;
  }

  .tags-control a {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    .tags-control a {
      opacity: 1;
    }
  }

  .dashboard-control {
    .icon-button {
      width: 32px;
      padding: 0 10px;
    }

    .hidden-print {
      display: flex;
    }

    .fa-check {
      margin-right: 5px;
    }

    .ant-btn {
      font-size: 13px;
      &.publish {
        margin-right: 5px;
      }
    }

    .anticon {
      vertical-align: unset !important;
    }

    .save-status {
      vertical-align: middle;
      margin-right: 7px;
      font-size: 12px;
      text-align: left;
      display: inline-block;

      &[data-saving] {
        opacity: 0.6;
        width: 45px;

        &:after {
          content: "";
          animation: saving 2s linear infinite;
        }
      }

      &[data-error] {
        color: #f44336;
      }
    }

    @media (max-width: 515px) {
      flex-basis: 100%;
    }
  }
`;

const ButtonRow = styled.div`
  align-self: center;
  display: flex;

  .anticon svg {
    margin-bottom: 3px;
  }
`;

const PublishButton = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const InfoDiv = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgb(211, 211, 211);
  box-shadow: 0px 0px 20px -14px rgba(0, 0, 0, 0.75);
`;

const Label = styled.div`
  font-size: 13px;
  align-self: center;
  line-height: 16px;
  font-weight: 700;
  color: #595959;
  cursor: pointer;
  padding: 10px 20px;
`;

const LempActive = styled(Label)`
  background: #3182eb;
  color: #fff;

  .kdpLnM {
    color: #fff !important;
  }
`;

const LabelCanViewActive = styled(LempActive)``;

const LabelEditActive = styled(LempActive)``;

const LabelEdit = styled(Label)`
  margin-bottom: 0;
`;

const Desc = styled.div`
  font-size: 13px;
  align-self: center;
  line-height: 16px;
  font-weight: 700;
  color: #c5c5c5;
  margin-top: 10px;
`;

function buttonType(value) {
  return value ? "primary" : "default";
}

function DashboardPageTitle({ dashboardOptions }) {
  const { dashboard, updateDashboard, editingLayout } = dashboardOptions;

  const onRedirectBack = () => {
    navigate("/home");
  };

  return (
    <div className="title-with-tags">
      <div className="page-title">
        <div className="left-icon" onClick={onRedirectBack}>
          <i class="fa fa-arrow-left" aria-hidden="true" />
        </div>
        <h3>
          <EditInPlace
            isEditable={editingLayout}
            onDone={(name) => updateDashboard({ name })}
            value={dashboard.name}
            ignoreBlanks
          />
        </h3>
        <Tooltip title={dashboard.user.name} placement="bottom">
          <img
            src={dashboard.user.profile_image_url}
            className="profile-image"
            alt={dashboard.user.name}
          />
        </Tooltip>
      </div>
    </div>
  );
}

DashboardPageTitle.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function RefreshButton({ dashboardOptions }) {
  const {
    refreshRate,
    setRefreshRate,
    disableRefreshRate,
    refreshing,
    refreshDashboard
  } = dashboardOptions;

  // useEffect(() => {
  //   refreshDashboard();
  // }, []);
  const allowedIntervals = [60, 300, 600, 1800, 3600, 43200, 86400];
  const refreshRateOptions = allowedIntervals;
  const onRefreshRateSelected = ({ key }) => {
    const parsedRefreshRate = parseFloat(key);
    if (parsedRefreshRate) {
      setRefreshRate(parsedRefreshRate);
      refreshDashboard();
    } else {
      disableRefreshRate();
    }
  };
  return (
    <Button.Group>
      <Tooltip
        title={
          refreshRate
            ? `Auto Refreshing every ${durationHumanize(refreshRate)}`
            : null
        }
      >
        <Button
          type={buttonType(refreshRate)}
          onClick={() => refreshDashboard()}
        >
          <i
            className={cx("fa fa-refresh m-r-5", {
              "fa fa-refresh fa-spin": refreshing
            })}
          />
          {refreshRate ? durationHumanize(refreshRate) : "Refresh"}
        </Button>
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        overlay={
          <Menu
            onClick={onRefreshRateSelected}
            selectedKeys={[`${refreshRate}`]}
          >
            {refreshRateOptions.map((option) => (
              <Menu.Item
                key={`${option}`}
                disabled={!includes(allowedIntervals, option)}
              >
                {durationHumanize(option)}
              </Menu.Item>
            ))}
            {refreshRate && (
              <Menu.Item key={null}>Disable auto refresh</Menu.Item>
            )}
          </Menu>
        }
      >
        <Button
          className="icon-button hidden-xs"
          type={buttonType(refreshRate)}
        >
          <Icon type="down" />
        </Button>
      </Dropdown>
    </Button.Group>
  );
}

RefreshButton.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function DashboardMoreOptionsButton({ dashboardOptions }) {
  const { setEditingLayout, gridDisabled } = dashboardOptions;

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      overlay={
        <Menu data-test="DashboardMoreButtonMenu">
          <Menu.Item className={cx({ hidden: gridDisabled })}>
            <a onClick={() => setEditingLayout(true)}>Edit</a>
          </Menu.Item>
        </Menu>
      }
    >
      <Button className="icon-button m-l-5" data-test="DashboardMoreButton">
        <Icon type="ellipsis" rotate={90} />
      </Button>
    </Dropdown>
  );
}

DashboardMoreOptionsButton.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function DashboardControl({ dashboardOptions, isShared }) {
  const { dashboard, canEditDashboard, updateDashboard } = dashboardOptions;
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const showRefreshButton = true;
  const showMoreOptionsButton = canEditDashboard;

  useEffect(() => {
    if (!dashboard.is_draft && dashboard.is_team_editable) {
      setActiveItem("canEdit");
    } else if (!dashboard.is_draft && !dashboard.is_team_editable) {
      setActiveItem("canView");
    } else {
      setActiveItem("private");
    }
  }, [dashboard]);

  /* Onclick Function */
  const onClickMenu = (MenuOpen) => {
    setMenuOpen(MenuOpen);
  };

  const onClickOutside = () => {
    setMenuOpen(false);
  };

  const onClickShare = useCallback(
    (updateItem) => {
      if (updateItem === "private") {
        updateDashboard(
          { is_draft: !dashboard.is_draft, is_team_editable: false },
          false
        );
      } else if (updateItem === "canEdit") {
        updateDashboard({ is_draft: false, is_team_editable: true }, false);
      } else if (updateItem === "canView") {
        updateDashboard({ is_draft: false, is_team_editable: false }, false);
      }
      setActiveItem(updateItem);
      onClickOutside();
    },
    [dashboard, updateDashboard]
  );

  const LabelComp = activeItem === "private" ? LempActive : Label;
  const LabelViewComp = activeItem === "canView" ? LabelCanViewActive : Label;
  const LabelEditComp = activeItem === "canEdit" ? LabelEditActive : LabelEdit;

  return (
    <div className="dashboard-control">
      {!dashboard.is_archived && (
        <span className="hidden-print">
          {/* {showPublishButton && (
						<Button className="publish" onClick={togglePublished}>
							Publish
						</Button>
					)} */}
          <ButtonRow>
            {!isShared && (
              <Popover
                containerClassName="tiny-popup-query"
                containerStyle={{ zIndex: 11, marginTop: "-4px" }}
                isOpen={isMenuOpen}
                position={["bottom"]}
                content={(data) => (
                  <ArrowContainer
                    position={data.position}
                    targetRect={data.targetRect}
                    popoverRect={data.popoverRect}
                    arrowColor="#fff"
                    arrowSize={10}
                    arrowStyle={{ opacity: 0.7 }}
                  >
                    <InfoDiv>
                      <LabelComp onClick={() => onClickShare("private")}>
                        Private
                        <Desc>Only you have access</Desc>
                      </LabelComp>
                      <LabelViewComp onClick={() => onClickShare("canView")}>
                        Can View
                        <Desc>Your team can view this dashboard</Desc>
                      </LabelViewComp>
                      <LabelEditComp onClick={() => onClickShare("canEdit")}>
                        Can Edit
                        <Desc>Your team can edit this dashboard</Desc>
                      </LabelEditComp>
                    </InfoDiv>
                  </ArrowContainer>
                )}
                onClickOutside={onClickOutside}
              >
                <PublishButton>
                  <Button
                    className="m-r-5"
                    onClick={() => onClickMenu(!isMenuOpen)}
                  >
                    <Icon type="share-alt" />
                    Share
                  </Button>
                </PublishButton>
              </Popover>
            )}
          </ButtonRow>
          {showRefreshButton && (
            <RefreshButton dashboardOptions={dashboardOptions} />
          )}
          {(showMoreOptionsButton ||
            !isShared ||
            (isShared && !dashboard.isDraft && dashboard.is_team_editable)) && (
            <DashboardMoreOptionsButton dashboardOptions={dashboardOptions} />
          )}
        </span>
      )}
    </div>
  );
}

DashboardControl.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function DashboardEditControl({ dashboardOptions }) {
  const {
    setEditingLayout,
    doneBtnClickedWhileSaving,
    dashboardStatus,
    retrySaveDashboardLayout
  } = dashboardOptions;

  /* let status;
  if (dashboardStatus === DashboardStatusEnum.SAVED) {
    status = <span className="save-status">Saved</span>;
  } else if (dashboardStatus === DashboardStatusEnum.SAVING) {
    status = (
      <span className="save-status" data-saving>
        Saving
      </span>
    );
  } else {
    status = (
      <span className="save-status" data-error>
        Saving Failed
      </span>
    );
  } */

  const onEditControl = () => {
    setEditingLayout(false);
  };

  return (
    <div className="dashboard-control">
      {/* {status} */}
      {dashboardStatus === DashboardStatusEnum.SAVING_FAILED ? (
        <Button type="primary" onClick={retrySaveDashboardLayout}>
          Retry
        </Button>
      ) : (
        <Button
          loading={doneBtnClickedWhileSaving}
          type="primary"
          onClick={onEditControl}
        >
          {!doneBtnClickedWhileSaving && <i className="fa fa-check m-r-5" />}{" "}
          Done Editing
        </Button>
      )}
    </div>
  );
}

DashboardEditControl.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default function DashboardHeader({
  dashboardOptions,
  isShared
}) {
  const { editingLayout } = dashboardOptions;
  const DashboardControlComponent = editingLayout
    ? DashboardEditControl
    : DashboardControl;

  return (
    <Wrapper>
      <DashboardPageTitle dashboardOptions={dashboardOptions} />
      <DashboardControlComponent
        dashboardOptions={dashboardOptions}
        isShared={isShared}
      />
    </Wrapper>
  );
}

DashboardHeader.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};
