import React, { Fragment } from "react";
import { Select } from "antd";
import styled from "styled-components";

import MemberDropdown from "./member_dropdown";
import RemoveButtonGroup from "./remove_button";
import FilterInput from "./filter_input";
import MissingMemberTooltip from "./missing_member";

const SectionRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-right: -8px;
  margin-bottom: -8px;

  && > * {
    margin-right: 8px !important;
    margin-bottom: 8px !important;
  }

  .ant-select-selection--single {
    height: 37px !important;
  }

  .anticon-plus {
    svg {
      vertical-align: unset;
    }
  }
`;

const FilterGroup = ({
  disabled = false,
  members,
  availableMembers,
  addMemberName,
  updateMethods,
  missingMembers
}) => (
  <SectionRow>
    {members.map((m) => {
      const isMissing = missingMembers.includes(m.member);

      const buttonGroup = (
        <RemoveButtonGroup
          disabled={disabled}
          className={disabled ? "disabled" : null}
          color={isMissing ? "danger" : "primary"}
          onRemoveClick={() => updateMethods.remove(m)}
        >
          <MemberDropdown
            disabled={disabled}
            availableMembers={availableMembers}
            style={{
              width: 150,
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
            onClick={(updateWith) =>
              updateMethods.update(m, { ...m, dimension: updateWith })
            }
          >
            {m.dimension.title}
          </MemberDropdown>
        </RemoveButtonGroup>
      );

      return (
        <Fragment key={m.index}>
          {isMissing ? (
            <MissingMemberTooltip>{buttonGroup}</MissingMemberTooltip>
          ) : (
            buttonGroup
          )}

          <Select
            disabled={disabled}
            value={m.operator}
            style={{ width: 200 }}
            onChange={(operator) => updateMethods.update(m, { ...m, operator })}
          >
            {m.operators.map((operator) => (
              <Select.Option key={operator.name} value={operator.name}>
                {operator.title}
              </Select.Option>
            ))}
          </Select>
          <FilterInput
            key="filterInput"
            disabled={disabled}
            member={m}
            updateMethods={updateMethods}
          />
        </Fragment>
      );
    })}
    <MemberDropdown
      availableMembers={availableMembers}
      type="dashed"
      disabled={disabled}
      icon="plus"
      onClick={(m) => updateMethods.add({ member: m })}
    >
      {!members.length ? addMemberName : null}
    </MemberDropdown>
  </SectionRow>
);

export default FilterGroup;
