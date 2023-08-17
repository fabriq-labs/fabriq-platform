// FreshDesk Component
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

const FormRowCol = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`;

const Col = styled.div`
  width: 220px;
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
const FreshDeskConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    display_name: "",
    domain: "",
    api_key: "",
    type: "password",
    isErrorName: false,
    isErrorDomain: false,
    isErrorKey: false,
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
      api_key: state.api_key,
      domain: state.domain
    };

    let noError = 0;
    if (isEmpty(state.display_name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
    }

    if (isEmpty(state.api_key)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorKey: true
      }));
    }

    if (isEmpty(state.domain)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorDomain: true
      }));
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
        isErrorDomain: false,
        isErrorKey: false
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
        message: t("pipeline:freshdesk.message"),
        description: t("pipeline:freshdesk.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>Connection Name</Title>
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
        <FormRowCol>
          <Col>
            <Title>API Key</Title>
            <Input
              type={state.type}
              value={state.api_key}
              name="api_key"
              isError={state.isErrorKey}
              variant="data-source"
              isShowRightIcon
              iconName={state.type === "password" ? "eye-invisible" : "eye"}
              onChange={handleChange}
              onClickIcon={onClickIcon}
            />
          </Col>
          <Col>
            <Title>Domain</Title>
            <Input
              type="text"
              value={state.domain}
              isError={state.isErrorDomain}
              name="domain"
              variant="data-source"
              onChange={handleChange}
            />
          </Col>
        </FormRowCol>
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
const FreshDesk = (props) => {
  const { children } = props;

  return children;
};

FreshDesk.Connect = FreshDeskConnect;

FreshDesk.propTypes = {
  children: PropTypes.node
};

FreshDesk.defaultProps = {
  children: null
};

export default FreshDesk;
