// Text Component
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Result } from "antd";

import { Navbar } from "../Navbar";
import Router from "../../router";
import { tablist } from "../Navbar/helpers/options";

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Content = styled.div``;

const exclusionlist = [
  "/pipeline/connect/callback",
  "/:org/invite/:token",
  "/pipeline/connect/init"
];

const MobileWrapper = styled.div`
  width: 100%;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileContent = styled.div`
  width: 70%;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
`;

const MobileView = () => {
  return (
    <MobileWrapper>
      <MobileContent>
        <Result
          status="500"
          title="Welcome!"
          subTitle="Please note that our website is currently optimized for
          desktop viewing only.We apologize for any inconvenience this may cause, but we encourage
          you to visit us on a desktop or laptop computer for the best user
          experience."
        />
      </MobileContent>
    </MobileWrapper>
  );
};
// Main Component
const LayoutView = (props) => {
  const organization = localStorage.getItem("organization");
  let parsed = null;

  if (organization) {
    parsed = JSON.parse(organization);
  }

  const { activeTab, updateActiveTab, refreshActiveMenu } = props;
  const authed = () => localStorage.hasOwnProperty("token");
  const url = window.location.pathname;

  let exclusion = exclusionlist.indexOf(url) !== -1;
  const [isDesktop, setDesktop] = useState(window.innerWidth > 820);

  useEffect(() => {
    if (url === "/content/overview") {
      updateActiveTab("overview");
    }

    if (url === "/content/authors") {
      updateActiveTab("authors");
    }

    if (url === "/explore/") {
      updateActiveTab("explore");
    }
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 820);
  };

  return (
    <>
      {isDesktop === true ? (
        <>
          {" "}
          {authed && parsed && !exclusion && (
            <Header>
              <Navbar
                tablist={tablist}
                activeMenu={activeTab}
                onUpdateTab={updateActiveTab}
                refreshActiveMenu={refreshActiveMenu}
              />
            </Header>
          )}
          <Content>
            <Router />
          </Content>
        </>
      ) : (
        <MobileView />
      )}
    </>
  );
};

export default LayoutView;
