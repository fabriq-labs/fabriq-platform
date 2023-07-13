/* eslint-disable camelcase */
// Login Page Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import { MultiOrgList } from "../../components/MultiOrgList";
import { EmptyOrgList } from "../../components/MultiOrgList";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const Content = styled.div`
  min-height: 100%;
  overflow: hidden;
`;

// Main Component
const SelectOrgsPage = (props) => {
  const { orgDetails } = props.location.state;

  const onNext = (data) => {
    const selected_org = JSON.stringify(data);
    localStorage.setItem("organization", selected_org);
    navigate("/content/overview");

    window.location.reload();
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Orgs</title>
      </Helmet>
      <Content>
        {orgDetails && orgDetails.fabriq_orgs.length > 0 ? (
          <MultiOrgList
            onNext={onNext}
            orgList={orgDetails && orgDetails.fabriq_orgs}
          />
        ) : (
          <EmptyOrgList />
        )}
      </Content>
    </Wrapper>
  );
};

export default React.memo(SelectOrgsPage, isEqual);
