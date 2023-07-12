// Base Configure
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import moment from "moment";
import { Modal } from "antd";
import { isArray } from "lodash";
import { notification, Divider } from "antd";
import { useTranslation } from "react-i18next";
import JSONInput from "react-json-editor-ajrm";

import { OauthService } from "./index";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

import { syncList, syncTimeList } from "../helpers/options";

import Pipeline from "../../../api/pipelines";
import Configure from "../../../api/configure";
import SchemaApi from "../../../api/elt";

const ContentInfo = styled.div`
  margin-top: 20px;

  .ant-divider-horizontal {
    margin: 12px 0;
  }
`;

const Heading = styled.div`
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 18px;
  color: #000000;
  font-weight: 600;
  line-height: 16px;
`;

const Title = styled.div`
  width: 110px;
  color: #000000;
  font-weight: 600;
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 18px;
`;

const SyncInfo = styled.div`
  margin-bottom: 6px;
`;

const SelectComp = styled.div`
  width: 300px;
  margin-bottom: 26px;

  .css-1okebmr-indicatorSeparator,
  .css-109onse-indicatorSeparator {
    display: none;
  }
`;

const Footer = styled.div`
  display: flex;
`;

const ButtonRow = styled.div`
  margin-top: 20px;
  margin-right: 30px;
`;

const BackButtonRow = styled(ButtonRow)`
  margin-right: 30px;
`;

const InputRow = styled.div`
  margin: 20px 0;
  width: 300px;
`;

const Info = styled.div`
  font-size: 11px;
  margin-left: 10px;
  color: #7a7a7a;
  font-weight: 600;
`;

const ProjectIssueRow = styled.div``;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div``;

const Content = styled.div`
  display: flex;
`;

const TextareaComp = styled.div`
  width: 485px;
  margin-top: 30px;
`;

const ReportValue = styled.div`
  border: 1px solid #cbd5e0;
`;

const GoogleAnalyticsTap = styled.div``;

const ViewIdRow = styled.div`
  width: 300px;
`;

const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainContent = styled.div`
  max-width: 50%;
  min-width: 50%;
`;

