// User Edit Component
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";

import UserEdit from "../../components/Redash/UserEdit";
import User from "../../api/users";
import notification from "../../api/notification";
import { Sidebar } from "../../components/Sidebar";
import { menulist } from "../../components/Sidebar/helpers/options";
import { Skeleton } from "../../components/Skeleton";

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
const UserProfile = (props) => {
  const { userId, activeMenu, updateActiveMenu } = props;
  const [userInfo, setUser] = useState(null);

  useEffect(() => {
    User.get({ id: userId })
      .then((user) => setUser(User.convertUserInfo(user.data)))
      .catch((error) => notification.error(error.message));
  }, []);

  // setActive Menu
  const onMenuItem = (ident) => {
    navigate("/setup");

    if (updateActiveMenu) {
      updateActiveMenu(ident);
    }
  };

  let user_title = userInfo ? `${userInfo.name} | User Edit` : "User Edit";

  return (
    <Wrapper>
      <Helmet>
        <title>{user_title} | Setup</title>
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
              {userInfo ? <UserEdit user={userInfo} /> : <Skeleton />}
            </div>
          </Content>
        </ColRight>
      </PageContent>
    </Wrapper>
  );
};

UserProfile.propTypes = {
  rows: PropTypes.array // eslint-disable-line
};

UserProfile.defaultProps = {
  rows: []
};

export default React.memo(UserProfile, isEqual);
