// Page Base Component
import React, { useEffect, useState } from "react";
import { Card, Empty } from "antd";
import styled from "styled-components";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import { navigate } from "@reach/router";

import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";
import { NoDataFound } from "../../components/NoDataFound";
import CreateDashboardDialog from "../../components/Redash/CreateDashboardDialog";

import { Dashboard } from "../../api/dashboard";
import notification from "../../api/notification";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  padding: 20px;

  .card-click {
    cursor: pointer;
    color: #87ceeb;
  }

  .flex-gap {
    display: flex;
    flex-wrap: wrap;
  }

  .flex-gap > div {
    margin: 10px;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
  flex-grow: 1;
`;

const HeadingRow = styled.div`
  display: flex;
`;

const ButtonRow = styled.div`
  margin-left: 20px;

  .button {
    width: 82px;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
  }
`;

// Main Component
const DashboardHomePage = () => {
  const [dashboards, setDashboardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const params = {
      page_size: 250
    };

    Dashboard.query(params)
      .then((res) => {
        const { results } = res;
        const dashboardList = [];
        if (results.length !== 0) {
          results.forEach((item) => {
            dashboardList.push(item);
          });
          setDashboardList(dashboardList);
          setLoading(false);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        notification.error(
          t("dashboard:mydashboard.dashboardlist_error"),
          err.message
        );
      });
  }, []);

  const onNavigate = (item) => {
    if (item?.options?.url) {
      window.open(item?.options?.url, "_blank");
    } else {
      navigate(`/dashboards/${item?.slug}/edit`);
    }
  };

  const onClick = () => {
    CreateDashboardDialog.showModal();
  };

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Wrapper>
      <HeadingRow>
        <Heading>My Dashboards</Heading>
        <ButtonRow>
          <Button title="Create" variant="alert-save" onClick={onClick} />
        </ButtonRow>
      </HeadingRow>
      <div className="flex-gap">
        {dashboards?.length > 0 ? (
          dashboards?.map((item) => {
            return (
              <Card
                title={item?.name}
                extra={
                  <div className="card-click" onClick={() => onNavigate(item)}>
                    View
                  </div>
                }
                style={{ width: "22%" }}
              >
                {item?.options?.description || (
                  <Empty description={"No Description"} />
                )}
              </Card>
            );
          })
        ) : (
          <div className="center">
            <NoDataFound />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(DashboardHomePage, isEqual);