// Main Component
const BaseConfigure = (props) => {
  const {
    item,
    pipeline,
    onComplete,
    onBack,
    isCredit,
    destinationId,
    disableLeftView
  } = props;
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const [state, setState] = useState({
    content: null,
    entities: [],
    tableList: [],
    sync_from: "",
    sync_frequency: "",
    transform: false,
    destination_id: "",
    transform_url: "",
    target_schema: "",
    project_name: "",
    spreadsheet_id: "",
    spreadsheet_name: "",
    custom_domain: "",
    isSandbox: false,
    isDisabled: true,
    isEdit: false,
    isShowTargetSchema: "",
    report_json: [],
    view_id: "",
    deployLoading: false
  });
  const [countNo, setCountNo] = useState(0);
  let countno = 0;
  useEffect(() => {
    Configure.getPipelineWithId(pipeline.id, organization.fabriq_org_id)
      .then((res) => {
        const { data } = res;
        if (data && data.data && data.data.pipeline.length !== 0) {
          const pipelineData = data.data.pipeline[0];

          setState((prevState) => ({
            ...prevState,
            content: pipelineData,
            sync_from: (pipelineData && pipelineData.sync_from) || "",
            sync_frequency: (pipelineData && pipelineData.sync_frequency) || "",
            transform:
              pipelineData && pipelineData.transform === "run" ? true : false,
            transform_url: (pipelineData && pipelineData.transform_url) || "",
            isSandbox:
              (pipelineData && pipelineData.config.is_sandbox) || false,
            custom_domain:
              (pipelineData && pipelineData.config.custom_domain) || "",
            destination_id: disableLeftView
              ? destinationId
              : (pipelineData && pipelineData.destination_id) || "",
            project_name: pipelineData && pipelineData.config.project_name,
            spreadsheet_id: pipelineData && pipelineData.config.spreadsheet_id,
            spreadsheet_name:
              pipelineData && pipelineData.config.spreadsheet_name,
            target_schema: pipelineData && pipelineData.config.target_schema,
            view_id: pipelineData && pipelineData.config.view_id,
            report_json: pipelineData && pipelineData.config.reports
          }));
        }
      })
      .catch((err) => {
        Promise.resolve(err);
      });
  }, []);

  if (!state.content) {
    return null;
  }

  /* Handler Function */
  const onUpdate = (data) => {
    let count = 0;

    data.forEach((obj) => {
      if (obj.isChecked) {
        count += 1;
      }
    });

    Configure.updateEntities(pipeline.id, count, organization.fabriq_org_id);
    setState((prevState) => ({
      ...prevState,
      entities: data
    }));
    countno += 1;
    setCountNo(countno);
  };

  const handleChangeFrom = (opt) => {
    let timpStamp;
    if (opt.value === "lastonemonth") {
      const date = moment().subtract("months", 1).unix();
      timpStamp = moment.unix(date).format();
    } else if (opt.value === "lastoneweek") {
      const date = moment().subtract(7, "days").unix();
      timpStamp = moment.unix(date).format();
    } else if (opt.value === "lastoneyear") {
      const date = moment().subtract(1, "years").unix();
      timpStamp = moment.unix(date).format();
    }

    // Update sync from timestamp
    let obj = { ...content };
    let config = { ...obj.config };
    config.start_date = timpStamp;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      sync_from: opt ? opt.value : "",
      content: obj
    }));
    countno += 1;
    setCountNo(countno);
    Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const handleChangeTime = (opt) => {
    setState((prevState) => ({
      ...prevState,
      sync_frequency: opt ? opt.value : ""
    }));
    countno += 1;
    setCountNo(countno);
  };

  const handleChangeName = (val) => {
    setState((prevState) => ({
      ...prevState,
      project_name: val
    }));
    countno += 1;
    setCountNo(countno);
  };

  const handleBlur = (event) => {
    const val = event.target.value;

    let obj = { ...content };
    let config = { ...obj.config };
    config.project_name = val;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      content: obj
    }));
    Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const updateStreams = (list) => {
    let obj = { ...content };
    let config = { ...obj?.config };
    config.streams = list;
    obj.config = config;
    let count = 0;

    list.forEach((obj) => {
      if (obj?.config?.selected) {
        count += 1;
      }
    });

    setCountNo(count);

    setState((prevState) => ({
      ...prevState,
      content: obj
    }));

    Pipeline.updateConfig(
      pipeline.id,
      config,
      organization.fabriq_org_id
    ).catch((err) => {
      notification.error({
        message: "Error",
        description: err?.message
      });
    });
  };

  const handleChangeSpreadsheetId = (value) => {
    setState((prevState) => ({
      ...prevState,
      spreadsheet_id: value
    }));
    countno += 1;
    setCountNo(countno);
  };

  const handleChangeSpreadsheetName = (value) => {
    setState((prevState) => ({
      ...prevState,
      spreadsheet_name: value
    }));
    countno += 1;
    setCountNo(countno);
  };

  const onSaveSpreadsheetId = () => {
    let obj = { ...content };
    let config = { ...obj.config };
    config.spreadsheet_id = state.spreadsheet_id;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      content: obj
    }));
    Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const onSaveSpreadsheetName = () => {
    let obj = { ...content };
    let config = { ...obj.config };
    config.spreadsheet_name = state.spreadsheet_name;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      content: obj
    }));
    Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const onClickBack = () => {
    const {
      sync_from,
      sync_frequency,
      entities,
      content,
      transform,
      transform_url,
      destination_id
    } = state;
    const entitesItems = entities.length === 0 ? content.entities : entities;

    if (onBack) {
      const transformInfo = transform ? "run" : "skip";
      onBack(
        pipeline.id,
        sync_from,
        sync_frequency,
        entitesItems,
        transformInfo,
        transform_url,
        destination_id
      );
    }
  };

  const handleJsonChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      report_json: value.jsObject
    }));

    countno += 1;
    setCountNo(countno);
    let val = value.jsObject;
    let obj = { ...content };
    let config = { ...obj.config };
    config.reports = val;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      content: obj
    }));

    if (value.jsObject !== undefined) {
      Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
    }
  };

  const handleChangeViewId = (value) => {
    setState((prevState) => ({
      ...prevState,
      view_id: value
    }));
    countno += 1;
    setCountNo(countno);

    let obj = { ...content };
    let config = { ...obj.config };
    config.view_id = value;
    obj.config = config;
    setState((prevState) => ({
      ...prevState,
      content: obj
    }));
    Pipeline.updateConfig(pipeline.id, config, organization.fabriq_org_id);
  };

  const onClickComplete = () => {
    const {
      sync_from,
      sync_frequency,
      entities,
      content,
      transform,
      transform_url,
      destination_id
    } = state;
    const entitesItems = entities.length === 0 ? content.entities : entities;
    setState((prevState) => ({
      ...prevState,
      isEdit: false
    }));

    if (state.sync_from === "" || state.sync_frequency === "") {
      notification.warning({
        message: t("pipeline:base_configure.message"),
        description: t("pipeline:base_configure.description")
      });
    } else if (onComplete) {
      const transformInfo = transform ? "run" : "skip";
      onComplete(
        pipeline.id,
        sync_from,
        sync_frequency,
        entitesItems,
        transformInfo,
        transform_url,
        destination_id
      );
    }
  };

  const stateUpdate = (value) => {
    setState((prevState) => ({
      ...prevState,
      deployLoading: value
    }));
  };

  const onDeploy = () => {
    stateUpdate(true);
    SchemaApi.deploy(pipeline?.id)
      .then((res) => {
        stateUpdate(false);
        if (res?.data?.url) {
          Modal.success({
            title: "Deployed Successfully",
            content: (
              <>
                Click{" "}
                <a
                  href={`${res?.data?.url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#0000FF" }}
                >
                  here
                </a>{" "}
                go to pipeline
              </>
            ),
            okText: "Close"
          });
        } else if (res?.data?.status === "error") {
          notification.error({
            message: t("pipeline:base_configure.deployment_error"),
            description: res?.data?.message
          });
        }
      })
      .catch((err) => {
        stateUpdate(false);
        notification.warning({
          message: t("pipeline:base_configure.deployment_error"),
          description: err?.message
        });
      });
  };

  const { content } = state;

  return (
    <MainWrapper>
      <MainContent>
        <ContentInfo>
          {isArray(pipeline.entities) && pipeline.entities.length > 0 && (
            <Heading>Select the entities that need to be synced</Heading>
          )}
          <OauthService>
            <OauthService.Entities
              pipeline={content}
              onUpdate={onUpdate}
              updateStreams={updateStreams}
            />
          </OauthService>
        </ContentInfo>
        <Divider dashed />
        {item.id === 34 && (
          <>
            <GoogleAnalyticsTap>
              <ViewIdRow>
                <TitleRow>
                  <Title>View ID</Title>
                </TitleRow>
                <Input
                  type="number"
                  placeholder="Enter View ID"
                  value={state.view_id}
                  variant="data-source"
                  onChange={handleChangeViewId}
                />
              </ViewIdRow>
              <TextareaComp>
                <TitleRow>
                  <Title>Reports JSON</Title>
                </TitleRow>
                <ReportValue>
                  <JSONInput
                    id="a_unique_id"
                    height="250px"
                    theme="light_mitsuketa_tribute"
                    colors={{
                      background: "white",
                      string: "#DAA520"
                    }}
                    confirmGood={false}
                    placeholder={state.report_json ? state.report_json : []}
                    onChange={handleJsonChange}
                  />
                </ReportValue>
              </TextareaComp>
            </GoogleAnalyticsTap>
            <Divider dashed />
          </>
        )}
        {item.id === 27 && (
          <ProjectIssueRow>
            <InputRow>
              <TitleRow>
                <Title>Project Name</Title>
                <Info>(Optional)</Info>
              </TitleRow>
              <Wrapper>
                <Content>
                  <Input
                    value={state.project_name}
                    variant="data-source"
                    onBlur={handleBlur}
                    onChange={handleChangeName}
                  />
                </Content>
              </Wrapper>
            </InputRow>
            <Divider dashed />
          </ProjectIssueRow>
        )}
        {item.id === 31 && (
          <ProjectIssueRow>
            <InputRow>
              <TitleRow>
                <Title>Spreadsheet ID</Title>
              </TitleRow>
              <Input
                type="text"
                placeholder="Enter spreadsheet ID"
                value={state.spreadsheet_id}
                variant="data-source"
                onChange={handleChangeSpreadsheetId}
                onBlur={onSaveSpreadsheetId}
              />
            </InputRow>
            <InputRow>
              <TitleRow>
                <Title>Spreadsheet Name</Title>
                <Info>(Optional)</Info>
              </TitleRow>
              <Input
                type="text"
                placeholder="Enter spreadsheet name"
                value={state.spreadsheet_name}
                variant="data-source"
                onChange={handleChangeSpreadsheetName}
                onBlur={onSaveSpreadsheetName}
              />
            </InputRow>
            <Divider dashed />
          </ProjectIssueRow>
        )}
        <SyncInfo>
          <Title>Sync From</Title>
          <SelectComp>
            <Select
              value={state.sync_from}
              options={syncList}
              onChange={handleChangeFrom}
            />
          </SelectComp>
          <Title>Sync Time</Title>
          <SelectComp>
            <Select
              value={state.sync_frequency}
              options={syncTimeList}
              onChange={handleChangeTime}
            />
          </SelectComp>
        </SyncInfo>
        <Footer>
          {!isCredit && (
            <BackButtonRow>
              <Button
                title="Back"
                isDisabled={countNo !== 0 ? false : true}
                leftIcon="arrow-back"
                variant="connect-view"
                onClick={onClickBack}
              />
            </BackButtonRow>
          )}
          <ButtonRow>
            <Button
              title="Save"
              isDisabled={countNo !== 0 ? false : true}
              rightIcon="arrow-forward"
              variant="connect-view"
              onClick={onClickComplete}
            />
          </ButtonRow>
          <ButtonRow>
            <Button
              title="Deploy"
              variant="connect-view"
              isLoading={state?.deployLoading}
              isDisabled={state?.deployLoading}
              onClick={onDeploy}
            />
          </ButtonRow>
        </Footer>
      </MainContent>
    </MainWrapper>
  );
};

BaseConfigure.propTypes = {
  item: PropTypes.object,
  pipeline: PropTypes.object,
  isCredit: PropTypes.bool,
  onComplete: PropTypes.func,
  onBack: PropTypes.func
};

BaseConfigure.defaultProps = {
  item: null,
  pipeline: null,
  isCredit: false,
  onComplete: null,
  onBack: null
};

export default React.memo(BaseConfigure, isEqual);
