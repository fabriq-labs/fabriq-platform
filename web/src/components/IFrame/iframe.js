// IFrameComponent

import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100% !important;
  min-height: 100vh !important;

  .iframe {
    width: 100% !important;
    height: 100% !important;
  }
`;

const IFrameComponent = ({ url }) => {
  return (
    <Wrapper>
      <iframe src={url} className="iframe" title="Url"></iframe>
    </Wrapper>
  );
};

export default React.memo(IFrameComponent, isEqual);
