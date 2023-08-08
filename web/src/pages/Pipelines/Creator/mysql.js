// MySql Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { isEmpty, isNumeric } from "../../../utils/helper";

import Connection from "../../../api/connection";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormRow = styled.div`
  margin-bottom: 25px;
`;

const FormRowCol = styled.div`
  margin-bottom: 25px;
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
const MySqlConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const connection = (pipeline && pipeline.connection) || {};

  const [state, setState] = useState({
    host: "",
    port: "",
    user: "",
    password: "",
    dbname: "",
    type: "password",
    isErrorHost: false,
    isErrorPort: false,
    isErrorUser: false,
    isErrorPassword: false,
    isErrordbName: false,
    ...connection.credentials
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
    const data = {
      host: state.host,
      port: state.port,
      user: state.user,
      password: state.password,
      dbname: state.dbname
    };

    let noError = 0;
    let isportError = false;
    let isdbnameError = false;
    if (isEmpty(state.host)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorHost: true
      }));
    }

    if (!isNumeric(state.port)) {
      noError++;
      isportError = true;
      setState((prevState) => ({
        ...prevState,
        isErrorPort: true
      }));
      notification.warning({
        message: t("pipeline:mysql.message"),
        description: t("pipeline:mysql.port_description")
      });
    }

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
          message: t("pipeline:mysql.message"),
          description: t("pipeline:mysql.name_description")
        });
      }
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
        isErrordbName: false
      }));
      Connection.insertConnection(
        state.dbname,
        data,
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
        } else {
          console.log(data.errors);
        }
      });
    } else {
      if (!isportError && !isdbnameError) {
        notification.warning({
          message: t("pipeline:mysql.mysql_error"),
          description: t("pipeline:mysql.mysql_description")
        });
      }
    }
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
            <Title>Port</Title>
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
            <Title>User Name</Title>
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
            <Title>Password</Title>
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
          <Title>Database Name</Title>
          <Input
            type="text"
            variant="data-source"
            name="dbname"
            value={state.dbname}
            onChange={handleChange}
            isError={state.isErrordbName}
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
const MySql = (props) => {
  const { children } = props;

  return children;
};

MySql.Connect = MySqlConnect;

MySql.propTypes = {
  children: PropTypes.node
};

MySql.defaultProps = {
  children: null
};

export default MySql;
