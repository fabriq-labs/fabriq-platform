// FlowListAutomation Component
import React, { useState, useEffect } from "react";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";
import {
  notification,
  Select,
  Result,
  Icon,
  Tabs,
  Input,
  Row,
  Checkbox
} from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { ChatAI, Template } from "../../components/Chat";
import MessageCard from "../../components/Chat/messageCard";
import { Skeleton } from "../../components/Skeleton";
import { generateTableData } from "./utils";

import ChatApi from "../../api/chat";
import QueryService from "../../api/queries";
import DataSource from "../../api/datasource";

import { updateIsQuery } from "../../actions/query";

const { TabPane } = Tabs;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .ant-checkbox-wrapper {
    float: right;
    padding: 10px;
  }
`;

const PageContent = styled.div`
  padding: 30px;
  width: 100%;
  min-height: 100%;
  display: flex;
  gap: 20px;

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

const Sidebar = styled.div`
  width: 15%;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    background-color: #f2f8f8;
    padding: 10px;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  .body-content {
    flex: 1;
    overflow-y: auto; /* Enable vertical scrolling */
    padding: 10px;
  }

  .footer {
    background-color: #f2f8f8;
    padding: 10px;
    position: sticky;
    bottom: 0;
  }

  .sidebar-new-chat {
    padding: 10px;
    display: flex;
    align-items: baseline;
    cursor: pointer;
    margin: 20px 10px 10px 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
      rgb(209, 213, 219) 0px 0px 0px 1px inset;

    .sidebar-title {
      font-size: 18px;
      font-weight: 600;
      margin: 10px 0;
      border-radius: 5px;
      margin: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .list-container {
    padding: 10px;
    display: flex;
    align-items: baseline;
    cursor: pointer;

    &:hover {
      background-color: rgb(235, 239, 250);
    }

    .list-title {
      font-size: 16px;
      line-height: 18px;
      padding: 2px 10px;
      text-transform: capitalize;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .sidebar-footer {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 115px;
  }

  .footer-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 10px;
    margin: 10px;
    background-color: #fff;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
      rgb(209, 213, 219) 0px 0px 0px 1px inset;
  }

  .switch-text {
    font-size: 16px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ResultView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ChatRow = styled.div`
  width: 100%;
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
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  margin: 20px 0;
`;

const ChatConatiner = styled.div`
  width: 85%;
  margin-left: 15%;
  margin-top: -20px;
`;

const SearchInfo = styled.div`
  margin-bottom: 20px;
  padding: 0 10px;
