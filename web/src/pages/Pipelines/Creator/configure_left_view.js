// Cofigure Left View Component
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "react-fast-compare";

const Wrapper = styled.div`
  width: 100%;
`;

const ColLeftPick = styled.div``;

const Content = styled.div`
  padding: 48px 0 0 94px;
`;

const ImageRow = styled.div`
  width: 50px;
  height: 50px;
`;

const RowInfo = styled.div`
  padding-top: 146px;
  max-width: 356px;
  padding-bottom: 36px;
`;

const Title = styled.div`
  color: #c8636f;
  font-weight: 500;
  font-size: 26px;
  line-height: 28px;
  padding-bottom: 34px;
`;

const ConfigureLeftView = (props) => {
  const { title } = props;

  return (
    <Wrapper>
      <ColLeftPick>
        <Content>
          <ImageRow>
            <img
              src="/images/header_connect_transparent.png"
              alt="connect"
              width={50}
              height={50}
            />
          </ImageRow>
          <RowInfo>
            <Title>{title}</Title>
          </RowInfo>
        </Content>
      </ColLeftPick>
    </Wrapper>
  );
};

ConfigureLeftView.propTypes = {
  info: PropTypes.string,
  title: PropTypes.string,
  img: PropTypes.string,
  item: PropTypes.object // eslint-disable-line
};

ConfigureLeftView.defaultProps = {
  info: "",
  title: "",
  img: PropTypes.string,
  item: null
};

export default React.memo(ConfigureLeftView, isEqual);
