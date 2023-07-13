// Plans View Component
import React from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";

import { planList } from "./helpers/options";
import { Button } from "../../components/Button";

const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Info = styled.div``;

const Item = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  box-shadow: rgba(102, 136, 153, 0.15) 0px 4px 9px -3px;
  cursor: pointer;
  width: 134px;
  height: 180px;
  border-radius: 20px;
  margin-right: 60px;
`;

const Title = styled.div`
  align-self: center;
  color: #000;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
`;

const Amount = styled(Title)`
  font-weight: 600;
  font-size: 20px;
  line-height: 22px;
  margin-top: 20px;

  span {
    color: #ccccd0;
    margin-right: 4px;
  }
`;

const ButtonRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 134px;
  margin-top: 20px;
`;

const Footer = styled.div`
  margin-top: 20px;
`;

const Header = styled(Title)`
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  margin-bottom: 12px;
  margin-lefr: 10px;
`;

const Feature = styled(Title)`
  font-weight: 600;
  font-size: 13px;
  line-height: 15px;
  margin-bottom: 12px;
`;

// PipelineInfo Component
const ItemInfo = ({ item }) => {
  return (
    <Info>
      <Item>
        <Title>{item.plan}</Title>
        <Amount>
          <span>&#36;</span>
          {item.amount}
        </Amount>
      </Item>
      <ButtonRow>
        <Button title={item.status} variant="header" />
      </ButtonRow>
      <Footer>
        <Header>{`${item.plan} Features`}</Header>
        {item.features.map((feature, idx) => (
          <Feature key={`${idx}`}>{feature}</Feature>
        ))}
      </Footer>
    </Info>
  );
};

// Main Component
const PlansView = () => (
  <Wrapper>
    <Heading>Plans</Heading>
    <Content>
      {planList.map((plan) => (
        <ItemInfo item={plan} key={`${plan.id}`} />
      ))}
    </Content>
  </Wrapper>
);

export default React.memo(PlansView, isEqual);
