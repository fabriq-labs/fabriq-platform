/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import moment from "moment";
import { isNil } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";
import { Moment } from "./proptypes";

function toMoment(value) {
  value = !isNil(value) ? moment(value) : null;
  return value && value.isValid() ? value : null;
}

export default function TimeAgo({ date, placeholder, autoUpdate }) {
  const startDate = toMoment(date);
  const [value, setValue] = useState(null);

  const title = useMemo(
    () => (startDate ? startDate.format("DD/MM/YY HH:mm") : null),
    [startDate]
  );

  useEffect(() => {
    function update() {
      setValue(startDate ? startDate.fromNow() : placeholder);
    }
    update();

    if (autoUpdate) {
      const timer = setInterval(update, 30 * 1000);
      return () => clearInterval(timer);
    }
  }, [autoUpdate, startDate, placeholder]);

  return (
    <Tooltip title={title}>
      <span data-test="TimeAgo">{value}</span>
    </Tooltip>
  );
}

TimeAgo.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
    Moment
  ]),
  placeholder: PropTypes.string,
  autoUpdate: PropTypes.bool
};

TimeAgo.defaultProps = {
  date: null,
  placeholder: "",
  autoUpdate: true
};
