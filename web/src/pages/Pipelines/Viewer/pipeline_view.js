/* eslint-disable no-unreachable */
// Pipeline View Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { find, isObject } from "lodash";
import moment from "moment";
import { Table, Tooltip, Modal, Tag, Radio, Spin, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";

import EditInput from "../../Query/editor-components/edit_input";
import { Skeleton } from "../../../components/Skeleton";
import { Spinner } from "../../../components/Spinner";
import { Switch } from "../../../components/Switch";
import { Icon } from "../../../components/Icon";

import Pipelines from "../../../api/pipelines";
import PipelineConnect from "../../../api/pipeline_connect";
import notification from "../../../api/notification";
import EltService from "../../../api/elt";

import { ErrorMessage } from "../../../components/ErrorMessage";
import { QueryPage } from "../../Query";
import MyQueries from "../../../containers/my_queries";
import QueryView from "../../../containers/query_view";
import QueryEdit from "../../../containers/query_edit";

const WrapperComp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .ant-table-wrapper {
    background-color: #fdfdfd;
  }

  .ant-modal {
    width: 100%;
    padding: 30px;
  }
`;

const WrapperAutoCom = styled.div`
  .ant-table-wrapper {
    background-color: #fdfdfd;
  }

  .ant-modal {
    width: 100%;
    padding: 30px;
  }
`;

const Content = styled.div`
  padding: 16px 22px;
  background-color: #f6f8f9;
  min-height: 100%;
`;

const Title = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  padding-bottom: 14px;
`;

const Link = styled.div`
  cursor: pointer;

  &:hover {
    color: #2996f1;
    text-decoration: underline;
  }
`;

const HeadingContent = styled.div`
  margin-top: 14px;
  margin-bottom: 34px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
`;

const ColSwitch = styled.div``;

const ColInfo = styled.div``;

const SourceInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 15px;
`;

const AppInfo = styled.div`
  width: 20%;
`;

const SourceDetails = styled.div`
  display: flex;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
`;

const ImageBack = styled.img`
  width: 30px;
  height: 30px;
`;

const Connection = styled(Title)`
  font-size: 14px;
  font-weight: 400;
  padding-bottom: 6px;
  font-family: unset;
  color: rgba(0, 0, 0, 0.65);
`;

const AppTitle = styled(Title)`
  padding-top: 6px;
  padding-bottom: 0;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
`;

const ColSync = styled(ColInfo)`
  cursor: pointer;
  width: 20px;
  align-self: center;
  padding-bottom: 4px;

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
  }
`;

const IconContent = styled.div`
  cursor: pointer;
  margin-right: 20px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
`;

const TitleDiv = styled.div`
  padding: 0 15px;
  display: flex;
`;

const TitleDatasource = styled.div`
  width: 20%;
  color: #000;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
`;

const Group = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebeef0;
  color: #9ba4a8;
  width: 60px;
  padding: 4px;
  border-radius: 6px;
  margin-top: 6px;
  font-weight: 700;
  font-size: 11px;
`;

const ActionDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
`;

const ActionDivDate = styled(ActionDiv)`
  width: 97px;
`;

const ImageDiv = styled.div``;

const ImageDivBack = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  width: 3%;
`;

const AppDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
`;

const AppTitleStatus = styled(AppTitle)`
  width: 50px;
`;

const TitleDatasourceStaus = styled(TitleDatasource)`
  width: 10%;
`;

const AppInfoStatus = styled(TitleDatasourceStaus)`
  width: 10%;
`;

const EditInPlace = styled.span`
  .edit-in-place {
    display: block;
    width: 400px;
    overflow: auto;
    padding: 10px 0;

    &.active {
      overflow: visible;
    }
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9ba4a8;
  margin-bottom: 10px;
`;

const QueryContent = styled.div`
  margin-bottom: 40px;
`;

const QueryData = styled.div`
  display: flex;
  margin: 10px;
`;

const QueryRadio = styled.div`
  margin-left: 40px;
`;

const LinkRow = styled.div`
  display: flex;
`;

const LinkDetails = styled.div`
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    color: #2996f1;
    text-decoration: underline;
  }
