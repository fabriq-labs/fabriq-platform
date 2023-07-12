// DatePicker Component

import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";
const DateRangePicker = ({ onChange }) => {
  const [dateRange, setDateRange] = useState([]);

  const handleDate = (dates) => {
    let range = [];
    range.push(dates[0]?.format(dateFormat));
    range.push(dates[1]?.format(dateFormat));
    setDateRange(range);
    if (onChange) {
      onChange(range);
    }
  };
  function disabledDate(current) {
    return (
      current &&
      current.valueOf() > Date.now()
    );
  }

  return (
    <RangePicker
      disabledDate={disabledDate}
      defaultValue={[
        moment(new Date(), dateFormat),
        moment(
          new Date(new Date().setDate(new Date().getDate() - 30)),
          dateFormat
        ),
      ]}
      ranges={dateRange}
      format="YYYY-MM-DD"
      onChange={handleDate}
      style={{ border: 0, marginTop: 3 }}
    />
  );
};

export default DateRangePicker;
