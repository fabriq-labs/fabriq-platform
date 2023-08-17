// Chat Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Radio } from "antd";

const Wrapper = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;

  .message-div {
    width: 100%;
    height: 50vh;
    background-color: #fff;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.05) 0px 8px 32px;
    border-radius: 0.5rem;
    margin-bottom: 10px;
  }

  .usermessage {
    padding: 1.5rem;
  }

  .usermessagewaiting {
    padding: 1.5rem;
    background: linear-gradient(to left, #fff, #d3d3d3, #fff);
    background-size: 200% 200%;
    background-position: -100% 0;
    animation: loading-gradient 2s ease-in-out infinite;
    animation-direction: alternate;
    animation-name: loading-gradient;
  }

  @keyframes loading-gradient {
    0% {
      background-position: -100% 0;
    }
    100% {
      background-position: 100% 0;
    }
  }

  .apimessage {
    background: #d3d3d3;
    padding: 1.5rem;
    animation: fadein 0.5s;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .apimessage,
  .usermessage,
  .usermessagewaiting {
    display: flex;
  }

  .anticon {
    align-self: center;
    margin-right: 20px;
    font-size: 20px;
  }
`;

const ChatRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  justify-content: center;

  .text-wrapper {
    width: 80%;
    position: relative;

    input {
      padding-right: 30px;
      border: 1px solid transparent;
    }

    input:focus {
      outline: none;
    }

    input:disabled {
      cursor: not-allowed;
    }

    .input-icon {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }

  .select-wrapper {
    width: 20%;
    border-radius: 10px;

    .ant-select-lg .ant-select-selection--single {
      height: 50px;
      box-shadow: none;
      border: none;
      border-radius: 10px;
      background-color: #ebeffa;
    }

    .ant-select-selection__rendered {
      line-height: 45px;
      text-transform: capitalize;
    }

    .ant-select-arrow {
      top: 40%;
      right: 0px;
    }
  }

  .select-wrapper-chat-model {
    width: 10%;
    border-radius: 10px;

    .ant-select-lg .ant-select-selection--single {
      height: 50px;
      box-shadow: none;
      border: none;
      border-radius: 10px;
      background-color: #ebeffa;
    }

    .ant-select-selection__rendered {
      line-height: 45px;
      text-transform: capitalize;
    }

    .ant-select-arrow {
      top: 40%;
      right: 0px;
    }
  }
`;

// Main Component
const NewChat = ({
  chat_models,
  handleChangeChatTypes,
  selectedChatModel,
}) => {

  return (
    <Wrapper>
        <ChatRow>
          <Radio.Group
            value={selectedChatModel}
            size="large"
            onChange={handleChangeChatTypes}
          >
            {chat_models?.map((item) => {
              return (
                <Radio.Button value={item.value}>{item.label}</Radio.Button>
              );
            })}
          </Radio.Group>
        </ChatRow>
    </Wrapper>
  );
};

export default React.memo(NewChat, isEqual);
