/* eslint-disable react/jsx-props-no-spreading */
import { isNil, map, filter, some, includes } from "lodash";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { Input, Button } from "antd";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import styled from "styled-components";

import { Icon } from "../../components/Icon";

const SchemaContainer = styled.div`
  background: transparent;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 10;
  position: absolute;
  left: 15px;
  top: 0;
  right: 15px;
  bottom: 0;

  .schema-browser {
    overflow-x: hidden;
    border: none;
    margin-top: 10px;
    overflow-y: auto;
    height: 100%;

    .schema-loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .collapse.in {
      background: transparent;
    }

    .copy-to-editor {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 20px;
      display: flex;
      font-size: 10px;
      align-items: center;
      justify-content: center;
    }

    .table-open {
      padding: 0 22px 0 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      font-size: 12px;
      line-height: 1.42857143;
      color: #767676;

      &:hover {
        background: rgba(102, 136, 153, 0.1);

        .copy-to-editor {
          display: flex;
        }
      }
    }
  }

  .schema-control {
    display: flex;
    flex-wrap: nowrap;
    padding: 0;

    .ant-btn {
      height: auto;
    }
  }

  div.table-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    padding: 2px 22px 2px 10px;
    position: relative;
    font-size: 13px;
    line-height: 1.42857143;
    color: #767676;

    &:hover {
      background: fade(@redash-gray, 10%);

      .copy-to-editor {
        display: flex;
      }
    }
  }

  input {
    width: 100%;
    height: 35px;
    padding: 6px 12px;
    background-color: #fff;
    background-image: none;
    border: 1px solid #e8e8e8;
    transition: all;
    transition-duration: 0s;
    transition-duration: 0.3s;
    resize: none;
    box-shadow: 0 0 0 40px transparent !important;
    border-radius: 2px;
    margin-right: 5px;
  }

  .ant-btn {
    background-color: rgba(102, 136, 153, 0.15);
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    padding: 6px 12px;
    font-size: 13px;
    line-height: 1.42857143;
    border-radius: 2px;
    user-select: none;
  }

  .zmdi {
    display: inline-block;
    font-size: 14px;
    font-size: inherit;
    text-rendering: auto;
  }

  .ant-btn:not(.ant-btn-alt) {
    border: 0;
  }

  .ant-tooltip {
    display: none !important;
  }

  .fa {
    display: inline-block;
    font-size: 14px;
    font-size: inherit;
    text-rendering: auto;
  }

  .fa-table {
    margin-right: 5px;
  }

  .fa-angle-double-right::before {
    content: "\F101";
  }

  .ant-input {
    color: #767676;
    font-size: 14px;
    line-height: 16px;
  }
`;

const SchemaItemType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired
});

const schemaTableHeight = 22;
const schemaColumnHeight = 18;

function SchemaItem({ item, expanded, onToggle, onSelect, ...props }) {
  const handleSelect = useCallback(
    (event, ...args) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect(...args);
    },
    [onSelect]
  );

  if (!item) {
    return null;
  }

  return (
    <div {...props}>
      <div className="table-name" onClick={onToggle}>
        <i className="fa fa-table m-r-5" />
        <span title={item.name}>{item.name}</span>
        {!isNil(item.size) && <span> ({item.size})</span>}
        <span className="copy-to-editor">
          <Icon
            name={expanded ? "arrowUp" : "arrowDown"}
            fill="#000"
            width={12}
            height={12}
          />
        </span>
      </div>
      {expanded && (
        <div>
          {map(item.columns, (column) => (
            <div key={column} className="table-open">
              {column}
              <span
                className="copy-to-editor"
                onClick={(e) => handleSelect(e, column)}
              >
                Add
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SchemaItem.propTypes = {
  item: SchemaItemType,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func
};

SchemaItem.defaultProps = {
  item: null,
  expanded: false,
  onToggle: () => {},
  onSelect: () => {}
};

export function SchemaList({
  schema,
  expandedFlags,
  onTableExpand,
  onItemSelect,
  setListRef
}) {
  return (
    <div className="schema-browser">
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={setListRef}
            width={width}
            height={height}
            rowCount={schema.length}
            rowHeight={({ index }) => {
              const item = schema[index];
              const columnCount = expandedFlags[item.name]
                ? item.columns.length
                : 0;
              return schemaTableHeight + schemaColumnHeight * columnCount;
            }}
            rowRenderer={({ key, index, style }) => {
              const item = schema[index];
              return (
                <SchemaItem
                  key={key}
                  style={style}
                  item={item}
                  expanded={expandedFlags[item.name]}
                  onToggle={() => onTableExpand(item.name)}
                  onSelect={onItemSelect}
                />
              );
            }}
          />
        )}
      </AutoSizer>
    </div>
  );
}

function applyFilter(schema, filterString) {
  const filters = filter(
    filterString.toLowerCase().split(/\s+/),
    (s) => s.length > 0
  );

  // Empty string: return original schema
  if (filters.length === 0) {
    return schema;
  }

  // Single word: matches table or column
  if (filters.length === 1) {
    const nameFilter = filters[0];
    const columnFilter = filters[0];
    return filter(
      schema,
      (item) =>
        includes(item.name.toLowerCase(), nameFilter) ||
        some(item.columns, (column) =>
          includes(column.toLowerCase(), columnFilter)
        )
    );
  }

  // Two (or more) words: first matches table, seconds matches column
  const nameFilter = filters[0];
  const columnFilter = filters[1];
  return filter(
    map(schema, (item) => {
      if (includes(item.name.toLowerCase(), nameFilter)) {
        item = {
          ...item,
          columns: filter(item.columns, (column) =>
            includes(column.toLowerCase(), columnFilter)
          )
        };
        return item.columns.length > 0 ? item : null;
      }
    })
  );
}

export default function SchemaBrowser({
  schema,
  onRefresh,
  onItemSelect,
  ...props
}) {
  const [filterString, setFilterString] = useState("");
  const filteredSchema = useMemo(
    () => applyFilter(schema, filterString),
    [schema, filterString]
  );
  const [handleFilterChange] = useDebouncedCallback(setFilterString, 500);
  const [expandedFlags, setExpandedFlags] = useState({});
  const [listRef, setListRef] = useState(null);

  useEffect(() => {
    setExpandedFlags({});
  }, [schema]);

  useEffect(() => {
    if (listRef) {
      listRef.recomputeRowHeights();
    }
  }, [listRef, filteredSchema, expandedFlags]);

  if ((schema && schema?.length === 0) || schema?.length === undefined) {
    return null;
  }

  function toggleTable(tableName) {
    setExpandedFlags({
      ...expandedFlags,
      [tableName]: !expandedFlags[tableName]
    });
  }

  return (
    <SchemaContainer {...props}>
      <div className="schema-control">
        <Input
          className="m-r-5"
          placeholder="Search schema..."
          disabled={schema.length === 0}
          onChange={(event) => handleFilterChange(event.target.value)}
        />
        <Button onClick={onRefresh}>
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </Button>
      </div>
      <SchemaList
        schema={filteredSchema}
        setListRef={setListRef}
        expandedFlags={expandedFlags}
        onTableExpand={toggleTable}
        onItemSelect={onItemSelect}
      />
    </SchemaContainer>
  );
}

SchemaBrowser.propTypes = {
  schema: PropTypes.arrayOf(SchemaItemType),
  onRefresh: PropTypes.func,
  onItemSelect: PropTypes.func
};

SchemaBrowser.defaultProps = {
  schema: [],
  onRefresh: () => {},
  onItemSelect: () => {}
};
