// Site View Component
import React, { useEffect, useState } from "react";
import { isString, get, find } from "lodash";
import isEqual from "react-fast-compare";
import { Table } from "antd";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { useTranslation } from "react-i18next";

import CreateSiteDialog from "../../components/Redash/CretaeSiteDialog";
import { Sites } from "../../api/sites";
import notification from "../../api/notification";
import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";
import PipelineConnect from "../../api/pipeline_connect";

const Wrapper = styled.div`
  .ant-table-wrapper {
    background-color: #fff;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 20px;
  line-height: 22px;
  padding-bottom: 20px;
`;

const Edit = styled.div`
  cursor: pointer;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

// Main Component
const SiteView = () => {
  const [state, setState] = useState({
    loading: true,
    sites: [],
    isload: false
  });
  const { t } = useTranslation();

  useEffect(() => {
    getSiteList();
  }, []);

  const getSiteList = async () => {
    let sitesTemp = [];
    try {
      const user = await PipelineConnect.getMyUserDetails();
      if (user) {
        if (user?.data?.sites) {
          sitesTemp = user?.data?.sites;
        }

        const res = await Sites.get_sitesData();
        if (res) {
          let sitesArray = res?.data?.filter((opt) =>
            sitesTemp.includes(opt.id)
          );
          setState((prevState) => ({
            ...prevState,
            sites: sitesArray,
            loading: false
          }));
        }
      }
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        loading: false
      }));
      notification.error(t("setup:site_view.site_error"), err.message);
    }
  };

  const createSite = (values) =>
    Sites.create_site(values)
      .then(() => {
        notification.success(t("setup:site_view.save_success"));
        getSiteList();
      })
      .catch((error) => {
        const message = find(
          [
            get(error, "response.data.message"),
            get(error, "message"),
            "Failed saving."
          ],
          isString
        );
        return Promise.reject(new Error(message));
      });

  const showCreateUserDialog = () => {
    const organization = JSON.parse(localStorage.getItem("organization"));

    CreateSiteDialog.showModal()
      .onClose((values) => {
        let requiredFields = {
          site_name: values?.name,
          host_name: values?.host_name,
          site_id: `${values?.name.toLowerCase().replace(/\s/g, "_")}-web`,
          org_id: organization.fabriq_org_id,
          collector_url: `${process.env.REACT_APP_BACKEND_BASE_URL}dt`
        };
        createSite(requiredFields);
      })
      .onDismiss();
  };

  if (state.loading) {
    return <Skeleton />;
  }
  const { sites } = state;

  const rows = sites.map((row) => ({
    key: row.id,
    name: row.site_name,
    url: row.host_name,
    site_id: row.site_id
  }));

  /* Handler functions */
  const editRow = (key) => {
    navigate(`/site/${key}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Host Name",
      dataIndex: "url",
      render: (_text, record) => (
        <div style={{ color: "#3e7af3" }}>
          <a href={_text} target="/">
            {_text}
          </a>
        </div>
      )
    },
    {
      title: "Site ID",
      dataIndex: "site_id",
      key: "site_id"
    },
    {
      title: "",
      dataIndex: "action",
      render: (_text, record) => (
        <Edit onClick={() => editRow(record.key)}>
          <i class="fa fa-edit" />
        </Edit>
      )
    }
  ];

  return (
    <Wrapper>
      <Heading>Sites</Heading>
      <UserInfo>
        <Button
          title="New Site"
          variant="alert-save"
          onClick={showCreateUserDialog}
        />
      </UserInfo>
      <Table columns={columns} dataSource={rows} rowKey={(row) => row.key} />
    </Wrapper>
  );
};

export default React.memo(SiteView, isEqual);
