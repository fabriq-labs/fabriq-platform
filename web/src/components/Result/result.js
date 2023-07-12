// Result Component
import React from "react";
import isEqual from "react-fast-compare";

import styled from "styled-components";
import "antd/dist/antd.css";
import { Result, Icon } from "antd";

const WrapperComp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Main Component
const ResultComponent = (props) => (
  <WrapperComp>
    <Result
      icon={
        <Icon
          type={props.type === "success" ? "like" : "message"}
          theme="twoTone"
        />
      }
      title={props.title}
    />
    ,
  </WrapperComp>
);

export default React.memo(ResultComponent, isEqual);
