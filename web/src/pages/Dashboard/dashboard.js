// DashboardView Component
import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Checkbox, Button } from "antd";
import Helmet from "react-helmet";
import { IFrameComponent } from "../../components/IFrame";

import Parameters from "../Query/parameter_component/parameters";
import Filters from "../Query/editor-components/filters";
import DashboardHeader from "../../components/Redash/DashboardHeader";
import recordEvent from "../../api/record_event";
import { Dashboard } from "../../api/dashboard";
import DashboardGrid from "../../components/Redash/Dashboard/DashboardGrid";
import useDashboard from "../Query/lib/useDashboard";
import { Skeleton } from "../../components/Skeleton";


const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .ant-table-wrapper {
    background-color: #fff;
  }

  .dashboard-page,
  .dashboard-page .container {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: 100%;
  }

  #dashboard-container {
    position: relative;
    flex-grow: 1;
    display: flex;
  }

  .bg-white {
    border-radius: 3px;
    position: sticky;
    box-shadow: rgba(102, 136, 153, 0.15) 0px 4px 9px -3px;
    background-color: #ffffff !important;
    padding: 15px !important;
    margin-bottom: 10px !important;
  }

  .add-widget-container {
    background: #fff;
    border-radius: 3px;
    position: sticky;
    padding: 15px;
    left: 15px;
    bottom: 20px;
    width: 100%;
    z-index: 99;
    box-shadow: fade(@redash-gray, 50%) 0px 7px 29px -3px;
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;

    .ant-btn {
      margin-right: 10px;
    }

    h2 {
      margin: 0;
      font-size: 14px;
      line-height: 2.1;
      font-weight: 400;

      .zmdi {
        margin: 0;
        margin-right: 5px;
        font-size: 24px;
        position: absolute;
        bottom: 18px;
      }

      span {
        vertical-align: middle;
        padding-left: 30px;
      }
    }

    .btn {
      align-self: center;
    }
  }
`;

const PageContent = styled.div`
  display: flex;
  min-height: 100%;
`;

const ColRight = styled.div`
  background-color: #f6f8f9;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 15px;
  margin-right: auto;
  margin-left: auto;
`;

function DashboardSettings({ dashboardOptions }) {
  const { dashboard, updateDashboard } = dashboardOptions;
  return (
    <div className="m-b-10 p-15 bg-white tiled">
      <Checkbox
        checked={!!dashboard.dashboard_filters_enabled}
        onChange={({ target }) =>
          updateDashboard({ dashboard_filters_enabled: target.checked })
        }
        data-test="DashboardFiltersCheckbox"
      >
        Use Dashboard Level Filters
      </Checkbox>
    </div>
  );
}

DashboardSettings.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function AddWidgetContainer({ dashboardOptions }) {
  const { showAddTextboxDialog, showAddWidgetDialog } = dashboardOptions;
  return (
    <div className="add-widget-container">
      <h2>
        <i className="zmdi zmdi-widgets" />
        <span className="hidden-xs hidden-sm">
          Widgets are individual query visualizations or text boxes you can
          place on your dashboard in various arrangements.
        </span>
      </h2>
      <div>
        <Button
          className="m-r-15"
          onClick={showAddTextboxDialog}
          data-test="AddTextboxButton"
        >
          Add Textbox
        </Button>
        <Button
          type="primary"
          onClick={showAddWidgetDialog}
          data-test="AddWidgetButton"
        >
          Add Widget
        </Button>
      </div>
    </div>
  );
}

AddWidgetContainer.propTypes = {
  dashboardOptions: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

// DashboardComponent
function DashboardComponent(props) {
  const dashboardOptions = useDashboard(
    props.dashboard,
    props.isEdit,
    props.queryString
  );
  const {
    dashboard,
    filters,
    setFilters,
    loadDashboard,
    loadWidget,
    removeWidget,
    saveDashboardLayout,
    globalParameters,
    refreshDashboard,
    refreshWidget,
    editingLayout,
    setGridDisabled
  } = dashboardOptions;

  return (
    <>
      <DashboardHeader
        dashboardOptions={dashboardOptions}
        isShared={props.isShared}
      />
      {!isEmpty(globalParameters) && (
        <div
          className="dashboard-parameters m-b-10 p-15 bg-white tiled"
          data-test="DashboardParameters"
        >
          <Parameters
            parameters={globalParameters}
            onValuesChange={refreshDashboard}
          />
        </div>
      )}
      {!isEmpty(filters) && (
        <div
          className="m-b-10 p-15 bg-white tiled"
          data-test="DashboardFilters"
        >
          <Filters filters={filters} onChange={setFilters} />
        </div>
      )}
      {editingLayout && (
        <DashboardSettings dashboardOptions={dashboardOptions} />
      )}
      <div id="dashboard-container">
        {dashboard?.options?.type === "custom" ? (
          <IFrameComponent url={dashboard?.options?.url} />
        ) : (
          <DashboardGrid
            dashboard={dashboard}
            widgets={dashboard.widgets}
            filters={filters}
            isEditing={editingLayout}
            onLayoutChange={editingLayout ? saveDashboardLayout : () => {}}
            onBreakpointChange={setGridDisabled}
            onLoadWidget={loadWidget}
            onRefreshWidget={refreshWidget}
            onRemoveWidget={removeWidget}
            onParameterMappingsChange={loadDashboard}
          />
        )}
      </div>
      {editingLayout && (
        <AddWidgetContainer dashboardOptions={dashboardOptions} />
      )}
    </>
  );
}

// DashboardPage Component
function DashboardPage({ dashboardSlug, isEdit, isShared, queryString }) {
  const [dashboard, setDashboard] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    Dashboard.get({ slug: dashboardSlug.toLowerCase() }).then(
      (dashboardData) => {
        recordEvent("view", "dashboard", dashboardData.id);
        setDashboard(dashboardData);
        setLoading(false);
      }
    );
  }, [dashboardSlug]);

  if (Loading) {
    return <Skeleton />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {dashboard && (
          <DashboardComponent
            dashboard={dashboard}
            isEdit={isEdit}
            isShared={isShared}
            queryString={queryString}
          />
        )}
      </div>
    </div>
  );
}

// Main Component
const DashboardView = (props) => {
  const { slug, location } = props;
  const { state } = location;
  const [isEdit, setIsEdit] = useState(
    state && state.isEdit ? state.isEdit : false
  );
  const isShared = state && state.isShared ? state.isShared : false;
  const queryString = getQueryStrings();

  useEffect(() => {
    if (state && state.isEdit) {
      setIsEdit(state.isEdit);
    }
  }, [isEdit]);

  // get querystring
  function getQueryStrings() {
    let assoc = {};

    let decode = function (s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    };
    let queryString = location.search.substring(1);
    let keyValues = queryString.split("&");

    for (let i in keyValues) {
      let key = keyValues[i].split("=");
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }

    return assoc;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{slug} | Dashboard</title>
      </Helmet>
      <PageContent>
        <ColRight>
          <DashboardPage
            dashboardSlug={slug}
            isEdit={isEdit}
            isShared={isShared}
            queryString={queryString}
          />
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(DashboardView, isEqual);
