// Tabs Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import Popover, { ArrowContainer } from "react-tiny-popover";
import { Menu, Dropdown, AutoComplete, Input } from "antd";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useDispatch } from "react-redux";

import { Avatar } from "../Avatar";
import { Icon } from "../Icon";
import PipelineConnect from "../../api/pipeline_connect";
import { Divider } from "antd";
import { updateActiveTab } from "../../actions/header";

import notification from "../../api/notification";
import { Sites } from "../../api/sites";
import { Overview } from "../../content-analytics/api/overview";
import OrganizationDetails from "../../api/organizations";

const Wrapper = styled.div`
  width: 100%;
  background: #fff;

  .arw-icn {
    padding-top: 2px;
  }

  .menu {
    font-size: 13px;
    line-height: 33px;
    font-weight: 700;
    color: #abb1b6;
    cursor: pointer;
    text-decoration: none;
    margin-right: 30px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  border-bottom: 1px solid #eceef0;
  padding: 12px 72px 0 20px;
`;

const ColImage = styled.div`
  flex-grow: 1;
  margin-left: -16px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ViewTitle = styled.div`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
`;

const ViewLink = styled.div`
  margin-left: 10px;
  color: #1f73e0;
  font-size: 12px;
  margin-top: 4px;
`;

const SearchWrapper = styled.div`
  margin-right: 20px;
`;

const Image = styled.img`
  cursor: pointer;
  width: 75px;
  height: 16.15px;
  margin-left: 20px;
  margin-top: 4px;

  &.normal-img {
    width: 34px;
    height: 34px;
  }
`;

const MenuTitle = styled.div``;
const MenuItem = styled.div`
  display: inline-block;
  height: 53px;
  font-size: 13px;
  line-height: 33px;
  font-weight: 700;
  color: #abb1b6;
  cursor: pointer;
  text-decoration: none;
  margin-right: 30px;
`;

const MenuItemActive = styled(MenuItem)`
  color: #192734;
  border-bottom: 3px solid #2996f1;
`;

const ColProfile = styled.div`
  cursor: pointer;
  margin-top: 5px;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #192734;
  padding: 9px 0 0 10px;
  text-transform: capitalize;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  border: 1px solid rgb(211, 211, 211);
  box-shadow: 0px 0px 20px -14px rgba(0, 0, 0, 0.75);

  .ant-divider-horizontal {
    margin: 11px 0 0px 0;
  }
`;

const ProfileOrgContent = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 10px 0px 5px 10px;
  border-radius: 10px;
  margin-right: 15px;
  border: 1px solid rgb(211, 211, 211);
  box-shadow: 0px 0px 20px -14px rgba(0, 0, 0, 0.75);
`;

const LabelProfile = styled.div`
  font-size: 13px;
  align-self: center;
  line-height: 16px;
  font-weight: 700;
  color: #595959;
  cursor: pointer;
  margin-right: 20px;
`;

const LogoutDetails = styled.div`
  display: flex;
`;

const IconContent = styled.div`
  cursor: pointer;
`;

const SetupDetails = styled.div`
  margin-bottom: 10px;
`;

const OrgDetails = styled.div`
  margin-bottom: 10px;
`;

const OrgNewDetails = styled.div`
  padding: 3px 0 10px 10px;
`;

const OrgName = styled.div`
  font-size: 9px;
  margin-top: 2px;
  text-transform: uppercase;
`;

// MenuItem Component
const MenuItemComponent = ({ menu, activeMenu, index, onChange, path }) => {
  const MenuItemComp = activeMenu === menu.id ? MenuItemActive : MenuItem;

  /* Handler Function */
  const onMenuItem = (e) => {
    if (e.key === "0") {
      navigate("/connect");
    }

    if (e.key === "2") {
      navigate("/actions");
    }

    if (onChange) {
      onChange(menu.id);
    }
  };

  const handleButtonClick = () => {
    navigate("/automation");

    if (onChange) {
      onChange(menu.id);
    }
  };

  const onMenuItemExplore = () => {
    navigate(path);

    if (onChange) {
      onChange(menu.id);
    }
  };

  const menuList = (
    <Menu onClick={onMenuItem}>
      <Menu.Item key="2">Actions</Menu.Item>
    </Menu>
  );

  return (
    <>
      {menu && menu.title === "Automations" ? (
        <Dropdown overlay={menuList} onClick={handleButtonClick}>
          <MenuItemComp key={menu.id}>{menu.title}</MenuItemComp>
        </Dropdown>
      ) : (
        <MenuItemComp key={menu.id} onClick={onMenuItemExplore}>
          {menu.title}
        </MenuItemComp>
      )}
    </>
  );
};

