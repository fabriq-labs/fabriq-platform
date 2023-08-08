// Salesmate Component
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

const ImageRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

// Main Component
const SalesmateConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    instance_name: "",
    session_token: "",
    type: "password",
    isErrorName: false,
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
      session_token: state.session_token,
      instance_name: state.instance_name
    };

    let noError = 0;
    if (isEmpty(state.instance_name)) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
      noError++;
    }

    if (isEmpty(state.session_token)) {
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
        state.instance_name,
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
        <ImageRow>
          <img src={item.image_url} alt="connect" width={50} height={50} />
        </ImageRow>
        <FormRow>
          <Title>Instance Name *</Title>
          <Input
            type="text"
            value={state.instance_name}
            name="instance_name"
            variant="data-source"
            onChange={handleChange}
            isError={state.isErrorName}
          />
        </FormRow>
        <FormRow>
          <Title>Session Token *</Title>
          <Input
            type={state.type}
            value={state.session_token}
            name="session_token"
            isError={state.isErrorKey}
            placeholder="Enter your session token"
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
const Salesmate = (props) => {
  const { children } = props;

  return children;
};

Salesmate.Connect = SalesmateConnect;

Salesmate.propTypes = {
  children: PropTypes.node
};

Salesmate.defaultProps = {
  children: null
};

export default Salesmate;
