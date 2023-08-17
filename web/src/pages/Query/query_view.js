// QueryView Component
import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import { Button, Icon, Select, Tooltip } from "antd";
import Popover, { ArrowContainer } from "react-tiny-popover";
import { useTranslation } from "react-i18next";

import useQueryFlags from "./lib/useQueryFlag";
import useQueryDataSources from "./lib/useQueryDataSources";
import useQueryParameters from "./lib/useQueryParameters";
import useVisualizationTabHandler from "./lib/useVisualizationTabHandler";
import useQueryExecute from "./lib/useQueryExcute";
import useDeleteVisualization from "./lib/useDeleteVisualization";
import useQueryResultData from "./lib/useQueryResultData";
import useEditVisualizationDialog from "./lib/useEditVisualizationDialog";
import useRenameQuery from "./lib/useRenameQuery";
import EditInput from "./editor-components/edit_input";
import Parameters from "./parameter_component/parameters";
import useUpdateQuery from "./lib/useUpdateQuery";
import QueryVisualizationTabs from "./editor-components/QueryVisualizationTabs";
import { ExecutionStatus } from "../../api/query_result";
import QueryExecutionStatus from "./editor-components/QueryExecutionStatus";
import QueryExecutionMetadata from "./editor-components/QueryExecutionMetadata";

import { Query } from "../../api/queries";
import notification from "../../api/notification";

const Header = styled.div`
  width: 100%;
  display: flex;
  margin-right: 15px;
  background-color: #f6f8f9;
  padding-right: 15px;
  margin-right: auto;
  margin-left: auto;

  .anticon-share-alt,
  .anticon-folder,
  .anticon-edit {
    vertical-align: -0.255em !important;
  }
`;

const EditInPlace = styled.div`
  flex-grow: 1;

  .edit-in-place {
    display: flex;
    width: 400px;
    max-height: 150px;
    overflow: auto;
    padding: 15px 5px 15px 15px;

    .left-icon {
      align-self: center;
      .fa {
        cursor: pointer;
        font-size: 14px;
        margin-right: 15px;
      }
    }

    &.active {
      overflow: visible;
    }
  }
`;

const ButtonRow = styled.div`
  align-self: center;
  display: flex;

  .anticon svg {
    margin-bottom: 3px;
  }
`;

const PublishButton = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const InfoDiv = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgb(211, 211, 211);
  box-shadow: 0px 0px 20px -14px rgba(0, 0, 0, 0.75);
`;

const Label = styled.div`
  font-size: 13px;
  align-self: center;
  line-height: 16px;
  font-weight: 700;
  color: #595959;
  cursor: pointer;
  padding: 10px 20px;
`;

const LempActive = styled(Label)`
  background: #3182eb;
  color: #fff;

  .kdpLnM {
    color: #fff !important;
  }
`;

const LabelCanViewActive = styled(LempActive)``;

const LabelEditActive = styled(LempActive)``;

const LabelEdit = styled(Label)`
  margin-bottom: 0;
`;

const PageContent = styled.div`
  .ant-pagination-item-link {
    .anticon {
      vertical-align: unset !important;
    }
  }
`;

const ParameterWrapper = styled.div`
  border-radius: 3px;
  box-shadow: rgba(102, 136, 153, 0.15) 0px 4px 9px -3px;
  background-color: #ffffff !important;
  padding: 15px !important;
`;

const QueryResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  margin-top: 15px;
`;

const Desc = styled.div`
  font-size: 13px;
  align-self: center;
  line-height: 16px;
  font-weight: 700;
  color: #c5c5c5;
  margin-top: 10px;
`;

const Editable = styled.div`
  cursor: pointer;
  font-size: 16px;
  color: #323232;
  align-self: center;
  margin-right: 10px;

  .folder {
    margin: 0 5px;
  }
`;