// Menu Component
const MenuComp = ({ tablist, activeMenu, onChange }) => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1184);

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1184);
  };

  const onMenuItem = (e) => {
    navigate(`/${e.key}`);

    if (onChange) {
      onChange(e.key);
    }
  };

  const handleButtonClick = () => {
    navigate("/content/overview");

    if (onChange) {
      onChange("overview");
    }
  };

  const menuList = (
    <Menu onClick={onMenuItem}>
      <Menu.Item key="article">Article</Menu.Item>
      <Menu.Item key="author">Author</Menu.Item>
      <Menu.Item key="explore">Explore</Menu.Item>
      <Menu.Item key="chat">Chat</Menu.Item>
    </Menu>
  );

  return (
    <MenuTitle>
      <>
        {!isDesktop ? (
          <Dropdown overlay={menuList} onClick={handleButtonClick}>
            <div className={"menu"} key={tablist[0]?.id}>
              {tablist[0]?.id}
            </div>
          </Dropdown>
        ) : (
          tablist.map((menu, idx) => (
            <MenuItemComponent
              key={menu.id}
              menu={menu}
              index={idx}
              activeMenu={activeMenu}
              path={menu.path}
              onChange={onChange}
            />
          ))
        )}
      </>
    </MenuTitle>
  );
};

// Popover Org Component
const PopoverOrgComp = ({ props, org_list, current_org, onUpdateTab }) => {
  let org = org_list.filter(
    (list) => list.fabriq_org_id !== current_org.fabriq_org_id
  );
  const handleSwitchOrg = (id) => {
    const selectedOrg = org_list.find((list) => list.fabriq_org_id === id);
    localStorage.setItem("organization", JSON.stringify(selectedOrg));

    window.location.pathname = "/overview";

    if (onUpdateTab) {
      onUpdateTab("overview");
    }
  };

  return (
    <ArrowContainer
      position={props.position}
      targetRect={props.targetRect}
      popoverRect={props.popoverRect}
      arrowColor="#fff"
      arrowSize={10}
      align="start"
      arrowStyle={{ opacity: 0.7 }}
    >
      <ProfileOrgContent>
        {org.map((list) => (
          <OrgNewDetails onClick={() => handleSwitchOrg(list.fabriq_org_id)}>
            <LabelProfile>{list.fabriq_org_name}</LabelProfile>
          </OrgNewDetails>
        ))}
      </ProfileOrgContent>
    </ArrowContainer>
  );
};

// Popover site Component
const PopoverSiteComp = ({ props, siteList, current_org, onUpdateTab }) => {
  const handleSwitchOrg = (id) => {
    const selectedOrg = siteList.find((list) => list.id === id);
    localStorage.setItem("view_id", JSON.stringify(selectedOrg));

    window.location.pathname = "/overview";
    if (onUpdateTab) {
      onUpdateTab("overview");
    }
  };

  return (
    <ArrowContainer
      position={props.position}
      targetRect={props.targetRect}
      popoverRect={props.popoverRect}
      arrowColor="#fff"
      arrowSize={10}
      align="start"
      arrowStyle={{ opacity: 0.7 }}
    >
      <ProfileOrgContent>
        {siteList.map((list) => (
          <OrgNewDetails onClick={() => handleSwitchOrg(list.id)}>
            <LabelProfile>{list.site_name}</LabelProfile>
          </OrgNewDetails>
        ))}
      </ProfileOrgContent>
    </ArrowContainer>
  );
};

