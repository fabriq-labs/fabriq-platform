import { map, find, extend, trim, isString, isUndefined } from "lodash";
import React, { useState, useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Table } from "antd";
import { VisualizationType } from "@redash/viz/lib";
import { navigate } from "@reach/router";

import Filters, { FiltersType, filterData } from "./filters";
import { Renderer } from "./visualization_component";
import MainChart from "../../../components/Redash/Dashboard/dashboard-widget/LineChart";
import AreaChart from "../../../components/Redash/Dashboard/dashboard-widget/AreaChart";
import BarChart from "../../../components/Redash/Dashboard/dashboard-widget/BarChart";
import PieChart from "../../../components/Redash/Dashboard/dashboard-widget/PieChart";
import ScatterChart from "../../../components/Redash/Dashboard/dashboard-widget/ScatterChart";
import useQueryResultData from "../lib/useQueryResultData";

import { isURL } from "../../../utils/validator/isURL";

// Link
const Link = styled.div`
  color: #0a6ebd;
  text-decoration: none;
  cursor: pointer;
`;

function combineFilters(localFilters, globalFilters) {
  // tiny optimization - to avoid unnecessary updates
  if (localFilters.length === 0 || globalFilters.length === 0) {
    return localFilters;
  }

  return map(localFilters, (localFilter) => {
    const globalFilter = find(
      globalFilters,
      (f) => f.name === localFilter.name
    );
    if (globalFilter) {
      return {
        ...localFilter,
        current: globalFilter.current
      };
    }
    return localFilter;
  });
}

