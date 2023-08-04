import React from "react";
import styled from "styled-components";

import { UserProfile } from "./Proptypes";
import DynamicForm from "./DynamicForm";

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

export default class SiteEdit extends React.Component {
  static propTypes = {
    site: UserProfile.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      site: this.props.site
    };
  }

  renderUserInfoForm() {
    const { site } = this.state;

    const formFields = [
      {
        name: "site_name",
        title: "Name",
        type: "text",
        initialValue: site.site_name,
        readOnly: true
      },
      {
        name: "host_name",
        title: "Host Name",
        type: "text",
        initialValue: site.host_name,
        readOnly: true
      },
      // {
      //   name: "collector_url",
      //   title: "Collector Url",
      //   type: "text",
      //   initialValue: site.collector_url,
      //   readOnly: true
      // },
      {
        name: "site_id",
        title: "Site Id",
        type: "text",
        initialValue: site.site_id,
        readOnly: true
      }
    ];

    return <DynamicForm fields={formFields} hideSubmitButton />;
  }

  render() {
    return <Wrapper>{this.renderUserInfoForm()}</Wrapper>;
  }
}
