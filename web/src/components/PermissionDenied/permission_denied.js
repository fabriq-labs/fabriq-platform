// Permission Denied Component
import React from "react";
import styled from "styled-components";
import { Result } from "antd";

const Wrapper = styled.div``;

// Main Component
const PermissionDenied = () => {
  return (
    <Wrapper>
      <Result
        status="403"
        subTitle="Sorry, you are not authorized to access this page."
      />
      ,
    </Wrapper>
  );
};

export default PermissionDenied;
