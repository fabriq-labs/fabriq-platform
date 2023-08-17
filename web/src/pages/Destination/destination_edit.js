// Destination Edit Page Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import PropTypes from "prop-types";
import { get, find } from "lodash";
import { navigate } from "@reach/router";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";

import { Skeleton } from "../../components/Skeleton";
import DynamicForm from "../../components/Redash/DynamicForm";
import helper from "../../components/Redash/DynamicHelper";

import notification from "../../api/notification";
import { notification as notificationAntd } from "antd";
import DataSource from "../../api/datasource";
import SchemaApi from "../../api/elt";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .left-icon {
    padding-left: 15px;
    padding-top: 15px;
    font-size: 15px;
    cursor: pointer;
  }
`;

const PageContent = styled.div`
  display: flex;
  background-color: #f6f8f9;
  min-height: 100%;
`;

const ColRight = styled.div`
  width: 100%;
  padding: 20px 100px;
`;

const DataSourceContent = styled.div`
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 4px 9px -3px rgba(102, 136, 153, 0.15);
  background-color: #fff !important;
  padding: 15px !important;
`;

const Image = styled.img`
  width: 64px;
  height: 64px;
  margin-right: 5px;
`;

const Name = styled.h3`
  font-size: 23px;
  color: #323232;
  margin: 0 !important;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ant-form {
    min-width: 350px;
    max-width: 350px;
  }

  .dynamic-form .extra-options-button {
    height: 40px;
    font-weight: 500;
    background-color: rgba(102, 136, 153, 0.1);
    border-color: rgba(102, 136, 153, 0.15);
    color: #595959;
  }

  .ant-collapse.ant-collapse-headerless .ant-collapse-header {
    display: none;
  }

  .ant-collapse.ant-collapse-headerless .ant-collapse-item,
  .ant-collapse.ant-collapse-headerless .ant-collapse-content {
    border: 0;
  }

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .ant-collapse.ant-collapse-headerless {
    border: 0;
    background: none;
  }

  .ant-input-number {
    width: 100%;
  }

  .ant-btn {
    margin-right: 15px;
  }

  hr {
    margin-bottom: 10px;
  }
`;

const Info = styled.div`
  margin-bottom: 10px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EditInfo = ({ type, dataSource, getDataSource }) => {
  // Destionation Save
  const saveDataSource = (values, successCallback, errorCallback) => {
    helper.updateTargetWithValues(dataSource, values);
    DataSource.save(dataSource)
      .then(() => successCallback("Saved."))
      .catch((error) => {
        const message = get(error, "response.data.message", "Failed saving.");
        errorCallback(message);
      });
  };
  const { t } = useTranslation();

  // Destionation Delete
  const deleteDataSource = (callback) => {
    const doDelete = () => {
      DataSource.delete(dataSource)
        .then(() => {
          notification.success(
            t("destination:destination_edit.datasourcedelete_success")
          );
          navigate("/setup", { state: { activeMenu: "destination" } });
        })
        .catch(() => {
          callback();
        });
    };

    Modal.confirm({
      title: "Delete Data Source",
      content: "Are you sure you want to delete this data source?",
      okText: "Delete",
      okType: "danger",
      onOk: doDelete,
      onCancel: callback,
      maskClosable: true,
      autoFocusButton: null
    });
  };

  const testConnection = (callback) => {
    DataSource.test({ id: dataSource.id })
      .then((httpResponse) => {
        const { data } = httpResponse;
        if (data.ok) {
          notification.success(
            t("destination:destination_edit.connection_success")
          );
        } else {
          notification.error(
            t("destination:destination_edit.connectiontest_error"),
            data.message,
            { duration: 10 }
          );
        }
        callback();
      })
      .catch(() => {
        notification.error(
          t("destination:destination_edit.connectiontest_failed"),
          { duration: 10 }
        );
        callback();
      });
  };

  const reconnect = (callback) => {
    DataSource.get_redirecturi(dataSource.id)
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
            callback();
            getDataSource();
          }
        }, 1000);
      })
      .catch((err) => {
        callback();
        Promise.reject(err);
      });
  };

  const organization = JSON.parse(localStorage.getItem("organization"));

  const getDeploy = (callback) => {
    SchemaApi.deployDestionation(
      dataSource.id,
      organization.fabriq_org_id,
      organization.fabriq_org_slug
    )
      .then((res) => {
        notificationAntd.success({
          message: "Deployed"
        });
        if (res?.data?.url) {
        } else if (res?.data?.status === "error") {
          notificationAntd.error({
            message: t("pipeline:base_configure.deployment_error"),
            description: res?.data?.message
          });
        }
      })
      .catch((err) => {
        notificationAntd.warning({
          message: t("pipeline:base_configure.deployment_error"),
          description: err?.message
        });
        callback();
      });
  };

  const fields = helper.getFields(type, dataSource);
  const formProps = {
    dataSource,
    fields,
    type,
    actions: [
      { name: "Delete", type: "danger", callback: deleteDataSource },
      {
        name: "Test Connection",
        // pullRight: true,
        callback: testConnection,
        disableWhenDirty: true
      },
      { name: "Deploy", callback: getDeploy, pullRight: true },
      {
        name: "Re Authorize",
        pullRight: true,
        callback: reconnect,
        disableWhenDirty: true
      }
    ],
    onSubmit: saveDataSource,
    feedbackIcons: true
  };

  return (
    <div className="row">
      <Info>
        <Image src={`/images/db_logos/${type.type}.png`} alt={type.name} />
        <Name>{type.name}</Name>
      </Info>
      <div className="col-md-4 col-md-offset-4 m-b-10">
        <DynamicForm {...formProps} />
      </div>
    </div>
  );
};

// Main Component
const DestinationEdit = (props) => {
  const { dataSourceId } = props;
  const [state, setState] = useState({
    dataSource: null,
    type: null
  });
  const { t } = useTranslation();

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = () => {
    DataSource.get({ id: dataSourceId })
      .then((res) => {
        if (res && res.data) {
          const { type } = res.data;
          DataSource.types().then((types) => {
            const { data } = types;
            const item = find(data, { type });
            setState((prevState) => ({
              ...prevState,
              dataSource: res.data,
              type: item
            }));
          });
        }
        return Promise.resolve({});
      })
      .catch((err) => {
        notification.error(
          t("destination:destination_edit.destination_error"),
          err.message
        );
        return Promise.resolve(err);
      });
  };

  const onRedirectBack = () => {
    navigate("/destinations");
  };

  let destination_helmet = state.dataSource
    ? `${state.dataSource.name} | Destination Edit`
    : "Destination Edit";

  return (
    <Wrapper>
      <Helmet>
        <title>{destination_helmet} | Setup | Fabriq</title>
      </Helmet>
      <PageContent>
        <div className="left-icon" onClick={onRedirectBack}>
          <i className="fa fa-arrow-left" aria-hidden="true" />
        </div>
        <ColRight>
          <DataSourceContent>
            {state.dataSource ? (
              <Content>
                <EditInfo
                  dataSource={state.dataSource}
                  type={state.type}
                  getDataSource={getDataSource}
                />
              </Content>
            ) : (
              <Skeleton />
            )}
          </DataSourceContent>
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

DestinationEdit.propTypes = {
  dataSourceId: PropTypes.string
};

DestinationEdit.defaultProps = {
  dataSourceId: ""
};

export default React.memo(DestinationEdit, isEqual);