`;

/* Other Component */
const HeaderTitleInfo = () => {
  return (
    <HeaderWrapper>
      <TitleDiv>
        <TitleDatasource>DataSource</TitleDatasource>
        <TitleDatasource>Sync Frequency</TitleDatasource>
        <TitleDatasource>Started From</TitleDatasource>
        <TitleDatasourceStaus>Status</TitleDatasourceStaus>
        <TitleDatasource />
      </TitleDiv>
    </HeaderWrapper>
  );
};

const HeaderDetails = ({
  source,
  checked,
  handleChange,
  pipeline,
  onClickSync,
  onClickConfigure,
  handleDelete,
  handleDuplicate,
  disableLeftView,
  handleData
}) => {
  const { name, image_url, id } = source;

  return (
    <SourceInfo>
      <AppInfo>
        <SourceDetails>
          <ImageDiv>
            <Image src={image_url} alt={name} />
          </ImageDiv>
          <AppDiv>
            <AppTitle>{id === 16 ? "GCS" : name}</AppTitle>
            <Group>{pipeline.is_receipe ? "Receipe" : "Custom"}</Group>
          </AppDiv>
        </SourceDetails>
      </AppInfo>
      <AppInfo>
        <ActionDiv>
          {" "}
          <Connection>Daily - &nbsp; </Connection>
          <Tooltip title="Run now" placement="bottom">
            <ColSync
              className={pipeline?.external_mapping?.elt_connection_id ? "" : "disabled"}
              onClick={onClickSync}
            >
              <Icon fill="#000" width={20} height={20} name="sync" />
            </ColSync>
          </Tooltip>
        </ActionDiv>
      </AppInfo>
      <AppInfo>
        <ActionDivDate>
          <Connection>
            {moment(pipeline.created_at).format("DD-MM-YYYY")}
          </Connection>
        </ActionDivDate>
      </AppInfo>
      <AppInfoStatus>
        <ColSwitch>
          <Switch
            isChecked={checked}
            color="green"
            onChange={handleChange}
          />
          <AppTitleStatus>{checked ? "Active" : "Pause"}</AppTitleStatus>
        </ColSwitch>
      </AppInfoStatus>
      <AppInfo>
        <ActionDiv>
          <Tooltip title="Configure" placement="bottom">
            <IconContent onClick={onClickConfigure}>
              <Icon fill="#000" width={20} height={20} name="settings" />
            </IconContent>
          </Tooltip>
          <Tooltip title="Delete" placement="bottom">
            <IconContent onClick={handleDelete}>
              <Icon fill="#000" width={20} height={18} name="delete" />
            </IconContent>
          </Tooltip>
          <Tooltip title="Duplicate" placement="bottom">
            <IconContent onClick={handleDuplicate}>
              <Icon fill="#000" width={20} height={18} name="duplicate" />
            </IconContent>
          </Tooltip>
          {disableLeftView && (
            <Tooltip title="Data" placement="bottom">
              <IconContent onClick={handleData}>
                <Icon fill="#000" width={20} height={18} name="data" />
              </IconContent>
            </Tooltip>
          )}
        </ActionDiv>
      </AppInfo>
    </SourceInfo>
  );
};

// Main Component
const PipelineView = (props) => {
  const {
    pipelineId,
    updatePipelineMenu,
    disableLeftView,
    dataSourceId,
    OnClickAutomationConfigure,
    isData,
    onClickDataOpen,
    updateBreadCrumbName
  } = props;
  const [pipeline, setPipelines] = useState({});
  const [pipelineLog, setPipelineLog] = useState([]);
  const [item, setItem] = useState([]);
  const [isShowSpinner, setShowSpinner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState("");
  const organization = JSON.parse(localStorage.getItem("organization"));
  const [activeQueryMenu, showQuery] = useState("query_list");
  const [categoryAll, setCategoryAll] = useState(false);
  const view_Details = localStorage.getItem("view_details");
  const [queryId, setQueryId] = useState(null);

  const [statusLoader, setStatusLoader] = useState(false);
  const [loaderTip, setLoaderTip] = useState("");

  const { t } = useTranslation();

  const source = (pipeline && pipeline.source) || {};
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    updateDefaultState();
  }, []);

  const updateDefaultState = () => {
    if (view_Details === "true") {
      setCategoryAll(true);
    }

    // Get Pipeline
    Pipelines.getPipelineWithId(pipelineId, organization.fabriq_org_id)
      .then((result) => {
        const { data } = result;

        if (data?.data?.pipeline?.length > 0) {
          const pipeline = data.data.pipeline[0];
          setPipelines(pipeline);
          setChecked(pipeline.status);
          setPipelineName(pipeline.name);

          if (pipeline?.external_mapping?.elt_connection_id) {
            return EltService.get_jobs(pipeline);
          }
        }
      })
      .then((res) => {
        if (res?.data?.jobs?.length > 0) {
          setPipelineLog(res?.data?.jobs);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  /* Handler Function */
  const handleChange = (isEnable) => {
    setChecked(isEnable);
    Pipelines.updateStatus(pipelineId, isEnable, organization.fabriq_org_id);
  };

  const updateName = (name) => {
    setPipelineName(name);
    Pipelines.updateName(pipelineId, name, organization.fabriq_org_id);
    if (disableLeftView) {
      updateBreadCrumbName(name);
    }
  };

  const handleDelete = () => {
    const doDelete = () => {
      Pipelines.updateDelete(pipelineId, organization.fabriq_org_id)
        .then(() => {
          navigate("/connect");
        })
        .catch(() => {});
    };

    Modal.confirm({
      title: "Delete Pipeline",
      content: "Are you sure you want to delete this pipeline?",
      okText: "Delete",
      okType: "danger",
      onOk: doDelete,
      maskClosable: true,
      autoFocusButton: null
    });
  };

  const handleDuplicate = () => {
    Pipelines.duplicateInsertPipeline(
      `${pipelineName} - copy`,
      pipeline.description,
      pipeline.source.id,
      pipeline.entities,
      organization.fabriq_org_id,
      organization.fabriq_user_id,
      pipeline.destination_id,
      pipeline.entities_count,
      pipeline.status,
      pipeline.is_receipe,
      pipeline.tenant_id,
      pipeline.transform,
      pipeline.transform_url,
      pipeline.sync_frequency,
      pipeline.sync_from,
      pipeline.connection_id,
      pipeline.config
    )
      .then((res) => {
        const { data } = res;
        if (
          data &&
          data.data &&
          data.data.insert_pipeline &&
          data.data.insert_pipeline.returning[0]
        ) {
          const item = data.data.insert_pipeline.returning[0];
          navigate(`/pipelines/${item.id}/view`);
        }
      })
      .catch((e) => {
        setError(e);
      });
  };

  if (Error) {
    return <ErrorMessage error={Error} />;
  }

  const onClickConfigure = () => {
    if (!disableLeftView) {
      navigate(`/pipelines/${pipeline.id}/edit`);
      updatePipelineMenu("configure");
    } else {
      OnClickAutomationConfigure(pipeline.id, pipeline.name);
      updatePipelineMenu("configure");
    }
  };

  const getLogInfo = () => {
    return EltService.get_jobs(pipeline)
      .then((res) => {
        if (res?.data?.jobs?.length > 0) {
          setPipelineLog(res?.data?.jobs);
        }
      })
      .catch((err) =>
        notification.error(t("viewer:pipeline_view.sync_error"), err.message)
      );
  };

  function timeRange(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchDataFromJob = (data) => {
    return EltService.get_job_info(pipeline?.id, data?.job?.id).then((res) => {
      const { data } = res;
      if (data.job.status !== "succeeded") {
        if (setLoaderTip) {
          setLoaderTip(data?.job?.status);
        }
        return timeRange(3000).then(() => fetchDataFromJob(data));
      } else if (data.job.status === "succeeded") {
        setStatusLoader(false);
        getLogInfo();
        return data;
      } else {
        setStatusLoader(false);
        return Promise.reject(new Error(data.job.error));
      }
    });
  };

  const onClickSync = () => {
    EltService.trigger_sync(pipeline?.id)
      .then((res) => {
        const { data } = res;
        if (data?.job) {
          setStatusLoader(true);
          notification.success(t("viewer:pipeline_view.sync_started"));
          return fetchDataFromJob(data, setLoaderTip);
        }
      })
      .catch((err) => {
        if (err) {
          setStatusLoader(false);
          notification.error(
            t("viewer:pipeline_view.onClicksync_error"),
            err.message
          );
          return Promise.resolve(err);
        }
      });
  };

  const goBackConnect = () => {
    navigate("/connect");
  };

  if (Loading) {
    return <Skeleton />;
  }

  const handleStatusTag = (record) => {
    let color = "";
    if (record === "succeeded") {
      color = "green";
    } else if (record === "error") {
      color = "volcano";
    } else if (record === "started") {
      color = "geekblue";
    }

    return <Tag color={color}>{record}</Tag>;
  };

  const columns = [
    {
      title: "Activity",
      dataIndex: "activity_name",
      key: "activity_name"
    },
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "No of rows processed",
      dataIndex: "target_count",
      key: "target_count"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_text, record) => handleStatusTag(record.status)
    },
    {
      title: "Logs",
      dataIndex: "action",
      render: (_text, record) => (
        <LinkRow>
          <Link onClick={() => viewLog(record.key)}>View</Link>
          {categoryAll && (
            <LinkDetails onClick={() => viewAllLog(record.key)}>
              Details
            </LinkDetails>
          )}
        </LinkRow>
      )
    }
  ];

  const viewAllLog = (key) => {
    setVisible(true);
    setShowSpinner(true);
    const item = find(pipelineLog, (opt) => opt.id === key) || null;
    const data = {
      pipeline_id: pipelineId,
      job_id: item.job_id,
      category: "all"
    };

    if (item.started_at === null && item.completed_at === null) {
      data.date_range = null;
    } else {
      data.date_range = {
        started_at: item.started_at,
        completed_at: item.completed_at
      };
    }
    PipelineConnect.pipelineLog(data)
      .then((res) => {
        const { data } = res;
        if ("job" in data) {
          return PipelineConnect.fetchDataFromJob(data);
        }

        return data.result ? data.result : Promise.reject();
      })
      .then((result) => {
        if (result) {
          const { cloud_logs } = result;
          setShowSpinner(false);
          if (cloud_logs.length > 0) {
            setItem(cloud_logs);
          }
        }
      })
      .catch((err) => {
        notification.error(
          t("viewer:pipeline_view.viewlog_error"),
          err.message
        );
      });
  };

  const viewLog = (key) => {
    setVisible(true);
    setShowSpinner(true);

    EltService.get_job_info(pipeline?.id, key)
      .then((res) => {
        const result = res?.data?.attempts[0];
        if (result) {
          setShowSpinner(false);
          setItem(result?.logs?.logLines);
        }
      })
      .catch((err) => {
        setShowSpinner(false);
        notification.error(
          t("viewer:pipeline_view.viewlog_error"),
          err.message
        );
      });
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onOrderChange = (value) => {
    showQuery(value);
  };

  const showCreateQuery = (name, id) => {
    showQuery(name);
    if (id) {
      setQueryId(id);
    }
  };

  const handleData = () => {
    onClickDataOpen(true);
  };

  const goBackView = () => {
    onClickDataOpen(false);
  };

  const rows =
    pipelineLog.length > 0 &&
    pipelineLog?.map((row) => ({
      key: row.job?.id,
      activity_name: "sync",
      created_at: moment
        .unix(row?.job?.createdAt)
        .format("DD MMM YYYY hh:mm a"),
      status: row.job.status,
      target_count: row?.attempts[0]?.recordsSynced
    }));

  const Wrapper = disableLeftView ? WrapperAutoCom : WrapperComp;

  return (
    <Wrapper>
      {!isData ? (
        <>
          {!disableLeftView && (
            <Helmet>
              {/* <title>{pipelineName} | Connect | Fabriq</title> */}
              <title>{pipelineName} | Connect</title>
            </Helmet>
          )}
          <Content>
            {!disableLeftView && (
              <ImageDivBack onClick={goBackConnect}>
                <ImageBack src="/images/back.png" alt={"back"} />
              </ImageDivBack>
            )}
            <EditInPlace>
              <EditInput
                onDone={updateName}
                ignoreBlanks
                value={pipelineName}
              />
            </EditInPlace>
            <HeadingContent>
              <HeaderTitleInfo />
              <HeaderDetails
                source={source}
                pipeline={pipeline}
                checked={checked}
                handleChange={handleChange}
                onClickSync={onClickSync}
                onClickConfigure={onClickConfigure}
                handleDelete={handleDelete}
                handleDuplicate={handleDuplicate}
                handleData={handleData}
                disableLeftView={disableLeftView}
              />
            </HeadingContent>
            {statusLoader && (
              <Row>
                <Col align="center">
                  <Spin size="large" tip={loaderTip} />
                </Col>
              </Row>
            )}
            {!statusLoader && (
              <>
                <Title>Activity Log</Title>

                <Table
                  columns={columns}
                  dataSource={rows}
                  rowKey={(row) => row.key}
                />
              </>
            )}
          </Content>
          <Modal
            title={`LogInfo Details`}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={"100%"}
            style={{ padding: "40px" }}
          >
            {isShowSpinner ? (
              <>
                <Center>Preparing log information</Center>
                <Spinner />
              </>
            ) : item && item.length > 0 ? (
              item.map(
                (log, index) =>
                  !isObject(log) && <div key={`${index + 1}`}>{log}</div>
              )
            ) : (
              "No Data"
            )}
          </Modal>
        </>
      ) : (
        <>
          <QueryData>
            <ImageDivBack onClick={goBackView}>
              <ImageBack src="/images/back.png" alt={"back"} />
            </ImageDivBack>
          </QueryData>
          <QueryRadio>
            <Radio.Group
              defaultValue={activeQueryMenu}
              size="small"
              onChange={(e) => onOrderChange(e.target.value)}
            >
              <Radio.Button value="query_list">Query List</Radio.Button>
              <Radio.Button value="create_query">Scratchpad</Radio.Button>
            </Radio.Group>
          </QueryRadio>
          {activeQueryMenu === "create_query" && (
            <QueryContent>
              <QueryPage
                dataSourceId={dataSourceId}
                disableLeftView={disableLeftView}
              />
            </QueryContent>
          )}
          {activeQueryMenu === "query_list" && (
            <MyQueries
              disableLeftView={disableLeftView}
              showQueryView={showCreateQuery}
            />
          )}
          {activeQueryMenu === "view_query" && (
            <QueryView
              disableLeftView={disableLeftView}
              queryId={queryId}
              showQueryView={showCreateQuery}
            />
          )}
          {activeQueryMenu === "edit_query" && (
            <QueryEdit disableLeftView={disableLeftView} />
          )}
        </>
      )}
    </Wrapper>
  );
};

PipelineView.propTypes = {
  pipelineId: PropTypes.string
};

PipelineView.defaultProps = {
  pipelineId: ""
};

export default React.memo(PipelineView, isEqual);
