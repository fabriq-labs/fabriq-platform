import React from "react";
import styled from "styled-components";

const MessageWrapper = styled.div`
  .widget-card-container {
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .message-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
  }

  .message-result {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #4e68b5;
    padding: 10px;
    max-height: 85%;
    overflow: auto;
  }
`;

const MessageCard = ({ messge }) => {
  return (
    <MessageWrapper>
      <div className="widget-card-container">
        <div className="message-result">{messge}</div>
      </div>
    </MessageWrapper>
  );
};

export default MessageCard;
