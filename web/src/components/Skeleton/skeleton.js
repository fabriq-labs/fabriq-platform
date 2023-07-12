// Skeleton Component
import React from "react";
import isEqual from "react-fast-compare";
import { Skeleton } from "antd";
import styled from "styled-components";

const WrapperComp = styled.div`
  margin: 100px;
  .ant-skeleton-title {
    width: 100% !important;
    background-color: #fafafa;
    height: 20px; /* Adjust the desired height */
  }

  .ant-skeleton-paragraph {
    display: none;
  }
`;

// Main Component
const SkeletonComponent = () => (
  <WrapperComp>
    <Skeleton active paragraph={{ rows: 0 }} />
  </WrapperComp>
);

export default React.memo(SkeletonComponent, isEqual);
