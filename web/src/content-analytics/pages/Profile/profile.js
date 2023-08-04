import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Card, Icon, Input, Result } from "antd";
import Helmet from "react-helmet";
import isEqual from "react-fast-compare";

import UserDetails from "./components/left_section";
import RightSection from "./components/right_section";
import { Skeleton } from "../../../components/Skeleton";
import notification from "../../../api/notification";

// API
import { Profile } from "../../api/profile";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  .ant-row {
    display: flex;
    flex-flow: row wrap;
    min-width: 0;
  }

  .anchor {
    .ant-tag {
      cursor: pointer;
    }
  }

  .ant-card-body {
    padding: 0 !important;
  }

  .calculated {
    font-size: 18px;
    color: #0a0909;
  }

  .search-row {
    justify-content: center;
  }
  .search-div {
    width: 450px;
  }

  .ant-select-auto-complete.ant-select .ant-input {
    height: 40px !important;
  }
`;

const Content = styled.div`
  background-color: #f6f8f9;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 15px;
  margin-right: auto;
  margin-left: auto;
`;

const { Search } = Input;

const SelectSection = ({
  handleSearchInput
}) => {
  return (
    <Row style={{ marginBottom: 20, marginTop: 15 }} className="search-row">
      <div className="search-div">
        <Search
          placeholder="Enter User ID or Domain User ID"
          onSearch={(value) => handleSearchInput(value)}
          style={{ width: "100%" }}
          size="large"
        />
      </div>
    </Row>
  );
};
const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [idValue, setIdValue] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [sevenDaysData, setSevenDaysData] = useState([]);
  const [lastSessionData, setLastSessionData] = useState([]);
  const [topAuthorCategoryData, setTopAuthorCatgoryData] = useState([]);
  const [loader, setLoader] = useState(false);

  let siteDetails =
    localStorage.getItem("view_id") !== "undefined" &&
    JSON.parse(localStorage.getItem("view_id"));

  useEffect(() => {
    const dropdown = document.querySelector("body > div:last-child");
    const sect = document.querySelectorAll(".scroll-div");

    if (dropdown && sect[sect.length - 1]) {
      sect[sect.length - 1].append(dropdown);
    }
  }, [open]);


  const getProfileData = (id) => {
    let domain_userid = id;
    setLoader(true);
    const currentDate = new Date();

    // Get the date 7 days ago
    const lastSevenDaysDate = new Date();
    lastSevenDaysDate.setDate(lastSevenDaysDate.getDate() - 7);
    currentDate.setDate(currentDate.getDate() - 1);

    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    const formattedLastSevenDaysDate = lastSevenDaysDate
      .toISOString()
      .split("T")[0];

    // 619254 619045 143023 00007718-8df2-4272-8805-d2ea903db3f5
    Promise.all([
      Profile.get_sevendayData(
        domain_userid,
        formattedLastSevenDaysDate,
        formattedCurrentDate,
        siteDetails?.site_id
      ),
      Profile.get_profileData(domain_userid, siteDetails?.site_id),
      Profile.get_lastSessionData(domain_userid, siteDetails?.site_id),
    ])
      .then((results) => {
        setSevenDaysData(results?.[0]?.data?.data?.user_active_hours);
        setProfileData(results?.[1]?.data?.data?.user_overview?.[0]);
        setLastSessionData(
          results?.[2]?.data?.data?.user_last_session_pageviews
        );
        setTopAuthorCatgoryData(
          results?.[1]?.data?.data?.user_overview?.[0]
        );
        setLoader(false);
      })
      .catch((err) => {
        setProfileData([]);
        setLoader(false);
        notification.error(err?.message);
      });
  };

  const handleSearchInput = (value) => {
    setIdValue(value);
    getProfileData(value);
  };

  return (
    <Wrapper className="scroll-div">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Content>
        <SelectSection
          handleSearchInput={handleSearchInput}
        />
        {loader === true ? (
          <div>
            <Skeleton />
          </div>
        ) : (
          profileData &&
          (Object.keys(profileData).length > 0 ? (
            <>
              {" "}
              <Row gutter={16}>
                <Col span={6}>
                  <UserDetails data={profileData} />
                </Col>
                <Col span={18}>
                  <RightSection
                    data={profileData}
                    chartdata={sevenDaysData}
                    lastSessionData={lastSessionData}
                    topAuthorCategoryData={topAuthorCategoryData}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <div>
              <Result title="Something Wrong, Please Try Again" />
            </div>
          ))
        )}
      </Content>
    </Wrapper>
  );
};

export default React.memo(ProfilePage, isEqual);
