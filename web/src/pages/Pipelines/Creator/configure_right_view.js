// Cofigure Right View Component
import React from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";

import { BaseConfigure } from "./index";

import Configure from "../../../api/configure";
import notification from "../../../api/notification";

const Wrapper = styled.div`
  width: 100%;
`;

const UserInfo = styled.div`
  display: flex;
`;

const ImageBack = styled.img`
  width: 30px;
  height: 30px;
`;

const ImageDivForward = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

// Main Component
const ConfigureRightView = (props) => {
  const {
    item,
    pipeline,
    onBackMenuItem,
    isCredit,
    destinations,
    disableLeftView,
    destinationId,
    onClickBackView
  } = props;

  const organization = JSON.parse(localStorage.getItem("organization"));

  const onComplete = (
    id,
    sync_from,
    sync_frequency,
    entities,
    transform,
    transform_url,
    destination_id
  ) => {
    Configure.updatePipeline(
      id,
      sync_from,
      sync_frequency,
      entities,
      transform,
      transform_url,
      destination_id,
      organization.fabriq_org_id
    ).then((res) => {
      const { data } = res;
      if (
        data &&
        data.data &&
        data.data.update_pipeline &&
        data.data.update_pipeline.returning[0]
      ) {
        if (disableLeftView) {
          onClickBackView();
        } else {
          notification.success("saved");
        }
      }
    });
  };

  const onBack = (
    id,
    sync_from,
    sync_frequency,
    entities,
    transform,
    transform_url,
    destination_id
  ) => {
    Configure.updatePipeline(
      id,
      sync_from,
      sync_frequency,
      entities,
      transform,
      transform_url,
      destination_id,
      organization.fabriq_org_id
    ).then((res) => {
      const { data } = res;
      if (
        data &&
        data.data &&
        data.data.update_pipeline &&
        data.data.update_pipeline.returning[0]
      ) {
        if (onBackMenuItem) {
          onBackMenuItem("connect", item);
        }
      }
    });
  };

  const onClickPipelineView = () => {
    navigate(`/pipelines/${pipeline.id}/view`);
  };

  if (!pipeline) {
    return null;
  }

  return (
    <Wrapper>
      <UserInfo>
        <ImageDivForward
          onClick={disableLeftView ? onClickBackView : onClickPipelineView}
        >
          <ImageBack src="/images/forward.png" alt={"forward"} />
        </ImageDivForward>
      </UserInfo>
      <BaseConfigure
        item={item}
        destinations={destinations}
        pipeline={pipeline}
        onComplete={onComplete}
        isCredit={isCredit}
        onBack={onBack}
        destinationId={destinationId}
        disableLeftView={disableLeftView}
      />
    </Wrapper>
  );
};

export default React.memo(ConfigureRightView, isEqual);