export default function VisualizationRenderer(props) {
  const data = useQueryResultData(props.queryResult);
  const [filters, setFilters] = useState(data.filters);
  const filtersRef = useRef();
  filtersRef.current = filters;

  // Reset local filters when query results updated
  useEffect(() => {
    setFilters(combineFilters(data.filters, props.filters));
  }, [data.filters, props.filters]);

  // Update local filters when global filters changed.
  // For correct behavior need to watch only `props.filters` here,
  // therefore using ref to access current local filters
  useEffect(() => {
    setFilters(combineFilters(filtersRef.current, props.filters));
  }, [props.filters]);

  const filteredData = useMemo(
    () => ({
      columns: data.columns,
      rows: filterData(data.rows, filters)
    }),
    [data, filters]
  );

  function formatSimpleTemplate(str, data) {
    if (!isString(str)) {
      return "";
    }
    return str.replace(/{{\s*([^\s]+?)\s*}}/g, (match, prop) => {
      if (hasOwnProperty.call(data, prop) && !isUndefined(data[prop])) {
        return data[prop];
      }
      return match;
    });
  }

  // Click Link
  const onClickLink = (column, record) => {
    record = extend({ "@": record[column.name] }, record);

    const href = trim(formatSimpleTemplate(column.linkUrlTemplate, record));
    if (href === "") {
      return {};
    }

    navigate(href);
  };

  const { showFilters, visualization } = props;

  const options = { ...visualization.options };

  // define pagination size based on context for Table visualization
  if (visualization.type === "TABLE") {
    options.paginationSize = props.context === "widget" ? "small" : "default";

    let columns = [];
    let rows = [];
    if (props.dashboard) {
      let eachRow = {};
      if (options?.columns?.length > 0) {
        options.columns.forEach((key) => {
          eachRow = {
            title: key.name,
            dataIndex: key.name,
            key: key.name,
            sorter: (a, b) => a[key.name] - b[key.name]
          };

          if (
            key.displayAs === "link" &&
            !isURL(key.linkUrlTemplate)
          ) {
            eachRow.render = (text, record) => (
              <Link onClick={() => onClickLink(key, record)}>{text}</Link>
            );
          }

          columns.push(eachRow);
        });
      } else {
        filteredData &&
          filteredData.columns &&
          filteredData.columns.length > 0 &&
          filteredData.columns.forEach((key) => {
            eachRow = {
              title: key.name,
              dataIndex: key.name,
              key: key.name,
              sorter: (a, b) => a[key.name] - b[key.name]
            };
            columns.push(eachRow);
          });
      }

      if (filteredData && filteredData.rows.length > 0) {
        let rowKeys = Object.keys(filteredData.rows[0]);
        filteredData.rows.forEach((row, index) => {
          let eachRow = {};
          eachRow.key = index + 1;
          rowKeys.forEach((eachRowKey) => {
            eachRow[eachRowKey] = row[eachRowKey];
          });

          rows.push(eachRow);
        });
      }

      return (
        <div className="visualization-renderer">
          <div className="visualization-renderer-wrapper">
            <Table
              columns={columns}
              dataSource={rows}
              rowKey={(row) => row.key}
              pagination={{
                total: rows.length,
                pageSize: 10
              }}
            />
          </div>
        </div>
      );
    }
  }

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  if (visualization.type === "CHART" && props.dashboard) {
    const xAxisValue = getKeyByValue(options.columnMapping, "x");
    const yAxisData = Object.keys(options.columnMapping).filter(
      (key) => options.columnMapping[key] === "y"
    );

    const rows = [];
    const yAxisDataBar = Object.keys(
      props.queryResult.query_result.data.rows[0]
    );
    const YAxisList = yAxisDataBar.map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    });
    const customTooltip = props.visualization.options.customTooltip
      ? props.visualization.options.customTooltip
      : false;

    if (options.globalSeriesType === "pie") {
      let link = "";
      if (options && options.columns && options.columns.length > 0) {
        link = find(
          options.columns,
          (f) => f.name === xAxisValue
        ).linkUrlTemplate;
      }

      return yAxisData.map((eachitem) => (
        <PieChart
          eachitem={eachitem}
          xAxisValue={xAxisValue}
          filteredData={filteredData}
          link={link}
          name={visualization.query.name}
          tooltipList={yAxisDataBar}
          dataRows={props.queryResult.query_result.data.rows}
          customTooltip={customTooltip}
        />
      ));
    }

    if (filteredData && filteredData.rows.length > 0) {
      let rowKeys = Object.keys(filteredData.rows[0]);
      filteredData.rows.forEach((row) => {
        let eachRow = {};
        rowKeys.forEach((eachRowKey) => {
          if (
            xAxisValue === eachRowKey ||
            yAxisData.find((key) => key === eachRowKey)
          ) {
            eachRow[eachRowKey] = row[eachRowKey];
          }
        });
        rows.push(eachRow);
      });
    }

    if (options.globalSeriesType === "line") {
      let link = "";
      if (options && options.columns && options.columns.length > 0) {
        link = find(
          options.columns,
          (f) => f.name === xAxisValue
        ).linkUrlTemplate;
      }
      return (
        <MainChart
          xAxisValue={xAxisValue}
          list={yAxisData}
          data={rows}
          link={link}
          name={visualization.query.name}
          tooltipList={yAxisDataBar}
          dataRows={props.queryResult.query_result.data.rows}
          customTooltip={customTooltip}
        />
      );
    }

    if (options.globalSeriesType === "area") {
      let link = "";
      if (options && options.columns && options.columns.length > 0) {
        link = find(
          options.columns,
          (f) => f.name === xAxisValue
        ).linkUrlTemplate;
      }

      return (
        <AreaChart
          xAxisValue={xAxisValue}
          list={yAxisData}
          data={rows}
          link={link}
          name={visualization.query.name}
          tooltipList={yAxisDataBar}
          dataRows={props.queryResult.query_result.data.rows}
          customTooltip={customTooltip}
        />
      );
    }

    if (options.globalSeriesType === "column") {
      let link = "";
      if (options && options.columns && options.columns.length > 0) {
        link = find(
          options.columns,
          (f) => f.name === xAxisValue
        ).linkUrlTemplate;
      }

      return (
        <BarChart
          xAxisValue={xAxisValue}
          list={yAxisData}
          data={rows}
          link={link}
          name={visualization.query.name}
          tooltipList={yAxisDataBar}
          dataRows={props.queryResult.query_result.data.rows}
          customTooltip={customTooltip}
        />
      );
    }

    if (options.globalSeriesType === "scatter") {
      let series = [];
      let link = "";
      if (options && options.columns && options.columns.length > 0) {
        link = find(
          options.columns,
          (f) => f.name === xAxisValue
        ).linkUrlTemplate;
      }
      yAxisData.forEach((eachitem) => {
        let eachRow = {
          title: eachitem
        };
        series.push(eachRow);
      });
      return (
        <ScatterChart
          xAxisValue={xAxisValue}
          list={yAxisData}
          data={rows}
          series={series}
          link={link}
        />
      );
    }
  }

  return (
    <Renderer
      key={`visualization${visualization.id}`}
      type={visualization.type}
      options={options}
      data={filteredData}
      visualizationName={visualization.name}
      addonBefore={
        showFilters && <Filters filters={filters} onChange={setFilters} />
      }
    />
  );
}

VisualizationRenderer.propTypes = {
  visualization: VisualizationType.isRequired,
  queryResult: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  filters: FiltersType,
  showFilters: PropTypes.bool,
  context: PropTypes.oneOf(["query", "widget"]).isRequired
};

VisualizationRenderer.defaultProps = {
  filters: [],
  showFilters: true
};
