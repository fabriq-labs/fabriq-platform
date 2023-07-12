// Avatar components
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Avatar } from "antd";

const Wrapper = styled.div`
  .avt {
    width: 30px;
    height: 30px;
    color: #fff;
    background-color: #08d7a6;

    .css-1wnrxjo {
      font-weight: 700;
      font-size: 11px;
    }
  }

  .ant-avatar-sm {
    line-height: 29px;
  }
`;

// Main Component
const AvatarComponent = (props) => {
  const { name, image } = props;

  const getInitials = (name) => {
    const initials = name ? name.charAt(0) : "";
    return initials.toUpperCase();
  };

  return (
    <Wrapper>
      <Avatar src={image} size="small" className="avt">
        {getInitials(name)}
      </Avatar>
    </Wrapper>
  );
};

AvatarComponent.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string
};

AvatarComponent.defaultProps = {
  image: "",
  name: ""
};

export default React.memo(AvatarComponent, isEqual);
