// AutoCompleteToggle
import React, { useCallback } from "react";
import { Tooltip, Button } from "antd";
import PropTypes from "prop-types";
import { Icon } from "antd";
import recordEvent from "../../../api/record_event";

export default function AutocompleteToggle({ available, enabled, onToggle }) {
  let tooltipMessage = "Live Autocomplete Enabled";
  let icon = "eye";
  if (!enabled) {
    tooltipMessage = "Live Autocomplete Disabled";
    icon = "eye-invisible";
  }

  if (!available) {
    tooltipMessage =
      "Live Autocomplete Not Available (Use Ctrl+Space to Trigger)";
    icon = "eye-invisible";
  }

  const handleClick = useCallback(() => {
    recordEvent("toggle_autocomplete", "screen", "query_editor", {
      state: !enabled
    });
    onToggle(!enabled);
  }, [enabled, onToggle]);

  return (
    <Tooltip placement="top" title={tooltipMessage}>
      <Button
        className="query-editor-controls-button m-r-5"
        disabled={!available}
        onClick={handleClick}
      >
        <Icon type={icon} />
      </Button>
    </Tooltip>
  );
}

AutocompleteToggle.propTypes = {
  available: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};
