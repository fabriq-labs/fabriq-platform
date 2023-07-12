import React from "react";
import { Menu, Icon } from "antd";
import styled from "styled-components";

import ButtonDropdown from "./button_dropdown";

const Wrapper = styled.div`
  .anticon {
    svg {
      vertical-align: unset;
    }
  }
`;

const ChartTypes = [
  {
    name: "line",
    title: "Line",
    iconType: "line-chart",
    icon: <Icon type="line-chart" />
  },
  {
    name: "area",
    title: "Area",
    iconType: "area-chart",
    icon: <Icon type="area-chart" />
  },
  {
    name: "bar",
    title: "Bar",
    iconType: "bar-chart",
    icon: <Icon type="bar-chart" />
  },
  {
    name: "pie",
    title: "Pie",
    iconType: "pie-chart",
    icon: <Icon type="pie-chart" />
  },
  {
    name: "table",
    title: "Table",
    iconType: "table",
    icon: <Icon type="table" />
  }
];

const SelectChartType = ({ chartType, updateChartType }) => {
  const menu = (
    <Wrapper>
      <Menu data-testid="chart-type-dropdown">
        {ChartTypes.map((m) => (
          <Menu.Item key={m.title} onClick={() => updateChartType(m.name)}>
            {m.icon} {m.title}
          </Menu.Item>
        ))}
      </Menu>
    </Wrapper>
  );

  const foundChartType = ChartTypes.find((t) => t.name === chartType);
  return (
    <Wrapper>
      <ButtonDropdown
        data-testid="chart-type-btn"
        overlay={menu}
        icon={foundChartType?.iconType}
        style={{ border: 0 }}
      >
        {foundChartType?.title || ""}
      </ButtonDropdown>
    </Wrapper>
  );
};

export default SelectChartType;
