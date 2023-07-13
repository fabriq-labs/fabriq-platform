// DashboardList Component
import React, { useEffect, useState } from "react";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { Table, Input } from "antd";
import moment from "moment";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";

import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";
import { Dashboard } from "../../api/dashboard";
import notification from "../../api/notification";
import CreateDashboardDialog from "../../components/Redash/CreateDashboardDialog";

const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
    margin-right: 11px;
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

const Edit = styled.div`
  cursor: pointer;
`;

const SearchInfo = styled.div`
  margin-bottom: 20px;

  .ant-input {
    width: 200px;
  }
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

const HeadingLeft = styled.div`
  display: flex;
`;

// Main Component
const DashboardList = (props) => {
  const [Dashboards, setDashboardList] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { updateDashboardShare } = props;
  const { t } = useTranslation();

  useEffect(() => {
    const email = localStorage.getItem("user_email"); // eslint-disable-line
    const params = {
      page_size: 250,
      q: searchTerm
    };

    Dashboard.query(params)
      .then((res) => {
        const { results } = res;
        const dashboardList = [];
        if (results.length !== 0) {
          results.forEach((item) => {
            if (item.user.email === email) {
              dashboardList.push(item);
            }
          });
          setDashboardList(dashboardList);
          setLoading(false);
        }

        setLoading(false);
        return Promise.resolve([]);
      })
      .catch((err) => {
        setLoading(false);
        notification.error(
          t("dashboard:mydashboard.dashboardlist_error"),
          err.message
        );
        return Promise.resolve(err);
      });
  }, [searchTerm]);

  if (Loading) {
    return <Skeleton />;
  }

  const editRow = (key) => {
    navigate(`/dashboards/${key}/edit`);
    updateDashboardShare(false);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    CreateDashboardDialog.showModal();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug"
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "",
      dataIndex: "action",
      width: "3%",
      render: (_text, record) => (
        <Edit onClick={() => editRow(record.slug)}>
          <i class="fa fa-edit" />
        </Edit>
      )
    }
  ];

  const list = Dashboards;
  const rows = list.map((row) => ({
    key: row.id,
    slug: row.slug,
    created_at: moment(row.created_at).format("MM/DD/YY HH:MM"),
    created_by: row.user.name,
    name: row.name
  }));

  return (
    <Wrapper>
      <HeadingRow>
        <Heading>My Dashboard</Heading>
        <HeadingLeft>
          <SearchInfo>
            <Input
              placeholder="search dasboard"
              type="text"
              name="dashboard"
              value={searchTerm}
              onChange={handleChange}
            />
          </SearchInfo>
          <ButtonRow>
            <Button title="Create" variant="alert-save" onClick={onClick} />
          </ButtonRow>
        </HeadingLeft>
      </HeadingRow>
      <Table
        columns={columns}
        dataSource={rows}
        rowKey={(row) => row.key}
        pagination={{
          total: rows.length,
          pageSize: 25
        }}
      />
    </Wrapper>
  );
};

export default React.memo(DashboardList, isEqual);
