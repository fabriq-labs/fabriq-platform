// CheckBox Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Table, Icon } from "antd";

import { EditModal } from ".";
import MessageCard from "./messageCard";
import QueryCard from "./query_card";

import { Renderer } from "../../pages/Query/editor-components/visualization_component";

const Wrapper = styled.div``;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  margin-top: 20px;

  .modebar {
    display: none;
  }

  .template-container {
    border-radius: 10px;
    padding: 20px;
    width: 100%;
    display: flex;
    gap: 20px;

    .chat-left-container {
      width: 60%;
      border: 1px solid #eceef2;
      border-radius: 10px;
      background-color: #fff;

      .ant-table-wrapper {
        margin: 0 20px;
      }
    }

    .chat-right-container {
      width: 40%;
      height: 100%;
    }
  }

  .btn-delete-module-wrapper {
    padding: 10px;
    .anticon-edit {
      cursor: pointer;
    }
  }

  .chat-query-container {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #eceef2;
  }

  .chat-message-wrapper{
    margin: 0 20px;
  }

  .chat-message-container {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #eceef2;
  }
`;

// Main Component
const Template = ({
  template,
  isOpenModal,
  handleClickClose,
  handleClickModalOpen,
  saveQuery,
  buttontitle
}) => {
  const [editTemplate, setEditTepmplate] = useState({
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
    const filterColumns = [];
    // eslint-disable-next-line no-unused-expressions
    template?.data?.columns.map((item) => {
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
    setEditTepmplate((preState) => ({
      ...preState,
      filteredData: {
        columns: filterColumns,
        rows: template?.data?.rows
      },
      columnMapping: columnMapping,
      xvalue: filterColumns[0]?.name,
      yvalue: filterColumns[1]?.name,
      type: template?.widget_type ? template?.widget_type : "table"
    }));
  }, [template]);

  const handleClickOK = (data) => {
    setEditTepmplate(data);
    handleClickClose();
  };

  const handleClickCancel = () => {
    setEditTepmplate(editTemplate);
    handleClickClose();
  };

  const type = "CHART";
  const name = "Chart";
  const options = {
    globalSeriesType: editTemplate?.globalSeriesType,
    legend: {
      enabled: true
    },
    columnMapping: editTemplate?.columnMapping,
    columns: editTemplate?.filteredData?.columns
  };

  return (
    <Wrapper>
      <Content>
        <div className="chat-message-wrapper">
        <div className="chat-message-container">
          {" "}
          <MessageCard messge={template?.message} />
        </div>
        </div>
        <div className="template-container">
          <div className="chat-left-container">
            <div
              className="btn-delete-module-wrapper"
              style={{ display: "flex", justifyContent: "end" }}
              onClick={handleClickModalOpen}
            >
              <Icon type="edit" />
            </div>
            {editTemplate?.type === "table" ? (
              <Table
                columns={template?.data?.columns}
                dataSource={template?.data?.rows}
                rowKey={(row) => row.key}
                pagination={{
                  total: template?.data?.rows?.length,
                  pageSize: 10
                }}
              />
            ) : (
              <div className="edit-chart-content">
                <Renderer
                  type={type}
                  data={editTemplate?.filteredData}
                  options={options}
                  visualizationName={name}
                />
              </div>
            )}
          </div>
          <div className="chat-right-container">
            <div className="chat-query-container">
              {" "}
              <QueryCard
                result={template?.query}
                saveQuery={saveQuery}
                title={buttontitle}
              />
            </div>
          </div>
        </div>
        <EditModal
          editTemplate={editTemplate}
          setEditTepmplate={setEditTepmplate}
          visible={isOpenModal}
          onCancel={handleClickCancel}
          tableData={template}
          handleClickOK={handleClickOK}
        />
      </Content>
    </Wrapper>
  );
};

export default React.memo(Template, isEqual);
