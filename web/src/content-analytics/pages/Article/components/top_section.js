import React from "react";
import { Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const TopSection = () => {
  return (
    <Row style={{ marginBottom: 10 }}>
      <Col style={{ marginLeft: 20 }} span={3}>
        <Row>
          <Title level={1} style={{ fontSize: 14, fontWeight: "bold" }}>
            Politics
          </Title>
        </Row>
        <Row>
          <img
            src="/images/politics.webp"
            alt="Flowers in Chania"
            width="80px"
            height="70px"
          ></img>
        </Row>
      </Col>
      <Col span={20}>
        <Row>
          <Title style={{ fontSize: 16, color: "#0d67a0" }} level={2}>
            Saudi defense minister received by British counterpart in London
          </Title>
        </Row>
        <Row>
          <Text style={{ fontSize: 12, color: "#141010" }}>
            The ministers reflected on the strength of the historic defence
            partnership between the UK and the Kingdom
          </Text>
        </Row>
        <Row style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 12, color: "#141010" }}>
            First published Saturday 23 January 2022 05.59GMT(10 hours)
          </Text>
        </Row>
        <Row style={{ marginTop: 2 }}>
          <Text style={{ fontSize: 12, color: "#141010" }}>
            Last updated Saturday 23 January 2022 10.26GMT
          </Text>
        </Row>
      </Col>
    </Row>
  );
};

export default TopSection;
