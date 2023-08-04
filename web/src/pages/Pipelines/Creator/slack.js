// Slack Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { isEmpty } from "../../../utils/helper";

import Connection from "../../../api/connection";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormRow = styled.div`
  margin-bottom: 15px;
`;

const Content = styled.div`
  min-width: 500px;
  max-width: 500px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #7a7a7a;
  padding-bottom: 8px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const Info = styled.div`
  font-size: 11px;
  margin-top: 6px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

// Main Component
const SlackConnect = (props) => {
  const { item, pipeline, onMenuItem, loader } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    display_name: "",
    bot_user_oauth_token: "",
    type: "password",
    start_date: "",
    threads_lockback: 0,
    isErrorName: false,
    isErrorOauth: false,
    isErrorStartDate: false,
    isErrorThreads: false,
    ...connection.credentials,
    ...connection
  });
  const [countNo, setCountNo] = useState(0);

  let count = 0;
  const handleChange = (value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
    count += 1;
    setCountNo(count);
  };

  const onClickMenuItem = () => {
    const connectionData = {
      bot_user_oauth_token: state.bot_user_oauth_token,
      start_date: state.start_date,
      threads_lockback: state.threads_lockback
    };

    let noError = 0;
    if (isEmpty(state.display_name)) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
      noError++;
    }

    if (isEmpty(state.bot_user_oauth_token)) {
      setState((prevState) => ({
        ...prevState,
        isErrorOauth: true
      }));
      noError++;
    }
    if (isEmpty(state.start_date)) {
      setState((prevState) => ({
        ...prevState,
        isErrorStartDate: true
      }));
      noError++;
    }
    if (isEmpty(state.threads_lockback)) {
      setState((prevState) => ({
        ...prevState,
        isErrorThreads: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
        isErrorOauth: false
      }));

      Connection.insertConnection(
        state.display_name,
        connectionData,
        item.id,
        organization.fabriq_org_id
      ).then((res) => {
        const { data } = res;
        if (data && data.data && data.data.insert_connection.returning[0]) {
          const connectionItem = data.data.insert_connection.returning[0];
          Connection.updatePipeline(
            pipeline.id,
            connectionItem.id,
            organization.fabriq_org_id
          );

          if (onMenuItem) {
            onMenuItem(item);
          }
        }
      });
    } else {
      notification.warning({
        message: t("pipeline:slack.message"),
        description: t("pipeline:slack.description")
      });
    }
  };

  const onClickIcon = () => {
    let type = state.type;
    if (type === "text") {
      type = "password";
    } else if (type === "password") {
      type = "text";
    }

    setState((prevState) => ({
      ...prevState,
      type
    }));
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>Connection Name *</Title>
          <Input
            type="text"
            value={state.display_name}
            name="display_name"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorName}
          />
          <Info>This attribute is the connection identifier.</Info>
        </FormRow>
        <FormRow>
          <Title>User Oauth Token *</Title>
          <Input
            type={state.type}
            value={state.bot_user_oauth_token}
            name="bot_user_oauth_token"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorOauth}
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onClickIcon={onClickIcon}
          />
          <Info>User tokens represent workspace members.</Info>
        </FormRow>
        <FormRow>
          <Title>Start Date *</Title>
          <Input
            type="text"
            value={state.start_date}
            name="start_date"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorStartDate}
          />
          <Info>
            UTC date and time in the format 2017-01-25T00:00:00Z. Any data
            before this date will not be replicated.
          </Info>
        </FormRow>
        <FormRow>
          <Title>Threads Lookback window *</Title>
          <Input
            type="text"
            value={state.threads_lockback}
            name="threads_lockback"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorThreads}
          />
          <Info>How far into the past to look for messages in threads.</Info>
        </FormRow>
        <ButtonRow>
          <Button
            title="Continue"
            isDisabled={countNo !== 0 ? false : true}
            rightIcon="arrow-forward"
            variant="connect-view"
            onClick={onClickMenuItem}
            isLoading={loader}
          />
        </ButtonRow>
      </Content>
    </Wrapper>
  );
};

// Main Component
const Slack = (props) => {
  const { children } = props;

  return children;
};

Slack.Connect = SlackConnect;

Slack.propTypes = {
  children: PropTypes.node
};

Slack.defaultProps = {
  children: null
};

export default Slack;
