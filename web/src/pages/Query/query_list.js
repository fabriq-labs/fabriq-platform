// Queries Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { QuerySidebar } from "../../components/QuerySidebar";
import MyQueries from "./my_queries";

import { Query } from "../../api/queries";
import notification from "../../api/notification";

// PageWrapper
const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const WrapperAutomation = styled(Wrapper)`
  top: 132px;
`;

const PageContent = styled.div`
  display: flex;
  min-height: 100%;
`;

const PageContentAutomation = styled.div`
  min-height: 100%;
`;

const ColLeft = styled.div``;

const ColRight = styled.div`
  width: 100%;
  background-color: #f6f8f9;
  padding: 20px 100px;
`;

const ColRightAutomation = styled(ColRight)`
  background-color: #fff;
  padding: 20px 40px;
  width: 95%;
`;

// Main Component
const QueryList = (props) => {
  const {
    queryActiveMenu,
    updateQueryActiveMenu,
    updateQuery,
    updateQueryObj,
    disableLeftView,
    showQueryView
  } = props;

  const [state, setState] = useState({
    loading: true,
    filterData: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    getQueryList();
  }, [searchTerm, queryActiveMenu]);

  const getQueryList = () => {
    const params = {
      page_size: 250,
      q: searchTerm
    };
    Query.query(params)
      .then((res) => {
        const { results } = res;

        let filterList = [];
        if (queryActiveMenu === "myquery") {
          filterList = results.filter(
            (item) => !item?.query_folder || item?.query_folder === null
          );
        } else {
          filterList = results.filter(
            (item) => item?.query_folder?.id === queryActiveMenu
          );
        }

        setState((prevState) => ({
          ...prevState,
          filterData: filterList,
          loading: false
        }));
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        notification.error(t("query:myquerie.queryview_error"), err.message);
      });
  };

  const onMenuItem = (ident, i) => {
    if (updateQueryActiveMenu) {
      updateQueryActiveMenu(ident);
    }
  };

  if (disableLeftView) {
    return (
      <WrapperAutomation>
        <PageContentAutomation>
          <ColRightAutomation>
            <MyQueries
              updateQuery={updateQuery}
              updateQueryObj={updateQueryObj}
              disableLeftView={disableLeftView}
              showQueryView={showQueryView}
              queryState={state}
              getQueryList={getQueryList}
            />
          </ColRightAutomation>
        </PageContentAutomation>
      </WrapperAutomation>
    );
  }

  return (
    <Wrapper>
      <PageContent>
        <ColLeft>
          <QuerySidebar activeMenu={queryActiveMenu} onMenuItem={onMenuItem} />
        </ColLeft>
        <ColRight>
          <MyQueries
            updateQuery={updateQuery}
            updateQueryObj={updateQueryObj}
            disableLeftView={disableLeftView}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            queryState={state}
            getQueryList={getQueryList}
          />
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

export default React.memo(QueryList, isEqual);
