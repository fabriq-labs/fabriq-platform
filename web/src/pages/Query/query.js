// Query Component
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";
import { Button, Select } from "antd";
import PropTypes from "prop-types";
import { map, extend, isEmpty, find, includes } from "lodash";
import { useDebouncedCallback } from "use-debounce";
import Helmet from "react-helmet";

import { Query } from "../../api/queries";
import { getEditorComponents } from "./editor-components";
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
`;

const WrapperAutomation = styled(Wrapper)`
  top: 140px;
  width: 80%;
  margin-left: 350px;
`;

const PageContent = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 100%;
  margin-top: 20px;
`;

const Content = styled.div`
  background: #fff;
  padding: 0;
  box-shadow: 0 4px 9px -3px rgba(102, 136, 153, 0.15);
  display: flex;
  flex-grow: 1;
  width: 33%;
  border-right: 1px solid #efefef;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
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

const SelectRow = styled.div`
  padding: 0 15px;
  margin-bottom: 15px;

  .ant-select {
    width: 100%;
  }
`;

const LeftSchema = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  position: relative;
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
  .edit-in-place {
    display: flex;
    max-height: 150px;
    width: 400px;
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

function chooseDataSourceId(dataSourceIds, availableDataSources) {
  dataSourceIds = map(dataSourceIds, (v) => parseInt(v, 10));
  availableDataSources = map(availableDataSources, (ds) => ds.id);
  return (
    find(dataSourceIds, (id) => includes(availableDataSources, id)) || null
  );
}

// Main Component
const QueryPage = (props) => {
  const { dataSourceId, disableLeftView } = props;
  const editorRef = useRef(null);
  const [state, setState] = useState({
    loading: true,
    error: "",
    editing: false
  });
  const query = Query.newQuery();
  query.data_source_id = dataSourceId;
  const { queryObj, setQuery, saveQuery, isDirty } = useQuery(query);
  const { dataSourcesLoaded, dataSources, dataSource } =
    useQueryDataSources(queryObj);
  const [schema, refreshSchema] = useDataSourceSchema(dataSource);
  const formatQuery = useFormatQuery(
    queryObj,
    dataSource ? dataSource.syntax : null,
    setQuery
  );
  const queryFlags = useQueryFlags(queryObj, dataSource);
  const [selectedVisualization, setSelectedVisualization] =
    useVisualizationTabHandler(queryObj.visualizations);
  const [parameters, areParametersDirty, updateParametersDirtyFlag] =
    useQueryParameters(queryObj);
  const [autocompleteAvailable, autocompleteEnabled, toggleAutocomplete] =
    useAutocompleteFlags(schema);

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

  const updateQuery = useUpdateQuery(queryObj, setQuery);
  const queryResultData = useQueryResultData(queryResult);
  const editVisualization = useEditVisualizationDialog(
    queryObj,
    queryResult,
    (newQuery) => setQuery(newQuery)
  );
  const deleteVisualization = useDeleteVisualization(queryObj, setQuery);
  const updateName = useRenameQuery(queryObj, setQuery);

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

  const handleDataSourceChange = useCallback(
    (dataSourceId) => {
      if (dataSourceId) {
        try {
          localStorage.setItem("lastSelectedDataSourceId", dataSourceId);
        } catch (e) {
          // `localStorage.setItem` may throw exception if there are no enough space - in this case it could be ignored
        }
      }
      if (queryObj.data_source_id !== dataSourceId) {
        recordEvent("update_data_source", "query", queryObj.id, {
          dataSourceId
        });
        const updates = {
          data_source_id: dataSourceId,
          latest_query_data_id: null,
          latest_query_data: null
        };
        setQuery(extend(queryObj.clone(), updates));
        updateQuery(updates, { successMessage: null }); // show message only on error
      }
    },
    [query, setQuery, updateQuery]
  );

  useEffect(() => {
    // choose data source id for new queries
    if (dataSourcesLoaded && queryFlags.isNew) {
      const firstDataSourceId =
        dataSources.length > 0 ? dataSources[0].id : null;
      handleDataSourceChange(
        chooseDataSourceId(
          [
            query.data_source_id,
            localStorage.getItem("lastSelectedDataSourceId"),
            firstDataSourceId
          ],
          dataSources
        )
      );
    }
  }, [
    query.data_source_id,
    queryFlags.isNew,
    dataSourcesLoaded,
    dataSources,
    handleDataSourceChange
  ]);

  // const [showEditor, setShowEditor] = useState(false);
  const [isQuerySaving, setIsQuerySaving] = useState(false);

  const doSaveQuery = useCallback(() => {
    if (!isQuerySaving) {
      setIsQuerySaving(true);
      saveQuery().finally(() => setIsQuerySaving(false));
    }
  }, [isQuerySaving, saveQuery]);

  const onRedirectBack = () => {
    navigate("/explore/queries");
  };

  const addVisualization = useAddVisualizationDialog(
    queryObj,
    queryResult,
    doSaveQuery,
    (newQuery, visualization) => {
      setQuery(newQuery);
      setSelectedVisualization(visualization.id);
    }
  );

  const [selectedText, setSelectedText] = useState(null); // eslint-disable-line
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

  const { SchemaBrowser } = getEditorComponents(dataSource && dataSource.type);

  let editClassName = "edit-in-place";

  if (state.editing) {
    editClassName = "edit-in-place active";
  }

  const WrapperComp = disableLeftView ? WrapperAutomation : Wrapper;

  return (
    <WrapperComp>
      <Helmet>
        {/* <title>Create Query | Explore | Fabriq</title> */}
        <title>Create Query | Explore</title>
      </Helmet>
      <Header>
        <EditInPlace className={editClassName}>
          <EditInput
            isEditable={queryFlags.canEdit}
            onDone={updateName}
            ignoreBlanks
            value={queryObj.name}
            onRedirectBack={onRedirectBack}
            isQuery
            disableLeftView={disableLeftView}
          />
        </EditInPlace>
      </Header>
      <PageContent>
        <Content>
          <NavigatorList>
            {!disableLeftView && (
              <SelectRow>
                {dataSourcesLoaded && (
                  <div className="editor__left__data-source">
                    <Select
                      className="w-100"
                      data-test="SelectDataSource"
                      placeholder="Choose data source..."
                      value={dataSource ? dataSource.id : undefined}
                      disabled={
                        !queryFlags.canEdit ||
                        !dataSourcesLoaded ||
                        dataSources.length === 0
                      }
                      loading={!dataSourcesLoaded}
                      optionFilterProp="data-name"
                      showSearch
                      onChange={handleDataSourceChange}
                    >
                      {map(dataSources, (ds) => (
                        <Select.Option key={`ds-${ds.id}`} value={ds.id}>
                          <span>{ds.name}</span>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                )}
              </SelectRow>
            )}
            <LeftSchema>
              <SchemaBrowser
                schema={schema}
                onRefresh={() => refreshSchema(true)}
                onItemSelect={handleSchemaItemSelect}
              />
            </LeftSchema>
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
            {!disableLeftView ? (
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
            ) : (
              <QueryEditor.Controls
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
              />
            )}

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
              {loadedInitialResults && !(queryFlags.isNew && !queryResult) && (
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
                      disabled={!queryFlags.canExecute || areParametersDirty}
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
    </WrapperComp>
  );
};

QueryPage.propTypes = {
  dataSourceId: PropTypes.string
};

QueryPage.defaultProps = {
  dataSourceId: ""
};

export default React.memo(QueryPage, isEqual);
