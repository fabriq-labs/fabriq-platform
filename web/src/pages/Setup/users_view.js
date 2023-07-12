// User View Component
import React, { useEffect, useState } from "react";
import { isString, get, find } from "lodash";
import isEqual from "react-fast-compare";
import { Table, Tag } from "antd";
import styled from "styled-components";
import { navigate } from "@reach/router";
import moment from "moment";
import { useTranslation } from "react-i18next";

import CreateUserDialog from "../../components/Redash/CreateUserDialog";
import User from "../../api/users";
import notification from "../../api/notification";
import { Skeleton } from "../../components/Skeleton";
import { Button } from "../../components/Button";

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

const Item = styled.span`
  display: flex;
`;

const Group = styled.div`
  background: rgba(102, 136, 153, 0.15);
  color: #475f6b;
  margin-right: 10px;
  border-radius: 2px;
  padding: 3px 6px 4px;
  font-weight: 500;
  font-size: 11px;
`;

const Edit = styled.div`
  cursor: pointer;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
`;

// Main Component
const UserView = () => {
  const [state, setState] = useState({
    loading: true,
    users: [],
    isload: false
  });
  const { t } = useTranslation();

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    User.query()
      .then((res) => {
        if (res && res.data.results.length !== 0) {
          setState((prevState) => ({
            ...prevState,
            users: res.data.results,
            loading: false
          }));
        }

        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        return Promise.resolve([]);
      })
      .catch((err) => {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));
        notification.error(t("setup:user_view.alertView_error"), err.message);
        return Promise.resolve(err);
      });
  };

  const createUser = (values) =>
    User.create(values)
      .then((user) => {
        notification.success(t("setup:user_view.save_success"));
        getUserList();
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
    CreateUserDialog.showModal()
      .onClose((values) => createUser(values))
      .onDismiss();
  };

  if (state.loading) {
    return <Skeleton />;
  }
  const { users } = state;

  const rows = users.map((row) => ({
    key: row.id,
    name: row.name,
    groups: row.groups.map((item) => item),
    created_at: moment(row.created_at).fromNow(),
    is_invitation_pending: row.is_invitation_pending,
    is_disabled: row.is_disabled,
    active_at: row.active_at
      ? moment(row.active_at).format("DD/MM/YYYY hh:mm")
      : ""
  }));

  /* Handler functions */
  const editRow = (key) => {
    navigate(`/users/${key}`);
  };

  const handleStatusTag = (record) => {
    let color = "";
    let status = "";
    if (!record.is_invitation_pending) {
      color = "green";
      status = "Active";
    } else if (record.is_invitation_pending) {
      color = "geekblue";
      status = "Pending Invitation";
    } else if (record.is_disabled) {
      color = "volcano";
      status = "Disabled";
    }

    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Groups",
      dataIndex: "groups",
      key: "groups",
      render: (groups) => (
        <Item>
          {groups.map((group, idx) => (
            <Group key={idx}>{group.name}</Group>
          ))}
        </Item>
      )
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "Status",
      dataIndex: "is_invitation_pending",
      key: "is_invitation_pending",
      render: (_text, record) => handleStatusTag(record)
    },
    {
      title: "Last Active At",
      dataIndex: "active_at",
      key: "active_at"
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
      <Heading>Users</Heading>
      <UserInfo>
        <Button
          title="New User"
          variant="alert-save"
          onClick={showCreateUserDialog}
        />
      </UserInfo>
      <Table columns={columns} dataSource={rows} rowKey={(row) => row.key} />
    </Wrapper>
  );
};

export default React.memo(UserView, isEqual);
