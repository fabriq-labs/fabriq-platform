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


// Main Component
const JiraConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    user_name: "",
    password: "",
    jira_domain: "",
    isUsernameError: false,
    isPasswordError: false,
    isUrlError: false,
    type: "password",
    ...connection.credentials
  });
  const [countNo, setCountNo] = useState(0);

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
      user_name: state.user_name,
      password: state.password,
      jira_domain: state.jira_domain
    };

    let noError = 0;
    if (validator.isEmpty(state.user_name)) {
      setState((prevState) => ({
        ...prevState,
        isUsernameError: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.password)) {
      setState((prevState) => ({
        ...prevState,
        isPasswordError: true
      }));
      noError++;
    }

    if (validator.isEmpty(state.jira_domain)) {
      setState((prevState) => ({
        ...prevState,
        isUrlError: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isUsernameError: false,
        isPasswordError: false,
        isUrlError: false
      }));
      Connection.insertConnection(
        state.user_name,
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
        message: t("pipeline:jira.message"),
        description: t("pipeline:jira.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>Jira Domain</Title>
          <Input
            type="text"
            value={state.jira_domain}
            isError={state.isUrlError}
            name="jira_domain"
            placeholder="your-company.atlassian.net (with the 'http' or 'https' or 'www')"
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>User Name</Title>
          <Input
            type="text"
            value={state.user_name}
            placeholder="Enter your jira user name"
            isError={state.isUsernameError}
            name="user_name"
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Password</Title>
          <Input
            type={state.type}
            value={state.password}
            name="password"
            variant="data-source"
            onChange={handleChange}
            isError={state.isPasswordError}
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onClickIcon={onClickIcon}
          />
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
const Jira = (props) => {
  const { children } = props;

  return children;
};

Jira.Connect = JiraConnect;

Jira.propTypes = {
  children: PropTypes.node
};

Jira.defaultProps = {
  children: null
};

export default Jira;
