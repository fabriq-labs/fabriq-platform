// Create Pipeline
import React, { useState } from "react";
import { Modal, Input } from "antd";
import Helmet from "react-helmet";
import DynamicComponent from "../../../components/Redash/Dynamic_Component";

function CreatePipeline({
  visible,
  savePipeline,
  name,
  isValid,
  handleNameChange,
  close
}) {
  const [saveInProgress, setSaveInProgress] = useState(false);
  const isCreatePipelineEnabled = true;

  async function save() {
    if (name !== "") {
      setSaveInProgress(true);
      if (savePipeline) {
        savePipeline();
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Pipeline</title>
      </Helmet>
      <Modal
        {...(isCreatePipelineEnabled ? {} : { footer: null })}
        title="New Pipeline"
        okText="Save"
        visible={visible}
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
        onCancel={close}
        closable={!saveInProgress}
        maskClosable={!saveInProgress}
        wrapProps={{
          "data-test": "CreatePipeline"
        }}
      >
        <DynamicComponent
          name="CreatePipelineExtra"
          disabled={!isCreatePipelineEnabled}
        >
          <Input
            defaultValue={name}
            onChange={handleNameChange}
            onPressEnter={save}
            placeholder="Pipeline Name"
            disabled={saveInProgress}
            autoFocus
          />
        </DynamicComponent>
      </Modal>
    </>
  );
}

export default CreatePipeline;