// Popover Component
const PopoverComp = ({
  props,
  onClickSetup,
  org_value,
  siteArray,
  onUpdateTab
}) => {
  const [isOrgPopover, setIsOrgPopover] = useState(false);
  const [isSitePopover, setIsSitePopover] = useState(false);
  const view_id =
    localStorage.getItem("view_id") !== "undefined" &&
    JSON.parse(localStorage.getItem("view_id"));
  const onLogout = () => {
    localStorage.clear();

    window.location.pathname = "/login";
  };

  const orgs = JSON.parse(localStorage.getItem("fabriq_orgs"));

  const onClickOutsideOrg = () => {
    setIsOrgPopover(false);
  };

  const onClickOrg = (isOpen) => {
    if (orgs.length > 1) {
      setIsOrgPopover(isOpen);
    }
  };
  const onClickOutsideSite = () => {
    setIsSitePopover(false);
  };

  const onClickSite = (isOpen) => {
    setIsSitePopover(isOpen);
  };

  return (
    <ArrowContainer
      position={props.position}
      targetRect={props.targetRect}
      popoverRect={props.popoverRect}
      arrowColor="#fff"
      arrowSize={10}
      arrowStyle={{ opacity: 0.7 }}
    >
      <ProfileContent>
        {orgs && orgs.length > 1 && (
          <OrgDetails>
            <Popover
              containerClassName="tiny-popup"
              containerStyle={{ zIndex: 11, marginTop: "-21px" }}
              isOpen={isOrgPopover}
              position={["left"]}
              align="start"
              arrowSize={0}
              content={(data) => (
                <PopoverOrgComp
                  props={data}
                  org_list={orgs}
                  current_org={org_value}
                />
              )}
              onClickOutside={onClickOutsideOrg}
            >
              <LabelProfile onClick={() => onClickOrg(!isOrgPopover)}>
                Switch Org
                <OrgName>{`( ${org_value.fabriq_org_name} )`}</OrgName>
              </LabelProfile>
            </Popover>
            <Divider dashed />
          </OrgDetails>
        )}
        <OrgDetails>
          <Popover
            containerClassName="tiny-popup"
            containerStyle={{ zIndex: 11, marginTop: "-21px" }}
            isOpen={isSitePopover}
            position={["left"]}
            align="start"
            arrowSize={0}
            content={(data) => (
              <PopoverSiteComp
                props={data}
                siteList={siteArray}
                current_org={org_value}
                onUpdateTab={onUpdateTab}
              />
            )}
            onClickOutside={onClickOutsideSite}
          >
            <LabelProfile onClick={() => onClickSite(!isSitePopover)}>
              Switch Site
              {view_id && <OrgName>{`( ${view_id?.site_name} )`}</OrgName>}
            </LabelProfile>
          </Popover>
          <Divider dashed />
        </OrgDetails>
        <SetupDetails onClick={() => onClickSetup("/setup")}>
          <LabelProfile>Setup</LabelProfile>
        </SetupDetails>
        <SetupDetails onClick={() => onClickSetup("/connect")}>
          <LabelProfile>Connections</LabelProfile>
        </SetupDetails>
        <SetupDetails onClick={() => onClickSetup("/destinations")}>
          <LabelProfile>Destinations</LabelProfile>
        </SetupDetails>
        <LogoutDetails onClick={onLogout}>
          <LabelProfile>Logout</LabelProfile>
          <IconContent>
            <Icon width={18} height={18} name="logout" />
          </IconContent>
        </LogoutDetails>
      </ProfileContent>
    </ArrowContainer>
  );
};

