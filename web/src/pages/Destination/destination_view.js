// Destination Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Button, Table } from "antd";
import { reject } from "lodash";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";

import { PermissionDenied } from "../../components/PermissionDenied";
import { Skeleton } from "../../components/Skeleton";
import CreateSourceDialog from "../../components/Redash/CreateSourceDialog";
import helper from "../../components/Redash/DynamicHelper";

import Datasource from "../../api/datasource";
import notification from "../../api/notification";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .ant-table-wrapper {
    background-color: #fff;
  }
`;

const PageContent = styled.div`
  min-height: 100%;
  padding: 20px 100px;
  background-color: #f6f8f9;
`;

const Edit = styled.div`
  cursor: pointer;
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

// Main Component
const Destination = (props) => {
  const [datasourceList, setDatasourceList] = useState([]);
  const [Types, SetTypes] = useState([]);
  const [isShowErrorComponent, setShowErrorComponent] = useState(false);
  const [Loading, setLoading] = useState(true);

  let newDataSourceDialog = null;
  const { updateDestinations } = props;
  const { t } = useTranslation();

  const onClick = (id) => {
    navigate(`/destinations/${id}`);
  };

  useEffect(() => {
    Promise.all([Datasource.query(), Datasource.types()])
      .then((values) => {
        if (values.length > 0) {
          const result = values[0].data.map((item) => {
            const res = { ...item };
            res.loading = false;
            res.disabled = false;

            return res;
          });
          setDatasourceList(result);
          updateDestinations(values[0].data);
          SetTypes(values[1].data);
          setLoading(false);
        }

        setLoading(false);
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 403") {
          setShowErrorComponent(true);
          setLoading(false);
        } else {
          setLoading(false);
          notification.error(
            t("destination:destination_view.destination_error"),
            err.message
          );
          return Promise.resolve(err);
        }
      });
  }, []);

  const createDataSource = (selectedType, values) => {
    const target = { options: {}, type: selectedType.type };
    helper.updateTargetWithValues(target, values);

    return Datasource.create(target).then((res) => {
      setLoading(true);
      if (target.type !== "fabriq_google_spreadsheets") {
        Datasource.query().then((results) => {
          if (results && results.data.length !== 0) {
            const result = results.data.map((item) => {
              const res = { ...item };
              res.loading = false;
              res.disabled = false;

              return res;
            });
            setDatasourceList(result);
            updateDestinations(results.data);
            setLoading(false);
          }
        });
      }

      return res.data;
    });
  };

  const showCreateSourceDialog = () => {
    const list = [
      "pg",
      "bigquery",
      "snowflake",
      "fabriq_google_spreadsheets",
      "athena",
      "redshift",
      "redshift_iam"
    ];
    const typeObj = Types.filter((opt) => list.includes(opt.type));
    newDataSourceDialog = CreateSourceDialog.showModal({
      types: reject(typeObj, "deprecated"),
      sourceType: "Data Source",
      imageFolder: "/images/db_logos",
      helpTriggerPrefix: "DS_",
      onCreate: createDataSource
    });

    newDataSourceDialog
      .onClose((result = {}) => {
        newDataSourceDialog = null;
        if (result.success) {
          if (result.data.type === "fabriq_google_spreadsheets") {
            Datasource.get_redirecturi(result.data.id)
              .then((res_data) => {
                const { data } = res_data;
                const popup = window.open(
                  data.url,
                  "windowname1",
                  "width=800, height=600"
                );
                const timer = setInterval(() => {
                  if (popup && popup.closed) {
                    clearInterval(timer);
                    setLoading(false);
                    navigate(`/destinations/${result.data.id}`);
                  }
                }, 1000);
              })
              .catch((err) => Promise.reject(err));
          }
          navigate(`/destinations/${result.data.id}`);
        }
      })
      .onDismiss(() => {
        newDataSourceDialog = null;
        console.log("onDismiss");
      });
  };

  const clearState = (index) => {
    const list = [...datasourceList];
    if (list[index]) {
      list[index].loading = false;
      list[index].disabled = false;
    }

    setDatasourceList(list);
  };

  const testConnection = (datasourceId) => {
    const list = [...datasourceList];
    const index = list.findIndex((p) => p.id === datasourceId);

    if (list[index]) {
      list[index].loading = true;
      list[index].disabled = true;
    }

    setDatasourceList(list);
    Datasource.test({ id: datasourceId })
      .then((httpResponse) => {
        const { data } = httpResponse;
        if (data.ok) {
          notification.success(
            t("destination:destination_edit.connection_success")
          );
          clearState(index);
        } else {
          notification.error(
            t("destination:destination_edit.connectiontest_error"),
            data.message,
            { duration: 10 }
          );
          clearState(index);
        }
      })
      .catch(() => {
        notification.error(
          t("destination:destination_edit.connectiontest_failed"),
          { duration: 10 }
        );
        clearState(index);
      });
  };

  if (Loading) {
    return <Skeleton />;
  }

  const newDataSourceProps = {
    type: "primary",
    onClick: showCreateSourceDialog
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (_text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <img
              className="p-5"
              width="48"
              src={`/images/db_logos/${_text}.png`}
              alt={_text}
            />
          </div>
          <div style={{ textTransform: "capitalize" }}>
            {_text === "pg" ? "PostgreSQL" : _text}
          </div>
        </div>
      )
    },
    {
      title: "",
      dataIndex: "testconnection",
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
      render: (_text, record) => (
        <Edit onClick={() => onClick(record.key)}>
          <i class="fa fa-edit" />
        </Edit>
      )
    }
  ];

  const rows = datasourceList?.map((row) => ({
    key: row.id,
    name: row.name,
    type: row.type,
    loading: row.loading,
    disabled: row.disabled
  }));

  return (
    <Wrapper>
      <PageContent>
        <Heading>Destinations</Heading>
        {isShowErrorComponent && <PermissionDenied />}
        {!isShowErrorComponent && (
          <UserInfo>
            <Button {...newDataSourceProps}>New</Button>
          </UserInfo>
        )}
        {!isShowErrorComponent && (
          <Table
            columns={columns}
            dataSource={rows}
            rowKey={(row) => row.key}
          />
        )}
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(Destination, isEqual);
