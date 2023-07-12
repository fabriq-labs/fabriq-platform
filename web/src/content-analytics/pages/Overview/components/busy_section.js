import React from "react";
import { Row, Col } from "antd";
import styled from "styled-components";

import { AreaChart } from "./index";
import { TitleComp } from "../../../components/Title";
import { numberConvertion } from "../../../utils/helper";

const Wrapper = styled.div`
  .overViewStats {
    margin-top: 25px;
  }

  .overViewSelect {
    margin-right: 10px;
    margin-bottom: 20px;
  }
`;

const BusyDaySection = ({
  heading,
  trafficDetail,
  description,
  views,
  chartValues,
  pageView,
  avgTime,
  visitors
}) => {
  let view = !views ? [] : [...views];
  if (views?.length > 0) {
    view.forEach((v) => {
      if (v.title === "Page Views") {
        v.value = pageView;
      }
      if (v.title === "Avg. Time") {
        v.value = avgTime;
      }
      if (v.title === "Visitors") {
        v.value = visitors;
      }
    });
  }

  return (
    <Wrapper>
      <Row gutter={16}>
        <Col span={8}>
          <Row>
            <Col span={6}>
              <TitleComp title={heading} type="Heading" />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <TitleComp title={trafficDetail} type="Description" />
            </Col>
          </Row>
          <Row style={{ marginTop: 14 }}>
            <Col span={24}>
              <TitleComp title={description} type="Description" />
            </Col>
          </Row>
          <Row>
            {view?.map((sec, i) => {
              return (
                <Col key={i} span={8} className={"overViewStats"}>
                  <Row>
                    <TitleComp title={sec.title} type="Description" />
                  </Row>
                  <Row>
                    {sec?.title === "Avg. Time" ? (
                      <TitleComp title={sec.value} type="Heading3" />
                    ) : (
                      <TitleComp
                        title={numberConvertion(sec.value)}
                        type="Heading3"
                      />
                    )}
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={16}>
          <Row
            gutter={16}
            style={{
              justifyContent: "end"
            }}
            className="overViewSelect"
          ></Row>
          <AreaChart
            labels={chartValues?.labels}
            series={chartValues?.series}
          />
        </Col>
      </Row>
    </Wrapper>
  );
};
export default BusyDaySection;
