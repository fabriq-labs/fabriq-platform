// Connection View Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { Table, Modal, Input, Icon, Tooltip, Button } from "antd";
import moment from "moment";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Skeleton } from "../../components/Skeleton";
import notification from "../../api/notification";
import Connections from "../../api/connection";

const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
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

const Content = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const SearchInfo = styled.div`
  width: 20%;
`;

// Main Component
const ConnectionView = () => {
  const [state, setState] = useState({
    loading: true,
    connections: [],
    isLoad: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  const getConnection = () => {
    const params = {
      page_size: 100
    };

    Connections.get(params)
      .then((result) => {
        const { data } = result;

        const results = data?.results.map((item) => {
          const res = { ...item };
          res.loading = false;
          res.disabled = false;

          return res;
        });
        setState((prevState) => ({
          ...prevState,
          connections: results,
          loading: false
        }));
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        notification.error(
          t("setup:connectionview.connectionview_error"),
          err.message
        );
      });
  };

  // Get Rows
  useEffect(() => {
    getConnection();
  }, []);

  if (state.loading) {
    return <Skeleton />;
  }

  const list = state.connections;
  const filterList = list.filter(
    (list) =>
      list.name && list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filterList?.map((row) => ({
    key: row.id,
    type: row.Source.name,
    created_at: moment(row.created_at).format("MMM Do YY"),
    name: row.name,
    loading: row.loading,
    disabled: row.disabled
  }));

  const clearState = (index) => {
    const list = [...state.connections];
    if (list[index]) {
      list[index].loading = false;
      list[index].disabled = false;
    }

    setState((prevState) => ({
      ...prevState,
      connections: list
    }));
  };

  const testConnection = (connectionId) => {
    const list = [...state.connections];
    const index = list.findIndex((p) => p.id === connectionId);

    if (list[index]) {
      list[index].loading = true;
      list[index].disabled = true;
    }

    setState((prevState) => ({
      ...prevState,
      connections: list
    }));

    setTimeout(() => {
      notification.warning(t("setup:connectionview.testconnection_message"));
      clearState(index);
    }, 1000);
  };

  const editRow = (key) => {
    Modal.confirm({
      title: "Delete Connections",
      content: "Are you sure you want to delete this connection?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        Connections.delete(key)
          .then(() => {
            setState((prevState) => ({
              ...prevState,
              loading: true
            }));
            getConnection();
          })
          .catch((err) => {
            notification.error(
              t("setup:connectionview.connectionviewDelete_error"),
              err.message
            );
          });
      },
      maskClosable: true,
      autoFocusButton: null
    });
  };

  const columns = [
    {
      title: "Account",
      dataIndex: "name",
      key: "name",
      width: "50%"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%"
    },
    {
      title: "Last Connected",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%"
    },
    {
      title: "",
      dataIndex: "testconnection",
      width: "15%",
      render: (_text, record) => (
        <Button
          key="Test Connection"
          htmlType="button"
          disabled={record?.disabled}
          loading={record?.loading}
          onClick={() => testConnection(record.key)}
        >
          Test
        </Button>
      )
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      render: (_text, record) => (
        <Edit onClick={() => editRow(record.key)}>
          <Tooltip title="Delete" placement="bottom">
            <Icon type="delete" theme="twoTone" />
          </Tooltip>
        </Edit>
      )
    }
  ];

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Wrapper>
      <Content>
        <Heading>Accounts</Heading>
        <SearchInfo>
          <Input
            placeholder="search"
            isShowIcon
            value={searchTerm}
            onChange={handleChange}
          />
        </SearchInfo>
      </Content>
      <div>
        <Table
          columns={columns}
          style={{ marginLeft: 3 }}
          dataSource={rows}
          rowKey={(row) => row.key}
          pagination={{
            total: rows.length,
            pageSize: 25
          }}
        />
      </div>
    </Wrapper>
  );
};

export default React.memo(ConnectionView, isEqual);
