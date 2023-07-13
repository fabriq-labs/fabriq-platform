import React from "react";
import { Result, Icon } from "antd";

const NoDataFound = () => {
  return (
    <Result
      icon={<Icon type="folder" theme="twoTone" />}
      title="No Data"
      extra={null}
    />
  );
};

export default NoDataFound;
