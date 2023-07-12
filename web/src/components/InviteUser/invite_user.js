// InviteUser Component
import React, { useState } from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import validator from "validator";
import { useTranslation } from "react-i18next";
import { Button } from "antd";

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
`;

const ContentImage = styled.div`
  width: 30%;
`;

const ContentLogin = styled.div`
  width: 30%;
  margin-left: 5%;
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 2px;
  line-height: 34px;
  margin: 0 0 20px 15px;
`;

const Form = styled.form`
  width: 100%;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 10px;
  background: #f1f1f1;
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

const Text = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  margin: 0 12px 12px 12px;
`;

const Image = styled.img`
  width: 20px;
  height: 20px;
  padding: 1px;
`;

const ImageLogin = styled.img`
  max-width: 100%;
  height: auto;
`;

const FormRowLine = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  margin-left: 15%;
`;

const Label = styled.div`
  padding: 5px 0 0 10px;
  width: 50%;
  font-weight: 700;
  font-size: 14px;
`;

const LabelSignIn = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

const FormRowSignIn = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

// Main Component
const InviteUser = (props) => {
  const { onNext, signInWithGoogle, isLoad } = props;
  const { t } = useTranslation();

  const [state, setState] = useState({
    password: ""
  });

  const handleChange = (value, name) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveAndContinue = (event) => {
    event.preventDefault();
    let noError = 0;

    if (validator.isEmpty(state.password)) {
      noError++;
      notification.warning(t("login:login_page.password_validation"));
    }

    if (noError === 0) {
      if (onNext) {
        onNext(state.password);
      }
    }
  };

  return (
    <WrapperForm>
      <Content>
        <ContentImage>
          <ImageLogin src="/images/login.svg" alt="signup" />
        </ContentImage>
        <ContentLogin>
          <Heading>Welcome to fabriq</Heading>
          <Form onSubmit={saveAndContinue}>
            <FormRow>
              <FormRowSignIn onClick={signInWithGoogle}>
                <Image src="/images/google_logo.png" alt="signup" />
                <LabelSignIn>Sign In With Google</LabelSignIn>
              </FormRowSignIn>
            </FormRow>
            <FormRowLine>
              <Line></Line>
              <Text>or</Text>
              <Line></Line>
            </FormRowLine>
            <FormRow>
              <Label>Password</Label>
              <Input
                placeholder="Password"
                type="password"
                name="password"
                variant="login"
                value={state.password}
                onChange={handleChange}
              />
            </FormRow>
            <Button
              block
              type="primary"
              onClick={saveAndContinue}
              loading={isLoad}
              disabled={isLoad}
            >
              Password Update
            </Button>
          </Form>
        </ContentLogin>
      </Content>
    </WrapperForm>
  );
};

InviteUser.propTypes = {
  onNext: PropTypes.func,
  signInWithGoogle: PropTypes.func
};

InviteUser.defaultProps = {
  onNext: null,
  signInWithGoogle: null
};

export default React.memo(InviteUser, isEqual);
