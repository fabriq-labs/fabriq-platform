import React from "react";
import styled from "styled-components";
import { Row, Col, Timeline, Icon, Card, Tooltip, Empty } from "antd";
import * as moment from "moment";
import { navigate } from "@reach/router";

import { formatDuration } from "../../../../utils/helper";
import HeatmapChart from "../../../components/Charts/Heatmap/heatmap.js";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
`;

const TopListDetails = styled.div`
  width: 100%;

  .tooltip-content {
    font-size: 18px;
  }

  .spend-details-wrapper{
    display: flex;
    flex-direction: column;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    border-radius: 10px;
    justify-content: space-around;
  }

  .card-item {
    display: block;
    flex-direction: center;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
    min-height: 115px ;
    max-height: 115px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    border: 0;
  }

  .spend-container {
    text-align: center;
    margin 10px 0;

    .spend-title {
      font-size: 16px;
      font-weight: 500;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .spend-value {
      color: #2cd620;
      font-weight: 600;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 22px;
      line-height: 35px;
      padding-bottom: 5px;
    }
  }

  .top-spend-details {
    width: 100%;
    padding: 0 20px;
  }

  .top-author-details {
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    padding: 15px;
    border-radius: 10px;
    min-height: 168px;

    .author-title {
      font-size: 20px;
      font-weight: 600;
    }

    .author-values {
      font-size: 16px;
      font-weight: 500;
      padding: 5px;
      cursor: pointer;
      width: fit-content;
      text-decoration: none;
      color: inherit; 

    .author-values:hover {
      color: #43a5fc;
    }
  }


  .top-category-details {
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    padding: 15px;
    border-radius: 10px;
    min-height: 168px;

    .author-title {
      font-size: 20px;
      font-weight: 600;
    }

    .author-values {
      font-size: 16px;
      font-weight: 500;
      padding: 5px;
    }
  }
`;

const ChartDetails = styled.div`
  margin: 20px 0;
  background-color: #ffffff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 10px;
  border-radius: 10px;

  .apexcharts-menu-icon {
    display: none;
  }
`;

const TopDetailsWrapper = styled.div`
  margin: 20px 0 20px 20px;
  border-radius: 10px;

  .card-item {
    display: block;
    flex-direction: center;
    justify-content: center;
    padding: 20px 15px 20px 15px;
    border-radius: 10px;
    min-height: 180px;
    max-height: 180px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
      rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    border: 0;
  }

  .top-author-details {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 15px;
    border-radius: 10px;

    .author-title {
      font-size: 20px;
      font-weight: 600;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .author-values {
      font-size: 16px;
      font-weight: 500;
      padding: 5px;
      cursor: pointer;
      width: fit-content;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      text-decoration: none;
      color: inherit; 
    }

    .author-values:hover {
      color: #43a5fc;
    }
  }

  .card-item-category {
    display: block;
    flex-direction: center;
    justify-content: center;
    padding: 20px 15px 20px 15px;
    border-radius: 10px;
    min-height: 180px;
    max-height: 180px;
    margin-top: 20px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
      rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    border: 0;
  }

  .top-category-details {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 15px;
    border-radius: 10px;

    .author-title {
      font-size: 20px;
      font-weight: 600;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: -10px;
      margin-bottom: 10px;
    }

    .author-values {
      font-size: 16px;
      font-weight: 500;
      padding: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const ArticleDetails = styled.div`
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  padding: 10px;
  border-radius: 10px;

  .timeline-heading {
    font-size: 20px;
    font-weight: 600;
    padding: 15px 20px;
  }

  .last-session-content {
    width: 100%;
    padding: 15px 20px 0 40px;

    .last-session-time {
      font-size: 16px;
      margin-left: 15px;
    }

    .last-session-title {
      font-size: 18px;
      margin-left: 15px;
      font-weight: 600;
    }
  }

  .overview-posts-today {
    width: 100%;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .overview-list-wrapper {
    width: 100%;
    margin-top: 20px;
  }

  .overview-list-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .overview-key {
    width: 5%;
    font-size: 16px;
    font-weight: 600;
    color: #737a73;
    text-align: center;
  }

  .overview-title-list {
    width: 45%;
    text-align: left;
  }

  .overview-title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: #3a3f3a;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .overview-category-details {
    margin-top: 15px;
    display: flex;
    font-size: 11px;
    line-height: 13px;
    font-weight: 500;
    color: #737a73;
    flex-wrap: wrap;
    text-transform: capitalize;
    gap: 10px;
  }

  .timeline-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

let betterFormattedDuration;
const formatTime = (value) => {
  const duration = moment.duration(value, "seconds");
  betterFormattedDuration = formatDuration(duration, "25px", "35px");

  return betterFormattedDuration;
};

const UserVistDetails = (props) => {
  const { data, chartdata, lastSessionData, topAuthorCategoryData } = props;

  let aggregatedDataFormat;
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const getLast7Dates = () => {
    const today =  moment().subtract(1, 'days');
    const dates = Array(7).fill().map((_, index) => today.clone().subtract(index, 'days').format('MMM D'));
    return dates.reverse();
  };

  const formatDataForLast7Days = (chartData) => {
    // Get the last 7 dates in "Aug 3" format
    const last7Dates = getLast7Dates();
    const dataByDate = {};
  
    chartData.forEach((entry) => {
      const dateName = formatDate(entry.date);
      const hour = entry.hour;
      if (!dataByDate[dateName]) {
        dataByDate[dateName] = Array(24).fill(0);
      }
      dataByDate[dateName][hour] += entry.pageviews;
    });
  
    // Fill missing data with 0 for the last 7 days
    const aggregatedDataFormat = last7Dates.map((dateName) => ({
      name: dateName,
      data: dataByDate[dateName] || Array(24).fill(0),
    }));
  
    return aggregatedDataFormat;
  };

  const dataByDate = {};
  chartdata.forEach((entry) => {
    const dateName = formatDate(entry.date);
    const hour = entry.hour;
    if (!dataByDate[dateName]) {
      dataByDate[dateName] = Array(24).fill(0);
    }
    dataByDate[dateName][hour] += entry.pageviews;
  });

  aggregatedDataFormat = Object.entries(dataByDate).map(([dateName, data]) => ({
    name: dateName,
    data
  }));

  const formattedData = formatDataForLast7Days(chartdata);

  let authors =
    data?.top_authors !== undefined
      ? JSON.parse(data?.top_authors)
      : {};

  let category =
    data?.top_categories !== undefined
      ? JSON.parse(data?.top_categories)
      : {};

  // const handleClickAuthor = (id) => {
  //   navigate(`/content/author/${id}`);
  // };

  return (
    <Wrapper>
      <Content>
        <TopListDetails>
          <Row gutter={16}>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <div className="spend-value">
                        {formatTime(data?.engaged_time_in_s)}
                      </div>
                      <div className="spend-title">Total Time</div>
                    </div>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <div className="spend-value">
                        {formatTime(data?.average_engaged_time)}
                      </div>
                      <div className="spend-title">Average Time</div>
                    </div>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <div className="spend-value">
                        {formatTime(data?.last_session_engaged_time_in_s)}
                      </div>
                      <div className="spend-title">Session Time</div>
                    </div>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <Tooltip
                        placement="top"
                        title={
                          data?.last_session_referrer
                            ? data?.last_session_referrer
                            : "-"
                        }
                        overlayClassName="tooltip-content"
                        arrowPointAtCenter
                      >
                        <div className="spend-value">
                          {data?.last_session_referrer
                            ? data?.last_session_referrer
                            : "-"}
                        </div>
                      </Tooltip>
                      <div className="spend-title">Source</div>
                    </div>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <Tooltip
                        placement="top"
                        title={
                          data?.last_session_refr_medium
                            ? data?.last_session_refr_medium
                            : "-"
                        }
                        overlayClassName="tooltip-content"
                        arrowPointAtCenter
                      >
                        <div className="spend-value">
                          {data?.last_session_refr_medium
                            ? data?.last_session_refr_medium
                            : "-"}
                        </div>
                      </Tooltip>
                      <div className="spend-title">Medium</div>
                    </div>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card className="card-item">
                    <div className="spend-container">
                      <Tooltip
                        placement="top"
                        title={data?.last_page_title ? data?.last_page_title : "-"}
                        overlayClassName="tooltip-content"
                        arrowPointAtCenter
                      >
                        <div className="spend-value">
                          {data?.last_page_title ? data?.last_page_title : "-"}
                        </div>
                      </Tooltip>
                      <div className="spend-title">Exit Page</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </TopListDetails>

        <Row>
          <Col span={18}>
            <ChartDetails>
              <HeatmapChart data={formattedData} />
            </ChartDetails>
          </Col>
          <Col span={6}>
            <TopDetailsWrapper>
              <Card className="card-item">
                <div className="top-author-details">
                  <div className="author-title">Top Authors</div>
                  {Object.keys(authors).length > 0 ? (
                    Object.keys(authors).map((key) => {
                      return (
                        <a
                          className="author-values"
                          // onClick={() => handleClickAuthor(key)}
                          href={`/content/author/${key}`}
                        >
                          {key}
                        </a>
                      );
                    })
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              </Card>

              <Card className="card-item-category">
                <div className="top-category-details">
                  <div className="author-title">Top Category</div>
                  {Object.keys(category).length > 0 ? (
                    Object.keys(category).map((key) => {
                      return <div className="author-values">{key}</div>;
                    })
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              </Card>
            </TopDetailsWrapper>
          </Col>
        </Row>

        <ArticleDetails>
          <div className="overview-posts-today">
            <div className="timeline-heading">Timeline Activities</div>
            {lastSessionData?.length > 0 ? (
              <div className="last-session-content">
                <Timeline>
                  {lastSessionData.map((item) => {
                    return (
                      <Timeline.Item
                        dot={
                          <Icon
                            type="clock-circle-o"
                            style={{ fontSize: "26px" }}
                          />
                        }
                        color="green"
                      >
                        <div className="last-session-time">
                          {moment(item?.collector_tstamp).format("MMM D, YYYY h:mm A")}
                        </div>
                        <div className="last-session-title">
                          {item?.page_title}
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </div>
            ) : (
              <div className="timeline-empty">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        </ArticleDetails>
      </Content>
    </Wrapper>
  );
};

export default UserVistDetails;
