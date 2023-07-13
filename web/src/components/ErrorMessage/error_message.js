// Text Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const WrapperComp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ImageContent = styled.div``;

const ErrorInfo = styled.div`
  color: #4c5a67;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

const Image = styled.img`
  width: 500px;
  height: 500px;
`;

// Main Component
const ErrorMessage = (props) => {
  const { error } = props;

  return (
    <WrapperComp>
      <ImageContent>
        <Image src="/images/error.png" alt="error" />
      </ImageContent>
      <ErrorInfo>{error.message}</ErrorInfo>
    </WrapperComp>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.object // eslint-disable-line
};

ErrorMessage.defaultProps = {
  error: null
};

export default React.memo(ErrorMessage, isEqual);
