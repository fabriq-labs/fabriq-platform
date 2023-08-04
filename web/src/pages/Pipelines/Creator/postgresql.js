// PostgreSql Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification, Divider, Button as ButtomTest } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

import Pipelines from "../../../api/pipelines";
import Connection from "../../../api/connection";
import { isEmpty, isNumeric } from "../../../utils/helper";
import PipelineConnect from "../../../api/pipeline_connect";

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
const PostgreSqlConnect = (props) => {
  const { item, pipeline, onMenuItem,loader } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const config = (pipeline && pipeline.config) || {};
  const connection = (pipeline && pipeline.connection) || {};
  const { t } = useTranslation();

  const [state, setState] = useState({
    name: "",
    host: "",
    port: "",
    user: "",
    password: "",
    dbname: "",
    schema_name: "",
    type: "password",
    isErrorHost: false,
    isErrorPort: false,
    isErrorUser: false,
    isErrorPassword: false,
    isErrorMode: false,
    isErrordbName: false,
    isErrorSchema: false,
    isLoading: false,
    ...connection.credentials,
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

  const onClickMenuItem = () => {
    const connectionData = {
      host: state.host,
      port: state.port,
      user: state.user,
      password: state.password,
      dbname: state.dbname
    };

    const config_data = {
      schema_name: state.schema_name
    };

    let noError = 0;

    let isportError = false;
    let isdbnameError = false;
    let isErrorSchema = false;

    if (isEmpty(state.dbname)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrordbName: true
      }));
    } else {
      if (!/^\S{3,}$/.test(state.dbname)) {
        noError++;
        isdbnameError = true;
        notification.warning({
          message: t("pipeline:postgresql.validation_message"),
          description: t("pipeline:postgresql.name_description")
        });
      }
    }

    if (isEmpty(state.schema_name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorSchema: true
      }));
    } else {
      if (!/^\S{3,}$/.test(state.schema_name)) {
        noError++;
        isErrorSchema = true;
        notification.warning({
          message: t("pipeline:postgresql.validation_message"),
          description: t("pipeline:postgresql.name_description")
        });
      }
    }

    if (!isNumeric(state.port)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorPort: true
      }));
      isportError = true;
      notification.warning({
        message: t("pipeline:postgresql.validation_message"),
        description: t("pipeline:postgresql.port_description")
      });
    }

    if (isEmpty(state.host)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorHost: true
      }));
    }

    if (isEmpty(state.user)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorUser: true
      }));
    }

    if (isEmpty(state.password)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorPassword: true
      }));
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorHost: false,
        isErrorPort: false,
        isErrorUser: false,
        isErrorPassword: false,
        isErrorMode: false,
        isErrordbName: false,
        isErrorSchema: false
      }));
      Pipelines.updateConfig(
        pipeline.id,
        config_data,
        organization.fabriq_org_id
      )
        .then((res) => {
          const { data } = res;
          if (data && data.data && data.data.update_pipeline.returning[0]) {
            return Connection.insertConnection(
              state.name,
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
              onMenuItem(item);
            }
          }
        });
    } else {
      if (!isportError && !isdbnameError && !isErrorSchema) {
        notification.warning({
          message: t("pipeline:postgresql.file_message"),
          description: t("pipeline:postgresql.file_description")
        });
      }
    }
  };

  const onClickTestConnection = () => {
    const connectionData = {
      host: state.host,
      port: state.port,
      user: state.user,
      password: state.password,
      dbname: state.dbname
    };

    if (
      connectionData.host === "" ||
      connectionData.port === "" ||
      connectionData.user === "" ||
      connectionData.password === "" ||
      connectionData.dbname === ""
    ) {
      notification.warning({
        message: t("pipeline:postgresql.file_message"),
        description: t("pipeline:postgresql.file_description")
      });
    } else {
      setState((prevState) => ({
        ...prevState,
        isLoading: true
      }));
      return Connection.insertConnection(
        state.name,
        connectionData,
        item.id,
        organization.fabriq_org_id
      )
        .then((result) => {
          const { data } = result;
          if (data && data.data && data.data.insert_connection.returning[0]) {
            const connectionItem = data.data.insert_connection.returning[0];
            return PipelineConnect.testConnection(connectionItem.id);
          }
        })
        .then((res) => {
          const { data } = res;
          setState((prevState) => ({
            ...prevState,
            isLoading: false
          }));
          if (data.status === "error") {
            notification.error({
              message: t("pipeline:postgresql.connection_message"),
              description: data.message
            });
          } else {
            notification.success({
              message: t("pipeline:postgresql.test_success"),
              description: data.message
            });
          }
        })
        .catch((err) => {
          notification.error({
            message: t("pipeline:postgresql.connection_message"),
            description: err.message
          });
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
        <FormRowCol>
          <Col>
            <Title>Host *</Title>
            <Input
              type="text"
              value={state.host}
              name="host"
              variant="data-source"
              onChange={handleChange}
              isError={state.isErrorHost}
            />
            <Info>IP Address or the DNS name of your database server.</Info>
          </Col>
          <Col>
            <Title>Port *</Title>
            <Input
              type="text"
              value={state.port}
              name="port"
              variant="data-source"
              onChange={handleChange}
              isError={state.isErrorPort}
            />
            <Info>Port on which the database is accepting connections.</Info>
          </Col>
        </FormRowCol>
        <FormRowCol>
          <Col>
            <Title>User *</Title>
            <Input
              type="text"
              value={state.user}
              name="user"
              variant="data-source"
              onChange={handleChange}
              isError={state.isErrorUser}
            />
          </Col>
          <Col>
            <Title>Password *</Title>
            <Input
              type={state.type}
              value={state.password}
              name="password"
              variant="data-source"
              onChange={handleChange}
              isError={state.isErrorPassword}
              isShowRightIcon
              iconName={state.type === "password" ? "eye-invisible" : "eye"}
              onClickIcon={onClickIcon}
            />
          </Col>
        </FormRowCol>
        <FormRow>
          <Title>Database Name *</Title>
          <Input
            type="text"
            variant="data-source"
            name="dbname"
            isError={state.isErrordbName}
            value={state.dbname}
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Schema Name *</Title>
          <Input
            type="text"
            variant="data-source"
            name="schema_name"
            isError={state.isErrordbName}
            value={state.schema_name}
            onChange={handleChange}
          />
        </FormRow>
        <ButtonRow>
          <ButtomTest
            block
            onClick={onClickTestConnection}
            loading={state.isLoading}
          >
            Test Connection
          </ButtomTest>
        </ButtonRow>
        <Divider dashed />
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
const PostgreSql = (props) => {
  const { children } = props;

  return children;
};

PostgreSql.Connect = PostgreSqlConnect;

PostgreSql.propTypes = {
  children: PropTypes.node
};

PostgreSql.defaultProps = {
  children: null
};

export default PostgreSql;
