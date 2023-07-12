import React from "react";
import { Row, Col, Typography } from "antd";

import BarChart from "./bar_chart";

const { Title } = Typography;

const BarChartSection = ({
  countryChartLabel,
  countryChartSeries,
  findChartLabel,
  findChartSeries,
  browserLabelValue,
  browserSeriesValue
}) => {
  return (
    <>
      <Row style={{ borderBottom: "2px solid #cbcac4", marginLeft: 10 }}>
        <Row>
          <Title
            lebel={1}
            style={{ fontSize: 16, marginTop: 5, marginBottom: 0 }}
          >
            Where is this being read?
          </Title>
        </Row>
        <Col align="center" span={24}>
          <BarChart
            labels={countryChartLabel}
            series={countryChartSeries}
            colors={["#EEBEDC"]}
          />
        </Col>
      </Row>
      <Row style={{ borderBottom: "2px solid #cbcac4", marginLeft: 10 }}>
        <Row>
          <Title
            lebel={1}
            style={{ fontSize: 16, marginTop: 5, marginBottom: 0 }}
          >
            How did people read this?
          </Title>
        </Row>
        <Col align="center" span={24}>
          <BarChart
            labels={browserLabelValue}
            series={browserSeriesValue}
            colors={["#ea8765"]}
          />
        </Col>
      </Row>
      <Row style={{ borderBottom: "2px solid #cbcac4", marginLeft: 10 }}>
        <Row>
          <Title
            lebel={1}
            style={{ fontSize: 16, marginTop: 5, marginBottom: 0 }}
          >
            How did people find this?
          </Title>
        </Row>
        <Col align="center" span={24}>
          <BarChart
            labels={findChartLabel}
            series={findChartSeries}
            colors={["#176193"]}
          />
        </Col>
      </Row>
    </>
  );
};
export default BarChartSection;
