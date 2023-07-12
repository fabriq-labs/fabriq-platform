import React, { useCallback } from "react";
import styled from "styled-components";

import MemberDropdown from "./member_dropdown";
import RemoveButtonGroup from "./remove_button";
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

export default function MemberGroup({
  disabled = false,
  members,
  availableMembers,
  missingMembers,
  addMemberName,
  updateMethods
}) {
  const handleClick = useCallback((m) => updateMethods.add(m), []);

  return (
    <SectionRow>
      {members.map((m) => {
        const isMissing = missingMembers.includes(m.title);

        const buttonGroup = (
          <RemoveButtonGroup
            key={m.index || m.name}
            disabled={disabled}
            className={disabled ? "disabled" : null}
            color={isMissing ? "danger" : "primary"}
            onRemoveClick={() => updateMethods.remove(m)}
          >
            <MemberDropdown
              disabled={disabled}
              availableMembers={availableMembers}
              onClick={(updateWith) => updateMethods.update(m, updateWith)}
            >
              {m.title}
            </MemberDropdown>
          </RemoveButtonGroup>
        );

        return isMissing ? (
          <MissingMemberTooltip key={m.index || m.name}>
            {buttonGroup}
          </MissingMemberTooltip>
        ) : (
          buttonGroup
        );
      })}

      <MemberDropdown
        data-testid={addMemberName}
        disabled={disabled}
        availableMembers={availableMembers}
        type="dashed"
        icon="plus"
        onClick={handleClick}
      >
        {!members.length ? addMemberName : null}
      </MemberDropdown>
    </SectionRow>
  );
}
