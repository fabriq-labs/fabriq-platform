// Shopify Component
import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

import Pipelines from "../../../api/pipelines";
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

const Info = styled.div`
  font-size: 11px;
  margin-top: 6px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

// Main Component
const ShopifyConnect = (props) => {
  const { item, pipeline, onMenuItem, loader } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const config = (pipeline && pipeline.config) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    shop: "",
    api_key: "",
    type: "password",
    start_date: "",
    isErrorName: false,
    isErrorKey: false,
    isErrordate: false,
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
      shop: state.shop,
    };

    const connectionData = {
      api_key: state.api_key,
      start_date: state.start_date,
      shop: state.shop,
    };

    let noError = 0;
    if (isEmpty(state.shop)) {
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

    if (isEmpty(state.start_date)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrordate: true
      }));
    }

    const entities = [{ title: state.shop, isChecked: true }];
    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
        isErrorKey: false
      }));
      Pipelines.updateConfigAndEntities(
        pipeline.id,
        data,
        entities,
        organization.fabriq_org_id
      )
        .then((res) => {
          const { data } = res;
          if (data && data.data && data.data.update_pipeline.returning[0]) {
            return Connection.insertConnection(
              state.shop,
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
      notification.warning({
        message: t("pipeline:shopify.message"),
        description: t("pipeline:shopify.message")
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
          <Title>Shop Name *</Title>
          <Input
            type="text"
            value={state.shop}
            name="shop"
            isError={state.isErrorName}
            variant="data-source"
            onChange={handleChange}
          />
          <Info>
            Shop name is the part of the shop url going before .myshopify.com,
            e.g. for fabriq.myshopify.com the shop name is fabriq.
          </Info>
        </FormRow>
        <FormRow>
          <Title>Admin API Key *</Title>
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
          <Info>The date you would like to replicate data from. Format: YYYY-MM-DD. Any data before this date will not be replicated</Info>
        </FormRow>
        <FormRow></FormRow>
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
const Shopify = (props) => {
  const { children } = props;

  return children;
};

Shopify.Connect = ShopifyConnect;

Shopify.propTypes = {
  children: PropTypes.node
};

Shopify.defaultProps = {
  children: null
};

export default Shopify;
