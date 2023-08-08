/* eslint-disable react-hooks/exhaustive-deps */
// Query Component
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";
import { Button, Input, Select, Tooltip, Icon } from "antd";
import { map, extend, isEmpty } from "lodash";
import { useDebouncedCallback } from "use-debounce";
import Helmet from "react-helmet";

import { Query } from "../../api/queries";
import { getEditorComponents } from "./editor-components";
import { ErrorMessage } from "../../components/ErrorMessage";
import QueryEditor from "./query_editor/query_editor";
import useQuery from "./lib/useQuery";
import useAddNewParameterDialog from "./helpers/addparameter_dialog";
import useFormatQuery from "./helpers/formate_query";
import useQueryFlags from "./lib/useQueryFlag";
import QueryVisualizationTabs from "./editor-components/QueryVisualizationTabs";
import useVisualizationTabHandler from "./lib/useVisualizationTabHandler";
import useAddVisualizationDialog from "./lib/useAddVisualizationDialog";
import useDeleteVisualization from "./lib/useDeleteVisualization";
import useQueryResultData from "./lib/useQueryResultData";
import useQueryExecute from "./lib/useQueryExcute";
import useQueryParameters from "./lib/useQueryParameters";
import useEditVisualizationDialog from "./lib/useEditVisualizationDialog";
import useQueryDataSources from "./lib/useQueryDataSources";
import useUpdateQuery from "./lib/useUpdateQuery";
import QueryExecutionStatus from "./editor-components/QueryExecutionStatus";
import QueryExecutionMetadata from "./editor-components/QueryExecutionMetadata";
import Parameters from "./parameter_component/parameters";
import useRenameQuery from "./lib/useRenameQuery";
import EditInput from "./editor-components/edit_input";
import useAutocompleteFlags from "./lib/useAutocompleteFlags";

import { QuerySidebar } from "../../components/QuerySidebar";
import { dashboardList } from "../../components/QuerySidebar/helpers/options";

import { ExecutionStatus } from "../../api/query_result";
import recordEvent from "../../api/record_event";
import useDataSourceSchema from "../../api/use_datasource_schema";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .ant-pagination-item-link {
    .anticon {
      vertical-align: unset !important;
    }
  }
`;

const WrapperAutomation = styled(Wrapper)`
  top: 165px;
  width: 80%;
  margin-left: 330px;
`;

const PageContentDiv = styled.div`
  display: flex;
  min-height: 100%;
`;

const PageContentAutomation = styled.div`
  min-height: 100%;
`;

const ColLeft = styled.div``;

const ColRight = styled.div`
  width: 100%;
  background-color: #f6f8f9;
  padding: 0 20px;
`;

const PageContent = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Content = styled.div`
    background: #fff;
    border-right: 
    padding: 0;
    box-shadow: 0 4px 9px -3px rgba(102,136,153,.15);
    display: flex;
    flex-grow: 1;
    width: 33%;
    border-right: 1px solid #efefef;
`;

const Header = styled.div`
  width: 100%;
  display: block;
  margin-right: 15px;
  background-color: #f6f8f9;
  padding-right: 15px;
  margin-right: auto;
  margin-left: auto;
`;

const NavigatorList = styled.div`
  display: flex;
  flex-flow: column;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 10px;
  overflow-x: hidden;
  position: relative;
  flex-shrink: 0;
`;

const LeftSchema = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 0;
  padding-top: 0;
  position: relative;
  justify-content: center;
  // align-items: center;
`;

const MainContent = styled.div`
  background: #fff;
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
  align-content: space-around;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
`;

const FlexFill = styled.div`
  flex: 1 1 auto;
  position: relative;
`;

const RowContent = styled.div`
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 0 15px 0 15px;
`;

const RowEditor = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-content: space-around;
  overflow: hidden;
  flex: 0 0 300px;
  border-bottom: 1px solid #efefef;
  position: relative;
  background: #fff;
  z-index: 9;
  margin-right: -15px;
  margin-left: -15px;
`;

const TextContent = styled.div`
  width: 100%;
