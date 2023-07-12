// Files Component
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import validator from "validator";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { fileFormatList, delimiterList } from "../helpers/options";

import Pipelines from "../../../api/pipelines";

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
  min-width: 402px;
  max-width: 402px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #7a7a7a;
  padding-bottom: 8px;
`;

const SelectComp = styled.div`
  .css-1okebmr-indicatorSeparator {
    display: none;
  }
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
const FilesConnect = (props) => {
  const { item, pipeline, onMenuItem } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const config = (pipeline && pipeline.config) || {};

  const [state, setState] = useState({
    name: "",
    path: "",
    pattern: "",
    format: "csv",
    worksheet_name: "",
    delimiter: ",",
    key_properties:
      config && config.key_properties && config.key_properties.length > 0
        ? config.key_properties[0]
        : "",
    start_date: "",
    isNameError: false,
    isFormatError: false,
    isErrorFileName: false,
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

  const handleChangeDelimiter = (opt) => {
    setState((prevState) => ({
      ...prevState,
      delimiter: opt ? opt.value : ""
    }));
    count += 1;
    setCountNo(count);
  };

  const onClickMenuItem = () => {
    const keyList = state.key_properties ? [state.key_properties] : [];
    let data = {
      name: state.name,
      path: state.path,
      pattern: state.pattern,
      format: state.format,
      delimiter: state.delimiter,
      key_properties: keyList,
      start_date: state.start_date
    };

    let noError = 0;
    if (validator.isEmpty(state.path)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isNameError: true
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isNameError: false
      }));
    }

    if (validator.isEmpty(state.name)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isErrorFileName: true
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isErrorFileName: false
      }));
    }

    if (validator.isEmpty(state.format)) {
      noError++;
      setState((prevState) => ({
        ...prevState,
        isFormatError: true
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isFormatError: false
      }));
    }

    if (state.format === "excel") {
      data.worksheet_name = state.worksheet_name;
    }

    const entities = [{ title: state.name, isChecked: true }];

    if (noError === 0) {
      Pipelines.updateConfigAndEntities(
        pipeline.id,
        data,
        entities,
        organization.fabriq_org_id
      ).then((res) => {
        const { data } = res;
        if (data && data.data && data.data.update_pipeline.returning[0]) {
          if (onMenuItem) {
            onMenuItem(item);
          }
        }
      });
    } else {
      notification.warning({
        message: t("pipeline:files.message"),
        description: t("pipeline:files.description")
      });
    }
  };

  return (
    <Wrapper>
      <Content>
        <FormRow>
          <Title>File Path *</Title>
          <Input
            type="text"
            value={state.path}
            isError={state.isNameError}
            placeholder="url start with gs://your bucket Url"
            name="path"
            variant="data-source"
            onChange={handleChange}
          />
          <Info>File Path start with gs://your bucket Url</Info>
        </FormRow>
        <FormRow>
          <Title>File Name *</Title>
          <Input
            type="text"
            value={state.name}
            name="name"
            isError={state.isErrorFileName}
            variant="data-source"
            onChange={handleChange}
          />
        </FormRow>
        <FormRow>
          <Title>Pattern</Title>
          <Input
            type="text"
            value={state.pattern}
            name="pattern"
            variant="data-source"
            onChange={handleChange}
          />
          <Info>
            Pattern of path at which the files to be stored. Leave blank to read
            from the root of the bucket.(ex filename.*)
          </Info>
        </FormRow>
        <FormRow>
          <Title>File Format *</Title>
          <SelectComp>
            <Select
              value={state.format}
              options={fileFormatList}
              onChange={handleChangeFrom}
            />
          </SelectComp>
        </FormRow>
        <FormRow>
          <Title>Delimiter</Title>
          <SelectComp>
            <Select
              value={state.delimiter}
              options={delimiterList}
              onChange={handleChangeDelimiter}
            />
          </SelectComp>
          <Info>
            You can specify your the delimiter that your CSVs use here.
          </Info>
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
            Unique key id in your csv file which help us to get the data
          </Info>
        </FormRow>
        {state.format === "excel" && (
          <FormRow>
            <Title>Worksheet Name</Title>
            <Input
              type="text"
              value={state.worksheet_name}
              name="worksheet_name"
              variant="data-source"
              onChange={handleChange}
            />
          </FormRow>
        )}
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
const Files = (props) => {
  const { children } = props;

  return children;
};

Files.Connect = FilesConnect;

Files.propTypes = {
  children: PropTypes.node
};

Files.defaultProps = {
  children: null
};

export default Files;
