// SalesForce
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { notification } from "antd";
import styled from "styled-components";

import { Button } from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { Select } from "../../../components/Select";
import { orderBy, isArray } from "lodash";
import { AddTable } from "../../../components/AddTable";

import SchemaApi from "../../../api/elt";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  max-width: 550px;
  min-width: 550px;
`;

const ButtonRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 11px;
  margin-top: 20px;
  text-align: center;
`;

const SelectComp = styled.div`
  margin-top: 30px;
  margin-bottom: 15px;

  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`;

const Info = styled.div`
  font-size: 11px;
  margin-top: 6px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

const BackButtonRow = styled.div`
  margin-right: 15px;
`;

const WrapperDiv = styled.div`
  .anticon-close,
  .anticon-plus {
    svg {
      vertical-align: unset !important;
    }
  }
`;

// OauthServiceEntities Component
const OauthServiceEntities = (props) => {
  const { pipeline, updateStreams } = props;
  const [state, setState] = useState({
    entitiesSchema: [],
    dataObj: {},
    isLoad: false,
    buttonDisable: false,
    isRefresh: false
    // ...pipeline
  });
  const { t } = useTranslation();

  useEffect(() => {
    let obj = { ...state.dataObj };
    if (isArray(pipeline?.config?.streams)) {
      setState((prevState) => ({
        ...prevState,
        entitiesSchema: pipeline?.config?.streams
      }));

      obj.tableList = getObjects(pipeline?.config?.streams);
      setState((prevState) => ({
        ...prevState,
        dataObj: obj
      }));
      updateStreams(pipeline?.config?.streams);
    } else if (isArray(pipeline?.entities)) {
      setState((prevState) => ({
        ...prevState,
        entitiesSchema: pipeline?.entities
      }));
      obj.tableList = getObjects(pipeline?.entities);
      setState((prevState) => ({
        ...prevState,
        dataObj: obj
      }));
      updateStreams(pipeline?.entities);
    } else {
      let defaultEntities = true;
      getSchemaList(defaultEntities);
    }
  }, []);

  const onChange = (value, index) => {
    let { entitiesSchema } = state;
    // entitiesSchema[index].title = value;
    setState((prevState) => ({
      ...prevState,
      entitiesSchema
    }));
  };

  const getObjects = (opt) => {
    let dataList = [];
    if (opt?.length > 0) {
      opt.forEach((item) => {
        dataList.push(item?.stream?.name || item?.title);
      });
    }

    return dataList;
  };

  const UpdateDefaultEntities = (streams) => {
    state.entitiesSchema.forEach((item) => {
      const aliasName = item.title;
      const isChecked = item.isChecked;

      const stream = streams.find(
        (stream) => stream.config.aliasName === aliasName
      );
      if (stream) {
        stream.config.selected = isChecked;
      }
    });
    updateStreams(streams);
  };

  const UpdateRefreshStreams = (streams) => {
    let previousStream = pipeline?.config?.streams;
    let refreshStream = streams;
    for (const obj2 of refreshStream) {
      const existingObj = previousStream.find(
        (obj1) => obj1.title === obj2.title
      );
      if (!existingObj) {
        previousStream.push(obj2);
      }
    }
    updateStreams(previousStream);
  };

  const getSchemaList = (defaultEntities, isRefresh) => {
    let obj = { ...state.dataObj };
    const { external_mapping } = pipeline;
    setState((prevState) => ({
      ...prevState,
      isRefresh: true
    }));

    SchemaApi.getSchema(external_mapping?.elt_source_id)
      .then((res) => {
        if (res?.data?.catalog?.streams?.length > 0) {
          obj.tableList = getObjects(res?.data?.catalog?.streams);
          const streamList = res?.data?.catalog?.streams?.map((stream) => {
            stream.config.selected = false;

            return stream;
          });

          if (defaultEntities === true) {
            UpdateDefaultEntities(streamList);
          } else if (isRefresh === true) {
            UpdateRefreshStreams(streamList);
          } else {
            updateStreams(streamList);
          }

          setState((prevState) => ({
            ...prevState,
            dataObj: obj,
            isLoad: false,
            isRefresh: false
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            isLoad: false,
            isRefresh: false
          }));
        }
      })
      .catch(() => {
        notification.error({
          message: t("pipeline:salesforce.connection_message"),
          description: t("pipeline:salesforce.connection_description")
        });
        setState((prevState) => ({
          ...prevState,
          isLoad: false,
          buttonDisable: true,
          isRefresh: false
        }));
      });
  };

  const handleRereshSchema = () => {
    const isRefresh = true;
    getSchemaList(false, isRefresh);
  };

  const onAdd = () => {
    const { dataObj } = state;

    if (dataObj && !dataObj.tableList) {
      setState((prevState) => ({
        ...prevState,
        isLoad: true
      }));

      if (pipeline?.config?.streams?.length > 0) {
        let obj = { ...dataObj };
        const entitiesArr = pipeline.entities;
        const streamArr = pipeline?.config?.streams;

        const res = streamArr.filter((el) => {
          return !entitiesArr.find((element) => {
            return element?.title === el?.stream?.name;
          });
        });

        obj.tableList = getObjects(res);

        setState((prevState) => ({
          ...prevState,
          dataObj: obj,
          isLoad: false
        }));
      } else {
        if (pipeline?.source?.id !== 2) {
          getSchemaList();
        } else {
          setState((prevState) => ({
            isLoad: false
          }));
        }
      }
    }

    let { entitiesSchema } = state;
    const obj = {};
    entitiesSchema = [...entitiesSchema, obj];
    setState((prevState) => ({
      ...prevState,
      entitiesSchema
    }));
  };

  const handleConfirm = (value) => {
    let { entitiesSchema } = state;

    const selectedStreams =
      entitiesSchema.length > 0 &&
      entitiesSchema.filter((item) => item?.config?.selected);
    const aliasNames = selectedStreams.map((item) => item.config.aliasName);

    let isDuplicate =
      aliasNames.length > 0 &&
      aliasNames.some((item, idx) => {
        return item === value;
      });

    if (isDuplicate) {
      notification.warning({
        message: t("pipeline:postgresql.table_message"),
        description: t("pipeline:postgresql.table_description")
      });
    }

    const list = streamsUpdate(value, true);

    const removeEmptyObject = list;
    const filteredArray = removeEmptyObject.filter(
      (obj) => Object.keys(obj).length !== 0
    );

    setState((prevState) => ({
      ...prevState,
      entitiesSchema: filteredArray
    }));

    if (updateStreams) {
      updateStreams(list);
    }
  };

  const streamsUpdate = (value, selected) => {
    const list = pipeline?.config?.streams?.length > 0 && [
      ...pipeline?.config?.streams
    ];
    const index = list?.findIndex(
      (p) => (p?.stream?.name || p?.title) === value
    );

    if (list[index]) {
      if (list[index]?.config) list[index].config.selected = selected;
      else list[index].isChecked = selected;
    }
    return list;
  };

  const handleClose = (value, idx) => {
    const entitiesSchema = state.entitiesSchema.filter(
      (tag, index) => index !== idx
    );

    setState((prevState) => ({
      ...prevState,
      entitiesSchema
    }));

    const list = streamsUpdate(value, false);

    if (updateStreams) {
      updateStreams(list);
    }
  };

  const filteredStreams =
    isArray(state?.entitiesSchema) &&
    state?.entitiesSchema?.filter(
      (item) =>
        item?.config?.selected === true ||
        item?.isChecked ||
        Object.keys(item).length === 0
    );

  return (
    <WrapperDiv>
      <AddTable
        tags={filteredStreams}
        remove={handleClose}
        columns={(state.dataObj && state.dataObj.tableList) || []}
        inputValue={state.inputValue}
        onAdd={onAdd}
        handleConfirm={handleConfirm}
        handleChange={onChange}
        placeholder="Add Entities"
        isDisabled={state.isLoad}
        handlerefresh={handleRereshSchema}
        isRefresh={state.isRefresh}
      />
    </WrapperDiv>
  );
};

// OauthServiceConnect component
const OauthServiceConnect = (props) => {
  const [state, setState] = useState("");
  const { item, pipeline, onMenuItem, onClickReconnect, onClickItem } = props;

  const { connection } = pipeline;

  useEffect(() => {
    if (pipeline && pipeline.connection) {
      setState(
        `${pipeline.connection.display_name} - ${pipeline.connection.id}`
      );
    }
  }, [pipeline]);

  let syncList = [];
  if (pipeline && pipeline.source && pipeline.source.connections.length > 0) {
    const sortedArray = orderBy(pipeline.source.connections, ["id"], ["desc"]);
    sortedArray.forEach((list) => {
      syncList.push({
        label: `${list.display_name} - ${list.id}`,
        value: `${list.display_name} - ${list.id}`,
        id: list.id
      });
    });
  }

  /* Handler Functionn */
  const onClickMenuItem = (value) => {
    if (onMenuItem) {
      onMenuItem(item, value);

      if (item.id === 2 && onClickItem) {
        onClickItem();
      }
    }
  };

  const handleChangeFrom = (opt) => {
    setState(opt ? opt.value : "");
  };

  const title = `Selected user : ${
    (connection && connection.display_name) || state || "-"
  }`;

  const SelectInfo = SelectComp;

  return (
    <Wrapper>
      <Content>
        <SelectInfo>
          <Select
            value={state}
            options={syncList}
            onChange={handleChangeFrom}
          />
          <Info>
            Select existing connection or create new connection using connect or
            reconnect button.
          </Info>
        </SelectInfo>
        {((connection && connection.display_name) || state) && (
          <Title>{title}</Title>
        )}
        <ButtonRow>
          {((connection && connection.display_name) || state) && (
            <BackButtonRow>
              <Button
                title="Reconnect"
                rightIcon="arrow-forward"
                variant="reconnect-view"
                onClick={onClickReconnect}
              />
            </BackButtonRow>
          )}
          <Button
            title={connection || state ? "Continue" : "Connect"}
            rightIcon="arrow-forward"
            variant="connect-view"
            onClick={
              state ? () => onClickMenuItem(true) : () => onClickMenuItem(false)
            }
          />
        </ButtonRow>
      </Content>
    </Wrapper>
  );
};

// Main Component
const OauthService = (props) => {
  const { children } = props;

  return children;
};

OauthService.Connect = OauthServiceConnect;
OauthService.Entities = OauthServiceEntities;

OauthService.propTypes = {
  children: PropTypes.node
};

OauthService.defaultProps = {
  children: null
};

export default OauthService;
