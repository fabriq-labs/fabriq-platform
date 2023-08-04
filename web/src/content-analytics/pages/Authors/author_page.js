// Author Page
import React, { useState, useEffect } from "react";
import { navigate, Link } from "@reach/router";
import * as moment from "moment";
import { Icon, Empty, Pagination } from "antd";
import Helmet from "react-helmet";
import { useDispatch } from "react-redux";

// Component
import BarChartTiny from "../../components/Charts/Barchart/tinyBarChart";
import { Skeleton } from "../../../components/Skeleton";
import notification from "../../../api/notification";
import { updateActiveTab } from "../../../actions/header";
import { formatDuration } from "../../../utils/helper";

// API
import { AuthorList } from "../../api/author_list";
import { Overview } from "../../api/overview";

// Style
import "./author_page.css";

const AuthorPage = () => {
  const [authorData, setAuthorData] = useState([]);
  const [childrenOpen, setChildrenOpen] = useState(null);
  const [loader, setLoader] = useState(true);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();
  let siteDetails =
    localStorage.getItem("view_id") !== "undefined" &&
    JSON.parse(localStorage.getItem("view_id"));

  useEffect(() => {
    getAuthorDetails();
  }, []);

  const getAuthorDetails = async (page) => {
    let real_time_date = localStorage.getItem("real_time_date");
    const currentDate = new Date();

    // Format the date to "YYYY-MM-DD" format
    const formattedDate = currentDate.toISOString().split("T")[0];
    let period_date = real_time_date ? real_time_date : formattedDate;

    const currentDate_New = moment(period_date);
    const currentMonth = parseInt(currentDate_New.format("M")); // Full month name (e.g., "June")
    const currentYear = parseInt(currentDate_New.format("YYYY"));

    const limitPerPage = 10;
    const offset = limitPerPage * ((page || currentpage) - 1);

    try {
      const values = await AuthorList.get_Author_list(
        siteDetails?.site_id,
        `${period_date}%`,
        currentMonth,
        currentYear,
        offset
      );

      if (values?.data?.data?.Authors) {
        const result = values.data.data.Authors;

        const authorIds = result.map((item) => item?.author_id);

        const req = {
          period_date: real_time_date || moment.utc().format("YYYY-MM-DD"),
          site_id: siteDetails?.site_id,
          author_id: authorIds
        };

        const res = await Overview.getLast30DaysForAuthor(req);

        const response = res?.data?.data?.last30DaysDataForAuthor;
        let obj = {};
        if (response?.length > 0) {
          response.forEach((authorItem) => {
            const author_id = authorItem?.author_id;

            if (!obj[author_id]) {
              obj[author_id] = {
                series: [
                  {
                    name: "Page Views",
                    data: []
                  }
                ],
                labels: []
              };
            }

            obj[author_id].series[0].data.push(authorItem?.page_views);
            let dateFormat = moment(authorItem?.period_date).format("MMM DD");
            obj[author_id].labels.push(dateFormat);
          });
        }

        // Loop through result to add series property based on author_id
        const updatedResult = result.map((authorItem) => {
          const author_id = authorItem?.author_id;
          const item = { ...authorItem };

          if (obj[author_id]) {
            item.series = obj[author_id].series;
            item.labels = obj[author_id].labels;
          }

          return item;
        });

        setAuthorData(updatedResult);
        setTotalCount(values?.data?.data?.totalCount?.aggregate?.count);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      notification.error(err?.message);
    }
  };

  const handleClickAuthor = (id, index) => {
    navigate(`/content/author/${id}`, { state: { image: index } });
  };

  const handleClickArticle = (id) => {
    navigate(`/content/article/${id}`);
    dispatch(updateActiveTab("article"));
  };

  const handleClickopen = (index) => {
    if (index !== childrenOpen) {
      setChildrenOpen(index);
    } else {
      setChildrenOpen(null);
    }
  };

  const handleClickMore = (name) => {
    navigate("/article", { state: { author_name: name } });
    dispatch(updateActiveTab("article"));
  };

  const formatDurationAuthor = (value) => {
    let formattedDuration;
    const duration = moment.duration(value, "seconds");
    formattedDuration = formatDuration(duration, "14px", "18px");
    return formattedDuration;
  };

  const handleChangePagination = (value) => {
    setCurrentPage(value);
    getAuthorDetails(value);
  };

  return (
    <div className="author-page-wrapper">
      <Helmet>
        <title>Author</title>
      </Helmet>
      {loader === true ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        <div className="author-page-content">
          <div className="author-list-table-wrapper">
            <div className="author-list-table-content">
              <div className="list-table-heading">
                <div className="list-title-article">Author</div>
                <div className="list-title-page-view">Page Views: 30 Days</div>
                <div className="list-title-published-author">Published</div>
              </div>
              <div className="author-divider" />
              {authorData?.length > 0 ? (
                authorData?.map((item, index) => {
                  return (
                    <>
                      <div
                        className="list-author-details-wrapper"
                        key={`${item?.author_id}`}
                      >
                        <div className="list-author-details">
                          <div className="list-author-key">{index + 1}</div>
                          <div className="list-author-logo">
                            {" "}
                            <img
                              src={
                                item?.image_url ||
                                `/images/avatars/image-${index + 1}.png`
                              }
                              alt="blog"
                              style={{ width: "70px" }}
                              className="author-logo-img"
                            />
                          </div>
                          <div className="list-author-content">
                            <div className="list-author-title">
                              <Link
                                to={`/content/author/${item.author_id}`}
                                className="hover-title"
                                onClick={() =>
                                  handleClickAuthor(item.author_id, index)
                                }
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="list-view-chart-wrapper-author">
                          <div className="list-view-chart-author">
                            <BarChartTiny
                              series={item?.series}
                              labels={item?.labels}
                              logarithmic
                            />
                          </div>
                          <div className="list-view-count-author">
                            <div className="list-view-minutes-author">
                              <span className="list-value-author-list">
                                {formatDurationAuthor(
                                  item?.authors_monthly?.[0]?.total_time_spent
                                )}
                              </span>
                              &nbsp;
                              <span className="list-label">Total Spent</span>
                            </div>
                            <div className="list-minutes-vistor-author">
                              <span className="list-value-author-list">
                                {formatDurationAuthor(
                                  item?.authors_monthly?.[0]?.average_time_spent
                                )}
                              </span>
                              &nbsp;
                              <span className="list-label">Per Visitor</span>
                            </div>
                          </div>
                        </div>
                        <div className="list-published-view-author">
                          <div className="list-total-published">
                            {" "}
                            {item?.articles_aggregate?.aggregate?.count.toLocaleString()}
                          </div>
                          {item.articles.length > 0 && (
                            <div
                              className="list-arrow-view"
                              onClick={() => handleClickopen(index)}
                            >
                              <Icon
                                type={childrenOpen === index ? "up" : "down"}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {childrenOpen === index && (
                        <>
                          <div className="author-article-wrapper">
                            {item?.articles?.map((children, idx) => {
                              return (
                                <>
                                  {idx <= 4 && (
                                    <>
                                      <div style={{ display: "flex" }}>
                                        <div className="author-article-empty">
                                          {idx + 1}
                                        </div>
                                        <div className="author-article-title-wrapper">
                                          <Link
                                            to={`/content/article/${children?.article_daily?.article_id}`}
                                            className="author-article-title"
                                            onClick={() =>
                                              handleClickArticle(
                                                children.article_id
                                              )
                                            }
                                          >
                                            {children.title}
                                            <>&nbsp;</>
                                            <img
                                              src={"/images/open-link.webp"}
                                              alt="link"
                                              style={{
                                                width: "15px",
                                                height: "15px",
                                                marginTop: "2px"
                                              }}
                                            />
                                          </Link>
                                          <div className="author-article-details">
                                            <div className="author-article-published">
                                              {moment(
                                                children.published_date
                                              ).format("MMM DD")}
                                            </div>
                                            <div className="author-article-category">
                                              {children.category}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="list-children-view-count">
                                          <div className="list-view-minutes">
                                            <span className="list-value-author-list">
                                              {children?.article_daily
                                                ?.page_views
                                                ? children?.article_daily
                                                    ?.page_views.toLocaleString()
                                                : 0}
                                            </span>
                                            &nbsp;
                                            <span className="list-label">
                                              page views
                                            </span>
                                          </div>
                                          <div className="list-minutes-vistor">
                                            <span className="list-value-author-list">
                                              {children?.article_daily?.users
                                                ? children?.article_daily?.users.toLocaleString()
                                                : 0}
                                            </span>
                                            &nbsp;
                                            <span className="list-label">
                                              visitors
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      {item?.articles?.length > 4
                                        ? idx !== 4 && (
                                            <div className="author-children-divider"></div>
                                          )
                                        : item?.articles?.length !==
                                            idx + 1 && (
                                            <div className="author-children-divider"></div>
                                          )}
                                    </>
                                  )}
                                </>
                              );
                            })}
                          </div>
                          <>
                            {item?.author?.articles.length > 5 && (
                              <div
                                className="author-article-more"
                                onClick={() => {
                                  handleClickMore(item.author.name);
                                }}
                              >
                                More
                              </div>
                            )}
                          </>
                        </>
                      )}

                      {authorData?.length !== index + 1 && (
                        <div className="author-divider"></div>
                      )}
                    </>
                  );
                })
              ) : (
                <div style={{ marginTop: "20px" }}>
                  <Empty />
                </div>
              )}
            </div>
          </div>
          <div className="author-page-pagination">
            <Pagination
              defaultCurrent={1}
              current={currentpage}
              total={totalCount}
              onChange={handleChangePagination}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
