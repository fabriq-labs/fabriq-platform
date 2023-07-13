// Button Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import { Button } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  .ant-btn-disabled,
  .ant-btn.disabled,
  .ant-btn[disabled] {
    background-color: #1890ff !important;
    color: #fff !important;
    opacity: 0.4 !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
  }

  .icon-right {
    margin-left: 5px;
  }

  .icon-left {
    margin-right: 5px;
  }
`;

const WrapperConnect = styled(Wrapper)`
  .button {
    background-color: #1890ff;
    border-radius: 10px;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    height: 28px;
  }
`;

const WrapperConnectView = styled(WrapperConnect)`
  .button {
    border-radius: 5px;
    height: 40px;
  }
`;

const WrapperReConnectView = styled(WrapperConnect)`
  .button {
    background-color: #808080;
    border-radius: 5px;
    height: 40px;
  }
`;

const WrapperHeader = styled(WrapperConnect)`
  .button {
    border-radius: 5px;
    font-size: 12px;
    line-height: 14px;
    height: 30px;
  }
`;

const WrapperQuery = styled(WrapperConnect)`
  margin-right: 10px;

  .button {
    border-radius: 0;
    height: 30px;
    background-color: rgba(102, 136, 153, 0.15);
    color: #333;
    font-size: 12px;
    line-height: 14px;
  }
`;

const WrapperExecute = styled(WrapperQuery)`
  margin-right: 0;

  .button {
    background-color: #48a3ee;
    color: #fff;
  }
`;

const WrapperAlert = styled(WrapperQuery)`
  .button {
    background-color: #48a3ee;
    color: #fff;
  }
`;

const WrapperDelete = styled(WrapperQuery)`
  margin-right: 0;

  .button {
    background-color: #f44336;
    color: #fff;
  }
`;

// Main Component
const ButtonComponent = (props) => {
  const {
    variant,
    isDisabled,
    title,
    onClick,
    rightIcon,
    leftIcon,
    isLoading
  } = props;

  let ButtonComp = Wrapper;

  if (variant === "connect") {
    ButtonComp = WrapperConnect;
  } else if (variant === "connect-view") {
    ButtonComp = WrapperConnectView;
  } else if (variant === "reconnect-view") {
    ButtonComp = WrapperReConnectView;
  } else if (variant === "header") {
    ButtonComp = WrapperHeader;
  } else if (variant === "query-save") {
    ButtonComp = WrapperQuery;
  } else if (variant === "query-execute") {
    ButtonComp = WrapperExecute;
  } else if (variant === "alert-save") {
    ButtonComp = WrapperAlert;
  } else if (variant === "alert-delete") {
    ButtonComp = WrapperDelete;
  }

  return (
    <ButtonComp>
      <Button
        className="button"
        disabled={isDisabled}
        onClick={onClick}
        loading={isLoading}
        leftIcon={leftIcon}
      >
        {leftIcon && (
          <span className="icon-left">
            <i className="fa fa-arrow-left" />
          </span>
        )}
        {title}
        {rightIcon && (
          <span className="icon-right">
            <i className="fa fa-arrow-right" />
          </span>
        )}
      </Button>
    </ButtonComp>
  );
};

ButtonComponent.propTypes = {
  variant: PropTypes.oneOf([
    "connect",
    "connect-view",
    "header",
    "query-save",
    "query-execute",
    "alert-save",
    "alert-delete"
  ]),
  title: PropTypes.string,
  rightIcon: PropTypes.string,
  leftIcon: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func
};

ButtonComponent.defaultProps = {
  variant: "connect",
  title: "",
  rightIcon: "",
  leftIcon: "",
  isDisabled: false,
  isLoading: false,
  onClick: PropTypes.func
};

export default React.memo(ButtonComponent, isEqual);
