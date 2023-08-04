import React from "react";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { get } from "lodash";

import { UserProfile } from "./Proptypes";
import DynamicForm from "./DynamicForm";
import { ChatModel } from "../../api/chatModel";

const Wrapper = styled.div`
  width: 312px;
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 33%;

  .profile__image {
    float: left;
    margin-right: 10px;
    border-radius: 100%;
  }

  .profile__h3 {
    margin: 8px 0 0 0;
    font-size: 23px;
    font-weight: 600;
  }

  hr {
    margin-top: 18px;
    margin-bottom: 18px;
    border: 0;
    border-top: 1px solid #eeeeee;
  }

  .profile__container {
    .well {
      .form-group:last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .profile__dl {
    dd {
      margin-bottom: 12px;
    }
  }

  .alert-invited {
    .form-control {
      cursor: text !important;
      background: #fff !important;
    }
  }

  .ant-btn {
    width: 100%;
  }

  h5 {
    font-size: 13px;
    margin-top: 9px;
    margin-bottom: 9px;
  }
`;

export default class ChatModelEdit extends React.Component {
  static propTypes = {
    chatModelInfo: UserProfile.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      chatModelInfo: this.props.chatModelInfo,
      id: this.props.id
    };
  }

  saveUser = (values, successCallback, errorCallback) => {
    let data = {
      api_key: values.api_key
    };
    ChatModel.update(this.state.id, data)
      .then((res) => {
        if (res) {
          successCallback("Saved.");
          navigate("/setup");
        }
      })
      .catch((err) => {
        errorCallback(get(err, "response.data.message", "Failed saving."));
      });
  };

  renderUserInfoForm() {
    const { chatModelInfo } = this.state;

    const formFields = [
      {
        name: "chat_model_id",
        title: "Chat Model",
        type: "select",
        initialValue: chatModelInfo?.chat_modal?.name,
        readOnly: true
      },
      {
        name: "api_key",
        title: "API Key",
        type: "text",
        initialValue: chatModelInfo.api_key,
        readOnly: false
      }
    ];

    return <DynamicForm fields={formFields} onSubmit={this.saveUser} />;
  }

  render() {
    return <Wrapper>{this.renderUserInfoForm()}</Wrapper>;
  }
}
