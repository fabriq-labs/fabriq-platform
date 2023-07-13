/* eslint-disable react/jsx-props-no-spreading */
import { trim } from "lodash";
import React, { useState } from "react";
import { Modal, Input, Button, Collapse } from "antd";
import cx from "classnames";
import { navigate } from "@reach/router";

import recordEvent from "../../api/record_event";
import { Dashboard } from "../../api/dashboard";
import notification from "../../api/notification";
import { wrap as wrapDialog, DialogPropType } from "./DialogWrapper";
import DynamicComponent from "./Dynamic_Component";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

function CreateDashboardDialog({ dialog }) {
  const [name, setName] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const isCreateDashboardEnabled = true;

  const { t } = useTranslation();

  function handleNameChange(event) {
    const value = trim(event.target.value);
    setName(value);
    setIsValid(value !== "");
  }

  function handleCustomUrlChange(event) {
    const value = trim(event.target.value);
    setCustomUrl(value);
    setIsValid(value !== "");
  }

  function save() {
    if (name !== "") {
      setSaveInProgress(true);

      let obj = { name, options: null };
      if (customUrl) {
        obj.options = {
          url: customUrl,
          type: "custom"
        };
      }

      Dashboard.save(obj)
        .then((dat) => {
          dialog.close();
          navigate(`/dashboards/${dat.slug}/edit`, { state: { isEdit: true } });
        })
        .catch((err) => {
          notification.error(
            t("redash:createdashboarddialog.dashboardCreate_error"),
            err.message
          );
        });
      recordEvent("create", "dashboard");
    }
  }

  return (
    <Modal
      {...dialog.props}
      {...(isCreateDashboardEnabled ? {} : { footer: null })}
      title="New Dashboard"
      okText="Save"
      cancelText="Close"
      okButtonProps={{
        disabled: !isValid || saveInProgress,
        loading: saveInProgress,
        "data-test": "DashboardSaveButton"
      }}
      cancelButtonProps={{
        disabled: saveInProgress
      }}
      onOk={save}
      closable={!saveInProgress}
      maskClosable={!saveInProgress}
      wrapProps={{
        "data-test": "CreateDashboardDialog"
      }}
    >
      <DynamicComponent
        name="CreateDashboardDialogExtra"
        disabled={!isCreateDashboardEnabled}
      >
        <Input
          defaultValue={name}
          onChange={handleNameChange}
          onPressEnter={save}
          placeholder="Dashboard Name"
          disabled={saveInProgress}
          autoFocus
        />
        <Button
          type="dashed"
          block
          className="extra-options-button"
          onClick={() => setIsCollapse(!isCollapse)}
          style={{ marginTop: 15, marginBottom: 15 }}
        >
          Additional Settings
          <i
            className={cx("fa m-l-5", {
              "fa-caret-up": isCollapse,
              "fa-caret-down": !isCollapse
            })}
          />
        </Button>
        {isCollapse && (
          <Collapse defaultActiveKey={["1"]} className="extra-options-content">
            <Panel header="Custom URL" key="1">
              <Input
                onChange={handleCustomUrlChange}
                value={customUrl}
                placeholder="Enter your custom url..."
              />
            </Panel>
          </Collapse>
        )}
      </DynamicComponent>
    </Modal>
  );
}

CreateDashboardDialog.propTypes = {
  dialog: DialogPropType.isRequired
};

export default wrapDialog(CreateDashboardDialog);
