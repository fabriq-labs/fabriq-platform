// Icon Component
import React from "react";
import isEqual from "react-fast-compare";
import PropTypes from "prop-types";

import { ReactComponent as Arrow } from "./svg/arrow.svg";
import { ReactComponent as Server } from "./svg/server.svg";
import { ReactComponent as Settings } from "./svg/settings.svg";
import { ReactComponent as Logout } from "./svg/logout.svg";
import { ReactComponent as ArrowUp } from "./svg/chevron-arrow-up.svg";
import { ReactComponent as ArrowDown } from "./svg/down-arrow.svg";
import { ReactComponent as Sync } from "./svg/sync.svg";
import { ReactComponent as Delete } from "./svg/delete.svg";
import { ReactComponent as Cross } from "./svg/multiply.svg";
import { ReactComponent as Duplicate } from "./svg/duplicate.svg";
import { ReactComponent as Data } from "./svg/data.svg";

// Main Component
const Icon = (props) => {
  const { name, fill, width, height } = props;

  if (name === "arrow") {
    return <Arrow fill={fill} width={width} height={height} />;
  }

  if (name === "server") {
    return <Server fill={fill} width={width} height={height} />;
  }

  if (name === "settings") {
    return <Settings fill={fill} width={width} height={height} />;
  }

  if (name === "logout") {
    return <Logout fill={fill} width={width} height={height} />;
  }

  if (name === "arrowUp") {
    return <ArrowUp fill={fill} width={width} height={height} />;
  }

  if (name === "arrowDown") {
    return <ArrowDown fill={fill} width={width} height={height} />;
  }

  if (name === "sync") {
    return <Sync fill={fill} width={width} height={height} />;
  }

  if (name === "delete") {
    return <Delete fill={fill} width={width} height={height} />;
  }

  if (name === "cross") {
    return <Cross fill={fill} width={width} height={height} />;
  }

  if (name === "duplicate") {
    return <Duplicate fill={fill} width={width} height={height} />;
  }

  if (name === "data") {
    return <Data fill={fill} width={width} height={height} />;
  }

  return null;
};

Icon.propTypes = {
  fill: PropTypes.string,
  name: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Icon.defaultProps = {
  fill: "",
  name: "",
  height: 16,
  width: 16
};

export default React.memo(Icon, isEqual);
