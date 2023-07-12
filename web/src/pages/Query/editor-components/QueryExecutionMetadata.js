// QueryExecutionMetaData

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import TimeAgo from "./timeago";
import EditVisualizationButton from "./EditVisualizationButton";
import useQueryResultData from "../lib/useQueryResultData";
import { durationHumanize, pluralize, prettySize } from "../lib/utils";

const Wrapper = styled.div`
  padding: 10px 15px;
  background: #fff;
  display: flex;
  align-items: center;

  button,
  div,
  span {
    position: relative;
  }

  div:last-child {
    flex-grow: 1;
    text-align: right;
  }

  &:before {
    content: "";
    height: 50px;
    position: fixed;
    bottom: 0;
    width: 100%;
    pointer-events: none;
    left: 0;
  }

  .m-l-5,
  .m-r-10 {
    font-size: 12px;
    margin-left: 10px;
  }
`;

export default function QueryExecutionMetadata({
  // query,
  queryResult,
  isQueryExecuting,
  selectedVisualization,
  showEditVisualizationButton,
  onEditVisualization
  // extraActions,
}) {
  const queryResultData = useQueryResultData(queryResult);
  return (
    <Wrapper>
      {showEditVisualizationButton && (
        <EditVisualizationButton
          openVisualizationEditor={onEditVisualization}
          selectedTab={selectedVisualization}
        />
      )}
      <span className="m-l-5 m-r-10">
        <span>
          <strong>{queryResultData.rows.length}</strong>{" "}
          {pluralize("row", queryResultData.rows.length)}
        </span>
        <span className="m-l-5">
          {!isQueryExecuting && (
            <>
              <strong>{durationHumanize(queryResultData.runtime)}</strong>
              <span className="hidden-xs"> runtime</span>
            </>
          )}
          {isQueryExecuting && <span>Running&hellip;</span>}
        </span>
        {queryResultData.metadata.data_scanned && (
          <span className="m-l-5">
            Data Scanned
            <strong>{prettySize(queryResultData.metadata.data_scanned)}</strong>
          </span>
        )}
      </span>
      <div>
        <span className="m-r-10">
          <span className="hidden-xs">Refreshed </span>
          <strong>
            <TimeAgo date={queryResultData.retrievedAt} placeholder="-" />
          </strong>
        </span>
      </div>
    </Wrapper>
  );
}

QueryExecutionMetadata.propTypes = {
  query: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  queryResult: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isQueryExecuting: PropTypes.bool,
  selectedVisualization: PropTypes.number,
  showEditVisualizationButton: PropTypes.bool,
  onEditVisualization: PropTypes.func,
  extraActions: PropTypes.node
};

QueryExecutionMetadata.defaultProps = {
  isQueryExecuting: false,
  selectedVisualization: null,
  showEditVisualizationButton: false,
  onEditVisualization: () => {},
  extraActions: null
};
