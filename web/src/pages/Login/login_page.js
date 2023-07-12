/* eslint-disable camelcase */
// Login Page Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";

import { notification } from "antd";

import { Login } from "../../components/Login";
import UserApi from "../../api/user";

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
const LoginPage = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    // remove the localhost data
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("organization");
  }, []);

  const onLogin = (data) => {
    UserApi.login(data.email, data.password)
      .then((res) => {
        localStorage.setItem(
          "user_id",
          (res && res.user && res.user.uid) || ""
        );
        localStorage.setItem("user_email", data.email);
        res.user.getIdToken().then((result) => {
          const decoded = jwt_decode(result);
          const orgDetails =
            decoded["https://auth.metalimits.com/jwt/claims"] || null;

          localStorage.setItem("token", result || "");
          localStorage.setItem(
            "fabriq_orgs",
            JSON.stringify(orgDetails.fabriq_orgs) || []
          );
          if (orgDetails && orgDetails.fabriq_orgs.length === 1) {
            const org = orgDetails.fabriq_orgs[0];
            const selected_org = JSON.stringify(org);
            localStorage.setItem("organization", selected_org);
            navigate("/overview");

            window.location.reload();
          } else if (orgDetails && orgDetails.fabriq_orgs.length > 1) {
            navigate("/orgs", { state: { orgDetails } });
          } else {
            notification.warning({
              message: "Login Error",
              description: "user not found, please try again later"
            });
          }
        });
      })
      .catch((err) => {
        notification.warning({
          message: t("login:login_page.login_error"),
          description: err.message
        });
        setActive(true);
      });
  };

  const signInWithGoogle = () => {
    UserApi.signInWithGoogle()
      .then((res) => {
        localStorage.setItem(
          "user_id",
          (res && res.user && res.user.uid) || ""
        );
        res.user.getIdToken().then((result) => {
          const decoded = jwt_decode(result);
          const orgDetails =
            decoded["https://auth.metalimits.com/jwt/claims"] || null;
          localStorage.setItem("token", result || "");
          localStorage.setItem(
            "fabriq_orgs",
            JSON.stringify(orgDetails.fabriq_orgs) || []
          );
          if (orgDetails && orgDetails.fabriq_orgs.length === 1) {
            const org = orgDetails.fabriq_orgs[0];
            const selected_org = JSON.stringify(org);
            localStorage.setItem("organization", selected_org);
            navigate("/");

            window.location.reload();
          } else if (orgDetails && orgDetails.fabriq_orgs.length > 1) {
            navigate("/orgs", { state: { orgDetails } });
          } else {
            notification.warning({
              message: "Login Error",
              description: "user not found, please enter proper details"
            });
          }
        });
      })
      .catch((err) => {
        if (err) {
          notification.warning({
            message: "Login Error",
            description: err.message
          });
        }
      });
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Content>
        <Login
          onLogin={onLogin}
          signInWithGoogle={signInWithGoogle}
          active={active}
        />
      </Content>
    </Wrapper>
  );
};

export default React.memo(LoginPage, isEqual);
