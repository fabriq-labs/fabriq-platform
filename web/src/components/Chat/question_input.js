// Question UI Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Form, Select, Icon, Radio } from "antd";

const QuestionInputWrapper = styled.div``;

const QuestionRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  justify-content: center;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;

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
      right: 15px;
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
        top: 45%;
        right: 20px;
    }
  }

  }
`;

const QuestionInput = (props) => {
  const {
    handleSubmit,
    selectedDestination,
    handleChangeDestinations,
    destinationLoading,
    isDisabled,
    destionationOption,
    userInput,
    loading,
    onChange,
    onClickClear
  } = props;

  const handleClickClear = () => {
    if (!loading) {
      onClickClear();
    }
  };

  return (
    <QuestionInputWrapper>
      <Form onSubmit={handleSubmit}>
        <QuestionRow>
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
              disabled={isDisabled}
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
          </div>{" "}
        </QuestionRow>
      </Form>
    </QuestionInputWrapper>
  );
};

export default React.memo(QuestionInput, isEqual);
