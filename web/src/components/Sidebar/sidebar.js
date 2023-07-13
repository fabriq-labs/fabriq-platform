/* eslint-disable react/forbid-prop-types */
// Sidebar Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 140px;
  min-height: 100%;
  border-right: 2px solid #f5f6f7;
`;

const Items = styled.div`
  padding: 0px 40px 10px 18px;
  cursor: pointer;

  &:first-child {
    padding-top: 30px;
  }
`;

const MenuItem = styled.div`
  display: flex;
  flex-directions: row;
  align-items: center;
  border-radius: 6px;
  width: 100px;
  height: 38px;
  padding-left: 14px;
`;

const MenuItemActive = styled(MenuItem)`
  background-color: #f4f5f6;
`;

// MenuItems Component
const MenuItems = ({ menu, activeMenu, onMenuItem }) => {
  // eslint-disable-line
  const MenuItemComp = activeMenu === menu.id ? MenuItemActive : MenuItem;

  /* Handler Function */
  const onClickItem = (identifier) => {
    if (onMenuItem) {
      onMenuItem(identifier);
    }
  };

  return (
    <Items onClick={() => onClickItem(menu.id)}>
      <MenuItemComp>{menu.title}</MenuItemComp>
    </Items>
  );
};

// Main Component
const Sidebar = (props) => {
  const { menulist, activeMenu, onMenuItem } = props;

  return (
    <Wrapper>
      {menulist.map((menu) => (
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

Sidebar.propTypes = {
  menulist: PropTypes.array,
  activeMenu: PropTypes.string,
  onMenuItem: PropTypes.func
};

Sidebar.defaultProps = {
  menulist: [],
  activeMenu: "",
  onMenuItem: null
};

export default React.memo(Sidebar, isEqual);
