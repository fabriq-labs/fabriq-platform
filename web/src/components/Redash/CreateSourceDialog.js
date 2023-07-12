// Create Source Dialog Component
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isEmpty, toUpper, includes } from "lodash";
import { Button, List, Modal, Input, Steps, Icon } from "antd";

import DynamicForm from "./DynamicForm";
import helper from "./DynamicHelper";
import { getErrorMessage } from "./ErrorMessage";
import { PreviewCard } from "./PreviewCard";
import { wrap as wrapDialog, DialogPropType } from "./DialogWrapper";
import EmptyState from "./EmptyState";
import HelpTrigger, { TYPES as HELP_TRIGGER_TYPES } from "./HelpTrigger";
const ScrollBox = styled.div`
  overflow: auto;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapperTop = styled.div`
  margin-top: 10px;

  .clickable {
    padding: 14px 10px !important;
  }
`;

const { Step } = Steps;
const { Search } = Input;

const StepEnum = {
  SELECT_TYPE: 0,
  CONFIGURE_IT: 1,
  DONE: 2
};

class CreateSourceDialog extends React.Component {
  static propTypes = {
    dialog: DialogPropType.isRequired,
    types: PropTypes.arrayOf(PropTypes.object),
    sourceType: PropTypes.string.isRequired,
    imageFolder: PropTypes.string.isRequired,
    helpTriggerPrefix: PropTypes.string,
    onCreate: PropTypes.func.isRequired
  };

  static defaultProps = {
    types: [],
    helpTriggerPrefix: null
  };

  state = {
    searchText: "",
    selectedType: null,
    savingSource: false,
    currentStep: StepEnum.SELECT_TYPE
  };

  selectType = (selectedType) => {
    this.setState({ selectedType, currentStep: StepEnum.CONFIGURE_IT });
  };

  resetType = () => {
    if (this.state.currentStep === StepEnum.CONFIGURE_IT) {
      this.setState({
        searchText: "",
        selectedType: null,
        currentStep: StepEnum.SELECT_TYPE
      });
    }
  };

  createSource = (values, successCallback, errorCallback) => {
    const { selectedType, savingSource } = this.state;
    if (!savingSource) {
      this.setState({ savingSource: true, currentStep: StepEnum.DONE });
      this.props
        .onCreate(selectedType, values)
        .then((data) => {
          successCallback("Saved.");
          this.props.dialog.close({ success: true, data });
        })
        .catch((error) => {
          this.setState({
            savingSource: false,
            currentStep: StepEnum.CONFIGURE_IT
          });
          errorCallback(getErrorMessage(error, "Failed saving."));
        });
    }
  };

  renderTypeSelector() {
    const { types } = this.props;
    const { searchText } = this.state;

    const filteredTypes = types.filter(
      (type) =>
        isEmpty(searchText) ||
        includes(type.name.toLowerCase(), searchText.toLowerCase())
    );

    return (
      <WrapperTop>
        <Search
          placeholder="Search..."
          onChange={(e) => this.setState({ searchText: e.target.value })}
          autoFocus
          data-test="SearchSource"
        />
        <ScrollBox
          className="scrollbox p-5 m-t-10"
          style={{ minHeight: "30vh", maxHeight: "40vh" }}
        >
          {isEmpty(filteredTypes) ? (
            <EmptyState className="" />
          ) : (
            <List
              size="small"
              dataSource={filteredTypes}
              renderItem={(item) => this.renderItem(item)}
            />
          )}
        </ScrollBox>
      </WrapperTop>
    );
  }

  renderForm() {
    const { imageFolder, helpTriggerPrefix } = this.props;
    const { selectedType } = this.state;

    const fields = helper.getFields(selectedType);
    const helpTriggerType = `${helpTriggerPrefix}${toUpper(selectedType.type)}`;
    return (
      <div>
        <Content>
          <img
            className="p-5"
            src={`${imageFolder}/${selectedType.type}.png`}
            alt={selectedType.name}
            width="48"
          />
          <h4 className="m-0">{selectedType.name}</h4>
        </Content>
        <div className="text-right">
          {HELP_TRIGGER_TYPES[helpTriggerType] && (
            <HelpTrigger className="f-13" type={helpTriggerType}>
              Setup Instructions <i className="fa fa-question-circle" />
            </HelpTrigger>
          )}
        </div>
        <DynamicForm
          id="sourceForm"
          fields={fields}
          type={selectedType}
          onSubmit={this.createSource}
          feedbackIcons
          hideSubmitButton
        />
        {selectedType.type === "databricks" && (
          <small>
            By using the Databricks Data Source you agree to the Databricks
            JDBC/ODBC{" "}
            <a
              href="https://databricks.com/spark/odbc-driver-download"
              target="_blank"
              rel="noopener noreferrer"
            >
              Driver Download Terms and Conditions
            </a>
            .
          </small>
        )}
      </div>
    );
  }

  renderItem(item) {
    const { imageFolder } = this.props;

    return (
      <List.Item
        className="p-l-10 p-r-10 clickable"
        onClick={() => this.selectType(item)}
      >
        <PreviewCard
          title={item.name}
          imageUrl={`${imageFolder}/${item.type}.png`}
          roundedImage={false}
          data-test="PreviewItem"
          data-test-type={item.type}
        >
          <Icon type="double-right" />
        </PreviewCard>
      </List.Item>
    );
  }

  render() {
    const { currentStep, savingSource, selectedType } = this.state;
    const { dialog, sourceType } = this.props;
    return (
      <Modal
        {...dialog.props}
        title={`Create a New ${
          sourceType === "Data Source" ? "Destination" : sourceType
        }`}
        footer={
          currentStep === StepEnum.SELECT_TYPE
            ? [
                <Button key="cancel" onClick={() => dialog.dismiss()}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" disabled>
                  Create
                </Button>
              ]
            : [
                <Button key="previous" onClick={this.resetType}>
                  Previous
                </Button>,

                <Button
                  key="submit"
                  htmlType="submit"
                  form="sourceForm"
                  type="primary"
                  loading={savingSource}
                  data-test="CreateSourceButton"
                >
                  {selectedType &&
                  selectedType.type === "fabriq_google_spreadsheets"
                    ? "Authorize"
                    : "Create"}
                </Button>
              ]
        }
      >
        <div data-test="CreateSourceDialog">
          <Steps
            className="hidden-xs m-b-10"
            size="small"
            current={currentStep}
            progressDot
          >
            {currentStep === StepEnum.CONFIGURE_IT ? (
              <Step
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                title={<a>Type Selection</a>}
                className="clickable"
                onClick={this.resetType}
              />
            ) : (
              <Step title="Type Selection" />
            )}
            <Step title="Configuration" />
            <Step title="Done" />
          </Steps>
          {currentStep === StepEnum.SELECT_TYPE && this.renderTypeSelector()}
          {currentStep !== StepEnum.SELECT_TYPE && this.renderForm()}
        </div>
      </Modal>
    );
  }
}

export default wrapDialog(CreateSourceDialog);
