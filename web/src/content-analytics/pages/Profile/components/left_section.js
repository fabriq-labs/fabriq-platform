import React from "react";
import styled from "styled-components";
import moment from "moment";

import { Tooltip } from "antd";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px,
    rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  border-radius: 10px;
  background-color: #fff;
`;

const BackgroundCard = styled.div`
  width: 100%;
  height: 100px;
  background-color: #b4cdf5;
  position: relative;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  margin-top: -80px;
  position: relative;
  z-index: 10;

  .avatar-logo {
    border: 5px solid #b4cdf5;
    border-radius: 50%;
    margin: 10px 0;
  }

  .user-id-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
  }

  .user-name {
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    margin: 0 0 15px 0;
  }

  .id-details {
    width: 100%;
    background: #e5eefc;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;

    .id-details-container {
      display: flex;
      align-items: center;

      .id-title {
        flex-grow: 1;
        font-size: 12px;
        width: 30%;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .id-value {
        padding: 0 0 0 10px;
        font-size: 10px;
        width: 70%;
        text-align: left;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

const UserDetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;

  .user-container {
    width: 70%;
    padding: 10px;
    display: flex;
    align-items: center;

    @media screen and (max-width: 1300px) {
      width: 95%;
    }
  }

  .user-title {
    width: 35%;
    font-size: 18px;
    font-weight: 800;
    text-align: inherit;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-value {
    width: 60%;
    font-size: 16px;
    text-align: start;
    padding-left: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const UserDetails = (props) => {
  const { data } = props;

  return (
    <Wrapper>
      <Content>
        <BackgroundCard></BackgroundCard>
        <ImageContainer>
          <div className="avatar-logo">
            <img
              src="/images/avatars/image-1.png"
              alt="connect"
              width={128}
              height={128}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div className="user-id-details">
            <div className="user-name">John Smith</div>
            <div className="id-details">
              <div className="id-details-container">
                <div className="id-title">User ID </div>
                <Tooltip
                  placement="topLeft"
                  title={data?.user_id ? data?.user_id : "-"}
                >
                  <div className="id-value">
                    {data?.user_id ? data?.user_id : "-"}
                  </div>
                </Tooltip>
              </div>
              <div className="id-details-container">
                <div className="id-title">Domain ID </div>
                <Tooltip
                  placement="topLeft"
                  title={data?.domain_userid ? data?.domain_userid : "-"}
                >
                  <div className="id-value">
                    {data?.domain_userid ? data?.domain_userid : "-"}
                  </div>
                </Tooltip>
              </div>
              <div className="id-details-container">
                <div className="id-title">Network ID </div>
                <Tooltip
                  placement="topLeft"
                  title={data?.network_userid ? data?.network_userid : "-"}
                >
                  <div className="id-value">
                    {data?.network_userid ? data?.network_userid : "-"}
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </ImageContainer>
        <UserDetailsContainer>
          <div className="user-container">
            <div className="user-title">Last Visit</div>
            <Tooltip
              placement="topLeft"
              title={
                data?.end_tstamp ? moment(data?.end_tstamp).format("MMM D, YYYY h:mm A") : "-"
              }
            >
              <div className="user-value">
                {data?.end_tstamp
                  ? moment(data?.end_tstamp).format("MMM D, YYYY h:mm A")
                  : "-"}
              </div>
            </Tooltip>
          </div>
          <div className="user-container">
            <div className="user-title">Total Visit</div>
            <Tooltip
              placement="topLeft"
              title={data?.page_views ? data?.page_views : "-"}
            >
              <div className="user-value">
                {data?.page_views ? data?.page_views : "-"}
              </div>
            </Tooltip>
          </div>
          <div className="user-container">
            <div className="user-title">Country</div>
            <Tooltip
              placement="topLeft"
              title={
                data?.last_session_geo_country
                  ? data?.last_session_geo_country
                  : "-"
              }
            >
              <div className="user-value">
                {data?.last_session_geo_country
                  ? data?.last_session_geo_country
                  : "-"}
              </div>
            </Tooltip>
          </div>
          <div className="user-container">
            <div className="user-title">City</div>
            <Tooltip
              placement="topLeft"
              title={
                data?.last_session_geo_city ? data?.last_session_geo_city : "-"
              }
            >
              <div className="user-value">
                {data?.last_session_geo_city
                  ? data?.last_session_geo_city
                  : "-"}
              </div>
            </Tooltip>
          </div>
          <div className="user-container">
            <div className="user-title">Device</div>
            <Tooltip
              placement="topLeft"
              title={
                data?.last_session_device_class
                  ? data?.last_session_device_class
                  : "-"
              }
            >
              <div className="user-value">
                {data?.last_session_device_class
                  ? data?.last_session_device_class
                  : "-"}
              </div>
            </Tooltip>
          </div>
          <div className="user-container">
            <div className="user-title">Email ID</div>
            <div className="user-value">{data?.email ? data?.email : "-"}</div>
          </div>
        </UserDetailsContainer>
      </Content>
    </Wrapper>
  );
};

export default UserDetails;
