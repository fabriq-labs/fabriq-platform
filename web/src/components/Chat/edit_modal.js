// Edit Modal Component
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { each } from "lodash";
import { Select as FabriqSelect } from "../Select";
import { Select, Table } from "antd";
import styled from "styled-components";

import { Renderer } from "../../pages/Query/editor-components/visualization_component";

const Option = Select.Option;

const Wrapper = styled.div`
  .inputContainer {
    width: 100%;
    height: 500px;
    display: grid;
    grid-template-columns: 1fr 3fr;
  }

  .modalSideBar {
    box-shadow: rgba(40, 60, 75, 0.05) 13px 0px 20px;
    display: flex;
    padding: 24px;
    flex-direction: column;
    justify-content: space-between;
  }

  .each-avg {
    margin-top: 20px;
  }

  .select-wrap {
    margin-top: 10px;
  }

  .inputLogic {
    text-align: center;
  }

  .filter-query {
    padding: 10px 0;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }

  .filter-query::-webkit-scrollbar {
    display: none;
  }

  .add-rule {
    padding-top: 10px;
  }

  .filter-card-div {
    display: flex;
    justify-content: center;
    max-width: 250px;
    margin: 10px auto;
  }

  .filter-card-div span {
    color: blue;
  }

  .filter-card-div input {
    border: 0.5px solid black;
    text-align: center;
  }

  .ant-card-body {
    border: 1px solid rgb(147, 167, 179);
    border-radius: 8px;
  }

  .ant-card-bordered {
    border: none;
  }

  .filter-input-container input {
    margin-top: 10px;
  }

  .filter-input-container select {
    overflow: hidden;
  }

  .filter-select {
    width: 100%;
  }

  .filter-option {
    width: 100%;
  }

  .flow-div {
    margin: 15px;
  }

  .flex-center {
    margin: 20px 15px;
  }

  .source-col-group {
    margin-bottom: 10px;
  }

  .modalOutput {
    overflow: auto;
    padding: 20px;
  }

  .sum-col-flex {
    display: flex;
    margin-bottom: 10px;
  }

  .sum-col-title {
    align-self: center;
    margin-right: 10px;
  }

  .sum-col-group {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .sum-value-group {
    margin-top: 10px;
  }

  .css-1okebmr-indicatorSeparator,
  .css-109onse-indicatorSeparator {
    display: none;
  }
`;

const Content = styled.div`
  display: flex;
`;

const OptionContent = styled.div`
  width: 40%;
  .select {
    width: 100%;
  }
  .ant-select-selection--single {
    height: 37px !important;
  }

  .select-heading {
    font-size: 16px;
    font-weight: 500;
    margin-top: 15px;
  }
`;

const ChartContent = styled.div`
  width: 60%;

  .edit-chart-content {
    .modebar {
      display: none;
    }
  }
`;

const typeList = [
  {
    label: "Table",
    value: "table"
  },
  {
    label: "Chart",
    value: "chart"
  }
];

const chartList = [
  {
    label: "Bar",
    value: "column"
  },
  {
    label: "Line",
    value: "line"
  },
  {
    label: "Pie",
    value: "pie"
  }
];

export const getOptions = (list, editModalData, type) => {
  // check whether name's available or not
  // if available filter the list
  let result = [];

  if (type === "xvalue") {
    result = list.filter((item) => item.name !== editModalData["yvalue"]);
  } else {
    result = list.filter((item) => item.name !== editModalData["xvalue"]);
  }

  return result;
};

const SelectOption = ({ options, onUpdateStateAxis, type, value }) => {
  return (
    <Select
      className="select"
      onChange={(e) =>
        onUpdateStateAxis(type, e, type === "xvalue" ? "x" : "y")
      }
      value={value}
    >
      {options?.map((option) => (
        <Option value={option.name}>{option.friendly_name}</Option>
      ))}
    </Select>
  );
};

