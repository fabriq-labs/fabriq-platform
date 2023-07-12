import React from "react";
import { Input, Select } from "antd";
import { debounce } from "throttle-debounce";
import { useRef, useState } from "react";
import styled from "styled-components";

const SectionRow = styled.div`
  .ant-select-selection--multiple {
    min-height: 37px !important;
  }
`;

const FilterInputs = {
  string: ({ values = [], disabled, onChange }) => (
    <SectionRow>
      <Select
        key="input"
        disabled={disabled}
        style={{ width: 300 }}
        mode="tags"
        value={values}
        maxTagCount="responsive"
        onChange={onChange}
      />
    </SectionRow>
  ),
  number: ({ values = [], disabled, onChange }) => (
    <Input
      key="input"
      disabled={disabled}
      style={{ width: 300, height: "37px" }}
      onChange={(e) => onChange([e.target.value])}
      value={values?.[0] || ""}
    />
  )
};

export default function FilterInput({
  member,
  disabled = false,
  updateMethods
}) {
  const Filter = FilterInputs[member.dimension.type] || FilterInputs.string;

  const ref = useRef(
    debounce(500, (member, values) => {
      updateMethods.update(
        member,
        Object.assign(Object.assign({}, member), { values })
      );
    })
  );
  const [values, setValues] = useState(member.values);

  return (
    <Filter
      key="filter"
      disabled={disabled}
      values={values}
      onChange={(values) => {
        setValues(values);
        ref.current(member, values);
      }}
    />
  );
}
