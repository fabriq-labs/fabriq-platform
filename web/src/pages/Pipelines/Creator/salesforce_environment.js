// Pipeline Connect Component
import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input } from "antd";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Select } from "../../../components/Select";
import { salesforceOption } from "../helpers/options";

import PipelineConnect from "../../../api/pipeline_connect";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background-color: #f6f8f9;
`;

const Heading = styled.div`
  color: #5f6c72;
  font-weight: 600;
  font-size: 13px;
  padding-bottom: 10px;

  span {
    color: #ff4a00;
    font-size: 11px;
    padding-left: 2px;
  }
`;

const SelectComp = styled.div`
  width: 350px;

  .css-1okebmr-indicatorSeparator,
  .css-109onse-indicatorSeparator {
    display: none;
  }
`;

const Flex = styled.div`
  margin-top: 10px;
  .ant-btn-primary {
    margin-right: 10px;
  }

  .anticon-loading {
    vertical-align: unset !important;
  }
`;

const MainContent = styled.div``;

const Row = styled.div`
  margin-top: 10px;

  .ant-input {
    height: 38px;
  }
`;

const SalesforceEnvironment = (props) => {
  const [type, selectType] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  /* onClick Functions */
  const handleChange = (opt) => {
    selectType(opt ? opt.value : "");
  };

  const onChange = (e) => {
    setDomain(e.target.value);
  };

  const onContinue = () => {
    const { pipelineId, redirect_url } = props;
    const is_sandbox = type === "sandbox" ? true : false;
    setLoading(true);
    const data = {
      pipeline_id: pipelineId,
      config: {
        is_sandbox,
        domain
      }
    };

    PipelineConnect.init(data)
      .then((res) => {
        const { data } = res;
        if (data.status === "success") {
          window.location = redirect_url;
        }
      })
      .catch((_err) => {
        notification.error({
          message: t("pipeline:salesforce.connection_message"),
          description: t("pipeline:salesforce.connection_description")
        });
      });
  };

  return (
    <Wrapper>
      <Content>
        <MainContent>
          <Heading>
            Salesforce Environment<span>(required)</span>
          </Heading>
          <SelectComp>
            <Select
              options={salesforceOption}
              value={type}
              onChange={handleChange}
            />
            <Row>
              <Heading>
                Custom Domain<span>(optional)</span>
              </Heading>
              <Input
                value={domain}
                onChange={onChange}
                placeholder="Enter your custom domain"
              />
            </Row>
          </SelectComp>
          <Flex>
            <Button
              type="primary"
              disabled={!type}
              onClick={onContinue}
              loading={loading}
            >
              Continue
            </Button>
            <Button onClick={props.onCancel}>Cancel</Button>
          </Flex>
        </MainContent>
      </Content>
    </Wrapper>
  );
};

export default SalesforceEnvironment;
