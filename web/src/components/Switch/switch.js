import React from "react";
import PropTypes from "prop-types";
import { Switch } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  .ant-switch-checked {
    background-color: rgb(56, 161, 105) !important;
  }
`;

const SwitchComponent = (props) => {
  const { isChecked, size, onChange } = props;

  const handleChange = (checked) => {
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <Wrapper>
      <Switch
        className={`switch ${isChecked ? "active" : ""}`}
        checked={isChecked}
        onChange={handleChange}
        size={size}
      />
    </Wrapper>
  );
};

SwitchComponent.propTypes = {
  isChecked: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  onChange: PropTypes.func
};

SwitchComponent.defaultProps = {
  isChecked: false,
  size: "default",
  onChange: null
};

export default React.memo(SwitchComponent);
