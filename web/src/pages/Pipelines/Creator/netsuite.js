// Netsuite Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import { notification, Checkbox } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
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

const FormCol = styled.div`
  display: flex;
  flex-direction: row;
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

const TitleSandbox = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #7a7a7a;
  padding-right: 10px;
  padding-bottom: 8px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

// Main Component
const NetsuiteConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    account_id: "",
    consumer_key: "",
    consumer_secret: "",
    token_key: "",
    token_secret: "",
    is_sandbox: false,
    consumerSecretType: "password",
    tokenKeyType: "password",
    isErrorAccountId: false,
    isErrorConsumerKey: false,
    isErrorConsumerSecret: false,
    isErrorTokenKey: false,
    isErrorTokenSecret: false,
    isErrorSandbox: false,
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

  const onClickIcon = (name, value) => {
    let type = value;
    if (type === "text") {
      type = "password";
    } else if (type === "password") {
      type = "text";
    }

    setState((prevState) => ({
      ...prevState,
      [name]: type
    }));
  };

  const handleIsSnadbox = (e) => {
    setState((prevState) => ({
      ...prevState,
      is_sandbox: e.target.checked
    }));
    count += 1;
    setCountNo(count);
  };

  const onClickMenuItem = () => {
    const connectionData = {
      account_id: state.account_id,
      consumer_key: state.consumer_key,
      consumer_secret: state.consumer_secret,
      token_key: state.token_key,
      token_secret: state.token_secret,
      is_sandbox: state.is_sandbox
    };

    let noError = 0;
    if (validator.isEmpty(state.account_id)) {
      setState((prevState) => ({
        ...prevState,
        isErrorAccountId: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.consumer_key)) {
      setState((prevState) => ({
        ...prevState,
        isErrorConsumerKey: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.consumer_secret)) {
      setState((prevState) => ({
        ...prevState,
        isErrorConsumerSecret: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.token_key)) {
      setState((prevState) => ({
        ...prevState,
        isErrorTokenKey: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.token_secret)) {
      setState((prevState) => ({
        ...prevState,
        isErrorTokenSecret: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorConsumerKey: false,
        isErrorAccountId: false,
        isErrorConsumerSecret: false,
        isErrorTokenKey: false,
        isErrorTokenSecret: false
      }));

      Connection.insertConnection(
        state.account_id,
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
        message: t("pipeline:salesmate.message"),
        description: t("pipeline:salesmate.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>Account *</Title>
          <Input
            type="text"
            value={state.account_id}
            name="account_id"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorAccountId}
          />
        </FormRow>
        <FormRow>
          <Title>Consumer Key *</Title>
          <Input
            type="text"
            value={state.consumer_key}
            name="consumer_key"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorConsumerKey}
          />
        </FormRow>
        <FormRow>
          <Title>Consumer Secret *</Title>
          <Input
            type={state.consumerSecretType}
            value={state.consumer_secret}
            name="consumer_secret"
            isError={state.isErrorConsumerSecret}
            placeholder="Enter your Consumer Secret"
            variant="data-source"
            isShowRightIcon
            iconName={
              state.consumerSecretType === "password" ? "eye-invisible" : "eye"
            }
            onClickIcon={() =>
              onClickIcon("consumerSecretType", state.consumerSecretType)
            }
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Token Key *</Title>
          <Input
            type="text"
            value={state.token_key}
            name="token_key"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorTokenKey}
          />
        </FormRow>
        <FormRow>
          <Title>Token Secret *</Title>
          <Input
            type={state.tokenKeyType}
            value={state.token_secret}
            name="token_secret"
            isError={state.isErrorTokenSecret}
            placeholder="Enter your Token Secret"
            variant="data-source"
            isShowRightIcon
            iconName={
              state.tokenKeyType === "password" ? "eye-invisible" : "eye"
            }
            onClickIcon={() => onClickIcon("tokenKeyType", state.tokenKeyType)}
            onChange={handleChange}
          />
        </FormRow>
        <FormCol>
          <TitleSandbox>Sandbox</TitleSandbox>
          <Checkbox checked={state.is_sandbox} onChange={handleIsSnadbox} />
        </FormCol>
        <ButtonRow>
          <Button
            title="Continue"
            isDisabled={countNo !== 0 ? false : true}
            rightIcon="arrow-forward"
            variant="connect-view"
            onClick={onClickMenuItem}
          />
        </ButtonRow>
      </Content>
    </Wrapper>
  );
};

// Main Component
const Netsuite = (props) => {
  const { children } = props;

  return children;
};

Netsuite.Connect = NetsuiteConnect;

Netsuite.propTypes = {
  children: PropTypes.node
};

Netsuite.defaultProps = {
  children: null
};

export default Netsuite;
