// Chat Model View Component
import React, { useEffect, useState } from "react";
import { isString, get, find } from "lodash";
import isEqual from "react-fast-compare";
import { Table } from "antd";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";

import CreateChatModelDialog from "../../components/Redash/CreateChatModelDialog";
import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";

import { ChatModel } from "../../api/chatModel";
import notification from "../../api/notification";
import ChatApi from "../../api/chat";

const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
`;

const Edit = styled.div`
  cursor: pointer;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

// Main Component
const ChatModelView = () => {
  const [state, setState] = useState({
    loading: false,
    chatModelList: [],
    isload: false,
    chatModelOptions: []
  });
  const { t } = useTranslation();

  useEffect(() => {
    getChatModelList();
    getChatModelOptions();
  }, []);

  const getChatModelOptions = () => {
    ChatApi.getChatOptions()
      .then((res) => {
        if (res) {
          setState((prevState) => ({
            ...prevState,
            chatModelOptions: res?.data?.data?.chat_models
          }));
        }
      })
      .catch((err) => {
        notification.error(t("setup:site_view.site_error"), err.message);
      });
  };

  const getChatModelList = () => {
    ChatModel.get_chat_model_Data()
      .then((res) => {
        if (res) {
          setState((prevState) => ({
            ...prevState,
            chatModelList: res?.data,
            loading: false
          }));
        }
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        notification.error(t("setup:site_view.site_error"), err.message);
      });
  };

  const createChatModel = (values) =>
    ChatModel.create_chatModel(values)
      .then(() => {
        notification.success(t("setup:site_view.save_success"));
        getChatModelList();
      })
      .catch((error) => {
        const message = find(
          [
            get(error, "response.data.message"),
            get(error, "message"),
            "Failed saving."
          ],
          isString
        );
        return Promise.reject(new Error(message));
      });

  const showCreateUserDialog = () => {
    let options = state.chatModelOptions;
    let filteredOptions = options.filter((option) => {
      let optionId = option?.id;
      return !state?.chatModelList.some(
        (item) => item?.chat_modal?.id === optionId
      );
    });

    CreateChatModelDialog.showModal({ options: filteredOptions })
      .onClose((values) => {
        let requiredFields = {
          chat_model_id: values?.chat_model_id,
          api_key: values?.api_key
        };
        createChatModel(requiredFields);
      })
      .onDismiss();
  };

  if (state.loading) {
    return <Skeleton />;
  }
  const { chatModelList } = state;

  const rows = chatModelList.map((row) => ({
    key: row.id,
    id: row.chat_modal.id,
    name: row.chat_modal.name,
    type: row.chat_modal.type
  }));

  /* Handler functions */
  const editRow = (key) => {
    navigate(`/chat/${key}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "",
      dataIndex: "action",
      render: (_text, record) => (
        <Edit onClick={() => editRow(record.key)}>
          <i className="fa fa-edit" />
        </Edit>
      )
    }
  ];

  return (
    <Wrapper>
      <Heading>Chat Models</Heading>
      <UserInfo>
        <Button
          title="New Model"
          variant="alert-save"
          onClick={showCreateUserDialog}
        />
      </UserInfo>
      <Table columns={columns} dataSource={rows} rowKey={(row) => row.key} />
    </Wrapper>
  );
};

export default React.memo(ChatModelView, isEqual);
