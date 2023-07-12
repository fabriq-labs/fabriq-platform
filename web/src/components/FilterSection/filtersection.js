// FilterSection Component

import React, { useState } from "react";
import { Row, Col, Typography, Popover } from "antd";
import { Select } from "../Select";
import FilterComponents from "../FilterComponents/filter_components";
import * as S from "./styles";
const { Text } = Typography;

const FilterSection = ({ authorsList, onApplyFilter, tab }) => {
  let filterValues = [
    "AUTHOR",
    "SECTION",
    "PAGE TYPE",
    "PUBLISHED WITHIN",
    "CAMPAIGN GROUP",
    "PATH"
  ];
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState();

  const onClear = () => {
    setOpen(!open);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [filterValue, setFilterValue] = useState();
  const changeSelect = (val) => {
    setFilterValue(val.value);
  };
  return (
    <S.WarpperFilterSection>
      <Row className="filter-row" gutter={24}>
        <Col style={{ marginTop: 6 }} span={2}>
          <Text>Filter by :</Text>
        </Col>
        <Col span={16}>
          <Row>
            {filterValues.map((val, i) => {
              if (tab.toUpperCase() === "AUTHOR" && val === "AUTHOR") {
                return null;
              } else if (val === "AUTHOR") {
                return (
                  <Popover
                    key={i}
                    placement="bottom"
                    trigger="click"
                    visible={open}
                    onVisibleChange={handleOpenChange}
                    content={
                      <FilterComponents
                        filterOptions={authorsList}
                        onApplyFilter={onApplyFilter}
                        setFilter={setFilter}
                        onClear={onClear}
                      />
                    }
                  >
                    <Col
                      key={i}
                      style={{
                        cursor: "pointer",
                        marginRight: 5,
                        padding: 10,
                        textAlign: "center",
                        background: filter ? "#2db7f5" : "",
                        fontSize: 12,
                        fontWeight: 500,
                        color: filter ? "#fff" : "#c3c5c6"
                      }}
                    >
                      {val}
                    </Col>
                  </Popover>
                );
              }
              return (
                <div
                  key={i}
                  style={{
                    cursor: "pointer",
                    marginRight: 5,
                    padding: 10,
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#c3c5c6"
                  }}
                >
                  {val}
                </div>
              );
            })}
          </Row>
        </Col>
        <Col span={6}>
          <Row
            style={{
              justifyContent: "end"
            }}
          >
            <span style={{ marginTop: -2, marginRight: 10 }}>
              {`Show ${tab} by : `}
            </span>
            <div style={{ marginTop: -5 }}>
              <Select
                className="select-filter"
                type="medium"
                value={filterValue}
                onChange={(e) => {
                  // eslint-disable-next-line no-unused-expressions
                  changeSelect(e);
                }}
                options={[
                  { label: "Search Referrals", value: "Search Referrals" },
                  { label: "Page Views", value: "Page Views" }
                ]}
              />
            </div>
          </Row>
        </Col>
      </Row>
    </S.WarpperFilterSection>
  );
};

export default FilterSection;
