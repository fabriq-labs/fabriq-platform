// Overview Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import * as moment from "moment";
import { navigate } from "@reach/router";
import Helmet from "react-helmet";
import { isArray } from "lodash";
import { Row, Col, Icon, Select } from "antd";

import { Skeleton } from "../../../components/Skeleton";

// Component
import LineChart from "../../components/Charts/Linechart/linechart";
import LineChartTiny from "../../components/Charts/Linechart/tinychart";

// Style File
import "./overview.css";

// Helper
import { overviewData, formatDuration } from "../../../utils/helper";

// API
import { Overview } from "../../api/overview";
import { Sites } from "../../../api/sites";
import notification from "../../../api/notification";
import PipelineConnect from "../../../api/pipeline_connect";

const DataCountView = (props) => {
  const { title, value } = props;

  function formatNumber(value) {
    if (value >= 1000000) {
      return (
        <div className="count-view-overview">
          <span>{(value / 1000000).toFixed(1)}</span>
          <span className="count-prefix">&nbsp;M</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="count-view-overview">
          <span>{(value / 1000).toFixed(1)}</span>
          <span className="count-prefix">&nbsp;K</span>
        </div>
      );
    } else {
      return (
        <div className="count-view-overview">
          <span>{value?.toString()}</span>
        </div>
      );
    }
  }

  let betterFormattedDuration;
  if (title === "Ttl Time Spent") {
    const duration = moment.duration(value, "seconds");
    betterFormattedDuration = formatDuration(duration, "25px", "35px");
  }

  let currentvalue =
    title === "Ttl Time Spent" ? betterFormattedDuration : formatNumber(value);

  return (
    <div className="count-view-wrapper">
      <div className="count-view-content">
        <div className="conut-view-header">{title}</div>
        <div className="count-view-overview">{currentvalue}</div>
      </div>
    </div>
  );
};

const DetailsCard = (data) => {
  let overviewData = data?.data;
  let siteDetails = JSON.parse(localStorage.getItem("view_id"));
  let real_time_date = localStorage.getItem("real_time_date");
  const overviewIds = overviewData?.map((item) => {
    return item?.article?.article_id;
  });

  const [seriobj, setSeries] = useState(null);
  useEffect(() => {
    const req = {
      period_date: real_time_date || moment().format("YYYY-MM-DD"),
      site_id: siteDetails?.site_id,
      article_id: overviewIds
    };

    Overview.getLast30Days(req)
      .then((res) => {
        const result = {};
        if (res?.data?.data?.last30DaysData?.length > 0) {
          res.data.data.last30DaysData.forEach((articleItem) => {
            const articleId = articleItem.article.article_id;

            if (!result[articleId]) {
              result[articleId] = {
                series: [
                  {
                    name: "Page Views",
                    data: []
                  }
                ]
              };
            }

            result[articleId].series[0].data.push(articleItem.page_views);
          });
        }

        setSeries(result);
      })
      .catch((err) => notification.error(err.message));
  }, []);

  const handleClickTitle = (id) => {
    navigate(`/content/article/${id}`);
  };

  return overviewData?.map((item, index) => {
    return (
      <div className="overview-list-wrapper">
        <div className="overview-list-content">
          <div className="overview-key">{index + 1}</div>
          <div className="overview-data-image">
            <img
              src={"/images/blog-1.jpg"}
              alt="blog-img"
              style={{ width: "70px" }}
            />
          </div>
          <div className="overview-title-list">
            <div
              className="overview-title"
              style={{ cursor: "pointer" }}
              onClick={() => handleClickTitle(item?.article?.article_id)}
            >
              {item.article.title}
            </div>
            <div className="overview-category-details">
              <span className="category-published-date">
                {moment(item.article.published_date).format("MMM DD")}
              </span>
              <span className="category-author-name">
                {item.article.authors.name}
              </span>
              <span className="category-name">{item.article?.category}</span>
            </div>
          </div>
          <div className="view-chart-details">
            <div className="item-view-count">
              {item.page_views.toLocaleString()}
            </div>
            <div style={{ width: "100%" }}>
              <LineChartTiny
                series={seriobj?.[item?.article?.article_id]?.series}
              />
            </div>
          </div>
        </div>
        {overviewData?.length !== index + 1 && (
          <div className="overview-divider"></div>
        )}
      </div>
    );
  });
};

