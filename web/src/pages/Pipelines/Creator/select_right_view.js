// Select Right View Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { trim } from "lodash";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";

import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { ErrorMessage } from "../../../components/ErrorMessage";
import CreatePipeline from "./create_pipeline";

import Pipelines from "../../../api/pipelines";
import DataSource from "../../../api/datasource";

const Wrapper = styled.div`
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 80%;
`;

const InputRow = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SalesInfo = styled.div``;

const Title = styled.div`
  color: #4c5a67;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  padding-bottom: 20px;
`;

const ContentInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Info = styled.div`
  display: flex;
  width: 300px;
  padding-bottom: 42px;
`;

const Image = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 18px;
`;

const Details = styled.div``;

const DetailsTitle = styled.h1`
  color: #192734;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
`;

const DetailsInfo = styled.p`
  color: #4c5a67;
  font-size: 12px;
  line-height: 14px;
  padding-top: 4px;
`;

const ButtonRow = styled.div`
  padding-top: 12px;
`;

const PipelineList = ({ list, onClickMenuItem, title, disabled }) => {
  return (
    list.length !== 0 && (
      <SalesInfo>
        <Title> {title} </Title>{" "}
        <ContentInfo>
          {" "}
          {list.map((menu) => (
            <Info key={`${menu.id}`}>
              <Image>
                <img src={menu.image_url} alt="img" width={50} height={50} />
              </Image>{" "}
              <Details>
                <DetailsTitle> {menu.name} </DetailsTitle>{" "}
                <DetailsInfo> {menu.description} </DetailsInfo>{" "}
                <ButtonRow>
                  <Button
                    title="Connect"
                    variant="connect"
                    isDisabled={disabled}
                    onClick={() => onClickMenuItem(menu)}
                  />{" "}
                </ButtonRow>{" "}
              </Details>{" "}
            </Info>
          ))}{" "}
        </ContentInfo>{" "}
      </SalesInfo>
    )
  );
};

const SelectRightView = (props) => {
  const {
    refSource,
    onMenuItem,
    updatePipelineMenu,
    destinations,
    updateDestinations,
    disableLeftView,
    createNewPipelineModel
  } = props;
  const [error, setError] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [menu, setMenu] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isShowModal, setModalShow] = useState(false);
  const [searchResults, setSearchResults] = React.useState(refSource);
  const organization = JSON.parse(localStorage.getItem("organization"));
  const destination = destinations[0];
  const entitiesCount = menu.id === 31 ? 1 : 0;

  const updateFunction = (ref_item) => {
    updatePipelineMenu("connect");
  };

  const savePipeline = async () => {
    if (onMenuItem) {
      try {
        await Pipelines.insertPipeline(
          name,
          menu.description,
          menu.id,
          menu.entities,
          // [],
          organization.fabriq_org_id,
          organization.fabriq_user_id,
          destination.id,
          entitiesCount
        ).then((res) => {
          const { data } = res;
          if (
            data &&
            data.data &&
            data.data.insert_pipeline &&
            data.data.insert_pipeline.returning[0]
          ) {
            const item = data.data.insert_pipeline.returning[0];
            setModalShow(false);
            if (disableLeftView) {
              updateFunction(menu);
              createNewPipelineModel(item);
            } else {
              navigate(`/pipelines/${item.id}/edit`);
              updateFunction(menu);
            }
          }
        });
      } catch (e) {
        setError(e);
      }
    }
  };

  const handleNameChange = (event) => {
    const value = trim(event.target.value);
    setName(value);
    setIsValid(value !== "");
  };

  const onClickMenuItem = (menu) => {
    setModalShow(true);
    setMenu(menu);
  };

  const close = () => {
    setModalShow(false);
  };

  useEffect(() => {
    if (refSource.length !== 0) {
      const results = refSource.filter((source) =>
        source.name.toLowerCase().includes(searchTerm)
      );

      setSearchResults(results);
    }

    DataSource.getList(organization.fabriq_org_id).then((res) => {
      if (res && res.data && res.data.data.data_sources.length > 0) {
        updateDestinations(res.data.data.data_sources);
      } else {
        updateDestinations([]);
      }
    });
  }, [searchTerm]);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const salesConnectList = [];
  const customerServiceList = [];
  const fileList = [];
  const ecommerceList = [];
  const databaseList = [];
  const subscriptionList = [];
  const chatList = [];
  const projectManagement = [];
  const spreadSheet = [];
  const cloudBusinessManagement = [];
  if (searchResults.length !== 0) {
    searchResults.forEach((source) => {
      if (source.group === "Sales & Marketing") {
        salesConnectList.push(source);
      } else if (source.group === "Customer service") {
        customerServiceList.push(source);
      } else if (source.group === "File Storage") {
        fileList.push(source);
      } else if (source.group === "Ecommerce") {
        ecommerceList.push(source);
      } else if (source.group === "DataBase") {
        databaseList.push(source);
      } else if (source.group === "Payment") {
        subscriptionList.push(source);
      } else if (source.group === "Chat") {
        chatList.push(source);
      } else if (source.group === "Project Management") {
        projectManagement.push(source);
      } else if (source.group === "Spreadsheet") {
        spreadSheet.push(source);
      } else if (source.group === "Cloud Business Management") {
        cloudBusinessManagement.push(source);
      }
    });
  }

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const disabled = destinations.length === 0 ? true : false;

  return (
    <Wrapper>
      <InputRow>
        <Input
          placeholder="Search"
          isShowIcon
          value={searchTerm}
          onChange={handleChange}
        />{" "}
      </InputRow>{" "}
      <Content>
        <ContentWrapper>
          <PipelineList
            title="Sales Marketing"
            list={salesConnectList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Customer service"
            list={customerServiceList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="File Storage"
            list={fileList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Ecommerce"
            list={ecommerceList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="DataBase"
            list={databaseList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Payment"
            list={subscriptionList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Chat"
            list={chatList}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Project Management"
            list={projectManagement}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Spreadsheet"
            list={spreadSheet}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
          <PipelineList
            title="Cloud Business Management"
            list={cloudBusinessManagement}
            disabled={disabled}
            onClickMenuItem={onClickMenuItem}
          />{" "}
        </ContentWrapper>
      </Content>{" "}
      <CreatePipeline
        visible={isShowModal}
        handleNameChange={handleNameChange}
        name={name}
        isValid={isValid}
        close={close}
        savePipeline={savePipeline}
      />{" "}
    </Wrapper>
  );
};

SelectRightView.propTypes = {
  refSource: PropTypes.array, // eslint-disable-line
  onMenuItem: PropTypes.func
};

SelectRightView.defaultProps = {
  refSource: [],
  onMenuItem: null
};

export default React.memo(SelectRightView, isEqual);
