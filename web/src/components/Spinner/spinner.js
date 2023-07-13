// Text Component
import React from "react";
import isEqual from "react-fast-compare";
import { Spin, Icon } from "antd";
import styled from "styled-components";

const WrapperComp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Main Component
const SpinnerComponent = () => (
  <WrapperComp>
    <Spin indicator={<Icon type="loading" style={{ fontSize: 38 }} spin />} />
  </WrapperComp>
);

export default React.memo(SpinnerComponent, isEqual);