const AuthorDetails = (data) => {
  let authorData = data?.data;

  let siteDetails = JSON.parse(localStorage.getItem("view_id"));
  let real_time_date = localStorage.getItem("real_time_date");
  const authorIds = authorData?.map((item) => {
    return item?.author?.author_id;
  });

  const [seriobj, setSeries] = useState(null);
  useEffect(() => {
    const req = {
      period_date: real_time_date || moment().format("YYYY-MM-DD"),
      site_id: siteDetails?.site_id,
      author_id: authorIds
    };

    Overview.getLast30DaysForAuthor(req)
      .then((res) => {
        const result = {};
        if (res?.data?.data?.last30DaysDataForAuthor?.length > 0) {
          res.data.data.last30DaysDataForAuthor.forEach((articleItem) => {
            const author_id = articleItem?.article?.author_id;

            if (!result[author_id]) {
              result[author_id] = {
                series: [
                  {
                    name: "Page Views",
                    data: []
                  }
                ]
              };
            }

            result[author_id].series[0].data.push(articleItem.page_views);
          });
        }

        for (const author_id in result) {
          const data = result[author_id].series[0].data;

          if (data.length > 30) {
            const random30Data = data
              .sort(() => Math.random() - 0.5) // Shuffle the array randomly
              .slice(0, 30); // Get the first 30 elements

            result[author_id].series[0].data = random30Data;
          }
        }

        setSeries(result);
      })
      .catch((err) => notification.error(err.message));
  }, []);

  return (
    authorData &&
    authorData.map((item, index) => {
      return (
        <div className="overview-author-wrapper">
          <div className="overview-author-content">
            <div className="overview-key">{index + 1}</div>

            <div className="overview-data-image">
              <img
                src={"/images/blog-1.jpg"}
                alt="blog-img"
                style={{ width: "70px" }}
              />
            </div>
            <div className="overview-title-list">
              <div className="overview-title">{item.author.name}</div>
              <div className="overview-category-details">
                {`Articles published : ${
                  isArray(item.author.articles)
                    ? item.author.articles.length
                    : Object.keys(item.author.articles).length
                }`}
              </div>
            </div>
            <div className="view-chart-details">
              <div className="item-view-count">
                {item.page_views.toLocaleString()}
              </div>
              <div style={{ width: "100%" }}>
                <LineChartTiny
                  series={seriobj?.[item?.author?.author_id]?.series}
                />
              </div>
            </div>
          </div>
          {authorData?.length !== index + 1 && (
            <div className="overview-divider"></div>
          )}
        </div>
      );
    })
  );
};

const TagDetails = (data) => {
  let tagData = data?.data;
  return tagData.map((item, index) => {
    return (
      index < 5 && (
        <div className="tag-details-wrapper">
          <div className="tag-details-content">
            <div className="tag-key">{index + 1}</div>
            <div className="tag-title">{item.type}</div>
            <div className="tag-chart">
              <LineChartTiny />
            </div>
            <div className="tag-view">{item.page_view.toLocaleString()}</div>
          </div>
          {index !== tagData.length - 1 && (
            <div className="overview-divider"></div>
          )}
        </div>
      )
    );
  });
};

