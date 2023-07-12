// Intercom Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import { notification } from "antd";
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

const Flex = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Info = styled.div`
  font-size: 11px;
  margin-top: 6px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

// Main Component
const InterComConnect = (props) => {
  const { item, pipeline, onMenuItem, pipelineMenu } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const connection = (pipeline && pipeline.connection) || {};
  const config = (pipeline && pipeline.config) || {};
  const { t } = useTranslation();

  const [state, setState] = useState({
    access_token: "",
    start_date: "",
    isErrorAccessToken: false,
    auth_type: "oAuth",
    isErrordate: false,
    ...(connection && connection.credentials),
    ...(connection && connection.config),
    ...config,
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

  const addAuthType = (type) => {
    setState((prevState) => ({
      ...prevState,
      auth_type: type
    }));
    let config = { ...pipeline.config };
    config.auth_type = type;
    Pipelines.updateConfig(pipeline.id, config, organization.fabriq_org_id);
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
      access_token: state.access_token,
      user_agent: "tap-intercom all@fabriq.com",
      start_date: state.start_date,
    };

    const data = {
      start_date: state.start_date,
      auth_type: state.auth_type
    };

    let noError = 0;

    if (validator.isEmpty(state.access_token)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorAccessToken: true
      }));
    }

    if (validator.isEmpty(state.start_date)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrordate: true
      }));
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorAccessToken: false
      }));
      Pipelines.updateConfig(pipeline.id, data, organization.fabriq_org_id)
        .then((res) => {
          const { data } = res;
          if (data && data.data && data.data.update_pipeline.returning[0]) {
            return Connection.insertConnection(
              state.access_token,
              connectionData,
              item.id,
              organization.fabriq_org_id
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
            <FormRow>
              <Title>Access Token *</Title>
              <Input
                variant="data-source"
                placeholder="your intercom access token"
                name="access_token"
                value={state.access_token}
                onChange={handleChange}
                isError={state.isErrorAccessToken}
              />
            </FormRow>
            <FormRow>
              <Title>Start Date *</Title>
              <Input
                type="text"
                value={state.start_date}
                name="start_date"
                variant="data-source"
                onChange={handleChange}
                isError={state.isErrordate}
              />
            <Info>UTC date and time in the format 2017-01-25T00:00:00Z. Any data before this date will not be replicated.</Info>
            </FormRow>
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
const InterCom = (props) => {
  const { children } = props;

  return children;
};

InterCom.Connect = InterComConnect;

InterCom.propTypes = {
  children: PropTypes.node
};

InterCom.defaultProps = {
  children: null
};

export default InterCom;
