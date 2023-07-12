import React, { useEffect, useRef, useState } from "react";
import { Input, Menu as AntdMenu } from "antd";
import styled from "styled-components";
import FlexSearch from "flexsearch";

import ButtonDropdown from "./button_dropdown";
import useDeepMemo from "../lib/usedeep_memo";

export function getNameMemberPairs(members) {
  const items = [];
  members.forEach((cube) =>
    cube.members.forEach((member) => {
      items.push([member.name, member]);
    })
  );
  return items;
}

const Menu = styled(AntdMenu)`
  max-height: 320px;
  overflow: hidden auto;
  padding-top: 0;

  li.ant-dropdown-menu-item-active {
    background: #f3f3fb;
  }
`;

const SearchMenuItem = styled(Menu.Item)`
  position: sticky;
  top: 0;
  background: white;
  padding-top: 10px;
  padding-bottom: 0;
  margin-bottom: 16px;

  ::after {
    display: block;
    position: absolute;
    content: "";
    width: 100%;
    left: 0;
    bottom: -20px;
    height: 20px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
  }
`;

function filterMembersByKeys(members, keys) {
  const cubeNames = keys.map((key) => key.split(".")[0]);
  return members
    .filter(({ cubeName }) => cubeNames.includes(cubeName))
    .map((cube) => {
      return Object.assign(Object.assign({}, cube), {
        members: cube.members.filter(({ name }) => keys.includes(name))
      });
    });
}

export default function MemberMenu({
  availableMembers,
  showNoMembersPlaceholder = true,
  onClick,
  ...buttonProps
}) {
  const flexSearch = useRef(FlexSearch.create({ encode: "advanced" }));
  const [search, setSearch] = useState("");
  const [filteredKeys, setFilteredKeys] = useState([]);

  const index = flexSearch.current;
  const hasMembers = availableMembers.some((cube) => cube.members.length > 0);

  const indexedMembers = useDeepMemo(() => {
    getNameMemberPairs(availableMembers).forEach(([name, { title }]) =>
      index.add(name, title)
    );
    return Object.fromEntries(getNameMemberPairs(availableMembers));
  }, [availableMembers]);

  useEffect(() => {
    let currentSearch = search;

    (async () => {
      const results = await index.search(search);
      if (currentSearch !== search) {
        return;
      }

      setFilteredKeys(results);
    })();

    return () => {
      currentSearch = "";
    };
  }, [index, search]);

  const memberlist = search
    ? filterMembersByKeys(availableMembers, filteredKeys)
    : availableMembers;

  return (
    <ButtonDropdown
      {...buttonProps}
      overlay={
        <Menu
          onClick={(event) => {
            setSearch("");
            setFilteredKeys([]);
            onClick(indexedMembers[event.key]);
          }}
        >
          {hasMembers && (
            <Menu.Item>
              {" "}
              <SearchMenuItem disabled>
                <Input
                  placeholder="Search"
                  autoFocus
                  value={search}
                  allowClear
                  onKeyDown={(event) => {
                    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
              </SearchMenuItem>
            </Menu.Item>
          )}
          {hasMembers &&
            memberlist.length > 0 &&
            memberlist.map((cube) =>
              cube.members.length > 0 ? (
                <Menu.ItemGroup key={cube.cubeName} title={cube.cubeTitle}>
                  {cube.members.map((m) => (
                    <Menu.Item key={m.name} data-testid={m.name}>
                      {m.shortTitle}
                    </Menu.Item>
                  ))}
                </Menu.ItemGroup>
              ) : null
            )}
          {showNoMembersPlaceholder ? (
            <Menu.Item disabled>No members found</Menu.Item>
          ) : null}
        </Menu>
      }
    />
  );
}
