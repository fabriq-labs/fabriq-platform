// Creater View
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";

import {SelectRightView, ConnectRightView, ConfigureRightView } from "./index";
import { Header } from "../../../components/Header";
import { Skeleton } from "../../../components/Skeleton";

import Source from "../../../api/source";
import notification from "../../../api/notification";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const WrapperAutoMation = styled.div`
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
  padding-top: 30px;
`;

// CreaterView Component
const CreaterView = (props) => {
  const {
    updatePipelineMenu,
    destinations,
    updateDestinations,
    updateRedirectUrl,
    updatePipelineId,
    disableLeftView,
    destinationId,
    createNewPipelineModel
  } = props;
  const [step, setStep] = useState(1);
  const [activeMenu, setActiveMenu] = useState("source");
  const [activeItem, setactiveItem] = useState({});
  const [pipelineItem, setPipeline] = useState({});
  const [state, setState] = useState({
    error: "",
    loading: true,
    refSource: []
  });
  const { t } = useTranslation();

  useEffect(() => {
    Source.getSourceList()
      .then((res) => {
        const { data } = res;
        if (data && data.data && data.data.ref_source.length !== 0) {
          setState((prevState) => ({
            ...prevState,
            refSource: data.data.ref_source,
            loading: false
          }));
        }

        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        return Promise.resolve([]);
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));

        notification.error(t("pipeline:creator_view.message"), err.message);
        return Promise.resolve(err);
      });
  }, []);

  const onMenuItem = (identifier, menu, pipeline) => {

    if (identifier === "connect") {
      setActiveMenu(identifier);
      setStep(2);
      setactiveItem(menu);
      setPipeline(pipeline);
    }

    if (identifier === "configure") {
      setActiveMenu(identifier);
      setStep(3);
      setactiveItem(menu);
    }
  };

  if (state.loading) {
    return <Skeleton />;
  }

  const WrapperComp = disableLeftView ? WrapperAutoMation : Wrapper;
  const PageColRight = disableLeftView ? PageColRightAuto : PageColRightCon;

  return (
    <WrapperComp>
      <PageContent>
        <PageColRight>
          <Header activeMenu={activeMenu} isDisable />
          <Content>
            {step === 1 && (
              <SelectRightView
                refSource={state.refSource}
                destinations={destinations}
                disableLeftView={disableLeftView}
                createNewPipelineModel={createNewPipelineModel}
                onMenuItem={onMenuItem}
                updatePipelineMenu={updatePipelineMenu}
                updateDestinations={updateDestinations}
              />
            )}
            {step === 2 && (
              <ConnectRightView
                item={activeItem}
                pipeline={pipelineItem}
                isCredit
                piplineId={pipelineItem.id}
                updateRedirectUrl={updateRedirectUrl}
                updatePipelineId={updatePipelineId}
                onMenuItem={onMenuItem}
              />
            )}
            {step === 3 && (
              <ConfigureRightView
                item={activeItem}
                destinationId={destinationId}
                isCredit
                pipeline={pipelineItem}
                onMenuItem={onMenuItem}
              />
            )}
          </Content>
        </PageColRight>
      </PageContent>
    </WrapperComp>
  );
};

export default React.memo(CreaterView, isEqual);
