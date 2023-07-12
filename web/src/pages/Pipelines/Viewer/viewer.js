// Viewer Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { Input, Result, Icon } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";

import { Button } from "../../../components/Button";
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

const PageContent = styled.div`
  padding: 30px;
  background-color: #f6f8f9;
  width: 100%;
  min-height: 100%;
`;

const PipeLineContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  background-color: #fff;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
`;

const Heading = styled.div`
  color: #000;
  align-self: end;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  flex-grow: 1;
`;

const Content = styled.div`
  width: 100%;
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid rgba(102, 136, 153, 0.15);
`;

const Image = styled.div`
  img {
    width: 35px;
    height: 35px !important;
  }
`;

const Info = styled.div`
  width: 25%;
  align-self: center;
`;

const Title = styled.div`
  align-self: center;
  color: #4c5a67;
  font-weight: 700;
  font-size: 14px;
`;

const TypeTitle = styled(Title)`
  margin-left: 10px;
`;

const StatusImage = styled.img`
  width: 22px;
  height: 22px;
`;

const ImageContent = styled.div``;

const ButtonRow = styled.div`
  margin-left: 20px;

  .button {
    width: 82px;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
  }
`;

const Message = styled.div`
  align-self: center;
  color: #000002;
  font-size: 14px;
  font-weight: 700;
`;

const HeaderWrapper = styled.div`
  width: 100%;
`;

const TitleDiv = styled.div`
  display: flex;
`;

const PipelineHeaderTitle = styled.div`
  width: 25%;
  color: #e7e7e7;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
`;

const TypeDiv = styled.div`
  display: flex;
`;

const AppTitleStatus = styled.span``;

const SearchInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 20px;

  .ant-input {
    width: 150px;
  }
`;

// PipelineInfo Component
const PipelineInfo = ({ pipeline }) => {
  const { source, entities_count } = pipeline;
  const testDateUtc = moment.utc(pipeline.last_ran_at);
  const localDate = moment(testDateUtc).local();
  const syncInfo = `${moment(localDate).fromNow()}`;

  /* Handler Functionn */
  const onClickPipeline = () => {
    navigate(`/pipelines/${pipeline.id}/view`);
  };

  return (
    <Content onClick={onClickPipeline}>
      <HeaderWrapper>
        <TitleDiv>
          <PipelineHeaderTitle>Type</PipelineHeaderTitle>
          <PipelineHeaderTitle>Name</PipelineHeaderTitle>
          <PipelineHeaderTitle>Entities</PipelineHeaderTitle>
          <PipelineHeaderTitle>Status</PipelineHeaderTitle>
          <PipelineHeaderTitle>Last Run</PipelineHeaderTitle>
        </TitleDiv>
      </HeaderWrapper>
      <TitleDiv>
        <Info>
          <TypeDiv>
            <Image>
              <img src={source.image_url} alt="img" />
            </Image>
            <TypeTitle>{source.name}</TypeTitle>
          </TypeDiv>
        </Info>
        <Info>
          {" "}
          <Title>{pipeline.name}</Title>
        </Info>
        <Info>
          {" "}
          <Title>{entities_count ? entities_count : 0}</Title>
        </Info>
        <Info>
          <ImageContent>
            {pipeline.status === true ? (
              <TitleDiv>
                <StatusImage src="/images/start_icon.png" alt="start" />
                &nbsp;&nbsp;
                <AppTitleStatus>Active</AppTitleStatus>
              </TitleDiv>
            ) : (
              <TitleDiv>
                <StatusImage src="/images/stop_icon.png" alt="stop" />
                &nbsp;&nbsp;
                <AppTitleStatus>Pause</AppTitleStatus>
              </TitleDiv>
            )}
          </ImageContent>
        </Info>
        <Info>
          <Message>{syncInfo}</Message>
        </Info>
      </TitleDiv>
    </Content>
  );
};

// Viewer Component
const Viewer = (props) => {
  const [Loading, setLoading] = useState(true);
  const [pipelines, setPipelines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  useEffect(() => {
    Pipelines.getList(organization.fabriq_org_id)
      .then((res) => {
        const { data } = res;
        if (data && data.data && data.data.pipeline.length !== 0) {
          setPipelines(data.data.pipeline);
          setLoading(false);
        }

        setLoading(false);
        return Promise.resolve([]);
      })
      .catch((err) => {
        setLoading(false);
        notification.error(t("viewer:viewer.pipeline_error"), err.message);
      });
  }, []);

  if (Loading) {
    return <Skeleton />;
  }

  /* Handler Functionn */
  const onClick = () => {
    navigate("/pipelines/create");
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Wrapper>
      <Helmet>
        {/* <title>Connect | Fabriq</title> */}
        <title>Connect</title>
      </Helmet>
      <PageContent>
        {pipelines.length > 0 && (
          <SearchInfo>
            <Heading>Connections</Heading>
            <Input
              placeholder="search"
              isShowIcon
              value={searchTerm}
              onChange={handleChange}
            />
            <ButtonRow>
              <Button title="Create" variant="alert-save" onClick={onClick} />
            </ButtonRow>
          </SearchInfo>
        )}
        <PipeLineContent>
          {pipelines?.map((pipeline) => (
            <PipelineInfo pipeline={pipeline} key={`${pipeline.id}`} />
          ))}
        </PipeLineContent>
        {pipelines.length === 0 && (
          <Result
            icon={<Icon type="play-square" theme="twoTone" />}
            title="Let's build a new pipeline"
            extra={
              <Button title="Start" variant="alert-save" onClick={onClick} />
            }
          />
        )}
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(Viewer, isEqual);
