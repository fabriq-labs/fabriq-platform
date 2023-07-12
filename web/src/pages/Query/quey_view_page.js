// Query view Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import QueryView from "./query_view";
import { Skeleton } from "../../components/Skeleton";
import { QuerySidebar } from "../../components/QuerySidebar";
import { dashboardList } from "../../components/QuerySidebar/helpers/options";

import { Query } from "../../api/queries";
import QueryDetails from "../../api/query_details";
import notification from "../../api/notification";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;

  .query-results-footer {
    .css-1im46kq {
      svg {
        vertical-align: unset !important;
      }
    }

    .edit-ttl {
      padding-left: 5px;
    }
  }

  .m-r-5-refresh {
    margin-right: 10px;
  }
`;

const WrapperAutomation = styled(Wrapper)`
  top: 132px;
  width: 80%;
  margin-left: 310px;
`;

const PageContentDiv = styled.div`
  display: flex;
  min-height: 100%;
`;

const PageContentAutomation = styled.div`
  min-height: 100%;
`;

const ColLeft = styled.div``;

const ColRight = styled.div`
  background-color: #f6f8f9;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 15px;
  margin-right: auto;
  margin-left: auto;
`;

const ColRightAutomation = styled(ColRight)`
  background-color: #fff;
  padding-right: 40px;
  padding-left: 40px;
`;

// Main Component
const QueryViewPage = (props) => {
  const [loading, setloading] = useState(true);
  const {
    queryId,
    queryActiveMenu,
    updateQueryActiveMenu,
    mainMenu,
    updateMainMenu,
    updateQueryObj,
    query_isShared,
    item,
    disableLeftView,
    showQueryView,
    queryFolder
  } = props;
  const { t } = useTranslation();
  useEffect(() => {
    getQuery();
  }, []);

  const getQuery = () => {
    Query.get({ id: queryId })
      .then((query) => {
        const { data } = query;
        updateQueryObj(data);
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        notification.error(t("query:myquerie.queryview_error"), err.message);
      });
  };

  /* Handler Function */
  const onMenuItem = (ident) => {
    navigate("/queries");
    if (updateQueryActiveMenu) {
      updateQueryActiveMenu(ident);
    }
  };

  const onMainMenuItem = (ident) => {
    if (updateMainMenu) {
      updateMainMenu(ident);
    }
  };

  const folderList = queryFolder?.filter((item) => item?.id !== "myquery");

  if (disableLeftView) {
    return (
      <WrapperAutomation>
        <PageContentAutomation>
          <ColRightAutomation>
            {loading ? (
              <Skeleton />
            ) : (
              <QueryView
                query_isShared={query_isShared}
                item={item}
                queryId={queryId}
                disableLeftView={disableLeftView}
                showQueryView={showQueryView}
                folderList={folderList}
              />
            )}
          </ColRightAutomation>
        </PageContentAutomation>
      </WrapperAutomation>
    );
  }

  let query_helmet = props.item ? `${props.item.name}` : "Query View";

  return (
    <Wrapper className="query-fixed-layout">
      <Helmet>
        <title>{query_helmet} | Explore | Fabriq</title>
      </Helmet>
      <PageContentDiv>
        <ColLeft>
          <QuerySidebar
            activeMenu={queryActiveMenu}
            onMenuItem={onMenuItem}
            dashboardList={dashboardList}
            mainMenu={mainMenu}
            onMainMenuItem={onMainMenuItem}
          />
        </ColLeft>
        <ColRight>
          {loading ? (
            <Skeleton />
          ) : (
            <QueryView
              query_isShared={query_isShared}
              folderList={folderList}
              item={item}
              updateQueryActiveMenu={updateQueryActiveMenu}
              queryId={queryId}
            />
          )}
        </ColRight>
      </PageContentDiv>
    </Wrapper>
  );
};

export default React.memo(QueryViewPage, isEqual);
