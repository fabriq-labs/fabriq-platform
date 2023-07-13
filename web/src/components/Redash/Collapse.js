/* eslint-disable react/jsx-props-no-spreading */
// Collapse Component
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { Collapse } from "antd";

export default function CollapseComp({
  collapsed,
  children,
  className,
  ...props
}) {
  return (
    <Collapse
      {...props}
      activeKey={collapsed ? null : "content"}
      className={cx(className, "ant-collapse-headerless")}
    >
      <Collapse.Panel key="content" header="">
        {children}
      </Collapse.Panel>
    </Collapse>
  );
}

CollapseComp.propTypes = {
  collapsed: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

CollapseComp.defaultProps = {
  collapsed: true,
  children: null,
  className: ""
};