const OverviewPage = () => {
  const [isExpand, setIsExpand] = useState(false);
  const [overallData, setOverallData] = useState({});
  const [topPostToday, setTopPostToday] = useState([]);
  const [newPost, setNewPost] = useState(0);
  const [loader, setLoader] = useState(false);
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [overViewChartData, setOverViewChartData] = useState({});
  const [overviewTagsHour, setoverviewTagsHour] = useState([]);
  const [overviewAuthor, setOverviewAuthor] = useState([]);
  const [overViewCurrentChartResponse, setOverViewCurrentChartResponse] =
    useState([]);
  const [overViewAverageChartResponse, setOverViewAverageChartResponse] =
    useState([]);
  const { Option } = Select;

  useEffect(() => {
    let real_time_date = localStorage.getItem("real_time_date");
    setLoader(true);
    if (real_time_date) {
      getOverallData();
    } else {
      getSiteDetails();
    }

    setSelectedChartValue("page_views");
  }, [localStorage.getItem("view_id")]);

  const getSiteDetails = async () => {
    let sites = [];
    try {
      const user = await PipelineConnect.getMyUserDetails();
      if (user) {
        if (user?.data?.sites) {
          sites = user?.data?.sites;
        }

        const res = await Sites.get_sitesData();
        if (res) {
          let sitesArray = res?.data?.filter((opt) => sites.includes(opt.id));
          getOverallData(sitesArray?.[0]);
        }
      }
    } catch (err) {
      notification.error(err?.message);
    }
  };

  useEffect(() => {
    if (overViewCurrentChartResponse && overViewAverageChartResponse) {
      chartData(selectedChartValue);
    }
  }, [overViewCurrentChartResponse, overViewAverageChartResponse]);

  const getOverallData = (site) => {
    let siteDetails = site ? site : JSON.parse(localStorage.getItem("view_id"));
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];

    let topPostvariables = {
      limit: 5,
      period_date: real_time_date ? real_time_date : formattedDate,
      site_id: siteDetails?.site_id ? siteDetails?.site_id : getSiteDetails()
    };

    Promise.all([Overview.get_overviewData(topPostvariables)])
      .then((values) => {
        if (values?.length > 0) {
          setOverallData(
            values?.[0]?.data?.data?.daily_aggregate
              ?.aggregate?.sum
          );
          setNewPost(values?.[0]?.data?.data?.NewPostArticles?.length);
          setTopPostToday(values?.[0]?.data?.data?.TopPosts);
          setOverViewCurrentChartResponse(
            values?.[0]?.data?.data?.ArticleCurrentHours
          );
          setOverViewAverageChartResponse(
            values?.[0]?.data?.data?.ArticleAvgHours
          );
          setOverviewAuthor(values?.[0]?.data?.data?.TopAuthors);

          let result = [];
          const arrayList = values?.[0]?.data?.data?.TopPosts;
          arrayList.reduce(function (res, value) {
            if (!res[value.article?.category]) {
              res[value.article?.category] = {
                type: value?.article?.category,
                page_view: 0
              };
              result.push(res[value.article?.category]);
            }
            res[value.article?.category].page_view += value.page_views;
            return res;
          }, {});
          setoverviewTagsHour(result);

          setLoader(false);
        }
        setLoader(false);
      })
      .catch((err) => {
        notification.error(err?.message);
        setLoader(false);
      });
  };

  const chartData = (value) => {
    if (overViewCurrentChartResponse && overViewAverageChartResponse) {
      const lableValue = [
        0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData = overViewCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData = overViewCurrentChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData = overViewAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData = overViewAverageChartResponse.find(
          (obj) => obj.hour === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      let chartSeriesFormat = {
        series: [
          {
            name: "Current",
            data:
              value === "page_views"
                ? currentPageViewsValues
                : currentUserValues
          },
          {
            name: "Average",
            data:
              value === "page_views" ? averagePageViewsValue : averageUserValues
          }
        ],
        label: lableValue
      };

      setOverViewChartData(chartSeriesFormat);
    }
  };

  const handleClickExpand = (value) => {
    setLoader(true);

    setIsExpand(value);
    setLoader(false);
  };

  const handleChangeChart = (value) => {
    setSelectedChartValue(value);
    chartData(value);
  };

  const today = moment().format("dddd");
  if (overViewChartData?.label?.length > 0) {
    overViewChartData.label = overViewChartData.label.map((item) => {
      return moment(item, "h:mm a").format("h:mm a");
    });
  }

  return (
    <div className="overview-wrapper">
      <Helmet>
        <title>Overview</title>
      </Helmet>
      {loader === true ? (
        <div>
          <Skeleton />
        </div>
      ) : isExpand === true ? (
        <div className="overview-chart-full">
          <div className="overview-chart-header">
            <div className="overview-chart-select">
              <Select
                onChange={handleChangeChart}
                value={selectedChartValue}
                getPopupContainer={(triggerNode) =>
                  triggerNode?.parentNode || document.body
                }
              >
                <Option value="page_views">Page Views</Option>
                <Option value="users">Users</Option>
              </Select>
            </div>
            <div
              className="overview-close-icon"
              onClick={() => handleClickExpand(false)}
            >
              <Icon type="fullscreen-exit" style={{ fontSize: "20px" }} />
            </div>
          </div>
          <div style={{ marginTop: "50px" }} className="chart-screen-full">
            <LineChart
              labels={overViewChartData?.label}
              series={overViewChartData?.series}
              colors={["#A3E0FF", "#c4e0d7"]}
              height={"98%"}
            />
          </div>
        </div>
      ) : (
        <div className="overview-content">
          <div className="overview-content-row">
            <div className="overview-data-view">
              <div className="data-view-heading">So far, Business as usual</div>
              <div className="data-view-overall">
                {/* Today was the best {yesterday}, 603 overall */}
                Today was the best {today}
              </div>
              <div className="data-report-view">
                <Row>
                  <Col span={10}>
                    <DataCountView
                      title={overviewData?.overrallData?.post_view?.title}
                      value={overallData?.page_views}
                    />
                  </Col>
                  <Col span={10}>
                    <DataCountView
                      title={overviewData?.overrallData?.post_visitor?.title}
                      value={overallData?.users}
                    />
                  </Col>
                  <Col span={4}>
                    <DataCountView
                      title={overviewData?.overrallData?.new_posts?.title}
                      value={newPost}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={10}>
                    <DataCountView
                      title={overviewData?.overrallData?.total_shares?.title}
                      value={
                        overallData?.total_shares
                          ? overallData?.total_shares
                          : 0
                      }
                    />
                  </Col>
                  <Col span={10}>
                    <DataCountView
                      title={overviewData?.overrallData?.minutes?.title}
                      value={
                        overallData?.total_time_spent
                          ? overallData?.total_time_spent
                          : 0
                      }
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <div className="overview-chart">
              <div className="overview-chart-header">
                <div className="overview-chart-select">
                  <Select
                    onChange={handleChangeChart}
                    value={selectedChartValue}
                    getPopupContainer={(triggerNode) =>
                      triggerNode?.parentNode || document.body
                    }
                  >
                    <Option value="page_views">Page Views</Option>
                    <Option value="users">Users</Option>
                  </Select>
                </div>
                <div
                  className="overview-expand-icon"
                  onClick={() => handleClickExpand(true)}
                >
                  <Icon type="fullscreen" style={{ fontSize: "20px" }} />
                </div>
              </div>

              <div style={{ marginTop: "50px" }}>
                <LineChart
                  labels={overViewChartData?.label}
                  series={overViewChartData?.series}
                  colors={["#A3E0FF", "#c4e0d7"]}
                  height={300}
                />
              </div>
            </div>
          </div>
          <div className="overview-details-view">
            <div className="overview-posts-today">
              <div className="post-today-heading">
                <div className="post-today-title">
                  Top Posts Today
                  <div className="post-today-icon">
                    <Icon type="setting" />
                  </div>
                </div>

                <div className="post-today-minutes">Page Views</div>
              </div>
              {topPostToday !== undefined && (
                <div className="post-today-content">
                  <DetailsCard data={topPostToday} />
                </div>
              )}
            </div>
            <div className="overview-posts-mins">
              <div className="post-today-heading">
                <div className="post-today-title">
                  Top Authors
                  <div className="post-today-icon">
                    <Icon type="setting" />
                  </div>
                </div>

                <div className="post-today-minutes">Page Views</div>
              </div>
              {overviewAuthor !== undefined && (
                <div className="post-today-content">
                  <AuthorDetails data={overviewAuthor} />
                </div>
              )}
            </div>
            <div className="overview-posts-hour">
              <div className="post-today-heading">
                <div className="post-today-title">
                  Top Tags
                  <div className="post-today-icon">
                    <Icon type="setting" />
                  </div>
                </div>

                <div className="post-today-minutes">Page Views</div>
              </div>
              {overviewTagsHour !== undefined && (
                <div className="post-today-content">
                  <TagDetails data={overviewTagsHour} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OverviewPage, isEqual);
