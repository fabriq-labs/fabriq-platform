// Tag Component

import React from "react";
import { Tag } from "antd";

const TagComp = ({ title, type, icon }) => {
  if (type === "2") {
    return (
      <Tag
        color="cyan"
        style={{ height: 22, color: "#617698", borderStyle: "dotted" }}
      >
        {title}
      </Tag>
    );
  }

  if (type === "3") {
    return (
      <Tag
        color="cyan"
        style={{ height: 22, color: "#6a6d75", border: 0 }}
      >
        {title}
      </Tag>
    );
  }

  if (icon) {
    return (
      <Tag color="cyan" icon={icon} style={{ height: 26, paddingTop: 3 }}>
        {title}
      </Tag>
    );
  }

  return (
    <Tag
      color="cyan"
      style={{ height: 22, backgroundColor: "#fff", borderStyle: "dotted" }}
    >
      {title}
    </Tag>
  );
};

export default TagComp;
