/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from "react";
import AceEditor from "react-ace";
import styled from "styled-components";

const Wrapper = styled.div`
  // hide ghost cursor when not focused
  .ace_hidden-cursors {
    opacity: 0;
  }

  // allow Ant Form feedback icon to hover scrollbar
  .ace_scrollbar {
    z-index: auto;
  }
`;

function AceEditorInput(props, ref) {
  return (
    <Wrapper>
      <AceEditor
        ref={ref}
        mode="sql"
        theme="textmate"
        height="100px"
        editorProps={{ $blockScrolling: Infinity }}
        showPrintMargin={false}
        {...props}
      />
    </Wrapper>
  );
}

export default forwardRef(AceEditorInput);
