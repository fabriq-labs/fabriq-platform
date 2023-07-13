// FlowListAutomation Component
import React, { useState, useEffect } from "react";
import isEqual from "react-fast-compare";
import Helmet from "react-helmet";
import { notification, Select, Result } from "antd";
import styled from "styled-components";

import { ChatAI, Template } from "../../components/Chat";
import MessageCard from "../../components/Chat/messageCard";
import { Skeleton } from "../../components/Skeleton";
import { generateTableData } from "./utils";

import ChatApi from "../../api/chat";
import QueryService from "../../api/queries";
import DataSource from "../../api/datasource";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const PageContent = styled.div`
  padding: 30px;
  background-color: #f6f8f9;
  width: 100%;
  min-height: 100%;

  &.flex-center {
    display: flex;
    justify-content: center;
  }

  .anticon-plus {
    vertical-align: unset;
  }

  .ant-result {
    padding: 0 !important;
  }
`;

const ChatRow = styled.div`
  .ant-input {
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.05) 0px 8px 32px;
  }

  .ant-input::placeholder {
    color: #000 !important;
    font-weight: 600;
  }
`;

const WidgetRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;

  .chat-template-container {
    width: 100%;
  }

  .chat-message-single-container {
    width: 100%;
    overflow: auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
      rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    margin: 20px 0;
  }

  .chat-empty-result {
    margin-top: 50px;
    width: 50%;
    border-radius: 10px;
    padding: 20px;
  }
`;

const NoResultRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  border-radius: 10px;
`;

const SingleWidget = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  margin: 20px 0;
`;

const getConfigureOptions = (options, destination_id, setDestinationId) => {
  let dataList = [];
  let i = 0;
  if (options?.length > 0) {
    options.forEach((item, index) => {
      if (item.type === "pg") {
        if (destination_id === null && i === 0) {
          setDestinationId(item.id);
          i++;
        }
        dataList.push(
          <Select.Option
            key={item.id}
            value={item.id}
            style={{ textTransform: "capitalize" }}
          >
            {item.name}
          </Select.Option>
        );
      }
    });
  }

  return dataList;
};

// Chat Page Component
const ChatPage = () => {
  const [destination_id, setDestinationId] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [buttontitle, setButtonTitle] = useState("Save As");

  useEffect(() => {
    getDestination();
  }, []);

  const getDestination = () => {
    DataSource.query()
      .then((res) => {
        if (res) {
          const options = getConfigureOptions(
            res?.data,
            destination_id,
            setDestinationId
          );
          setDestinations(options);
        }
      })
      .catch((err) => {
        notification.error({
          message: err?.message,
          placement: "topRight"
        });
      });
  };

  const handleChangeDestinations = (opt) => {
    setDestinationId(opt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);

    const params = {
      query: userInput,
      data_source_id: destination_id
    };

    // Send user question and history to API
    ChatApi.getMessage(params)
      .then((res) => {
        setTemplate((prevState) => ({
          ...prevState,
          widget_type: "table",
          data: generateTableData(res?.data?.data, res?.data?.headers),
          message: res?.data?.message,
          query: res?.data?.query,
          question: res?.data?.question
        }));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        notification.error({
          message: err?.message,
          placement: "topRight"
        });
      });
  };

  const saveQuery = (title) => {
    let saveRequest = {
      query: template?.query,
      name: title !== "" ? title : template?.question,
      data_source_id: destination_id,
      options: { parameters: [] },
      latest_query_data_id: null
    };

    setButtonTitle("Saved");

    QueryService.save(saveRequest)
      .then((res) => {
        if (res) {
          notification.success({
            message: "Query Saved",
            placement: "bottomRight"
          });
          setButtonTitle("Saved");
        }
      })
      .catch((err) => {
        console.log("err");
      });
  };

  const onChange = (val) => {
    setUserInput(val);
  };

  const onClickClear = () => {
    setUserInput("");
  };

  const handleClickClose = () => {
    setIsOpenModal(false);
  };

  const handleClickModalOpen = () => {
    setIsOpenModal(true);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <PageContent>
        <ChatRow>
          <ChatAI
            handleSubmit={handleSubmit}
            loading={loading}
            onChange={onChange}
            handleChangeDestinations={handleChangeDestinations}
            destionationOption={destinations}
            selectedDestination={destination_id}
            userInput={userInput}
            onClickClear={onClickClear}
          />
        </ChatRow>
        {loading === true ? (
          <div>
            <Skeleton />
          </div>
        ) : (
          template &&
          (template.data?.rows?.length > 1 ? (
            <WidgetRow>
              <div className="chat-template-container">
                <Template
                  template={template}
                  isOpenModal={isOpenModal}
                  handleClickClose={handleClickClose}
                  handleClickModalOpen={handleClickModalOpen}
                  saveQuery={saveQuery}
                  buttontitle={buttontitle}
                />
              </div>
            </WidgetRow>
          ) : template.data?.rows?.length === 1 ? (
            <SingleWidget>
              <div className="chat-message-single-container">
                <MessageCard messge={template?.message} />
              </div>
            </SingleWidget>
          ) : (
            <NoResultRow>
              <div className="chat-empty-result">
                {" "}
                <Result
                  title="Something Wrong, Please Try Again"
                  subTitle={template?.message}
                />
              </div>
            </NoResultRow>
          ))
        )}
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(ChatPage, isEqual);
