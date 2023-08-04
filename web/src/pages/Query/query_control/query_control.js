/* eslint-disable no-param-reassign */
import { isFunction, map, filter, fromPairs } from "lodash";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Tooltip, Button, Select } from "antd";
import KeyboardShortcuts, {
  humanReadableShortcut
} from "../../../api/keyboard_shortcuts";

import AutocompleteToggle from "./AutocompleteToggle";

const QueryEditorControls = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: stretch;

  .query-editor-controls-button {
    display: flex !important;
    align-items: center;
    justify-content: stretch;
    margin: 10px;
  }

  .ant-btn {
    height: auto;
    padding: 10px 15px !important;
    line-height: unset;

    .fa + span,
    .zmdi + span {
      // if button has icon and label - add some space between them
      margin-left: 5px;
    }
  }
`;

const QueryEditorControlsSpacer = styled.span`
  flex: 1 1 auto;
  height: 35px;
`;

export function ButtonTooltip({ title, shortcut, ...props }) {
  shortcut = humanReadableShortcut(shortcut, 1); // show only primary shortcut
  title =
    title && shortcut ? (
      <>
        {title} (<i>{shortcut}</i>)
      </>
    ) : (
      title || shortcut
    );

  return <Tooltip placement="top" title={title} {...props} />;
}

ButtonTooltip.propTypes = {
  title: PropTypes.node,
  shortcut: PropTypes.string
};

ButtonTooltip.defaultProps = {
  title: null,
  shortcut: null
};

export default function EditorControl({
  addParameterButtonProps,
  formatButtonProps,
  saveButtonProps,
  executeButtonProps,
  autocompleteToggleProps,
  dataSourceSelectorProps
}) {
  useEffect(() => {
    const buttons = filter(
      [
        addParameterButtonProps,
        formatButtonProps,
        saveButtonProps,
        executeButtonProps
      ],
      (b) => b.shortcut && !b.disabled && isFunction(b.onClick)
    );
    if (buttons.length > 0) {
      const shortcuts = fromPairs(map(buttons, (b) => [b.shortcut, b.onClick]));
      KeyboardShortcuts.bind(shortcuts);
      return () => {
        KeyboardShortcuts.unbind(shortcuts);
      };
    }
  }, [
    addParameterButtonProps,
    formatButtonProps,
    saveButtonProps,
    executeButtonProps
  ]);

  return (
    <QueryEditorControls>
      {addParameterButtonProps !== false && (
        <ButtonTooltip
          title={addParameterButtonProps.title}
          shortcut={addParameterButtonProps.shortcut}
        >
          <Button
            className="query-editor-controls-button m-r-5"
            disabled={addParameterButtonProps.disabled}
            onClick={addParameterButtonProps.onClick}
          >
            {"{{"}
            {"}}"}
          </Button>
        </ButtonTooltip>
      )}
      {formatButtonProps !== false && (
        <ButtonTooltip
          title={formatButtonProps.title}
          shortcut={formatButtonProps.shortcut}
        >
          <Button
            className="query-editor-controls-button m-r-5"
            disabled={formatButtonProps.disabled}
            onClick={formatButtonProps.onClick}
          >
            <i className="fa fa-indent" aria-hidden="true"></i>
            {formatButtonProps.text}
          </Button>
        </ButtonTooltip>
      )}
      {autocompleteToggleProps !== false && (
        <AutocompleteToggle
          available={autocompleteToggleProps.available}
          enabled={autocompleteToggleProps.enabled}
          onToggle={autocompleteToggleProps.onToggle}
        />
      )}
      {dataSourceSelectorProps === false && <QueryEditorControlsSpacer />}
      {dataSourceSelectorProps !== false && (
        <Select
          className="w-100 flex-fill datasource-small"
          disabled={dataSourceSelectorProps.disabled}
          value={dataSourceSelectorProps.value}
          onChange={dataSourceSelectorProps.onChange}
        >
          {map(dataSourceSelectorProps.options, (option) => (
            <Select.Option key={`option-${option.value}`} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      )}
      {saveButtonProps !== false && (
        <ButtonTooltip
          title={saveButtonProps.title}
          shortcut={saveButtonProps.shortcut}
        >
          <Button
            className="query-editor-controls-button m-l-5"
            disabled={saveButtonProps.disabled}
            loading={saveButtonProps.loading}
            onClick={saveButtonProps.onClick}
            data-test="SaveButton"
          >
            {!saveButtonProps.loading && <span className="fa fa-floppy-o" />}
            {saveButtonProps.text}
          </Button>
        </ButtonTooltip>
      )}
      {executeButtonProps !== false && (
        <ButtonTooltip
          title={executeButtonProps.title}
          shortcut={executeButtonProps.shortcut}
        >
          <Button
            className="query-editor-controls-button m-l-5"
            type="primary"
            disabled={executeButtonProps.disabled}
            onClick={executeButtonProps.onClick}
            data-test="ExecuteButton"
          >
            <span className="zmdi zmdi-play" />
            {executeButtonProps.text}
          </Button>
        </ButtonTooltip>
      )}
    </QueryEditorControls>
  );
}

const ButtonPropsPropType = PropTypes.oneOfType([
  PropTypes.bool, // `false` to hide button
  PropTypes.shape({
    title: PropTypes.node,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.node,
    shortcut: PropTypes.string
  })
]);

EditorControl.propTypes = {
  addParameterButtonProps: ButtonPropsPropType,
  formatButtonProps: ButtonPropsPropType,
  saveButtonProps: ButtonPropsPropType,
  executeButtonProps: ButtonPropsPropType,
  autocompleteToggleProps: PropTypes.oneOfType([
    PropTypes.bool, // `false` to hide
    PropTypes.shape({
      available: PropTypes.bool,
      enabled: PropTypes.bool,
      onToggle: PropTypes.func
    })
  ]),
  dataSourceSelectorProps: PropTypes.oneOfType([
    PropTypes.bool, // `false` to hide
    PropTypes.shape({
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          label: PropTypes.node
        })
      ),
      onChange: PropTypes.func
    })
  ])
};

EditorControl.defaultProps = {
  addParameterButtonProps: false,
  formatButtonProps: false,
  saveButtonProps: false,
  executeButtonProps: false,
  autocompleteToggleProps: false,
  dataSourceSelectorProps: false
};
