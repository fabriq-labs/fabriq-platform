// Empty Org List Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const WrapperForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  margin: 10%;

  @media (max-width: 992px) {
    font-size: 15px;
  }
`;

// Main Component
const EmptyOrgList = () => {
  return (
    <WrapperForm>
      <Content>
        Your account have no organization to select. Please create an account
        with organization.
      </Content>
    </WrapperForm>
  );
};

export default React.memo(EmptyOrgList, isEqual);
