// Query Card
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Modal, Input, Icon } from "antd";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;

  .query-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    display: flex;
  }

  .query-label {
    display: flex;
    flex-grow: 1;
  }

  .query-icon {
    cursor: pointer;
  }

  .query-result {
    margin-top: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #737a73;
    max-height: 65%;
    overflow: auto;
  }

  .query-save-button {
    float: right;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .select-heading {
    font-size: 16px;
    font-weight: 500;
    margin-top: 15px;
  }
`;

const QueryCard = (props) => {
  const { result, saveQuery, title } = props;
  const [open, setOpen] = useState(false);
  const [queryTitle, setQuerTitle] = useState("");

  const handleOk = () => {
    saveQuery(queryTitle);
    setOpen(false);
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setQuerTitle("");
  };

  const handleChangeInput = (e) => {
    setQuerTitle(e.target.value);
  };

  return (
    <Wrapper>
      <div className="query-title">
        <div className="query-label">Query</div>
        <div onClick={showPopconfirm} title="Save Query" className="query-icon">
          <Icon type="save" style={{ fontSize: "18px" }} />
        </div>
      </div>
      <div className="query-result">
        <SyntaxHighlighter language="sql" style={coy} wrapLongLines={true}>
          {result}
        </SyntaxHighlighter>
      </div>
      <div className="query-save-button">
        {/* <Button
          type="primary"
          onClick={showPopconfirm}
          disabled={title === "Saved" ? true : false}
        >
          {title}
        </Button> */}
        <Modal
          title="Save Query"
          centered
          visible={open}
          onOk={() => handleOk()}
          onCancel={handleCancel}
        >
          <div>
            <h4 className="select-headingselect-heading">Query Title</h4>
            <div style={{ marginTop: "10px", width: "100%" }}>
              <Input
                placeholder="query title"
                size="large"
                value={queryTitle}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </Wrapper>
  );
};

export default QueryCard;
