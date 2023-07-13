/* eslint-disable react/forbid-prop-types */
// Query Sidebar Component
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { Skeleton, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { updateQueryFolder } from "../../actions/sidebar";

import QueryDetails from "../../api/query_details";
import notification from "../../api/notification";

const Wrapper = styled.div`
  width: 180px;
  min-height: 100%;
  border-right: 2px solid #f5f6f7;

  .ant-skeleton-title {
    margin: 30px;
  }
`;

const Items = styled.div`
  padding: 0px 40px 10px 18px;
  cursor: pointer;

  &:first-child {
    margin-top: 30px;
  }
`;

const MainMenuItem = styled.div`
  padding: 10px 40px 10px 18px;
  color: #192734;
  font-weight: 600;
`;

const MenuItem = styled.div`
  display: flex;
  flex-directions: row;
  align-items: center;
  border-radius: 6px;
  width: 124px;
  height: 38px;
  padding-left: 8px;
`;

const MenuItemActive = styled(MenuItem)`
  background-color: #f4f5f6;
`;

// MenuItems Component
const MenuItems = ({ menu, activeMenu, onMenuItem }) => {
  const MenuItemComp = activeMenu === menu.id ? MenuItemActive : MenuItem;

  /* Handler Function */
  const onClickItem = (identifier, ident, title) => {
    if (onMenuItem) {
      onMenuItem(identifier);
      navigate("/explore/queries");
    }
  };

  return (
    <Items onClick={() => onClickItem(menu?.id, menu?.ident, menu?.title)}>
      <MenuItemComp>{menu.title}</MenuItemComp>
    </Items>
  );
};

// MenuItems Component
const MainMenuItemContent = ({
  title,
  ident,
  onMainMenuItem,
  mainMenu,
  onMenuItem
}) => {
  return <MainMenuItem>{title}</MainMenuItem>;
};

// Main Component
const QuerySidebar = (props) => {
  const dispatch = useDispatch();
  const menuList = useSelector((state) => state?.sidebar?.queryFolder);
  const { activeMenu, onMenuItem, onMainMenuItem, mainMenu } = props;

  useEffect(() => {
    getQueryFolderList();
  }, []);

  const getQueryFolderList = () => {
    QueryDetails.getQueryFolderList()
      .then((res) => {
        const list = [
          {
            id: "myquery",
            title: "Queries"
          }
        ];

        if (res?.data?.data?.query_folder) {
          res.data.data.query_folder.forEach((item) => {
            list.push({
              id: item.id,
              title: item.name
            });
          });
        }
        dispatch(updateQueryFolder(list));
      })
      .catch((err) => {
        notification.error("Query Folder Get Error", err.message);
      });
  };

  return (
    <Wrapper>
      <MainMenuItemContent
        title="Query"
        mainMenu={mainMenu}
        ident="query"
        onMainMenuItem={onMainMenuItem}
        onMenuItem={onMenuItem}
      />
      {menuList.length <= 0 && (
        <Row>
          <Col align="center">
            <Skeleton paragraph={false} title={{ width: "70%" }} />
          </Col>
        </Row>
      )}
      {menuList.map((menu) => (
        <MenuItems
          key={`${menu.id}`}
          menu={menu}
          activeMenu={activeMenu}
          onMenuItem={onMenuItem}
        />
      ))}
    </Wrapper>
  );
};

QuerySidebar.propTypes = {
  menulist: PropTypes.array,
  activeMenu: PropTypes.string,
  onMenuItem: PropTypes.func
};

QuerySidebar.defaultProps = {
  menulist: [],
  activeMenu: "",
  onMenuItem: null
};

export default React.memo(QuerySidebar, isEqual);
