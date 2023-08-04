import React, { Fragment } from "react";
import { includes, get } from "lodash";
import { navigate } from "@reach/router";
import { Tag, Form } from "antd";
import styled from "styled-components";
import Group from "../../api/group";
import PipelineConnect from "../../api/pipeline_connect";
import User from "../../api/users";
import { Sites } from "../../api/sites";
import { UserProfile } from "./Proptypes";
import DynamicForm from "./DynamicForm";
import InputWithCopy from "./InputWithCopy";
import { Select } from "../Select";

const Wrapper = styled.div`
  width: 312px;
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 33%;

  .profile__image {
    float: left;
    margin-right: 10px;
    border-radius: 100%;
  }

  .profile__h3 {
    margin: 8px 0 0 0;
    font-size: 23px;
    font-weight: 600;
  }

  hr {
    margin-top: 18px;
    margin-bottom: 18px;
    border: 0;
    border-top: 1px solid #eeeeee;
  }

  .profile__container {
    .well {
      .form-group:last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .profile__dl {
    dd {
      margin-bottom: 12px;
    }
  }

  .alert-invited {
    .form-control {
      cursor: text !important;
      background: #fff !important;
    }
  }

  .ant-btn {
    width: 100%;
  }

  h5 {
    font-size: 13px;
    margin-top: 9px;
    margin-bottom: 9px;
  }
`;

const SelectComp = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;

  .css-1okebmr-indicatorSeparator {
    display: none;
  }
`;

const Heading = styled.div`
  color: #000;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  padding-bottom: 6px;
`;

export default class UserEdit extends React.Component {
  static propTypes = {
    user: UserProfile.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      groups: [],
      loadingGroups: true,
      sites: [],
      loadingSites: true
    };
  }

  componentDidMount() {
    this.getGroups();
    this.getSites();
  }

  getGroups = () => {
    Group.query().then((groups) => {
      const { data } = groups;
      this.setState({
        groups: data.map(({ id, name }) => ({ value: id, name })),
        loadingGroups: false
      });
    });
  };

  getSites = async () => {
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
          this.setState({
            sites: sitesArray.map(({ id, site_name }) => ({
              value: id,
              name: site_name
            })),
            loadingSites: false
          });
        }
      }
    } catch (err) {
      this.setState({
        sites: [],
        loadingSites: false
      });
    }
  };

  saveUser = (values, successCallback, errorCallback) => {
    const data = {
      id: this.props.user.id,
      ...values
    };

    User.save(data)
      .then((user) => {
        const { data } = user;
        successCallback("Saved.");
        this.setState({ user: User.convertUserInfo(data) });
        navigate("/setup");
      })
      .catch((error) => {
        errorCallback(get(error, "response.data.message", "Failed saving."));
      });
  };

  renderUserInfoForm() {
    const { user, groups, loadingGroups, sites, loadingSites } = this.state;
    const { isMyProfile } = this.props;
    const organization = JSON.parse(localStorage.getItem("organization"));
    const foundAdmin = groups.some((el) => el.name === "admin");

    const formFields = [
      {
        name: "name",
        title: "Name",
        type: "text",
        initialValue: user.name
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        initialValue: user.email
      },
      !user.isDisabled && organization.fabriq_user_id !== user.id && foundAdmin
        ? {
            name: "site_ids",
            title: "Sites",
            type: "select",
            mode: "multiple",
            options: sites,
            initialValue: sites
              .filter((site) => includes(user.sites, site.value))
              .map((site) => site.value),
            loading: loadingSites,
            placeholder: loadingSites ? "Loading..." : ""
          }
        : {
            name: "site_ids",
            title: "Sites",
            type: "select",
            mode: "multiple",
            readOnly: true,
            options: sites,
            initialValue: sites
              .filter((site) => includes(user.sites, site.value))
              .map((site) => site.value),
            placeholder: loadingSites ? "Loading..." : ""
          },
      !user.isDisabled && organization.fabriq_user_id !== user.id && foundAdmin
        ? {
            name: "group_ids",
            title: "Groups",
            type: "select",
            mode: "multiple",
            options: groups,
            initialValue: groups
              .filter((group) => includes(user.groupIds, group.value))
              .map((group) => group.value),
            loading: loadingGroups,
            placeholder: loadingGroups ? "Loading..." : ""
          }
        : {
            name: "group_ids",
            title: "Groups",
            type: "content",
            content: this.renderUserGroups()
          }
    ].map((field) => ({
      readOnly: isMyProfile ? true : user.isDisabled,
      required: true,
      ...field
    }));

    return (
      <DynamicForm
        fields={formFields}
        onSubmit={this.saveUser}
        hideSubmitButton={isMyProfile ? true : user.isDisabled}
      />
    );
  }

  renderUserGroups() {
    const { user, groups, loadingGroups } = this.state;

    return loadingGroups ? (
      "Loading..."
    ) : (
      <div data-test="Groups">
        {groups
          .filter((group) => includes(user.groupIds, group.value))
          .map((group) => (
            <Tag className="m-b-5 m-r-5" key={group.value}>
              <a href={`groups/${group.value}`}>{group.name}</a>
            </Tag>
          ))}
      </div>
    );
  }

  renderDashboardList() {
    const { options, selectedDashboard, handleChangeFrom } = this.props;

    return (
      <SelectComp>
        <Heading>Select Your Home Dashboard</Heading>
        <Select
          options={options}
          value={selectedDashboard}
          onChange={handleChangeFrom}
        />
      </SelectComp>
    );
  }

  renderApiKey() {
    const { user } = this.state;

    return (
      <Form layout="vertical">
        <hr />
        <Form.Item label="API Key" className="m-b-10">
          <InputWithCopy
            id="apiKey"
            className="hide-in-percy"
            value={user.apiKey}
            data-test="ApiKey"
            readOnly
          />
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { user } = this.state;
    const { isMyProfile } = this.props;

    return (
      <Wrapper>
        <img
          alt="Profile"
          src={user.profileImageUrl}
          className="profile__image"
          width="40"
        />
        <h3 className="profile__h3">{user.name}</h3>
        <hr />
        {this.renderUserInfoForm()}
        {/* {isMyProfile && this.renderDashboardList()} */}
        {isMyProfile && !user.isDisabled && (
          <Fragment>{this.renderApiKey()}</Fragment>
        )}
      </Wrapper>
    );
  }
}
