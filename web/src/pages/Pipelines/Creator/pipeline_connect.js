// Pipeline Connect Component
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import queryString from "query-string";
import { Result, Icon } from "antd";

import { Skeleton } from "../../../components/Skeleton";
import Pipeline from "../../../api/pipeline_connect";
import notification from "../../../api/notification";

const Wrapper = styled.div``;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PipelineConnect = (props) => {
  const parsed = queryString.parse(props.location.search);
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await Pipeline.callback(parsed)
        .then((res) => {
          setState(res.data.status);
          setLoading(false);
          setTimeout(() => {
            window.close();
          }, 3000);
        })
        .catch((error) => {
          setLoading(false);
          notification.error(error);
        });
    }
    fetchData();
  }, []);

  if (state === "" && loading) {
    return <Skeleton />;
  }

  return (
    <Wrapper>
      <Content>
        <Result
          icon={
            <Icon
              type={state === "success" ? "check-circle" : "close-circle"}
              theme="twoTone"
            />
          }
          title={
            state === "success"
              ? "Connected successfuly"
              : "Something went wrong!!"
          }
        />
      </Content>
    </Wrapper>
  );
};

export default PipelineConnect;