// Main Component
const QueryView = (props) => {
  const {
    queryId,
    query_isShared,
    item,
    showQueryView,
    disableLeftView,
    folderList,
    updateQueryActiveMenu
  } = props;
  const queryobj = new Query(item);
  const { isShared } = query_isShared;
  const selectRef = useRef(null);
  const [query, setQuery] = useState(queryobj);
  const [queryFolderId, setFolderId] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [editing, setEditing] = useState(false);
  const { dataSource } = useQueryDataSources(query);
  const queryFlags = useQueryFlags(query, dataSource);
  const [parameters, areParametersDirty, updateParametersDirtyFlag] =
    useQueryParameters(query);
  const [selectedVisualization, setSelectedVisualization] =
    useVisualizationTabHandler(query.visualizations);
  const { t } = useTranslation();

  useEffect(() => {
    if (!query.is_draft && query.is_team_editable) {
      setActiveItem("canEdit");
    } else if (!query.is_draft && !query.is_team_editable) {
      setActiveItem("canView");
    } else {
      setActiveItem("private");
    }
  }, [query]);

  useEffect(() => {
    // First time alone update
    if (item?.query_folder) {
      setFolderId(item?.query_folder?.id);
    }
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        selectRef.current.blur();
        setEditing(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const {
    queryResult,
    loadedInitialResults,
    isExecuting,
    executionStatus,
    executeQuery,
    error: executionError,
    cancelCallback: cancelExecution,
    isCancelling: isExecutionCancelling,
    updatedAt
  } = useQueryExecute(query);

  const queryResultData = useQueryResultData(queryResult);
  const addVisualization = useEditVisualizationDialog(
    query,
    queryResult,
    (newQuery, visualization) => {
      setQuery(newQuery);
      setSelectedVisualization(visualization.id);
    }
  );
  const editVisualization = useEditVisualizationDialog(
    query,
    queryResult,
    (newQuery) => setQuery(newQuery)
  );
  const deleteVisualization = useDeleteVisualization(query, setQuery);
  const updateName = useRenameQuery(query, setQuery);
  const updateQuery = useUpdateQuery(query, setQuery);

  const doExecuteQuery = useCallback(
    (skipParametersDirtyFlag = false) => {
      if (
        !queryFlags.canExecute ||
        (!skipParametersDirtyFlag && (areParametersDirty || isExecuting))
      ) {
        return;
      }
      executeQuery();
    },
    [areParametersDirty, executeQuery, isExecuting, queryFlags.canExecute]
  );

  const onClickEditSource = () => {
    Query.get({ id: queryId })
      .then((res) => {
        const { data } = res;
        if (disableLeftView) {
          showQueryView("edit_query", data.id);
        } else {
          navigate(`/queries/${data.id}/source`);
        }
      })
      .catch((err) => {
        notification.error(t("query:myquerie.queryview_error"), err.message);
      });
  };

  const onClickMenu = (MenuOpen) => {
    setMenuOpen(MenuOpen);
  };

  const onClickOutside = () => {
    setMenuOpen(false);
  };

  const onRedirectBack = () => {
    navigate("/explore/queries");
  };

  const onClickShare = useCallback(
    (updateItem) => {
      if (updateItem === "private") {
        updateQuery({ is_draft: false, is_team_editable: false });
      } else if (updateItem === "canEdit") {
        updateQuery({ is_draft: false, is_team_editable: true });
      } else if (updateItem === "canView") {
        updateQuery({ is_draft: false, is_team_editable: false });
      }
      setActiveItem(updateItem);
      onClickOutside();
    },
    [query.id, updateQuery]
  );

  const startEditing = () => {
    setEditing(true);
  };

  const onChange = (value) => {
    if (value) {
      setFolderId(value);
      updateQuery({ query_folder_id: value });
      updateQueryActiveMenu(value);
    }

    setEditing(false);
  };

  const LabelComp = activeItem === "private" ? LempActive : Label;
  const LabelViewComp = activeItem === "canView" ? LabelCanViewActive : Label;
  const LabelEditComp = activeItem === "canEdit" ? LabelEditActive : LabelEdit;

  return (
    <>
      <Header>
        <EditInPlace>
          <EditInput
            isEditable={queryFlags.canEdit}
            onDone={updateName}
            ignoreBlanks
            value={query.name}
            onRedirectBack={onRedirectBack}
            disableLeftView={disableLeftView}
            isQuery
          />
        </EditInPlace>
        <ButtonRow>
          {editing ? (
            <Select
              allowClear
              ref={selectRef}
              value={queryFolderId}
              style={{ width: 240, marginRight: 5 }}
              onChange={onChange}
            >
              {folderList?.map((item) => (
                <Select.Option key={item?.id} value={item?.id}>
                  {item?.title}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <Editable
              role="presentation"
              onFocus={startEditing}
              onClick={startEditing}
            >
              <Tooltip placement="top" title={"Query Folder"}>
                <span className="folder">
                  <Icon type="folder" />{" "}
                  {folderList?.find((folder) => folder?.id === queryFolderId)
                    ?.title || "Query Folder"}
                </span>
              </Tooltip>
            </Editable>
          )}
          <Button
            className="m-r-5-refresh"
            type="primary"
            shortcut="mod+enter, alt+enter, ctrl+enter"
            disabled={
              !queryFlags.canExecute || isExecuting || areParametersDirty
            }
            onClick={doExecuteQuery}
          >
            Refresh
          </Button>
          {!isShared && (
            <Popover
              containerClassName="tiny-popup-query"
              containerStyle={{ zIndex: 11, marginTop: "-4px" }}
              isOpen={isMenuOpen}
              position={["bottom"]}
              content={(data) => (
                <ArrowContainer
                  position={data.position}
                  targetRect={data.targetRect}
                  popoverRect={data.popoverRect}
                  arrowColor="#fff"
                  arrowSize={10}
                  arrowStyle={{ opacity: 0.7 }}
                >
                  <InfoDiv>
                    <LabelComp onClick={() => onClickShare("private")}>
                      Private
                      <Desc>Only you have access</Desc>
                    </LabelComp>
                    <LabelViewComp onClick={() => onClickShare("canView")}>
                      Can View
                      <Desc>Your team can view this query</Desc>
                    </LabelViewComp>
                    <LabelEditComp onClick={() => onClickShare("canEdit")}>
                      Can Edit
                      <Desc>Your team can edit this query</Desc>
                    </LabelEditComp>
                  </InfoDiv>
                </ArrowContainer>
              )}
              onClickOutside={onClickOutside}
            >
              <PublishButton>
                <Button
                  className="m-r-5"
                  onClick={() => onClickMenu(!isMenuOpen)}
                >
                  <Icon type="share-alt" />
                  Share
                </Button>
              </PublishButton>
            </Popover>
          )}
          {(!isShared ||
            (isShared &&
              !queryFlags.isDraft &&
              queryFlags.is_team_editable)) && (
            <Button onClick={onClickEditSource}>
              <Icon type="edit" />
              <span className="m-l-5">Source</span>
            </Button>
          )}
        </ButtonRow>
      </Header>
      <PageContent>
        {query.hasParameters() && (
          <ParameterWrapper>
            <Parameters
              parameters={parameters}
              onValuesChange={() => {
                updateParametersDirtyFlag(false);
                doExecuteQuery(true);
              }}
              onPendingValuesChange={() => updateParametersDirtyFlag()}
            />
          </ParameterWrapper>
        )}
        <QueryResultWrapper>
          {loadedInitialResults && (
            <QueryVisualizationTabs
              queryResult={queryResult}
              visualizations={query.visualizations}
              showNewVisualizationButton={
                queryFlags.canEdit &&
                queryResultData.status === ExecutionStatus.DONE &&
                (!isShared ||
                  (isShared &&
                    !queryFlags.isDraft &&
                    queryFlags.is_team_editable))
              }
              canDeleteVisualizations={queryFlags.canEdit}
              selectedTab={selectedVisualization}
              onChangeTab={setSelectedVisualization}
              onAddVisualization={addVisualization}
              onDeleteVisualization={deleteVisualization}
              refreshButton={
                <Button
                  type="primary"
                  disabled={!queryFlags.canExecute || areParametersDirty}
                  loading={isExecuting}
                  onClick={doExecuteQuery}
                >
                  {!isExecuting && (
                    <i className="zmdi zmdi-refresh m-r-5" aria-hidden="true" />
                  )}
                  Refresh Now
                </Button>
              }
            />
          )}
          <div className="query-results-footer">
            {queryResult && !queryResult.getError() && (
              <QueryExecutionMetadata
                query={query}
                queryResult={queryResult}
                selectedVisualization={selectedVisualization}
                isQueryExecuting={isExecuting}
                showEditVisualizationButton={
                  queryFlags.canEdit &&
                  (!isShared ||
                    (isShared &&
                      !queryFlags.isDraft &&
                      queryFlags.is_team_editable))
                }
                onEditVisualization={editVisualization}
              />
            )}
            {(executionError || isExecuting) && (
              <div className="query-execution-status">
                <QueryExecutionStatus
                  status={executionStatus}
                  error={executionError}
                  isCancelling={isExecutionCancelling}
                  onCancel={cancelExecution}
                  updatedAt={updatedAt}
                />
              </div>
            )}
          </div>
        </QueryResultWrapper>
      </PageContent>
    </>
  );
};

QueryView.propTypes = {
  queryId: PropTypes.string
};

QueryView.defaultProps = {
  queryId: ""
};

export default React.memo(QueryView, isEqual);
