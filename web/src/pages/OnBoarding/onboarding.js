// Workspace Component
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Icon, Button } from "antd";
import { reject } from "lodash";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import CreateSourceDialog from "../../components/Redash/CreateSourceDialog";
import helper from "../../components/Redash/DynamicHelper";
import CreateDashboardDialog from "../../components/Redash/CreateDashboardDialog";
import Datasource from "../../api/datasource";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const PageContent = styled.div`
  padding: 20px 100px;
  background-color: #f6f8f9;
  width: 100%;
  min-height: 100%;
`;

const Heading = styled.div`
  color: #000;
  font-weight: 600;
  font-size: 20px;
  padding-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  background-color: #fff;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
`;

const IconContent = styled.div`
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid rgba(102, 136, 153, 0.15);
`;

const Flex = styled.div`
  display: flex;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.85);
`;

const DetailsDiv = styled.div`
  padding-top: 10px;
  padding-left: 37px;
`;

const UserInfo = styled.div`
  margin-top: 20px;
`;

// Other Compoents
const Items = ({ onClickShow, isShow, props, heading, title }) => {
  return (
    <IconContent onClick={() => onClickShow(isShow)}>
      <Flex>
        <Icon
          type={isShow ? "down-circle" : "play-circle"}
          theme="twoTone"
          style={{ fontSize: "26px" }}
        />
        <Title>{heading}</Title>
      </Flex>
      {isShow && (
        <DetailsDiv>
          <UserInfo>
            <Button {...props}>{title}</Button>
          </UserInfo>
        </DetailsDiv>
      )}
    </IconContent>
  );
};

// Main Component
const Workspace = ({ destinations, updateDestinations }) => {
  const [Types, SetTypes] = useState([]);
  const [state, setState] = useState({
    isShowSetup: false,
    isShowPipeline: false,
    isShowQueries: false,
    isShowDashboard: false
  });
  let newDataSourceDialog = null;

  /* Handler Function */
  const onClickShow = (name, enable) => {
    setState((prevState) => ({
      ...prevState,
      [name]: enable
    }));
  };

  useEffect(() => {
    Datasource.types()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          SetTypes(res.data);
        }
      })
      .catch((err) => {
        return Promise.resolve(err);
      });
  }, []);

  const createDataSource = (selectedType, values) => {
    const target = { options: {}, type: selectedType.type };
    helper.updateTargetWithValues(target, values);

    return Datasource.create(target).then((res) => {
      Datasource.query().then((results) => {
        if (results && results.data.length !== 0) {
          updateDestinations(results.data);
        }
      });
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
          navigate(`/destinations/${result.data.id}`);
        }
      })
      .onDismiss(() => {
        newDataSourceDialog = null;
        navigate("/onboarding");
      });
  };

  const onClickDashboard = useCallback(() => {
    CreateDashboardDialog.showModal();
  }, []);

  const disabled = destinations.length === 0 ? true : false;
  const onNavigateUrl = () => {
    navigate("/pipelines/create");
  };

  const onNavigateQueries = () => {
    navigate("/queries/create");
  };

  const newDataSourceProps = {
    type: "primary",
    onClick: showCreateSourceDialog
  };

  const newPipelineProps = {
    type: "primary",
    onClick: onNavigateUrl,
    disabled: disabled
  };

  const newQueriesProps = {
    type: "primary",
    onClick: onNavigateQueries
  };

  const newDashboardProps = {
    type: "primary",
    onClick: onClickDashboard
  };

  return (
    <Wrapper>
      <Helmet>
        <title>OnBoard</title>
      </Helmet>
      <PageContent>
        <Heading>Set up your workspace</Heading>
        <Content>
          <Items
            heading="Setup your destination"
            title="Add New Destination"
            props={newDataSourceProps}
            isShow={state.isShowSetup}
            onClickShow={() => onClickShow("isShowSetup", !state.isShowSetup)}
          />
          <Items
            heading="Connect your first pipeline"
            title="Add New Pipeline"
            props={newPipelineProps}
            isShow={state.isShowPipeline}
            onClickShow={() =>
              onClickShow("isShowPipeline", !state.isShowPipeline)
            }
          />
          <Items
            heading="Setup your queries"
            title="Add New Queries"
            props={newQueriesProps}
            isShow={state.isShowQueries}
            onClickShow={() =>
              onClickShow("isShowQueries", !state.isShowQueries)
            }
          />
          <Items
            heading="Setup new dashboard"
            title="Add New Dashboard"
            props={newDashboardProps}
            isShow={state.isShowDashboard}
            onClickShow={() =>
              onClickShow("isShowDashboard", !state.isShowDashboard)
            }
          />
        </Content>
      </PageContent>
    </Wrapper>
  );
};

export default Workspace;