`;

const QueryAlerts = styled.div`
  margin: 10px 0 10px 0;
`;

const EditInPlace = styled.span`
  display: flex;
  padding: 15px 5px 15px 15px;

  .edit-in-place {
    display: flex;
    flex: 1;
    width: 400px;
    max-height: 150px;
    overflow: auto;

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

const SelectRow = styled.div`
  padding: 0 15px;
  margin: 10px 0;

  .ant-select {
    width: 100%;
  }
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

  .anticon-folder {
    vertical-align: -0.235em !important;
  }
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Main Component
const QueryEdit = (props) => {
  const { item, disableLeftView, queryFolder } = props;
  const editorRef = useRef(null);
  const selectRef = useRef(null);
  const [queryFolderId, setFolderId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState({
    loading: true,
    error: "",
    editing: false
  });
  const query = new Query(item);
  const { queryObj, setQuery, saveQuery, isDirty } = useQuery(query);
  const { dataSourcesLoaded, dataSource } = useQueryDataSources(queryObj);
  const formatQuery = useFormatQuery(
    queryObj,
    dataSource ? dataSource.syntax : null,
    setQuery
  );
  const [schema, refreshSchema, loadingSchema] =
    useDataSourceSchema(dataSource);
  const queryFlags = useQueryFlags(queryObj, dataSource);
  const [selectedVisualization, setSelectedVisualization] =
    useVisualizationTabHandler(queryObj.visualizations);
  const [parameters, areParametersDirty, updateParametersDirtyFlag] =
    useQueryParameters(queryObj);
  const [autocompleteAvailable, autocompleteEnabled, toggleAutocomplete] =
    useAutocompleteFlags(schema);
  const { queryActiveMenu, updateQueryActiveMenu, mainMenu, updateMainMenu } =
    props;

  const {
    queryResult,
    isExecuting: isQueryExecuting,
    executionStatus,
    executeQuery,
    error: executionError,
    cancelCallback: cancelExecution,
    isCancelling: isExecutionCancelling,
    updatedAt,
    loadedInitialResults
  } = useQueryExecute(queryObj);

  const queryResultData = useQueryResultData(queryResult);
  const editVisualization = useEditVisualizationDialog(
    queryObj,
    queryResult,
    (newQuery) => setQuery(newQuery)
  );
  const deleteVisualization = useDeleteVisualization(queryObj, setQuery);
  const updateName = useRenameQuery(queryObj, setQuery);
  const updateQuery = useUpdateQuery(query, setQuery);

  const openAddNewParameterDialog = useAddNewParameterDialog(
    queryObj,
    (newQuery, param) => {
      if (editorRef.current) {
        editorRef.current.paste(param.toQueryTextFragment());
        editorRef.current.focus();
      }
      setQuery(newQuery);
    }
  );

  useEffect(() => {
    // TODO: ignore new pages?
    recordEvent("view_source", "query", queryObj.id);
  }, [queryObj.id]);

  useEffect(() => {
    // First time alone update
    if (item?.query_folder) {
      setFolderId(item?.query_folder?.id);
    }
  }, [item]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (selectRef?.current) {
        selectRef.current.blur();
      }
      setEditing(false);
    }
  };

  const [isQuerySaving, setIsQuerySaving] = useState(false);

  const doSaveQuery = useCallback(() => {
    if (!isQuerySaving) {
      setIsQuerySaving(true);
      saveQuery().finally(() => setIsQuerySaving(false));
    }
  }, [isQuerySaving, saveQuery]);

  const addVisualization = useAddVisualizationDialog(
    queryObj,
    queryResult,
    doSaveQuery,
    (newQuery, visualization) => {
      setQuery(newQuery);
      setSelectedVisualization(visualization.id);
    }
  );

  const [selectedText, setSelectedText] = useState(null);
  const doExecuteQuery = useCallback(
    (skipParametersDirtyFlag = false) => {
      if (
        !queryFlags.canExecute ||
        (!skipParametersDirtyFlag && (areParametersDirty || isQueryExecuting))
      ) {
        return;
      }
      if (isDirty || !isEmpty(selectedText)) {
        executeQuery(null, () =>
          queryObj.getQueryResultByText(0, selectedText || queryObj.query)
        );
      } else {
        executeQuery();
      }
    },
    [
      queryObj,
      queryFlags.canExecute,
      areParametersDirty,
      isQueryExecuting,
      isDirty,
      selectedText,
      executeQuery
    ]
  );

  const [handleChange] = useDebouncedCallback((queryText) => {
    setQuery(extend(queryObj.clone(), { query: queryText }));
  }, 100);

  const handleSchemaItemSelect = useCallback((schemaItem) => {
    if (editorRef.current) {
      editorRef.current.paste(schemaItem);
    }
  }, []);

  const { SchemaBrowser } = getEditorComponents(dataSource?.type);

  /* Handler Function */
  const onMenuItem = (ident) => {
    navigate("/queries");
    if (updateQueryActiveMenu) {
      updateQueryActiveMenu(ident);
    }
  };

  const onMainMenuItem = (ident) => {
    if (updateMainMenu) {
      updateMainMenu(ident);
    }
  };

  const onRedirectBack = () => {
    navigate(`/queries/${queryObj?.id}`);
  };

  const startEditing = () => {
    setEditing(true);
  };

  const onChange = (value) => {
    if (value) {
      updateQuery({ query_folder_id: value });
      updateQueryActiveMenu(value);
      setFolderId(value);
    }

    setEditing(false);
  };

  if (state.error) {
    return <ErrorMessage error={state.error} />;
  }

  let editClassName = "edit-in-place";

  if (state.editing) {
    editClassName = "edit-in-place active";
  }

  const PageContentWrapper = disableLeftView
    ? PageContentAutomation
    : PageContentDiv;
  const WrapperComp = disableLeftView ? WrapperAutomation : Wrapper;
  const folderList = queryFolder?.filter((item) => item?.id !== "myquery");

  return (
    <WrapperComp>
      <Helmet>
        <title>{queryObj.name} | Explore</title>
      </Helmet>
      <PageContentWrapper>
        {!disableLeftView && (
          <ColLeft>
            <QuerySidebar
              activeMenu={queryActiveMenu}
              onMenuItem={onMenuItem}
              dashboardList={dashboardList}
              mainMenu={mainMenu}
              onMainMenuItem={onMainMenuItem}
            />
          </ColLeft>
        )}
        <ColRight>
          <Header>
            <EditInPlace className={editClassName}>
              <EditInput
                isEditable={queryFlags.canEdit}
                onDone={updateName}
                ignoreBlanks
                value={queryObj.name}
                onRedirectBack={onRedirectBack}
                disableLeftView={disableLeftView}
                isQuery
              />
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
                      <Icon type="folder" />
                    </span>
                    {folderList?.find((folder) => folder?.id === queryFolderId)
                      ?.title || "Query Folder"}
                  </Tooltip>
                </Editable>
              )}
            </EditInPlace>
          </Header>
          <PageContent>
            <Content>
              <NavigatorList>
                <>
                  <SelectRow>
                    {dataSourcesLoaded && (
                      <div className="editor__left__data-source">
                        <Input
                          value={dataSource ? dataSource.name : ""}
                          disabled
                        />
                      </div>
                    )}
                  </SelectRow>
                  <LeftSchema>
                    <SchemaBrowser
                      loadingSchema={loadingSchema}
                      schema={schema}
                      onRefresh={() => refreshSchema(true)}
                      onItemSelect={handleSchemaItemSelect}
                    />
                  </LeftSchema>
                </>
              </NavigatorList>
            </Content>
            <MainContent>
              <FlexFill>
                <RowContent>
                  <RowEditor>
                    <TextContent>
                      <QueryEditor
                        ref={editorRef}
                        syntax={dataSource ? dataSource.syntax : null}
                        value={queryObj.query}
                        schemas={schema}
                        autocompleteEnabled={
                          autocompleteAvailable && autocompleteEnabled
                        }
                        onChange={handleChange}
                      />
                    </TextContent>
                  </RowEditor>
                </RowContent>
                <QueryEditor.Controls
                  addParameterButtonProps={{
                    title: "Add New Parameter",
                    shortcut: "mod+p",
                    onClick: openAddNewParameterDialog
                  }}
                  formatButtonProps={{
                    title: "Format Query",
                    shortcut: "mod+shift+f",
                    onClick: formatQuery
                  }}
                  saveButtonProps={{
                    text: (
                      <React.Fragment>
                        <span className="hidden-xs">Save</span>
                      </React.Fragment>
                    ),
                    shortcut: "mod+s",
                    onClick: doSaveQuery
                  }}
                  executeButtonProps={{
                    shortcut: "mod+enter, alt+enter, ctrl+enter",
                    onClick: doExecuteQuery,
                    text: <span className="hidden-xs">Execute</span>
                  }}
                  autocompleteToggleProps={{
                    available: autocompleteAvailable,
                    enabled: autocompleteEnabled,
                    onToggle: toggleAutocomplete
                  }}
                />
                {queryObj.hasParameters() && (
                  <div className="query-parameters-wrapper">
                    <Parameters
                      editable={queryFlags.canEdit}
                      disableUrlUpdate={queryFlags.isNew}
                      parameters={parameters}
                      onPendingValuesChange={() => updateParametersDirtyFlag()}
                      onValuesChange={() => {
                        updateParametersDirtyFlag(false);
                        doExecuteQuery(true);
                      }}
                      onParametersEdit={() => {
                        // save if query clean
                        if (!isDirty) {
                          saveQuery();
                        }
                      }}
                    />
                  </div>
                )}
                {(executionError || isQueryExecuting) && (
                  <QueryAlerts>
                    <QueryExecutionStatus
                      status={executionStatus}
                      updatedAt={updatedAt}
                      error={executionError}
                      isCancelling={isExecutionCancelling}
                      onCancel={cancelExecution}
                    />
                  </QueryAlerts>
                )}
                <React.Fragment>
                  {queryResultData.log.length > 0 && (
                    <div className="query-results-log">
                      <p>Log Information:</p>
                      {map(queryResultData.log, (line, index) => (
                        <p key={`log-line-${index}`} className="query-log-line">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  {loadedInitialResults &&
                    !(queryFlags.isNew && !queryResult) && (
                      <QueryVisualizationTabs
                        queryResult={queryResult}
                        visualizations={queryObj.visualizations}
                        showNewVisualizationButton={
                          queryFlags.canEdit &&
                          queryResultData.status === ExecutionStatus.DONE
                        }
                        canDeleteVisualizations={queryFlags.canEdit}
                        selectedTab={selectedVisualization}
                        onChangeTab={setSelectedVisualization}
                        onAddVisualization={addVisualization}
                        onDeleteVisualization={deleteVisualization}
                        refreshButton={
                          <Button
                            type="primary"
                            disabled={
                              !queryFlags.canExecute || areParametersDirty
                            }
                            loading={isQueryExecuting}
                            onClick={doExecuteQuery}
                          >
                            {!isQueryExecuting && (
                              <i
                                className="zmdi zmdi-refresh m-r-5"
                                aria-hidden="true"
                              />
                            )}
                            Refresh Now
                          </Button>
                        }
                      />
                    )}
                </React.Fragment>
              </FlexFill>
              {queryResult && !queryResult.getError() && (
                <div className="bottom-controller-container">
                  <QueryExecutionMetadata
                    query={queryObj}
                    queryResult={queryResult}
                    selectedVisualization={selectedVisualization}
                    isQueryExecuting={isQueryExecuting}
                    showEditVisualizationButton={
                      !queryFlags.isNew && queryFlags.canEdit
                    }
                    onEditVisualization={editVisualization}
                  />
                </div>
              )}
            </MainContent>
          </PageContent>
        </ColRight>
      </PageContentWrapper>
    </WrapperComp>
  );
};

export default React.memo(QueryEdit, isEqual);
