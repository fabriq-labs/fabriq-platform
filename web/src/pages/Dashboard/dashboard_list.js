// Shared Queries Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import Helmet from "react-helmet";

import MyDashboard from "./my_dashboard";
import { QuerySidebar } from "../../components/QuerySidebar";
import { dashboardList } from "../../components/QuerySidebar/helpers/options";

// PageWrapper
const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const PageContent = styled.div`
  display: flex;
  min-height: 100%;
`;

const ColLeft = styled.div``;

const ColRight = styled.div`
  width: 100%;
  background-color: #f6f8f9;
  padding: 20px 100px;
`;

// Main Component
const DashboardList = (props) => {
  const {
    queryActiveMenu,
    updateQueryActiveMenu,
    updateDashboardShare,
    queryFolder
  } = props;

  const onMenuItem = (ident) => {
    if (updateQueryActiveMenu) {
      updateQueryActiveMenu(ident);
    }
  };

  return (
    <Wrapper>
      <Helmet>
        <title>My Dashboard | Explore</title>
      </Helmet>
      <PageContent>
        <ColLeft>
          <QuerySidebar
            menulist={queryFolder}
            activeMenu={queryActiveMenu}
            dashboardList={dashboardList}
            onMenuItem={onMenuItem}
          />
        </ColLeft>
        <ColRight>
          <MyDashboard updateDashboardShare={updateDashboardShare} />
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(DashboardList, isEqual);
