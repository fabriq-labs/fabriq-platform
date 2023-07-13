/* eslint-disable camelcase */
// InviteUser Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";

import { notification } from "antd";

import { Skeleton } from "../../components/Skeleton";
import { InviteUser } from "../../components/InviteUser";
import UsersApi from "../../api/user";
import UserInfo from "../../api/userinfo";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const Content = styled.div`
  min-height: 100%;
  overflow: hidden;
`;

// Main Component
const LoginPage = (props) => {
  const { token, location, org } = props;
  const { origin } = location;
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await UserInfo.verifyToken(token, origin, org)
        .then((res) => {
          if (res) {
            setUser(res.data);
            setLoading(false);
          }
        })
        .catch(() => {
          notification.warning({
            message: t("api:validate_user.error_message")
          });
          setLoading(false);
        });
    }
    fetchData();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  const signInWithGoogle = () => {
    let userData = null;
    let token_string = "";
    UsersApi.signInWithGoogle()
      .then((userInfo) => {
        userData = userInfo;
        if (userData.user.email === user.email && userData) {
          return userData.user.getIdToken();
        }
      })
      .then((result) => {
        if (result) {
          token_string = result;
          return UserInfo.updateClaims(user, result, origin, org);
        }
      })
      .then((res) => {
        if (userData.user.email === user.email) {
          localStorage.setItem(
            "user_id",
            (userData && userData.user && userData.user.uid) || ""
          );
          localStorage.setItem("user_email", user.email);
          if (token_string) {
            const data = {
              id: user.id,
              is_invitation_pending: false,
              ...user
            };
            localStorage.setItem("token", token_string || "");
            UserInfo.updateUserInfo(token_string, data, origin, org).then(
              () => {
                if (res && res.data && res.data.data) {
                  const orgInfo = res.data.data;
                  const orgDetails =
                    orgInfo["https://auth.metalimits.com/jwt/claims"] || null;

                  if (orgDetails && orgDetails.fabriq_orgs.length === 1) {
                    const org = orgDetails.fabriq_orgs[0];
                    const selected_org = JSON.stringify(org);
                    localStorage.setItem("organization", selected_org);
                    navigate("/");

                    window.location.reload();
                  } else {
                    navigate("/orgs", { state: { orgDetails } });
                  }
                } else {
                  notification.warning({
                    message: "Login Error",
                    description: "user not found, please try again later"
                  });
                }
              }
            );
          }
        } else {
          notification.warning({
            message: "Login Error",
            description: "please enter valid user info"
          });
        }
      })
      .catch((err) => {
        if (err) {
          notification.warning({
            message: "Login Error",
            description: err.message
          });
        }
        return Promise.resolve(err);
      });
  };

  const saveUser = (password) => {
    const data = {
      email: user.email,
      password: password
    };
    let token_string = "";
    let userData = null;

    setIsLoad(true);
    UsersApi.signup(data)
      .then((userInfo) => {
        userData = userInfo;
        if (userData) {
          return userData.getIdToken();
        }
      })
      .then((result) => {
        if (result) {
          token_string = result;
          return UserInfo.updateClaims(user, result, origin, org);
        }
      })
      .then((res) => {
        if (res) {
          localStorage.setItem("user_id", (userData && userData.uid) || "");
          localStorage.setItem("user_email", user.email);
          if (token_string) {
            const data = {
              id: user.id,
              is_invitation_pending: false,
              ...user
            };
            localStorage.setItem("token", token_string || "");
            UserInfo.updateUserInfo(token_string, data, origin, org).then(
              () => {
                if (res && res.data && res.data.data) {
                  const orgInfo = res.data.data;
                  const orgDetails =
                    orgInfo["https://auth.metalimits.com/jwt/claims"] || null;
                  localStorage.setItem(
                    "fabriq_orgs",
                    JSON.stringify(orgDetails.fabriq_orgs) || []
                  );
                  setIsLoad(false);
                  if (orgDetails && orgDetails.fabriq_orgs.length === 1) {
                    const org = orgDetails.fabriq_orgs[0];
                    const selected_org = JSON.stringify(org);
                    localStorage.setItem("organization", selected_org);
                    navigate("/");

                    window.location.reload();
                  } else {
                    navigate("/orgs", { state: { orgDetails } });
                  }
                } else {
                  notification.warning({
                    message: "Login Error",
                    description: "user not found, please try again later"
                  });
                }
              }
            );
          }
        }
      })
      .catch((err) => {
        notification.warning({
          message: t("login:login_page.login_error"),
          description: err.message
        });
        setIsLoad(false);
        return Promise.resolve(err);
      });
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Invite User</title>
      </Helmet>
      <Content>
        <InviteUser
          onNext={saveUser}
          signInWithGoogle={signInWithGoogle}
          isLoad={isLoad}
        />
      </Content>
    </Wrapper>
  );
};

export default React.memo(LoginPage, isEqual);
