// Main Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useTranslation } from "react-i18next";
import JSONInput from "react-json-editor-ajrm";

import { Button } from "../../../components/Button";
import Connection from "../../../api/connection";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  min-width: 500px;
  max-width: 500px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const ReportValue = styled.div`
  border: 1px solid #cbd5e0;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #7a7a7a;
  padding-bottom: 8px;
`;

const GoogleAnalyticsConnect = (props) => {
  const { item, pipeline, onMenuItem, loader } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    credentials_json: {},
    ...connection.credentials
  });
  const [countNo, setCountNo] = useState(0);

  let count = 0;

  const handleJsonChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      credentials_json: value.jsObject
    }));
    count += 1;
    setCountNo(count);
  };

  const onClickMenuItem = () => {
    const connectionData = {
      credentials_json: state.credentials_json
    };
    let noError = 0;

    if (!state.credentials_json) {
      noError++;
    }

    if (noError === 0) {
      Connection.insertConnection(
        "analytics",
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
        message: t("pipeline:googlesheets.message"),
        description: t("pipeline:googlesheets.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <Title>Credential JSON</Title>
        <ReportValue>
          <JSONInput
            id="a_unique_id"
            height="450px"
            theme="light_mitsuketa_tribute"
            colors={{
              background: "white",
              string: "#DAA520"
            }}
            confirmGood={false}
            placeholder={state.credentials_json ? state.credentials_json : {}}
            onChange={handleJsonChange}
          />
        </ReportValue>
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
const GoogleAnalytics = (props) => {
  const { children } = props;

  return children;
};

GoogleAnalytics.Connect = GoogleAnalyticsConnect;

GoogleAnalytics.propTypes = {
  children: PropTypes.node
};

GoogleAnalytics.defaultProps = {
  children: null
};

export default GoogleAnalytics;
