/* eslint-disable react/destructuring-assignment */
import { toString } from "lodash";
import { markdown } from "markdown";
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { Modal, Input, Tooltip, Divider } from "antd";
import HtmlContent from "@redash/viz/lib/components/HtmlContent";
import { wrap as wrapDialog, DialogPropType } from "../../DialogWrapper";
import notification from "../../../../api/notification";
import { useTranslation } from "react-i18next";

function TextboxDialog({ dialog, isNew, ...props }) {
  const [text, setText] = useState(toString(props.text));
  const [preview, setPreview] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    setText(props.text);
    setPreview(markdown.toHTML(props.text));
  }, [props.text]);

  const [updatePreview] = useDebouncedCallback(() => {
    setPreview(markdown.toHTML(text));
  }, 200);

  const handleInputChange = useCallback(
    (event) => {
      setText(event.target.value);
      updatePreview();
    },
    [updatePreview]
  );

  const saveWidget = useCallback(() => {
    dialog.close(text).catch(() => {
      notification.error(
        isNew
          ? t("redash:textboxdialog.widgetAdded_error")
          : t("redash:textboxdialog.widgetSave_error")
      );
    });
  }, [dialog, isNew, text]);

  return (
    <Modal
      {...dialog.props}
      title={isNew ? "Add Textbox" : "Edit Textbox"}
      onOk={saveWidget}
      okText={isNew ? "Add to Dashboard" : "Save"}
      width={500}
      wrapProps={{ "data-test": "TextboxDialog" }}
    >
      <div className="textbox-dialog">
        <Input.TextArea
          className="resize-vertical"
          rows="5"
          value={text}
          onChange={handleInputChange}
          autoFocus
          placeholder="This is where you write some text"
        />
        <small>
          Supports basic{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.markdownguide.org/cheat-sheet/#basic-syntax"
          >
            <Tooltip title="Markdown guide opens in new window">
              Markdown
            </Tooltip>
          </a>
          .
        </small>
        {text && (
          <>
            <Divider dashed />
            <strong className="preview-title">Preview:</strong>
            <HtmlContent className="preview markdown">{preview}</HtmlContent>
          </>
        )}
      </div>
    </Modal>
  );
}

TextboxDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  isNew: PropTypes.bool,
  text: PropTypes.string
};

TextboxDialog.defaultProps = {
  isNew: false,
  text: ""
};

export default wrapDialog(TextboxDialog);
