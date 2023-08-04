import React from "react";
import styled from "styled-components";

import { Button } from "antd";

const UnstyledRemoveButtonGroup = ({ onRemoveClick, children, ...props }) => (
  <Button.Group {...props} style={{ display: "flex" }}>
    {children}
    <Button
      ghost
      className="remove-btn"
      disabled={props.disabled}
      onClick={onRemoveClick}
    >
      <i className="fa fa-close"></i>
    </Button>
  </Button.Group>
);

function color(props) {
  const colorMap = {
    primary: "primary",
    danger: "pink"
  };

  if (props.color == null) {
    return "primary";
  }

  return colorMap[props.color];
}

const RemoveButtonGroup = styled(UnstyledRemoveButtonGroup)`
  && {
    border-radius: calc(4px + 1px);

    .ant-btn {
      border: none;

      & + .ant-btn {
        margin-left: 0;
      }
    }

    .remove-btn {
      .anticon {
        height: 14px;
        display: block;
      }
    }
  }

  &&:not(.disabled) {
    border: 1px solid rgb(122, 119, 251);
    color: rgb(117, 114, 249);

    .ant-btn {
      background-color: rgba(117, 114, 247, 0.1);
      color: rgb(118, 116, 247);

      span {
        color: rgb(121, 118, 249);
      }

      &:hover {
        background-color: var(--${color}-8);
        border: none;
        box-shadow: none;
      }
    }

    .remove-btn {
      background-color: white !important;
      color: rgba(122, 119, 255, 1);

      &:hover {
        background-color: var(--${color}-8) !important;
      }
    }
  }

  &&.disabled {
    border: 1px solid var(--disabled-color);
    color: var(--disabled-color);

    .ant-btn {
      background-color: var(--disabled-bg);
      color: var(--disabled-color);
      border: none;

      span {
        color: var(--disabled-color);
      }
    }

    .remove-btn {
      color: var(--disabled-color);
    }
  }
`;

export default RemoveButtonGroup;
