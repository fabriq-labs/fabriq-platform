// Queries Component
import React from "react";
import isEqual from "react-fast-compare";
import { Table, Input, Modal } from "antd";
import moment from "moment";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";
import { Query } from "../../api/queries";
import notification from "../../api/notification";

// PageWrapper
const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
    margin-right: 12px;
  }
`;

const WrapperAutoComp = styled(Wrapper)`
  margin-left: 310px;
  overflow: hidden;
  .ant-table-tbody > tr > td {
    padding: 8px 8px;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
  flex-grow: 1;
`;

const Edit = styled.div`
  cursor: pointer;
`;

const SearchInfo = styled.div`
  margin-bottom: 20px;

  .ant-input {
    width: 200px;
  }
`;

const HeadingRow = styled.div`
  display: flex;
`;

const ButtonRow = styled.div`
  margin-left: 20px;

  .button {
    width: 82px;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
  }
`;

const HeadingLeft = styled.div`
  display: flex;
`;

// Main Component
const QueryList = (props) => {
  const {
    updateQuery,
    disableLeftView,
    showQueryView,
    searchTerm,
    setSearchTerm,
    queryState,
    getQueryList
  } = props;
  const WrapperComp = disableLeftView ? WrapperAutoComp : Wrapper;
  if (queryState?.loading) {
    return (
      <WrapperComp>
        <Skeleton />
      </WrapperComp>
    );
  }

  const list = queryState?.filterData;
  const rows = list?.map((row) => ({
    key: row.id,
    created_at: moment(row.created_at).format("MM/DD/YY HH:MM"),
    name: row.name,
    created_by: row.user.name,
    updated_at: moment(row.updated_at).format("MM/DD/YY hh:MM")
  }));

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const editRow = (key) => {
    if (disableLeftView) {
      showQueryView("view_query", key);
    } else {
      navigate(`/queries/${key}`);
    }

    updateQuery(false);
  };

  const deleteRow = (key) => {
    let variables = {
      id: key
    };

    const doDelete = () => {
      Query.delete(variables)
        .then(() => {
          notification.success("Query Deleted");
          if (getQueryList) getQueryList();
        })
        .catch((err) => notification.error(err));
    };

    Modal.confirm({
      title: "Delete Query",
      content: "Are you sure you want to delete this query?",
      okText: "Delete",
      okType: "danger",
      onOk: doDelete,
      maskClosable: true,
      autoFocusButton: null
    });
  };

  const onClick = () => {
    if (disableLeftView) {
      showQueryView("create_query", null);
    } else {
      navigate("/queries/create");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "Last Excuted At",
      dataIndex: "updated_at",
      key: "updated_at"
    },
    {
      title: "",
      dataIndex: "action",
      width: "3%",
      render: (_text, record) => (
        <Edit onClick={() => editRow(record.key)}>
          <i class="fa fa-edit" />
        </Edit>
      )
    },
    {
      title: "",
      dataIndex: "action",
      width: "3%",
      render: (_text, record) => (
        <Edit onClick={() => deleteRow(record.key)}>
          <i class="fa fa-trash" />
        </Edit>
      )
    }
  ];

  return (
    <WrapperComp>
      {!disableLeftView && (
        <Helmet>
          {/* <title>Explore | Fabriq</title> */}
          <title>Explore</title>
        </Helmet>
      )}

      <HeadingRow>
        <Heading>Queries</Heading>
        <HeadingLeft>
          <SearchInfo>
            <Input
              placeholder="search queries"
              isShowIcon
              value={searchTerm}
              onChange={handleChange}
            />
          </SearchInfo>
          <ButtonRow>
            <Button title="Create" variant="alert-save" onClick={onClick} />
          </ButtonRow>
        </HeadingLeft>
      </HeadingRow>
      <Table
        columns={columns}
        dataSource={rows || []}
        rowKey={(row) => row.key}
        pagination={{
          total: rows?.length,
          pageSize: disableLeftView ? 10 : 25
        }}
      />
    </WrapperComp>
  );
};

export default React.memo(QueryList, isEqual);
