// CheckBox Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Form, Select, Icon } from "antd";

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
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 10px;

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
const ChatAI = ({
  handleSubmit,
  loading,
  userInput,
  onChange,
  destionationOption,
  selectedDestination,
  handleChangeDestinations,
  onClickClear,
  destinationLoading,
  chat_models,
  handleChangeChatTypes,
  selectedChatModel,
  chatModelLoading
}) => {
  const handleClickClear = () => {
    if (!loading) {
      onClickClear();
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <ChatRow>
          <div className="select-wrapper-chat-model">
            <Select
              size="large"
              showArrow={false}
              style={{ height: "50px" }}
              autoFocus
              placeholder="select Chat Types"
              value={selectedChatModel}
              onChange={handleChangeChatTypes}
              loading={chatModelLoading}
            >
              {chat_models}
            </Select>
          </div>
          <div className="select-wrapper">
            <Select
              size="large"
              showArrow={false}
              style={{ height: "50px" }}
              autoFocus
              placeholder="select destinations"
              value={selectedDestination}
              onChange={handleChangeDestinations}
              loading={destinationLoading}
            >
              {destionationOption}
            </Select>
          </div>
          <div className="text-wrapper">
            <input
              placeholder="Ask your question"
              value={userInput}
              onChange={(e) => onChange(e.target.value)}
              type="text"
              style={{
                height: "50px",
                borderRadius: "10px",
                boxShadow: "none",
                width: "100%",
                padding: "0 10px",
                backgroundColor: "#ebeffa"
              }}
              disabled={selectedDestination === null || loading}
            />
            <div className="input-icon" onClick={handleClickClear}>
              <Icon type={loading === true ? "loading" : "close-circle"} />
            </div>
          </div>
        </ChatRow>
      </Form>
    </Wrapper>
  );
};

export default React.memo(ChatAI, isEqual);
