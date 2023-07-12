// Header Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";

import { menuItems } from "../../pages/Pipelines/helpers/options";

const Wrapper = styled.div`
  width: 100%;
  height: 35px;
  top: 0;
  z-index: 10;
`;

const Content = styled.div``;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuEdit = styled.div`
  display: flex;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 12px;
  line-height: 1px;
  font-weight: 700;
  color: #c5c9d0;
  cursor: pointer;
  text-decoration: none;

  &.remove-space {
    margin-right: 40px;
  }
`;

const MenuItemDisable = styled(MenuItem)`
  pointer-events: none;
  cursor: none;
`;

const MenuItemActive = styled(MenuItem)`
  color: #262626;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #c5c9d0;
`;

const TitleActive = styled(Title)`
  color: #000;
`;

const Step = styled.div`
  width: 22px;
  height: 22px;
  font-size: 11px;
  line-height: 13px;
  font-weight: 700;
  border-radius: 22px;
  border: 1px solid;
  background-color: #fff;
  text-align: center;
  padding-top: 4px;
  margin-right: 12px;
`;

const StepActive = styled(Step)`
  background-color: #000;
  border: 0 none;
  color: #fff;
`;

// MenuItem Component
const MenuItemComponent = ({
  activeMenu,
  menu,
  onClickItem,
  isDisable,
  item,
  isTwoItem
}) => {
  const MenuItemComp =
    activeMenu === menu.identifier
      ? MenuItemActive
      : isDisable
      ? MenuItemDisable
      : MenuItem;
  const StepComp = activeMenu === menu.identifier ? StepActive : Step;
  const TitleComp = activeMenu === menu.identifier ? TitleActive : Title;

  const onClick = () => {
    if (onClickItem) {
      onClickItem(menu.identifier);
    }
  };

  const className = isTwoItem ? "remove-space" : "";

  return (
    <MenuItemComp className={className} key={menu.identifier} onClick={onClick}>
      <StepComp>{menu.step}</StepComp>
      <TitleComp>{menu.title}</TitleComp>
    </MenuItemComp>
  );
};

// Menu Component
const MenuComponent = ({
  activeMenu,
  onClickItem,
  isDisable,
  item,
  list,
  isTwoItem
}) => {
  const MenuComp = isTwoItem ? MenuEdit : Menu;
  return (
    <MenuComp>
      {list.map((menu) => (
        <MenuItemComponent
          menu={menu}
          onClickItem={onClickItem}
          activeMenu={activeMenu}
          isTwoItem={isTwoItem}
          isDisable={isDisable}
          item={item}
          key={`${menu.identifier}`}
        />
      ))}
    </MenuComp>
  );
};

// Header Component
const Header = (props) => {
  const { activeMenu, onClickItem, isDisable, item, disableLeftView, isEdit } =
    props;
  const list = disableLeftView
    ? menuItems.filter((item) => item?.identifier !== "source")
    : isEdit
    ? menuItems.filter(
        (item) => item?.identifier !== "source" && item?.identifier !== "data"
      )
    : menuItems.filter((item) => item?.identifier !== "data");

  const isTwoItem = list.length === 2;

  return (
    <Wrapper>
      <Content>
        <MenuComponent
          activeMenu={activeMenu}
          onClickItem={onClickItem}
          isDisable={isDisable}
          isTwoItem={isTwoItem}
          list={list}
          item={item}
        />
      </Content>
    </Wrapper>
  );
};

Header.propTypes = {
  activeMenu: PropTypes.string,
  onClickItem: PropTypes.func,
  isDisable: PropTypes.bool,
  disableLeftView: PropTypes.bool,
  item: PropTypes.object
};

Header.defaultProps = {
  activeMenu: "",
  onClickItem: null,
  isDisable: false,
  disableLeftView: false,
  item: null
};

export default React.memo(Header, isEqual);
