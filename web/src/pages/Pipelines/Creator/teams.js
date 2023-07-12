// Jira Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import { notification } from "antd";
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

const Content = styled.div`
  min-width: 402px;
  max-width: 402px;
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
const JiraConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    display_name: "",
    client_id: "",
    client_secret: "",
    tenant_id: "",
    type: "password",
    period: "",
    isTenantError: false,
    isClientError: false,
    isClientSecretError: false,
    isErrorName: false,
    isErrorPeriod: false,
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

  const onClickMenuItem = () => {
    const connectionData = {
      client_id: state.client_id,
      client_secret: state.client_secret,
      tenant_id: state.tenant_id,
      period: state.period
    };
    let noError = 0;

    if (validator.isEmpty(state.display_name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
    }

    if (validator.isEmpty(state.client_id)) {
      setState((prevState) => ({
        ...prevState,
        isClientError: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.client_secret)) {
      setState((prevState) => ({
        ...prevState,
        isClientSecretError: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.tenant_id)) {
      setState((prevState) => ({
        ...prevState,
        isTenantError: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.period)) {
      setState((prevState) => ({
        ...prevState,
        isErrorPeriod: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isClientError: false,
        isClientSecretError: false,
        isTenantError: false,
        isErrorName: false
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
        message: t("pipeline:teams.message"),
        description: t("pipeline:teams.description")
      });
    }
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
            isError={state.isErrorName}
            variant="data-source"
            onChange={handleChange}
          />
          <Info>This attribute is the connection identifier.</Info>
        </FormRow>
        <FormRow>
          <Title>Client Id *</Title>
          <Input
            type="text"
            value={state.client_id}
            isError={state.isClientError}
            name="client_id"
            placeholder="Enter your client id here"
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Client Secret *</Title>
          <Input
            type={state.type}
            value={state.client_secret}
            isError={state.isClientSecretError}
            name="client_secret"
            placeholder="Enter your client secret here"
            variant="data-source"
            onChange={handleChange}
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onClickIcon={onClickIcon}
          />
        </FormRow>
        <FormRow>
          <Title>Tenant Id *</Title>
          <Input
            type="text"
            value={state.tenant_id}
            placeholder="Enter your tenant id here"
            isError={state.isTenantError}
            name="tenant_id"
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Period *</Title>
          <Input
            type="text"
            value={state.period}
            name="period"
            isError={state.isErrorPeriod}
            variant="data-source"
            onChange={handleChange}
          />
          <Info>
            Specifies the length of time over which the Team Device Report
            stream is aggregated. The supported values are: D7, D30, D90, and
            D180.
          </Info>
        </FormRow>
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
const Teams = (props) => {
  const { children } = props;

  return children;
};

Teams.Connect = JiraConnect;

Teams.propTypes = {
  children: PropTypes.node
};

Teams.defaultProps = {
  children: null
};

export default Teams;
