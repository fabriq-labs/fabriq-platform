// User View Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import UserEdit from "../../components/Redash/UserEdit";

import { Skeleton } from "../../components/Skeleton";
import User from "../../api/users";
import { Dashboard } from "../../api/dashboard";
import notification from "../../api/notification";

const Wrapper = styled.div``;

const UserContent = styled.div`
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 4px 9px -3px rgba(102, 136, 153, 0.15);
  background-color: #fff !important;
  padding: 20px !important;
`;

// Main Component
const UserView = (props) => {
  const [userInfo, setUser] = useState(null);
  const [Dashboards, setDashboardList] = useState([]);
  const organization = JSON.parse(localStorage.getItem("organization"));
  const { t } = useTranslation();

  const getDashboard = () => {
    const email = localStorage.getItem("user_email");
    const params = {
      page_size: 250
    };

    Dashboard.query(params)
      .then((res) => {
        const { results } = res;
        const dashboardList = [];
        if (results.length !== 0) {
          results.forEach((item) => {
            if (item.user.email === email) {
              dashboardList.push(item);
            }
          });
          setDashboardList(dashboardList);
        }

        return Promise.resolve([]);
      })
      .catch((err) => {
        notification.error(t("setup:user.userDashboard_error"), err.message);
        return Promise.resolve(err);
      });
  };

  useEffect(() => {
    User.get({ id: organization.fabriq_user_id })
      .then((user) => {
        setUser(User.convertUserInfo(user.data));
        props.updateHomeDashboard(user.data.home_db_slug);
        return getDashboard();
      })
      .catch((error) => notification.error(error.message));
  }, []);

  const list = Dashboards;
  let options = [];

  if (list.length > 0) {
    options = list.map((row) => ({
      key: row.id,
      slug: row.slug,
      label: row.name,
      value: row.slug
    }));
  }

  const handleChangeFrom = (opt) => {
    props.updateHomeDashboard(opt ? opt.value : "");
    const data = {
      id: organization.fabriq_user_id,
      home_db_slug: opt.slug
    };

    User.save(data).then((user) => {
      setUser(User.convertUserInfo(user.data));
    });
  };

  return (
    <Wrapper>
      <UserContent>
        <div className="row">
          {userInfo ? (
            <UserEdit
              user={userInfo}
              options={options}
              isMyProfile
              selectedDashboard={props.homeDashboard}
              handleChangeFrom={handleChangeFrom}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      </UserContent>
    </Wrapper>
  );
};

export default React.memo(UserView, isEqual);
