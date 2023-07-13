import React from "react";

import { Typography, Alert } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const Code = styled.pre`
  padding: 0.4em 0.8em;
  font-size: 13px;
  white-space: pre-wrap;
  margin: 0;
`;

export function FatalError({ error }) {
  return (
    <div>
      <Text strong style={{ fontSize: 18 }}>
        Error
      </Text>
      <Alert
        type="error"
        message={
          <Code
            dangerouslySetInnerHTML={{
              __html: error.toString().replace(/(Error:\s){2,}/g, "")
            }}
          />
        }
      />
    </div>
  );
}
