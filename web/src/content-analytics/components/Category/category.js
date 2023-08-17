// Category Component
import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import * as moment from "moment";

import { formatDuration } from "../../../utils/helper";

import "./category.css";

const HeaderContainer = (props) => {
  const { title, value } = props;
  function formatNumber(value) {
    if (value >= 1000000) {
      return (
        <div className="header-count-view">
          <span>{(value / 1000000).toFixed(1)}</span>
          <span className="header-count-prefix">&nbsp;M</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="header-count-view">
          <span>{(value / 1000).toFixed(1)}</span>
          <span className="header-count-prefix">&nbsp;K</span>
        </div>
      );
    } else {
      return (
        <div className="header-count-view">
          <span>{value?.toString()}</span>
        </div>
      );
    }
  }

  function formatSecondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Add leading zero for seconds less than 10
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return (
      <div className="header-count-view">
        <span>
          {minutes}:{formattedSeconds}
        </span>
      </div>
    );
  }

  return (
    <div className="header-container-wrapper">
      <div className="header-container-title">{title}</div>
      <div className="header-container-value">
        {title !== "Average Time Spent"
          ? formatNumber(value)
          : formatSecondsToTime(value)}
      </div>
      {(title === "Total Time Spent" || title === "Average Time Spent") && (
        <div className="min-description">Minutes</div>
      )}
    </div>
  );
};

const formatDurationForCategory = (value) => {
  let formattedDuration;
  const duration = moment.duration(value, "seconds");
  formattedDuration = formatDuration(duration, "18px", "24px");
  return formattedDuration;
};

const Category = (props) => {
  const { view, totalNumber, data, imageIndex, authorName } = props;
  const [headerData, setHeaderData] = useState([]);

  useEffect(() => {
    setHeaderData(data);
  }, [data]);

  let publishedDate = headerData && headerData?.article?.published_date;

  const formattedDate = moment(publishedDate).format("MMMM Do YYYY");

  function secondsToMinutes(seconds) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    return minutes;
  }

  const total_time_spent_minutes = secondsToMinutes(
    headerData?.total_time_spent ? headerData?.total_time_spent : 0
  );

  const average_time_spent_minutes = secondsToMinutes(
    headerData?.average_time_spent ? headerData?.average_time_spent : 0
  );

  let ImageValue =
    imageIndex <= 4
      ? `/images/blog-${imageIndex + 1}.jpg`
      : `/images/blog-${imageIndex - 4}.jpg`;

  return (
    <div className="category-wrapper">
      <div className="category-content">
        <div className="heading-category">
          {headerData && headerData?.article?.category}
        </div>
        <div
          className={
            view === "author" ? "heading-image" : "heading-image-article"
          }
        >
          <img
            src={
              view === "author"
                ? headerData?.image_url ||
                  `/images/avatars/image-${imageIndex + 1}.png`
                : ImageValue
            }
            style={{ width: "100px" }}
            alt="logo"
            className={
              view === "author" ? "author-logo-img" : "article-logo-img"
            }
          />
        </div>
        {view === "author" && (
          <div
            className={
              view === "author" ? "heading-category-author" : "heading-category"
            }
          >
            {authorName}
          </div>
        )}
      </div>
      {view === "article" ? (
        <>
          <div className="title-content">
            <div className="heading-article-title">
              {headerData?.article?.title}
            </div>
            <div className="heading-first-published">
              {/* <div className="post-button">Post</div> */}
              <div className="first-published-value">&nbsp;{formattedDate}</div>
            </div>
          </div>
          <div className="header-card-wrapper">
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <HeaderContainer
                  title="Page Views"
                  value={headerData?.page_views ? headerData.page_views : 0}
                />
              </Col>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Users"
                  value={headerData?.users ? headerData.users : 0}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Total Time Spent"
                  value={
                    headerData?.total_time_spent ? total_time_spent_minutes : 0
                  }
                />
              </Col>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Average Time Spent"
                  value={
                    headerData?.average_time_spent
                      ? headerData?.average_time_spent
                      : 0
                  }
                />
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div className="author-title-content">
            <div className="heading-total">
              <div className="total-article-value">
                &nbsp;{totalNumber?.toLocaleString()}
              </div>
              <div className="total-article-title">
                Total Articles published
              </div>
            </div>
            <div className="header-card-wrapper">
              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <HeaderContainer
                    title="Total Time Spent"
                    value={
                      headerData?.total_time_spent
                        ? total_time_spent_minutes
                        : 0
                    }
                  />
                </Col>
                <Col span={12}>
                  {" "}
                  <HeaderContainer
                    title="Page Views"
                    value={headerData?.page_views ? headerData.page_views : 0}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