const EditModal = (props) => {
  const { editTemplate, tableData, handleClickOK, onCancel } = props;
  const [options, setOptions] = useState({});
  const [columns, selectedColumns] = useState({
    x: null,
    y: null,
    xColumns: [],
    yColumns: []
  });
  const [editModalData, setEditModaldata] = useState({
    type: "table",
    globalSeriesType: "column",
    filteredData: null,
    legend: {
      enabled: true
    },
    columnMapping: null,
    xvalue: null,
    yvalue: null
  });

  useEffect(() => {
    formatData();
  }, [editTemplate, onCancel]);

  useEffect(() => {
    if (editModalData?.columnMapping !== null) {
      formatOptions();
    }
  }, [editModalData]);

  const formatData = () => {
    const filterColumns = [];
    let type = editTemplate?.type ? editTemplate.type : "table";
    let global = editTemplate?.globalSeriesType
      ? editTemplate.globalSeriesType
      : "column";
    // eslint-disable-next-line no-unused-expressions
    tableData?.data?.columns.map((item) => {
      filterColumns.push({
        name: item.key,
        friendly_name: item.title
      });
    });
    const columnMapping =
      filterColumns.length > 1
        ? {
            [filterColumns[0].name]: "x",
            [filterColumns[1].name]: "y"
          }
        : null;
    setEditModaldata((preState) => ({
      ...preState,
      filteredData: {
        columns: filterColumns,
        rows: tableData?.data?.rows
      },
      columnMapping: columnMapping,
      xvalue: filterColumns[0]?.name,
      yvalue: filterColumns[1]?.name,
      type: type,
      globalSeriesType: global
    }));

    selectedColumns((preState) => ({
      ...preState,
      x: filterColumns[0]?.name,
      y: filterColumns[1]?.name,
      xColumns: editModalData?.filteredData?.columns,
      yColumns: editModalData?.filteredData?.columns
    }));
  };

  const type = "CHART";
  const name = "Chart";

  const formatOptions = () => {
    const options = {
      globalSeriesType: editModalData?.globalSeriesType,
      legend: {
        enabled: true
      },
      columnMapping: editModalData?.columnMapping,
      columns: editModalData?.filteredData?.columns
    };

    setOptions(options);
  };

  const onUpdateState = (key, val) => {
    setEditModaldata((preState) => ({
      ...preState,
      [key]: val
    }));
  };

  const onUpdateStateAxis = (key, val, type) => {
    const state = { ...editModalData };
    if (key === "xvalue") {
      state.yvalue = "";
      state[key] = val;
    } else {
      state["yvalue"] = val;
    }

    setEditModaldata((preState) => ({
      ...preState,
      ...state
    }));

    getColumnsField(key, val, type);
  };

  const getColumnsField = (key, val, type) => {
    const colObj = { ...columns };
    if (key === "xvalue") {
      colObj.y = null;
      colObj.x = val;
    } else {
      colObj.y = val;
    }

    const mappedColumns = { x: colObj.x, y: colObj.y };

    const result = {};
    each(mappedColumns, (value, type) => {
      if (value !== null) {
        result[value] = type;
      }
    });

    selectedColumns((preState) => ({
      ...preState,
      ...colObj
    }));

    // update columnMapping with edited data
    setEditModaldata((preState) => ({
      ...preState,
      columnMapping: result,
    }));
  };

  const handleClickCancel = () => {
    onCancel();
    formatData();
  };

  return (
    <Wrapper>
      <Modal
        title="Edit"
        width={"90%"}
        visible={props.visible}
        onCancel={handleClickCancel}
        onOk={() => handleClickOK(editModalData)}
      >
        <Content>
          <OptionContent>
            <h4 className="select-heading">Visualization Type</h4>
            <div style={{ marginTop: "10px", width: "80%" }}>
              <FabriqSelect
                onChange={(e) => onUpdateState("type", e.value)}
                value={editModalData?.type}
                options={typeList}
              />
            </div>
            {editModalData?.type !== "table" && (
              <>
                <h4 className="select-heading">Chart Type</h4>
                <div style={{ marginTop: "10px", width: "80%" }}>
                  <FabriqSelect
                    onChange={(e) => onUpdateState("globalSeriesType", e.value)}
                    value={editModalData?.globalSeriesType}
                    options={chartList}
                  />
                </div>
                {editModalData?.filteredData?.columns.length > 1 && (
                  <>
                    <h4 className="select-heading">Xaxis</h4>
                    <div style={{ marginTop: "10px", width: "80%" }}>
                      <SelectOption
                        options={getOptions(
                          columns?.xColumns,
                          editModalData,
                          "xvalue"
                        )}
                        type="xvalue"
                        value={editModalData?.xvalue}
                        onUpdateStateAxis={onUpdateStateAxis}
                      />
                    </div>
                    <h4 className="select-heading">Yaxis</h4>
                    <div style={{ marginTop: "10px", width: "80%" }}>
                      <SelectOption
                        options={getOptions(
                          columns?.yColumns,
                          editModalData,
                          "yvalue"
                        )}
                        type="yvalue"
                        value={editModalData?.yvalue}
                        onUpdateStateAxis={onUpdateStateAxis}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </OptionContent>
          <ChartContent>
            {editModalData.type === "table" ? (
              <Table
                columns={tableData?.data?.columns}
                dataSource={tableData?.data?.rows}
                rowKey={(row) => row.key}
                pagination={{
                  total: tableData?.data?.rows?.length,
                  pageSize: 10
                }}
              />
            ) : (
              <div className="edit-chart-content">
                <Renderer
                  type={type}
                  data={editModalData?.filteredData}
                  options={options}
                  visualizationName={name}
                />
              </div>
            )}
          </ChartContent>
        </Content>
      </Modal>
    </Wrapper>
  );
};

export default EditModal;
