import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import { Input, Icon } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;

  .input {
    background-color: #f4f5f6;
    font-size: 14px;
    border-radius: 8px;
    border: 0 none;
    color: #595959;
    font-weight: 600;

    &.password {
      .ant-input {
        border: 1px solid transparent !important;
      }
    }
  }
`;

const WrapperCompConnect = styled(Wrapper)`
  .input {
    background-color: transparent;
    border: 1px solid #cbd5e0;
    border-radius: 3px;
    color: #718096;
    font-weight: 600;
    font-size: 15px;
    line-height: 17px;
    height: 50px;
  }
`;

const WrapperCompLogin = styled(Wrapper)`
  .input {
    background-color: transparent;
    border: 0;
    border-radius: 3px;
    color: #718096;
    font-weight: 600;
    font-size: 15px;
    line-height: 17px;
    height: 30px;
  }
`;

const WrapperDataSource = styled(WrapperCompConnect)`
  .input {
    height: 38px;
    color: #595959;
    font-size: 13px;
    line-height: 15px;
    font-weight: 500;
  }
`;

const WrapperError = styled(WrapperDataSource)`
  .input {
    border: 1px solid #ff0000 !important;

    &:focus {
      box-shadow: none !important;
    }
  }
`;

const IconDiv = styled.div`
  cursor: pointer;

  .anticon {
    vertical-align: unset;
    svg {
      vertical-align: unset;
    }
  }
`;

const InputComponent = (props) => {
  const {
    variant,
    isDisabled,
    placeholder,
    isShowIcon,
    value,
    onChange,
    type,
    name,
    onBlur,
    isError,
    isRequired,
    isShowRightIcon,
    iconName,
    onClickIcon,
    onKeyPress
  } = props;

  let WrapperComp = Wrapper;

  if (variant === "connect") {
    WrapperComp = WrapperCompConnect;
  } else if (variant === "data-source") {
    WrapperComp = WrapperDataSource;
    if (isError) {
      WrapperComp = WrapperError;
    }
  } else if (variant === "login") {
    WrapperComp = WrapperCompLogin;
  }

  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value, event.target.name);
    }
  };

  const handleKeyPress = (event) => {
    onKeyPress && onKeyPress(event.charCode);
  };

  return (
    <WrapperComp>
      <Input
        className={type === "password" ? "input password" : "input"}
        prefix={isShowIcon ? <Icon type="search" /> : null}
        suffix={
          isShowRightIcon && (
            <IconDiv onClick={onClickIcon}>
              <Icon type={iconName} />
            </IconDiv>
          )
        }
        disabled={isDisabled}
        required={isRequired}
        placeholder={placeholder}
        value={value}
        name={name}
        onBlur={onBlur}
        type={type}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </WrapperComp>
  );
};

InputComponent.propTypes = {
  variant: PropTypes.oneOf(["normal", "connect", "data-source", "login"]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.oneOf(["text", "password"]),
  isDisabled: PropTypes.bool,
  isShowIcon: PropTypes.bool,
  isRequired: PropTypes.bool,
  isError: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func
};

InputComponent.defaultProps = {
  variant: "normal",
  placeholder: "",
  value: "",
  name: "",
  type: "text",
  isDisabled: false,
  isShowIcon: false,
  isRequired: false,
  isError: false,
  onChange: null,
  onBlur: null,
  onKeyPress: null
};

export default React.memo(InputComponent, isEqual);
