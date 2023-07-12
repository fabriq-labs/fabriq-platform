// Amazon Component
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { fileFormatList, regionList } from "../helpers/options";

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

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const SelectComp = styled.div`
  .css-1okebmr-indicatorSeparator {
    display: none;
  }

  .css-26l3qy-menu {
    z-index: 11;
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
const AmazonConnect = (props) => {
  const { item, pipeline, onMenuItem, loader } = props;
  const connection = (pipeline && pipeline.connection) || {};
  const config = (pipeline && pipeline.config) || {};
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    name: "",
    accessKey: "",
    secretAccessKey: "",
    path: "",
    region: "",
    pathPrefix: "",
    format: "",
    key_properties:
      config && config.key_properties && config.key_properties.length > 0
        ? config.key_properties[0]
        : "",
    type: "password",
    start_date: "",
    isErrorName: false,
    isErrorAccessKey: false,
    isErrorSecretKey: false,
    isErrorPath: false,
    isErrorRegion: false,
    isErrorFormat: false,
    ...connection.credentials,
    ...config
  });
  const [countNo, setCountNo] = useState(0);

  useEffect(() => {
    const configItem =
      (config &&
        config.key_properties &&
        config.key_properties.length > 0 &&
        config.key_properties[0]) ||
      "";
    setState((prevState) => ({
      ...prevState,
      key_properties: configItem
    }));
  }, []);

  let count = 0;
  const handleChange = (value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
    count += 1;
    setCountNo(count);
  };

  const handleChangeFrom = (opt) => {
    setState((prevState) => ({
      ...prevState,
      format: opt ? opt.value : ""
    }));
    count += 1;
    setCountNo(count);
  };

  const handleChangeList = (opt) => {
    setState((prevState) => ({
      ...prevState,
      region: opt ? opt.value : ""
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
    const keyList = state.key_properties ? [state.key_properties] : [];
    let data = {
      name: state.name,
      path: state.path,
      region: state.region,
      pathPrefix: state.pathPrefix,
      format: state.format,
      key_properties: keyList,
      start_date: state.start_date
    };

    const connectionData = {
      accessKey: state.accessKey,
      secretAccessKey: state.secretAccessKey
    };

    let noError = 0;
    if (validator.isEmpty(state.name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorName: true
      }));
    }

    if (validator.isEmpty(state.path)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorPath: true
      }));
    }

    if (validator.isEmpty(state.accessKey)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorAccessKey: true
      }));
    }

    if (validator.isEmpty(state.secretAccessKey)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorSecretKey: true
      }));
    }

    if (validator.isEmpty(state.region)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorRegion: true
      }));
    }

    if (validator.isEmpty(state.format)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorFormat: true
      }));
    }

    const entities = [{ title: state.name, isChecked: true }];
    if (noError === 0) {
      setState((prevState) => ({
        ...prevState,
        isErrorName: false,
        isErrorAccessKey: false,
        isErrorSecretKey: false,
        isErrorPath: false,
        isErrorRegion: false,
        isErrorFormat: false
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
      notification.warning({
        message: t("pipeline:amazon-connect.message"),
        description: t("pipeline:amazon-connect.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>File Name *</Title>
          <Input
            type="text"
            value={state.name}
            name="name"
            placeholder="Enter your csv file name here"
            isError={state.isErrorName}
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRowCol>
          <Col>
            <Title>Bucket Url *</Title>
            <Input
              type="text"
              value={state.path}
              placeholder="url start with s3://your bucket Url"
              isError={state.isErrorPath}
              name="path"
              variant="data-source"
              onChange={handleChange}
            />
            <Info>File Path start with s3://your bucket Url</Info>
          </Col>
          <Col>
            <Title>Bucket Region *</Title>
            <SelectComp>
              <Select
                value={state.region}
                options={regionList}
                onChange={handleChangeList}
              />
            </SelectComp>
          </Col>
        </FormRowCol>
        <FormRow>
          <Title>Access Key Id *</Title>
          <Input
            type="text"
            value={state.accessKey}
            name="accessKey"
            isError={state.isErrorAccessKey}
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Secret Access Key *</Title>
          <Input
            type={state.type}
            value={state.secretAccessKey}
            isError={state.isErrorSecretKey}
            name="secretAccessKey"
            variant="data-source"
            isShowRightIcon
            iconName={state.type === "password" ? "eye-invisible" : "eye"}
            onChange={handleChange}
            onClickIcon={onClickIcon}
          />
        </FormRow>
        <FormRow>
          <Title>Path Prefix</Title>
          <Input
            type="text"
            value={state.pathPrefix}
            name="pathPrefix"
            variant="data-source"
            onChange={handleChange}
          />
          <Info>
            Prefix of path at which the files to be stored. Leave blank to read
            from the root of the bucket.(ex filename.*)
          </Info>
        </FormRow>
        <FormRow>
          <Title>File Format</Title>
          <SelectComp>
            <Select
              value={state.format}
              options={fileFormatList}
              onChange={handleChangeFrom}
            />
          </SelectComp>
        </FormRow>
        <FormRow>
          <Title>Unique Key</Title>
          <Input
            type="text"
            value={state.key_properties}
            name="key_properties"
            variant="data-source"
            onChange={handleChange}
          />
          <Info>
            Unique key id in your csv file which help us to get the data.
          </Info>
        </FormRow>
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
const Amazon = (props) => {
  const { children } = props;

  return children;
};

Amazon.Connect = AmazonConnect;

Amazon.propTypes = {
  children: PropTypes.node
};

Amazon.defaultProps = {
  children: null
};

export default Amazon;
