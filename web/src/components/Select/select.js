/* eslint-disable jsx-a11y/img-redundant-alt */
// Select Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import { find } from "lodash";
import Select, { components } from "react-select";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;

  .select {
    border-color: #cbd5e0;
    color: #717780;
    border-radius: 6px;

    .css-1okebmr-indicatorSeparator {
      background-color: #fff !important;
    }
  }

  .flex {
    display: flex;

    .ml-10 {
      margin-left: 10px;
    }
  }
`;

const { Option } = components;

const IconOption = (props) => (
  <Option {...props}>
    <div className="flex">
      <>
        <img src={props.data.image_url} alt="image" width={24} hight={24} />
      </>
      <div className="ml-10 p-0">{props.data.label}</div>
    </div>
  </Option>
);

// Main Component
const SelectCompnent = (props) => {
  const {
    options,
    onChange,
    value,
    disabled,
    placeholder,
    isLoading,
    isShowIcon,
    onBlur,
    autoFocus,
    allowClear,
    showSearch,
    showArrow,
  } = props;

  /* Handler Function */
  const handleChange = (option) => {
    if (onChange) {
      onChange(option);
    }
  };

  let optValue = null;
  if (value) {
    optValue = find(options, (opt) => opt.value === value) || null;
  }

  const commonProps = {
    value: optValue,
    className: "select",
    placeholder,
    options,
    autoFocus,
    isDisabled: disabled,
    isLoading: isLoading,
    onChange: handleChange,
    onBlur,
    allowClear,
    showSearch,
    showArrow,
  };

  if (isShowIcon) {
    return (
      <Wrapper>
        <Select {...commonProps} components={{ Option: IconOption }} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Select {...commonProps} />
    </Wrapper>
  );
};

SelectCompnent.propTypes = {
  options: PropTypes.array, // eslint-disable-line
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowIcon: PropTypes.bool,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  allowClear:PropTypes.bool,
  showSearch:PropTypes.bool,
  showArrow:PropTypes.bool
};

SelectCompnent.defaultProps = {
  options: [],
  value: "",
  onChange: null,
  onBlur: null,
  disabled: false,
  isLoading: false,
  isShowIcon: false,
  autoFocus: false,
  placeholder: "",
  allowClear: false,
  showSearch: false,
  showArrow: false
};

export default React.memo(SelectCompnent, isEqual);
