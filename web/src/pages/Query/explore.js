// Explore Page
import React, { useEffect } from "react";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "@reach/router";

import ChatPage from "../Chat/chat";
import QueryPage from "../../containers/query";

import { updateQueryObj, updateIsQuery } from "../../actions/query";

import notification from "../../api/notification";
import { Query } from "../../api/queries";

const ExploreWrapper = styled.div`
  .ant-checkbox-wrapper {
    float: right;
    padding: 10px;
  }
`;

const ExplorePage = () => {
  const switchValue = useSelector((state) => state?.explore?.isQuery);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateIsQuery(false));
  }, []);

  const handleClickQuery = (id) => {
    Query.get({ id: id })
      .then((query) => {
        const { data } = query;
        dispatch(updateQueryObj(data));

        navigate(`/queries/${data.id}/source`);
      })
      .catch((err) => {
        notification.error(err?.message);
      });
  };

  return (
    <ExploreWrapper>
      {!switchValue ? (
        <ChatPage />
      ) : (
        <QueryPage handleClickQuery={handleClickQuery} />
      )}
    </ExploreWrapper>
  );
};

export default React.memo(ExplorePage, isEqual);
