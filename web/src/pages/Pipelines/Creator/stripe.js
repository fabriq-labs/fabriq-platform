// Stripe Component
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

// Main Component
const StripeConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    display_name: "",
    account_id: "",
    client_secret: "",
    type: "password",
    isErrorAccount: false,
    isErrorClient: false,
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
      account_id: state.account_id,
      client_secret: state.client_secret
    };

    let noError = 0;
    if (isEmpty(state.account_id)) {
      setState((prevState) => ({
        ...prevState,
        isErrorAccount: true
      }));
      noError++;
    }

    if (isEmpty(state.client_secret)) {
      setState((prevState) => ({
        ...prevState,
        isErrorClient: true
      }));
      noError++;
    }

    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorAccount: false,
        isErrorClient: false
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
        message: t("pipeline:stripe.message"),
        description: t("pipeline:stripe.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>Account ID *</Title>
          <Input
            type="text"
            value={state.account_id}
            name="account_id"
            placeholder="Enter your stripe account id"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorAccount}
          />
        </FormRow>
        <FormRow>
          <Title>Client Secret *</Title>
          <Input
            type={state.type}
            value={state.client_secret}
            name="client_secret"
            placeholder="Enter stripe client_secret id"
            variant="data-source"
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onChange={handleChange}
            onClickIcon={onClickIcon}
            isError={state.isErrorClient}
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
const Stripe = (props) => {
  const { children } = props;

  return children;
};

Stripe.Connect = StripeConnect;

Stripe.propTypes = {
  children: PropTypes.node
};

Stripe.defaultProps = {
  children: null
};

export default Stripe;