// Navbar Component
const Navbar = (props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [state, setState] = useState(false);
  const [viewData, setViewData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchOptionData, setSearchOptionData] = useState([]);
  const [searchLoad, setSearchLoad] = useState(false);
  const [siteArray, setSiteArray] = useState([]);
  const { tablist, activeMenu, onUpdateTab, refreshActiveMenu } = props;
  const { Search } = Input;
  const { Option, OptGroup } = AutoComplete;
  const dispatch = useDispatch();

  useEffect(() => {
    getSiteDetails();
    if (
      organization.fabriq_org_id &&
      (organizationLogo === "" || !organizationLogo)
    ) {
      getOrgDetails();
    }
  }, []);

  const getSiteDetails = async () => {
    let viewData =
      localStorage.getItem("view_id") !== "undefined" &&
      JSON.parse(localStorage.getItem("view_id"));
    let sites = [];
    try {
      const user = await PipelineConnect.getMyUserDetails();
      if (user) {
        if (user?.data?.sites) {
          sites = user?.data?.sites;
        }

        const res = await Sites.get_sitesData();
        if (res) {
          let sitesArray = res?.data?.filter((opt) => sites.includes(opt.id));
          setSiteArray(sitesArray);
          if (viewData) {
            setViewData(viewData);
          } else {
            setViewData(sitesArray[0]);
            localStorage.setItem("view_id", JSON.stringify(sitesArray[0]));
          }
        }
      }
    } catch (err) {
      notification.error(err?.message);
    }
  };

  /* Handler Function */
  const onClickOutside = () => {
    setIsPopoverOpen(false);
  };

  const onClickProfile = (isOpen) => {
    setIsPopoverOpen(isOpen);
  };

  const onClickImage = () => {
    navigate("/content/overview");
    if (onUpdateTab) {
      onUpdateTab("overview");
    }
  };

  const onClickSetup = (path) => {
    navigate(path);
    if (path === "/setup") refreshActiveMenu("");
    setIsPopoverOpen(false);
    if (onUpdateTab) {
      onUpdateTab("");
    }
  };

  const getOrgDetails = () => {
    return OrganizationDetails.getOrgLogo(organization.fabriq_org_id)
      .then((res) => {
        if (!organizationLogo) {
          localStorage.setItem(
            "org_logo",
            res.data.data.organizations[0].logo || ""
          );
        }
      })
      .catch((error) => notification.error(error.message));
  };

  const getUserInfo = () => {
    return PipelineConnect.getMyUserDetails()
      .then((user) => {
        if (user && user.data && user.data.name) {
          localStorage.setItem("user_name", user.data.name || "");
          setState(true);
        }
      })
      .catch((error) => notification.error(error.message));
  };

  const organization = JSON.parse(localStorage.getItem("organization"));
  const userName = localStorage.getItem("user_name");
  const nameSplit = userName && userName.split(" ", 1).toString();
  const organizationLogo = localStorage.getItem("org_logo");

  useEffect(() => {
    if (organization.fabriq_user_id && (userName === "" || !userName)) {
      getUserInfo();
    }
  }, []);

  function onSelect(value, option) {
    const filteredData = searchOptionData.filter((item) => {
      if (item.children && item.children.length) {
        return item.children.some((child) => child.id === parseInt(option.key));
      }
      return false;
    });
    if (filteredData.length > 0) {
      let path = filteredData[0]?.title === "Articles" ? "article" : "author";
      let id = filteredData[0]?.children[0].id;
      navigate(`/${path}/${id}`);
      dispatch(updateActiveTab(path));
      setSearchValue("");
      setSearchOptionData([]);
    }
  }

  const onChangeSearch = (value) => {
    setSearchValue(value);
  };

  function renderTitle(title) {
    return <span>{title}</span>;
  }

  const options = searchOptionData.map((group) => (
    <OptGroup key={group.title} label={renderTitle(group.title)}>
      {group.children.map((opt) => (
        <Option key={opt.id} value={opt.title}>
          {opt.title}
        </Option>
      ))}
    </OptGroup>
  ));

  const getOptionData = (data) => {
    let optionData = [
      {
        title: "Articles",
        children: data.Articles.map((article) => ({
          title: article.title,
          id: article.article_id
        }))
      },
      {
        title: "Authors",
        children: data.Authors.map((author) => ({
          title: author.name,
          id: author.author_id
        }))
      }
    ];

    const filteredDataSource = optionData
      .map((item) => {
        if (item.children.length === 0) {
          return null;
        } else {
          return item;
        }
      })
      .filter(Boolean);

    setSearchOptionData(filteredDataSource);
  };

  const onSearch = () => {
    let variables = {
      searchValue: `%${searchValue}%`
    };
    setSearchLoad(true);
    Overview.get_search(variables)
      .then((res) => {
        if (res) {
          setSearchLoad(false);
          getOptionData(res?.data?.data);
        }
      })
      .catch((err) => {
        setSearchLoad(false);
      });
  };

  const src = organizationLogo || "/images/header_connect_transparent.png";
  const domainlink =
    viewData && Array.isArray(viewData?.host_name)
      ? viewData?.host_name[0]
      : viewData?.host_name;

  return (
    <Wrapper>
      <Content className="header-top">
        <ColImage>
          <Image
            src={src}
            className={`${organizationLogo ? "org-img" : "normal-img"}`}
            alt=""
            onClick={onClickImage}
          />
          <ViewTitle>{viewData?.site_name}</ViewTitle>
          <ViewLink>
            <a href={domainlink} target="/">
              {domainlink}
            </a>
          </ViewLink>
        </ColImage>
        <MenuComp
          tablist={tablist}
          activeMenu={activeMenu}
          onChange={onUpdateTab}
        />
        <SearchWrapper>
          <AutoComplete
            value={searchValue}
            dataSource={options}
            style={{ width: 250, paddingBottom: 10 }}
            onSelect={onSelect}
            size="large"
            onChange={onChangeSearch}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 250 }}
          >
            <Search
              placeholder="search"
              loading={searchLoad}
              enterButton
              onSearch={onSearch}
              size="large"
            />
          </AutoComplete>
        </SearchWrapper>
        <Popover
          containerClassName="tiny-popup"
          containerStyle={{ zIndex: 11, marginTop: "-4px" }}
          isOpen={isPopoverOpen}
          position={["bottom"]}
          content={(data) => (
            <PopoverComp
              props={data}
              onClickSetup={onClickSetup}
              org_value={organization}
              siteArray={siteArray}
              onUpdateTab={onUpdateTab}
            />
          )}
          onClickOutside={onClickOutside}
        >
          <ColProfile onClick={() => onClickProfile(!isPopoverOpen)}>
            <Avatar name={userName} />
          </ColProfile>
        </Popover>
        <UserName>
          <ReactReadMoreReadLess
            charLimit={8}
            readMoreText={".."}
            readLessText={""}
          >
            {nameSplit || "Loading"}
          </ReactReadMoreReadLess>
        </UserName>
      </Content>
    </Wrapper>
  );
};

Navbar.propTypes = {
  tablist: PropTypes.array,
  activeMenu: PropTypes.string,
  onUpdateTab: PropTypes.func
};

Navbar.defaultProps = {
  tablist: [],
  activeMenu: "",
  onUpdateTab: null
};

export default React.memo(Navbar, isEqual);
