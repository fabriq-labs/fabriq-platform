// Button DropDown
import React from "react";
import styled from "styled-components";
import { Button, Dropdown } from "antd";

const StyledButton = styled(Button)`
  &&:not(.ant-btn-link) {
    padding: 5px 12px;
    height: auto;
    border-color: var(--dark-05-color);
    color: rgb(88, 89, 121);
    box-shadow: none;

    &:hover,
    &:active,
    &:focus {
      border-color: var(--purple-04-color);
      color: var(--primary-color);
    }

    &:disabled {
      color: var(--disabled-color);
      border-color: var(--disabled-color);
      background-color: white;

      &:hover,
      &:active,
      &:focus {
        color: var(--disabled-color);
        border-color: var(--disabled-color);
      }
    }

    &.ant-btn-primary:not([disabled]) {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      place-self: center;
    }

    &.ant-btn-background-ghost:not([disabled]) {
      color: var(--primary-color);
    }

    &.ant-btn-icon-only {
      display: inline-flex;
      place-items: center;
      padding: 5px 8px;
      font-size: 14px;

      svg {
        width: 15px;
        height: 14px;
      }
    }

    .anticon {
      display: inline-block;
      height: 14px;
    }

    &.ant-btn-sm {
      padding: 0 8px;
      height: 24px !important;
    }
  }
`;

const ButtonDropdown = ({ overlay, disabled = false, ...buttonProps }) => {
  return (
    <Dropdown
      disabled={disabled}
      overlay={overlay}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <StyledButton {...buttonProps} disabled={disabled} />
    </Dropdown>
  );
};

export default ButtonDropdown;
