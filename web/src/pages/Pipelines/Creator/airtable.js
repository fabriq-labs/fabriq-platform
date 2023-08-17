// Airtable Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

import Connection from "../../../api/connection";
import { isEmpty } from "../../../utils/helper";

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

const WrapperDiv = styled.div`
  .anticon-close,
  .anticon-plus {
    svg {
      vertical-align: unset !important;
    }
  }
`;

const Info = styled.div`
  font-size: 11px;
  margin-top: 6px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

// Main Component
const AirtableConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));

  const [state, setState] = useState({
    display_name: "",
    api_key: "",
    type: "password",
    isErrorName: false,
    isErrorKey: false,
    ...connection.credentials,
    ...connection
  });
  const [countNo, setCountNo] = useState(0);
  const { t } = useTranslation();

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
      api_key: state.api_key
    };

    let noError = 0;
    if (isEmpty(state.display_name)) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
      noError++;
    }

    if (isEmpty(state.api_key)) {
      setState((prevState) => ({
        ...prevState,
        isErrorKey: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
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
        message: t("pipeline:airtable.message"),
        description: t("pipeline:airtable.description")
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
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorName}
          />
          <Info>This attribute is the connection identifier.</Info>
        </FormRow>
        <FormRow>
          <Title>API Key</Title>
          <Input
            type={state.type}
            value={state.api_key}
            name="api_key"
            placeholder="Enter your airtable api key"
            isError={state.isErrorKey}
            variant="data-source"
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onChange={handleChange}
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
const Airtable = (props) => {
  const { children } = props;

  return children;
};

Airtable.Connect = AirtableConnect;

Airtable.propTypes = {
  children: PropTypes.node
};

Airtable.defaultProps = {
  children: null
};

export default Airtable;
