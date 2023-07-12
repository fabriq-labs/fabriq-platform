// EditorView View Signup
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";

import { ConnectRightView, ConfigureRightView } from "./index";

import { QueryPage } from "../../Query";
import MyQueries from "../../../containers/my_queries";
import QueryView from "../../../containers/query_view";
import QueryEdit from "../../../containers/query_edit";

import { Header } from "../../../components/Header";
import { Skeleton } from "../../../components/Skeleton";
import Pipelines from "../../../api/pipelines";
import notification from "../../../api/notification";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const WrapperAutoComp = styled.div`
  margin: 10px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100%;
  width: 100%;
`;

const PageColRightAuto = styled.div`
  flex-grow: 1;
  padding: 0px 120px 10px 30px;
`;

const PageColRightCon = styled.div`
  flex-grow: 1;
  padding: 36px 120px 10px 120px;
`;

const Content = styled.div`
  padding-top: 20px;
`;

const QueryContent = styled.div`
  margin-bottom: 40px;
`;

// EditorView Component
const EditorView = (props) => {
  const {
    pipelineMenu,
    pipelineId,
    destinations,
    updateRedirectUrl,
    updatePipelineId,
    disableLeftView,
    onClickBackView,
    destinationId,
    dataSourceId
  } = props;
  const [step, setStep] = useState(pipelineMenu === "connect" ? 1 : 2);
  const [activeQueryMenu, showQuery] = useState("query_list");
  const [queryId, setQueryId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(
    pipelineMenu === "connect" ? "connect" : "configure"
  );
  const [state, setState] = useState({
    activeItem: null,
    pipelineItem: null
  });
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const onMenuItem = (identifier, menu) => {
    if (identifier === "configure") {
      setActiveMenu(identifier);
      setStep(2);
      setState((prevState) => ({
        ...prevState,
        activeItem: menu
      }));
    }
  };

  const onClickItem = (identifier) => {
    if (identifier === "configure") {
      setActiveMenu(identifier);
      setStep(2);
    }

    if (identifier === "connect") {
      setActiveMenu(identifier);
      setStep(1);
    }

    if (identifier === "data") {
      setActiveMenu(identifier);
      setStep(3);
    }
  };

  const onBackMenuItem = (identifier, menu) => {
    if (identifier === "connect") {
      setActiveMenu(identifier);
      setStep(1);
      setState((prevState) => ({
        ...prevState,
        activeItem: menu
      }));
    }
  };

  const showCreateQuery = (name, id) => {
    showQuery(name);
    if (id) {
      setQueryId(id);
    }
  };

  const onOrderChange = (value) => {
    showQuery(value);
  };

  useEffect(() => {
    Pipelines.getPipelineWithId(pipelineId, organization.fabriq_org_id)
      .then((res) => {
        const { data } = res;
        if (data && data.data && data.data.pipeline.length !== 0) {
          const pipelineData = data.data.pipeline[0];
          setState((prevState) => ({
            ...prevState,
            pipelineItem: pipelineData,
            activeItem: pipelineData.source
          }));
        }

        return Promise.resolve([]);
      })
      .catch((err) => {
        notification.error(t("pipeline:editor_View.message"), err.message);
        return Promise.resolve(err);
      });
  }, []);

  if (!state.activeItem && !state.pipelineItem) {
    return <Skeleton />;
  }

  const WrapperComp = disableLeftView ? WrapperAutoComp : Wrapper;
  const PageColRight = disableLeftView ? PageColRightAuto : PageColRightCon;

  return (
    <WrapperComp>
      <PageContent>
        <PageColRight>
          <Header
            activeMenu={activeMenu}
            onClickItem={onClickItem}
            isEdit
            item={state.activeItem}
          />
          <Content>
            {step === 1 && (
              <ConnectRightView
                item={state.activeItem}
                pipelineMenu={pipelineMenu}
                updateRedirectUrl={updateRedirectUrl}
                updatePipelineId={updatePipelineId}
                pipeline={state.pipelineItem}
                piplineId={state.pipelineItem.id}
                onMenuItem={onMenuItem}
              />
            )}
            {step === 2 && (
              <ConfigureRightView
                item={state.activeItem}
                pipeline={state.pipelineItem}
                destinations={destinations}
                onBackMenuItem={onBackMenuItem}
                disableLeftView={disableLeftView}
                destinationId={destinationId}
                onClickBackView={onClickBackView}
              />
            )}
            {step === 3 && (
              <>
                <Radio.Group
                  defaultValue={activeQueryMenu}
                  size="small"
                  onChange={(e) => onOrderChange(e.target.value)}
                >
                  <Radio.Button value="query_list">Query List</Radio.Button>
                  <Radio.Button value="create_query">Scratchpad</Radio.Button>
                </Radio.Group>
                {activeQueryMenu === "create_query" && (
                  <QueryContent>
                    <QueryPage
                      dataSourceId={dataSourceId}
                      disableLeftView={disableLeftView}
                    />
                  </QueryContent>
                )}
                {activeQueryMenu === "query_list" && (
                  <MyQueries
                    disableLeftView={disableLeftView}
                    showQueryView={showCreateQuery}
                  />
                )}
                {activeQueryMenu === "view_query" && (
                  <QueryView
                    disableLeftView={disableLeftView}
                    queryId={queryId}
                    showQueryView={showCreateQuery}
                  />
                )}
                {activeQueryMenu === "edit_query" && (
                  <QueryEdit disableLeftView={disableLeftView} />
                )}
              </>
            )}
          </Content>
        </PageColRight>
      </PageContent>
    </WrapperComp>
  );
};

export default React.memo(EditorView, isEqual);
