import React from "react";
import PropTypes from "prop-types";
import { Button, Badge, Tooltip } from "antd";
import KeyboardShortcuts from "../../../api/keyboard_shortcuts";

function ParameterApplyButton({ paramCount, onClick }) {
  // show spinner when count is empty so the fade out is consistent
  const icon = !paramCount ? "spinner fa-pulse" : "check";

  return (
    <div
      className="parameter-apply-button"
      data-show={!!paramCount}
      data-test="ParameterApplyButton"
    >
      <Badge count={paramCount}>
        <Tooltip
          title={paramCount ? `${KeyboardShortcuts.modKey} + Enter` : null}
        >
          {paramCount !== 0 && (
            <span>
              <Button onClick={onClick}>
                <i className={`fa fa-${icon}`} /> Apply Changes
              </Button>
            </span>
          )}
        </Tooltip>
      </Badge>
    </div>
  );
}

ParameterApplyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  paramCount: PropTypes.number.isRequired
};

export default ParameterApplyButton;
