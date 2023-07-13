// Title Component

import React from "react";
import { Typography } from "antd";
import isEqual from "react-fast-compare";

const { Title, Text } = Typography;

const TitleComp = ({ title, type }) => {
  if (type === "Heading") {
    return (
      <Title
        style={{ color: "#7dad5c", fontSize: 20, fontWeight: 600 }}
        level={2}
      >
        {title}
      </Title>
    );
  }

  if (type === "Heading3") {
    return (
      <Title
        style={{ color: "#afbf84", fontSize: 19, fontWeight: 500 }}
        level={3}
      >
        {title}
      </Title>
    );
  }

  if (type === "Description") {
    return <Text style={{ fontSize: 15, fontWeight: 500 }}>{title}</Text>;
  }

  if (type === "Heading1") {
    return (
      <Title style={{ fontSize: 17, fontWeight: 700 }} level={3}>
        {title}
      </Title>
    );
  }

  if (type === "Heading2") {
    return (
      <Text
        style={{ color: "#bcbcc0", fontSize: 12, fontWeight: 600 }}
        type="secondary"
      >
        {title}
      </Text>
    );
  }
  return (
    <Text style={{ fontSize: 12, fontWeight: 600 }} type="secondary">
      {title}
    </Text>
  );
};

export default React.memo(TitleComp, isEqual);
