import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isFunction, get, findIndex } from "lodash";
import { Dropdown, Menu, Typography, Icon } from "antd";
import { DynamicDateType } from "../../../api/parameters/DateParameter";
import { DynamicDateRangeType } from "../../../api/parameters/DateRangeParameter";

const Wrapper = styled.div`
  .dynamic-button {
    height: 100%;
    position: absolute !important;
    right: 1px;
    top: 0;

    .ant-dropdown-trigger {
      height: 100%;
    }

    button {
      border: none;
      padding: 0;
      box-shadow: none;
      background-color: transparent !important;
    }

    &:after {
      content: "";
      position: absolute;
      width: 1px;
      height: 19px;
      left: 0;
      top: 8px;
      border-left: 1px dotted rgba(0, 0, 0, 0.12);
    }
  }

  .anticon {
    vertical-align: unset;
  }

  .dynamic-menu {
    width: 187px;

    em {
      color: #ccc;
      font-size: 11px;
    }
  }
`;

const { Text } = Typography;

function DynamicButton({ options, selectedDynamicValue, onSelect, enabled }) {
  const menu = (
    <Menu
      className="dynamic-menu"
      onClick={({ key }) => onSelect(get(options, key, "static"))}
      selectedKeys={[`${findIndex(options, { value: selectedDynamicValue })}`]}
      data-test="DynamicButtonMenu"
    >
      {options.map((option, index) => (
        <Menu.Item key={index}>
          {option.name}{" "}
          {option.label && (
            <em>{isFunction(option.label) ? option.label() : option.label}</em>
          )}
        </Menu.Item>
      ))}
      {enabled && <Menu.Divider />}
      {enabled && (
        <Menu.Item>
          <Text type="secondary">Back to Static Value</Text>
        </Menu.Item>
      )}
    </Menu>
  );

  const containerRef = useRef(null);

  return (
    <Wrapper ref={containerRef}>
      <a onClick={(e) => e.stopPropagation()}>
        <Dropdown.Button
          overlay={menu}
          className="dynamic-button"
          placement="bottomRight"
          trigger={["click"]}
          icon={
            <Icon
              type="thunderbolt"
              theme={enabled ? "twoTone" : "outlined"}
              className="dynamic-icon"
            />
          }
          getPopupContainer={() => containerRef.current}
          data-test="DynamicButton"
        />
      </a>
    </Wrapper>
  );
}

DynamicButton.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  selectedDynamicValue: PropTypes.oneOfType([
    DynamicDateType,
    DynamicDateRangeType
  ]),
  onSelect: PropTypes.func,
  enabled: PropTypes.bool
};

DynamicButton.defaultProps = {
  options: [],
  selectedDynamicValue: null,
  onSelect: () => {},
  enabled: false
};

export default DynamicButton;
