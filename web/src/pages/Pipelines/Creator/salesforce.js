// Salesforce Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import cx from "classnames";
import { notification, Checkbox } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Radio } from "../../../components/Radio";
import { OauthService } from "./index";

import Pipelines from "../../../api/pipelines";
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

const FormRowCol = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`;

const Col = styled.div`
  width: 240px;
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

const TitleSettings = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #595959;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  background-color: rgba(102, 136, 153, 0.1);
  border-color: rgba(102, 136, 153, 0.15);

  .m-l-5 {
    margin-left: 5px;
  }

  &:hover {
    color: #0680ec;
  }
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const WrapperDiv = styled.div`
  .anticon-close,
  .anticon-plus {
    svg {
      vertical-align: unset !important;
    }
  }
`;

const Flex = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const AdvanceSettings = styled.div`
  border: 1px solid #d9d9d9;
  padding: 20px;
`;

// Main Component
const SalesforceConnect = (props) => {
  const { item, pipeline, onMenuItem, pipelineMenu } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const connection = (pipeline && pipeline.connection) || {};
  const config = (pipeline && pipeline.config) || {};
  const { t } = useTranslation();

  const [state, setState] = useState({
    user_name: "",
    password: "",
    security_token: "",
    start_date: "",
    isErrorName: false,
    auth_type: "oAuth",
    isErrorPassword: false,
    isErrorSecurity: false,
    advancedSettings: false,
    is_sandbox: false,
    passwordType: "password",
    securityTokenType: "password",
    domain: "",
    ...(connection && connection.credentials),
    ...(connection && connection.config),
    ...config
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

  const addAuthType = (type) => {
    setState((prevState) => ({
      ...prevState,
      auth_type: type
    }));
    let config = { ...pipeline.config };
    config.auth_type = type;
    Pipelines.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const handleAdvancedSettings = () => {
    setState((prevState) => ({
      ...prevState,
      advancedSettings: !state.advancedSettings
    }));
  };

  const handleCustomDomain = (value) => {
    setState((prevState) => ({
      ...prevState,
      domain: value
    }));
    count += 1;
    setCountNo(count);
  };

  const handleIsSnadbox = (e) => {
    setState((prevState) => ({
      ...prevState,
      is_sandbox: e.target.checked
    }));
    count += 1;
    setCountNo(count);
  };

  const onClickItem = () => {
    const data = {
      start_date: state.start_date,
      auth_type: state.auth_type
    };

    Pipelines.updateConfig(pipeline.id, data, organization.fabriq_org_id);
  };

  const onClickMenuForConfig = () => {
    const connectionData = {
      user_name: state.user_name,
      password: state.password,
      security_token: state.security_token
    };

    const configData = {
      is_sandbox: state.is_sandbox,
      domain: state.domain
    };
    const data = {
      start_date: state.start_date,
      auth_type: state.auth_type
    };

    let noError = 0;
    if (validator.isEmpty(state.user_name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
    }

    if (validator.isEmpty(state.password)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorPassword: true
      }));
    }

    if (validator.isEmpty(state.security_token)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorSecurity: true
      }));
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
        isErrorPassword: false,
        isErrorSecurity: false
      }));
      Pipelines.updateConfig(pipeline.id, data, organization.fabriq_org_id)
        .then((res) => {
          const { data } = res;
          if (data && data.data && data.data.update_pipeline.returning[0]) {
            return Connection.insertConnectionWithConfig(
              state.user_name,
              connectionData,
              item.id,
              organization.fabriq_org_id,
              configData
            );
          }
        })
        .then((result) => {
          const { data } = result;
          if (data && data.data && data.data.insert_connection.returning[0]) {
            const connectionItem = data.data.insert_connection.returning[0];
            Connection.updatePipeline(
              pipeline.id,
              connectionItem.id,
              organization.fabriq_org_id
            );

            if (onMenuItem) {
              onMenuItem(item, true);
            }
          }
        });
    } else {
      notification.warning({
        message: t("pipeline:salesforce.message"),
        description: t("pipeline:salesforce.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        {pipelineMenu === "connect" && (
          <Flex>
            <Radio
              value={"oAuth"}
              name={"authType"}
              selected={state.auth_type}
              handleChange={(name, value) => addAuthType(value)}
              label={"OAuth"}
            />
            <Radio
              value={"user"}
              name={"authType"}
              selected={state.auth_type}
              handleChange={(name, value) => addAuthType(value)}
              label={"UserName"}
            />
          </Flex>
        )}
        {state.auth_type === "user" ? (
          <>
            <FormRowCol>
              <Col>
                <Title>User Name</Title>
                <Input
                  type="text"
                  value={state.user_name}
                  name="user_name"
                  variant="data-source"
                  onChange={handleChange}
                  isError={state.isErrorName}
                />
              </Col>
              <Col>
                <Title>Password</Title>
                <Input
                  type={state.passwordType}
                  value={state.password}
                  name="password"
                  variant="data-source"
                  onChange={handleChange}
                  isError={state.isErrorPassword}
                  isShowRightIcon
                  iconName={
                    state.passwordType === "password" ? "eye-invisible" : "eye"
                  }
                  onClickIcon={() =>
                    onClickIcon("passwordType", state.passwordType)
                  }
                />
              </Col>
            </FormRowCol>
            <FormRow>
              <Title>Security Token</Title>
              <Input
                type={state.securityTokenType}
                variant="data-source"
                placeholder="your salesforce security token"
                name="security_token"
                value={state.security_token}
                onChange={handleChange}
                isError={state.isErrorSecurity}
                isShowRightIcon
                iconName={
                  state.securityTokenType === "password"
                    ? "eye-invisible"
                    : "eye"
                }
                onClickIcon={() =>
                  onClickIcon("securityTokenType", state.securityTokenType)
                }
              />
            </FormRow>
            <FormRow>
              <TitleSettings onClick={handleAdvancedSettings}>
                Advanced Settings
                <i
                  className={cx("fa m-l-5", {
                    "fa-caret-up": state.advancedSettings,
                    "fa-caret-down": !state.advancedSettings
                  })}
                />
              </TitleSettings>
            </FormRow>
            {state.advancedSettings && (
              <AdvanceSettings>
                <FormRow>
                  <Checkbox
                    checked={state.is_sandbox}
                    onChange={handleIsSnadbox}
                  >
                    Sandbox
                  </Checkbox>
                </FormRow>
                <FormRow>
                  <Title>Custom Domain</Title>
                  <Input
                    type="text"
                    placeholder="Enter Custom Domain"
                    value={state.domain}
                    variant="data-source"
                    onChange={handleCustomDomain}
                  />
                </FormRow>
              </AdvanceSettings>
            )}
            <ButtonRow>
              <Button
                title="Continue"
                isDisabled={countNo !== 0 ? false : true}
                rightIcon="arrow-forward"
                variant="connect-view"
                onClick={onClickMenuForConfig}
              />
            </ButtonRow>
          </>
        ) : (
          <OauthService>
            <OauthService.Connect
              item={item}
              isImageExist
              syncList={props.syncList}
              pipeline={pipeline}
              onUpdate={props.onUpdate}
              onClickReconnect={props.onClickReconnect}
              onMenuItem={props.onMenuItem}
              onClickItem={onClickItem}
            />
          </OauthService>
        )}
      </Content>
    </Wrapper>
  );
};

// Main Component
const Salesforce = (props) => {
  const { children } = props;

  return children;
};

Salesforce.Connect = SalesforceConnect;

Salesforce.propTypes = {
  children: PropTypes.node
};

Salesforce.defaultProps = {
  children: null
};

export default Salesforce;
