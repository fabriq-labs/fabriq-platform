//
import React from "react";
import { Component, CSSProperties } from "react";
import Prism from "prismjs";
import styled from "styled-components";

const Wrapper = styled.pre`
  .token {
    &.constant {
      color: rgb(255, 100, 146);
    }
  }
`;

export default class PrismCode extends Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  render() {
    return (
      <Wrapper>
        <pre data-testid="prism-code" style={CSSProperties}>
          <code className={`language-${this.props.language || "javascript"}`}>
            {this.props.code}
          </code>
        </pre>
      </Wrapper>
    );
  }
}
