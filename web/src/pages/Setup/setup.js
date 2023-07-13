/* eslint-disable no-shadow */
// Page Base Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import Helmet from "react-helmet";

import { Sidebar } from "../../components/Sidebar";
import { menulist } from "../../components/Sidebar/helpers/options";
import { UserView, ConnectionView, PlansView, UserProfileInfo, SiteView } from "./index";

// PageWrapper
const PageWrapper = styled.div`
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
const Setup = (props) => {
  const {
    activeMenu,
    updateActiveMenu,
    updateHomeDashboard,
    homeDashboard,
  } = props;

  /* Handler Function */
  const onMenuItem = (ident) => {
    if (updateActiveMenu) {
      updateActiveMenu(ident);
    }
  };

  return (
    <PageWrapper>
      <Helmet>
        <title>Setup</title>
      </Helmet>
      <PageContent>
        <ColLeft>
          <Sidebar
            menulist={menulist}
            activeMenu={activeMenu}
            onMenuItem={onMenuItem}
          />
        </ColLeft>
        <ColRight>
          {activeMenu === "users" && <UserView />}
          {activeMenu === "connections" && <ConnectionView />}
          {activeMenu === "plans" && <PlansView />}
          {activeMenu === "userprofile" && (
            <UserProfileInfo
              updateHomeDashboard={updateHomeDashboard}
              homeDashboard={homeDashboard}
            />
          )}
           {activeMenu === "sites" && <SiteView />}
        </ColRight>
      </PageContent>
    </PageWrapper>
  );
};

export default React.memo(Setup, isEqual);
