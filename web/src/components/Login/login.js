// Login Component
import React, { useState } from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import validator from "validator";
import { useTranslation } from "react-i18next";

import { Input } from "../Input";
import notification from "../../api/notification";

const WrapperForm = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 10%;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const ContentImage = styled.div`
  width: 30%;
`;

const ContentLogin = styled.div`
  width: 30%;
  margin-left: 5%;

  @media (max-width: 992px) {
    width: 100%;
    margin-left: 1%;
  }
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 2px;
  line-height: 34px;
  margin: 0 0 6% 0;
`;

const Form = styled.form`
  width: 100%;

  @media (max-width: 992px) {
    width: 90%;
    margin: 4%;
  }
`;

const FormRow = styled.div`
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`;

const ImageLogin = styled.img`
  max-width: 100%;
  height: auto;
`;

const FormButtonActive = styled.div`
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 0 10px;
  padding: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  line-height: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #48a3ee;
  background-color: #48a3ee;

  @media (max-width: 992px) {
    width: 95%;
  }
`;

const FormButtonLoad = styled.div`
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 0 10px;
  padding: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #f7f7f7;
  line-height: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #d4d0c8;
  background-color: #d4d7dd;

  @media (max-width: 992px) {
    width: 95%;
  }
`;

const Label = styled.div`
  padding: 5px 0 0 10px;
  width: 50%;
  font-weight: 700;
  font-size: 14px;
`;

// Main Component
const Login = (props) => {
  const { onLogin, active } = props;

  const [state, setState] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    loading: false
  });
  const { t } = useTranslation();

  const handleChange = (value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveAndContinue = () => {
    let noError = 0;

    setState((prevState) => ({
      ...prevState,
      loading: true
    }));

    if (validator.isEmpty(state.email) || validator.isEmpty(state.password)) {
      noError++;
      notification.warning(t("login:login_page.login_validation"));
    }

    if (!validator.isEmail(state.email) && !validator.isEmpty(state.email)) {
      noError++;
      notification.warning(t("login:login_page.email_validation"));
    }

    if (noError === 0) {
      if (onLogin) {
        onLogin(state);
        setState((prevState) => ({
          ...prevState,
          loading: true
        }));
      }
    }
  };

  const handleKeyPress = (charCode) => {
    if (charCode === 13) {
      saveAndContinue();
    }
  };

  const FormRowButton =
    (state.loading !== true) | (active === true)
      ? FormButtonActive
      : FormButtonLoad;

  return (
    <WrapperForm>
      <Content>
        <ContentImage>
          <ImageLogin src="/images/login.svg" alt="signup" />
        </ContentImage>
        <ContentLogin>
          <Heading>Sign-in</Heading>
          <Form onSubmit={saveAndContinue}>
            <FormRow>
              <Label>Email</Label>
              <Input
                placeholder="Email Address"
                type="text"
                name="email"
                variant="login"
                value={state.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </FormRow>
            <FormRow>
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                name="password"
                variant="login"
                value={state.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </FormRow>
            <FormRowButton onClick={saveAndContinue}>Login</FormRowButton>
          </Form>
        </ContentLogin>
      </Content>
    </WrapperForm>
  );
};

Login.propTypes = {
  active: PropTypes.bool,
  onLogin: PropTypes.func,
  signInWithGoogle: PropTypes.func
};

Login.defaultProps = {
  active: false,
  onLogin: null,
  signInWithGoogle: null
};

export default React.memo(Login, isEqual);
