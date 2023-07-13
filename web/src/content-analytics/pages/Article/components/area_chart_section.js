import React from "react";
import { Row, Col, Typography } from "antd";

import { articleData } from "../../../utils/helper";

import StackAreaChart from "./stack_area_chart";

const { Title } = Typography;
const AreaChartSection = () => {
  return (
    <Row style={{ borderBottom: "2px solid #cbcac4", marginLeft: 10 }}>
      <Col span={3}>
        <Row>
          <Title style={{ fontSize: 18, marginTop: 10 }} level={1}>
            158,087
          </Title>
        </Row>
        <Row>
          <Title style={{ fontSize: 10, marginTop: -10 }} level={1}>
            page views
          </Title>
        </Row>
        <Row>
          <Title style={{ fontSize: 18, marginTop: 10 }} level={1}>
            2m 57s
          </Title>
        </Row>
        <Row>
          <Title style={{ fontSize: 10, marginTop: -10 }} level={1}>
            median attention time
          </Title>
        </Row>
      </Col>
      <Col span={21}>
        <StackAreaChart
          series={articleData()?.viewsPerMin}
          labels={[
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00"
          ]}
        />
      </Col>
    </Row>
  );
};

export default AreaChartSection;
