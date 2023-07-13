import React from "react";
import PropTypes from "prop-types";
import { DatePicker } from "antd";
import { Moment } from "../editor-components/proptypes";

const DateTimeInput = React.forwardRef(
  (
    { defaultValue, value, withSeconds, onSelect, className, ...props },
    ref
  ) => {
    const format = `YYYY-MM-DD${withSeconds ? " HH:mm:ss" : " HH:mm"}`;
    const additionalAttributes = {};
    if (defaultValue && defaultValue.isValid()) {
      additionalAttributes.defaultValue = defaultValue;
    }
    if (value === null || (value && value.isValid())) {
      additionalAttributes.value = value;
    }
    return (
      <DatePicker
        ref={ref}
        className={className}
        showTimea
        {...additionalAttributes}
        format={format}
        placeholder="Select Date and Time"
        onChange={onSelect}
        {...props}
      />
    );
  }
);

DateTimeInput.propTypes = {
  defaultValue: Moment,
  value: Moment,
  withSeconds: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string
};

DateTimeInput.defaultProps = {
  defaultValue: null,
  value: undefined,
  withSeconds: false,
  onSelect: () => {},
  className: ""
};

export default DateTimeInput;
