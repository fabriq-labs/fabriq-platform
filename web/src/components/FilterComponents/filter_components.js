import { Card, Row, Col, Button, Select } from "antd";
import React, { useState } from "react";
import { TitleComp } from "../Title";

const Option = Select.Option;
const FilterComponents = ({
  filterOptions,
  groupOptions,
  onApplyFilter,
  onClear,
  setFilter
}) => {
  const [filterValue, setFilterValue] = useState();
  const changeSelect = (val) => {
    setFilterValue(val);
    setFilter(val);
  };
  return (
    <Card style={{ width: 400 }}>
      <Row gutter={24}>
        <Col style={{ marginRight: 5, marginTop: 3 }}>
          <TitleComp title="Author Group :" type="Heading1" />
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 19 }}>
        <Col span={22}>
          <Select
            value={filterValue}
            onChange={(e) => {
              changeSelect(e);
            }}
            loading={filterOptions.length <= 0 ? true : false}
            allowClear
            showSearch
            showArrow
            style={{ width: "100%" }}
          >
            {filterOptions.map((item) => (
              <Option value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={24} style={{ marginTop: 21 }}>
        <Col span={4}>
          <Button
            onClick={() => {
              onApplyFilter(filterValue);
              onClear();
            }}
          >
            Apply Filters
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterComponents;
