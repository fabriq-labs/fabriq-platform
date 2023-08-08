import React from "react";
import styled from "styled-components";

import { Row, Col, Card, Tabs, Timeline, Icon } from "antd";

const { TabPane } = Tabs;

const TimelineWarpper = styled.div`
  margin: 10px;
  p {
    align-items: center;
    display: flex;
    i {
      padding-right: 5px;
    }
  }
  .p-10 {
    padding-left: 10px;
  }
  .txt-desc {
    max-width: 60%;
  }
  .row {
    padding-left: 10px;
  }
  .time-div {
    display: flex;
    justify-content: space-between;
}
  }
`;

const CenterSection = () => {
  return (
    <Card
      style={{
        width: "100%",
        boxShadow: "rgba(0, 0, 0, 0.2) 5px 5px 10px",
        borderRadius: 10,
        padding: 24
      }}
    >
      <Row>
        <Col span={2}>
          <img
            src="/images/engagement_new.png"
            alt="img"
            width={39}
            height={39}
          />
        </Col>
        <Col span={19} style={{ alignSelf: "center" }}>
          <div className="calculated">Engagement History</div>
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }}>
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Feed" key="1">
              <TimelineWarpper>
                <Timeline>
                  <Timeline.Item
                    dot={<Icon type="phone" style={{ fontSize: "20px" }} />}
                    color="lightgrey"
                  >
                    <div className="row">
                      <div className="col-m-12">
                        <h5>
                          Argentina erupts in joy after team reaches World Cup
                          final
                        </h5>
                        <div className="time-div">
                          <p>
                            <Icon type="glasses" theme="filled" /> Mobile
                            Article
                          </p>
                          <p>
                            1 minute ago{" "}
                            <Icon
                              className="p-10"
                              style={{ fontSize: "20px" }}
                              type="down-square"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    dot={<Icon type="mail" style={{ fontSize: "20px" }} />}
                    color="lightgrey"
                  >
                    <div className="row">
                      <div className="col-m-12">
                        <h5>
                          International camel festival encourages Saudis to
                          embrace their heritage
                        </h5>
                        <div className="time-div">
                          <p>
                            <Icon type="diamond" theme="filled" /> Opened
                            Newsletter
                          </p>
                          <p>
                            1 day ago{" "}
                            <Icon
                              className="p-10"
                              style={{ fontSize: "20px" }}
                              type="down-square"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    dot={<Icon type="like" style={{ fontSize: "20px" }} />}
                    color="lightgrey"
                  >
                    <div className="row">
                      <div className="col-m-12">
                        <h5>
                          Saudi defense minister received by British counterpart
                          in London
                        </h5>
                        <div className="time-div">
                          <p>
                            <Icon type="heart" theme="filled" /> Liked
                          </p>
                          <p>
                            2 days ago{" "}
                            <Icon
                              className="p-10"
                              style={{ fontSize: "20px" }}
                              type="down-square"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    dot={
                      <Icon type="weibo-square" style={{ fontSize: "20px" }} />
                    }
                    color="lightgrey"
                  >
                    <div className="row">
                      <div className="col-m-12">
                        <h5>
                          International tourist arrivals in Saudi Arabia up 575%
                          to 3.6m in Q2: MISA
                        </h5>
                        <div className="time-div">
                          <p>
                            <Icon type="arrow" theme="filled" /> Web Article
                          </p>
                          <p>
                            2 days ago
                            <Icon
                              className="p-10"
                              style={{ fontSize: "20px" }}
                              type="down-square"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item color="white"></Timeline.Item>
                </Timeline>
              </TimelineWarpper>
            </TabPane>
            <TabPane tab="Dashboard" key="2">
              Work on Progress
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
};

export default CenterSection;