`;

const ExamplePrompt = styled.div`
  width: 60%;
  margin: 100px 0 0 0;
  display: flex;
  justify-content: center;
  height: 200px;
  align-items: center;

  .prompt-title {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
`;

const PromtContainer = styled.div`
  padding: 20px;
  background-color: #ebeffa;
  border-radius: 10px;
  cursor: pointer;
  margin: 20px 0;
`;

const getConfigureOptions = (options, destination_id, setDestinationId) => {
  let dataList = [];
  let i = 0;
  if (options?.length > 0) {
    options.forEach((item) => {
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

const getConfigureOptionsForTypes = (
  options,
  chatModel_id,
  setChatModel_id
) => {
  let dataList = [];
  let i = 0;
  if (options?.length > 0) {
    options.forEach((item) => {
      if (chatModel_id === null && i === 0) {
        setChatModel_id(item?.id);
        i++;
      }
      dataList.push(
        <Select.Option
          key={item?.id}
          value={item?.id}
          style={{ textTransform: "capitalize" }}
        >
          {item?.chat_model?.name}
        </Select.Option>
      );
    });
  }

  return dataList;
};

const formatOptions = (data) => {
  return data.map((item) => {
    return {
      value: item.id,
      label: item.chat_model.name
    };
  });
};

// Chat Page Component
const ChatPage = ({ id }) => {
  const [destination_id, setDestinationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [chat_models, setChatModels] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [destinationLoading, destinationSetLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [buttontitle, setButtonTitle] = useState("Save Query");
  const [chatModel_id, setChatModel_id] = useState(null);
  const [chatModelLoading, setChatModelLoading] = useState(true);
  const [chatResultList, setChatResultList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [newChatModels, setNewChatModels] = useState([]);
  const organization = JSON.parse(localStorage.getItem("organization"));

  const switchValue = useSelector((state) => state?.explore?.isQuery);
  const dispatch = useDispatch();

  useEffect(() => {
    getChartTypes();
    getDestination();
    getChatSidebarList();
    getChatResults();
  }, []);

  const getChatSidebarList = () => {
    ChatApi.getChatReslutList(organization?.fabriq_org_id)
      .then((res) => {
        if (res) {
          setChatResultList(res?.data?.data?.chat_results);
        }
      })
      .catch((err) => {
        notification.error({
          message: err?.message,
          placement: "topRight"
        });
      });
  };

  const getChatResults = () => {
    if (id) {
      let variables = {
        org_id: organization?.fabriq_org_id,
        id: id
      };
      setLoading(true);
      ChatApi.getChatResultID(variables)
        .then((res) => {
          if (res) {
            let dataItem = res?.data?.data?.chat_results?.[0];
            setTemplate((prevState) => ({
              ...prevState,
              widget_type: "table",
              data: dataItem.data,
              message: dataItem.message,
              query: dataItem.query,
              question: dataItem.question
            }));
            setChatModel_id(dataItem?.chat_model_id);
            setDestinationId(dataItem?.data_source_id);
            setIsDisabled(true);
            setChatId(dataItem?.id);
            setUserInput(dataItem?.question);
            setLoading(false);
          }
        })
        .catch((err) => {
          notification.error({
            message: err?.message,
            placement: "bottomRight"
          });
        });
    }
  };

  const getChartTypes = () => {
    ChatApi.getChatTypes()
      .then((res) => {
        const options = getConfigureOptionsForTypes(
          res?.data?.data?.org_chat_models_mapping,
          chatModel_id,
          setChatModel_id
        );
        const formatRadioOptions = formatOptions(
          res?.data?.data?.org_chat_models_mapping
        );

        setNewChatModels(formatRadioOptions);
        setChatModels(options);
        setChatModelLoading(false);
      })
      .catch((err) => {
        notification.error({
          message: err?.message,
          placement: "topRight"
        });
      });
  };

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
          destinationSetLoading(false);
        }
      })
      .catch((err) => {
        notification.error({
          message: err?.message,
          placement: "topRight"
        });
        destinationSetLoading(false);
      });
  };

  const handleChangeDestinations = (opt) => {
    setDestinationId(opt);
  };

  const handleChangeChatTypes = (e) => {
    setChatModel_id(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);

    const params = {
      query: userInput,
      data_source_id: destination_id,
      id: chatModel_id
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
          question: res?.data?.question,
          error: res?.data?.error ? true : false
        }));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setTemplate((prevState) => ({
          ...prevState,
          error: true
        }));
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

  const saveChat = () => {
    let variables = {
      chat_model_id: chatModel_id,
      data_source_id: destination_id,
      org_id: organization.fabriq_org_id,
      question: template?.question,
      message: template?.message,
      query: template?.query,
      data: template?.data
    };

    let updateVariables = {
      org_id: organization.fabriq_org_id,
      question: template?.question,
      message: template?.message,
      query: template?.query,
      data: template?.data,
      id: chatId
    };

    if (chatId !== null) {
      ChatApi.updateChatReslut(updateVariables)
        .then((res) => {
          if (res) {
            getChatSidebarList();
            notification.success({
              message: "Chat Updated",
              placement: "bottomRight"
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: err?.message,
            placement: "bottomRight"
          });
        });
    } else {
      ChatApi.insertChatResult(variables)
        .then((res) => {
          if (res) {
            getChatSidebarList();
            setIsDisabled(true);
            setChatId(res?.data?.data?.insert_chat_results?.returning?.[0]?.id);
            notification.success({
              message: "Chat Saved",
              placement: "bottomRight"
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: err?.message,
            placement: "bottomRight"
          });
        });
    }
  };

  const onChange = (val) => {
    setUserInput(val);
  };

  const onChangeKey = (val) => {
    setApiKey(val);
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

  const handleClickNewChat = () => {
    navigate("/explore");
    getChartTypes();
    getDestination();
    setTemplate(null);
    setUserInput("");
    setIsDisabled(false);
  };

  const handleClickChat = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleClickPrompt = (val) => {
    setUserInput(val);
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleClickSwitch = (e) => {
    dispatch(updateIsQuery(e.target.checked));

    if (!e.target.checked) {
      navigate("/explore");
    }
  };

  const filteredData = chatResultList?.filter((item) =>
    item?.question?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  let exapmlePromptMessge = [
    "Today top post articles with page views & users",
    "Top Authors List Today with page views & users",
    "Top Authors List Today with page views & users"
  ];

  return (
    <Wrapper>
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <Checkbox checked={switchValue} onChange={handleClickSwitch}>
        I Know SQL
      </Checkbox>
      <PageContent>
        <Sidebar>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Chat List" key="1">
              <SearchInfo>
                <Input.Search
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchInfo>
              <div className="sidebar-header">
                <div
                  className="sidebar-new-chat"
                  onClick={() => handleClickNewChat()}
                >
                  <div>
                    <Icon type="plus" style={{ fontSize: "20px" }} />
                  </div>
                  <div className="sidebar-title" title="New Question">
                    New Question
                  </div>
                </div>
              </div>
              <div className="body-content">
                <div>
                  {filteredData?.map((item) => {
                    return (
                      <div
                        className="list-container"
                        onClick={() => handleClickChat(item?.id)}
                      >
                        <div className="list-icon">
                          <Icon
                            type="message"
                            theme="filled"
                            style={{ fontSize: "20px" }}
                          />
                        </div>
                        <div className="list-title" title={item?.question}>
                          {" "}
                          {item?.question}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Sidebar>
        <ChatConatiner>
          <ResultView>
            <ChatRow>
              <ChatAI
                handleSubmit={handleSubmit}
                loading={loading}
                onChange={onChange}
                chat_models={chat_models}
                destinationLoading={destinationLoading}
                handleChangeDestinations={handleChangeDestinations}
                handleChangeChatTypes={handleChangeChatTypes}
                destionationOption={destinations}
                selectedDestination={destination_id}
                userInput={userInput}
                onClickClear={onClickClear}
                apiKey={apiKey}
                onChangeKey={onChangeKey}
                selectedChatModel={chatModel_id}
                chatModelLoading={chatModelLoading}
                isDisabled={isDisabled}
              />
            </ChatRow>
            {loading ? (
              <div>
                <Skeleton />
              </div>
            ) : template === null ? ( // Check if template is null
              // Display empty prompt
              <ExamplePrompt>
                <Row gutter={24}>
                  <div className="prompt-title">Examples</div>
                  {exapmlePromptMessge?.map((message) => (
                    <div onClick={() => handleClickPrompt(message)}>
                      <PromtContainer>{message}</PromtContainer>
                    </div>
                  ))}
                </Row>
              </ExamplePrompt>
            ) : // Display template or appropriate message based on template data
            template.data?.rows?.length > 1 ? (
              <>
                <WidgetRow>
                  <div className="chat-template-container">
                    <Template
                      template={template}
                      isOpenModal={isOpenModal}
                      handleClickClose={handleClickClose}
                      handleClickModalOpen={handleClickModalOpen}
                      saveQuery={saveQuery}
                      buttontitle={buttontitle}
                      saveChat={saveChat}
                    />
                  </div>
                </WidgetRow>
              </>
            ) : (template.data?.rows?.length === 1 ||
                template.data?.rows?.length === 0) &&
              template?.error === false ? (
              <SingleWidget>
                <div className="chat-message-single-container">
                  <MessageCard messge={template?.message} />
                </div>
              </SingleWidget>
            ) : (
              <NoResultRow>
                <div className="chat-empty-result">
                  <Result
                    title="Something Wrong, Please Try Again"
                    subTitle={template?.message}
                  />
                </div>
              </NoResultRow>
            )}
          </ResultView>
        </ChatConatiner>
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(ChatPage, isEqual);
