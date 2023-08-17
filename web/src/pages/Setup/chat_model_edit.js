// Chat Model Edit Component
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import ChatModelEdit from "../../components/Redash/ChatModelEdit";
import notification from "../../api/notification";
import { Sidebar } from "../../components/Sidebar";
import { menulist } from "../../components/Sidebar/helpers/options";
import { Skeleton } from "../../components/Skeleton";
import { ChatModel } from "../../api/chatModel";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: scroll;
`;

const PageContent = styled.div`
  display: flex;
  min-height: 100%;
`;

const ColRight = styled.div`
  width: 100%;
  background-color: #f6f8f9;
  padding: 20px 100px;
`;

const Content = styled.div`
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 4px 9px -3px rgba(102, 136, 153, 0.15);
  background-color: #fff !important;
  padding: 20px !important;
`;

const ColLeft = styled.div``;

// Main Component
const ChatModelProfile = (props) => {
  const { modelId, activeMenu, updateActiveMenu } = props;
  const [chatModelInfo, setChatModelInfo] = useState(null);

  useEffect(() => {
    ChatModel.get(modelId)
      .then((res) => setChatModelInfo(res?.data))
      .catch((error) => notification.error(error.message));
  }, []);

  // setActive Menu
  const onMenuItem = (ident) => {
    navigate("/setup");

    if (updateActiveMenu) {
      updateActiveMenu(ident);
    }
  };

  let site_name = chatModelInfo ? `${chatModelInfo?.chat_modal?.name} | Chat Model Edit` : "Chat Model Edit";

  return (
    <Wrapper>
      <Helmet>
        <title>{site_name} | Setup</title>
      </Helmet>
      <PageContent>
        <ColLeft>
          <Sidebar
            menulist={menulist}
            activeMenu={activeMenu}
            onMenuItem={onMenuItem}
          />
        </ColLeft>
        <ColRight>
          <Content>
            <div className="row">
              {chatModelInfo ? (
                <ChatModelEdit chatModelInfo={chatModelInfo} id={modelId} />
              ) : (
                <Skeleton />
              )}
            </div>
          </Content>
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

ChatModelProfile.propTypes = {
  rows: PropTypes.array
};

ChatModelProfile.defaultProps = {
  rows: []
};

export default React.memo(ChatModelProfile, isEqual);
