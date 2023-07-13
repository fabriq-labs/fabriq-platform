// DynamicForm
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import cx from "classnames";
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Upload,
  Icon,
  Select
} from "antd";
import {
  includes,
  isFunction,
  filter,
  difference,
  isEmpty,
  some,
  isNumber,
  isBoolean
} from "lodash";
import Collapse from "./Collapse";
import AceEditorInput from "./AceEditorInput";
import notification from "../../api/notification";
import { Field, Action, AntdForm } from "./Proptypes";
import helper from "./DynamicHelper";
const Wrapper = styled.div`
  margin: 25px 0 10px;

  .extra-options-button {
    &,
    &:focus,
    &:hover {
      height: 40px;
      font-weight: 500;
      background-color: @btn-extra-options-bg;
      border-color: @btn-extra-options-border;
      color: @btn-default-color;
    }

    &:focus,
    &:hover {
      background-color: fade(@btn-extra-options-bg, 15%);
    }
  }

  .extra-options-content {
    margin-top: 15px;

    .ant-form-item:last-of-type {
      margin-bottom: 0 !important;
    }
  }

  .m-l-5 {
    margin-left: 5px;
  }
`;

const ButtonRow = styled.div`
  .w-100 {
    width: 100% !important;
  }
`;

const FromWrapper = styled(Form)`
  .m-b-10 {
    &.google-sheet {
      margin-top: 10px;
    }
  }
`;

const ActionBtn = styled.div`
  display: flex;
  justify-content: space-between;

  .m-t-20 {
    margin-top: 20px;
  }

  .m-t-10 {
    margin-top: 10px;
  }

  .pull-right {
    float: right !important;
  }
`;

function toHuman(text) {
  return text.replace(/_/g, " ").replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

const fieldRules = ({ type, required, minLength }) => {
  const requiredRule = required;
  const minLengthRule =
    minLength && includes(["text", "email", "password"], type);
  const emailTypeRule = type === "email";

  return [
    requiredRule && { required, message: "This field is required." },
    minLengthRule && { min: minLength, message: "This field is too short." },
    emailTypeRule && {
      type: "email",
      message: "This field must be a valid email."
    }
  ].filter((rule) => rule);
};

class DynamicForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    fields: PropTypes.arrayOf(Field),
    actions: PropTypes.arrayOf(Action),
    feedbackIcons: PropTypes.bool,
    hideSubmitButton: PropTypes.bool,
    saveText: PropTypes.string,
    onSubmit: PropTypes.func,
    form: AntdForm.isRequired
  };

  static defaultProps = {
    id: null,
    fields: [],
    actions: [],
    feedbackIcons: false,
    hideSubmitButton: false,
    saveText: "Save",
    onSubmit: () => {}
  };

  constructor(props) {
    super(props);

    const hasFilledExtraField = some(props.fields, (field) => {
      const { extra, initialValue, placeholder } = field;
      return (
        extra &&
        (!isEmpty(initialValue) ||
          isNumber(initialValue) ||
          (isBoolean(initialValue) && initialValue.toString() !== placeholder))
      );
    });

    const inProgressActions = {};
    props.actions.forEach((action) => (inProgressActions[action.name] = false));

    this.state = {
      isSubmitting: false,
      showExtraFields: hasFilledExtraField,
      inProgressActions
    };

    this.actionCallbacks = this.props.actions.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.name]: cur.callback
      }),
      null
    );
  }

  setActionInProgress = (actionName, inProgress) => {
    this.setState((prevState) => ({
      inProgressActions: {
        ...prevState.inProgressActions,
        [actionName]: inProgress
      }
    }));
  };

  handleSubmit = (e) => {
    this.setState({ isSubmitting: true });
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      Object.entries(values).forEach(([key, value]) => {
        const { initialValue } = this.props.fields.find((f) => f.name === key);
        if (
          (initialValue === null ||
            initialValue === undefined ||
            initialValue === "") &&
          value === ""
        ) {
          values[key] = null;
        }
      });

      if (!err) {
        this.props.onSubmit(
          values,
          (msg) => {
            const { setFieldsValue, getFieldsValue } = this.props.form;
            this.setState({ isSubmitting: false });
            setFieldsValue(getFieldsValue()); // reset form touched state
            notification.success(msg);
          },
          (msg) => {
            this.setState({ isSubmitting: false });
            notification.error(msg);
          }
        );
      } else this.setState({ isSubmitting: false });
    });
  };

  handleAction = (e) => {
    const actionName = e.target.dataset.action;

    this.setActionInProgress(actionName, true);
    this.actionCallbacks[actionName](() => {
      this.setActionInProgress(actionName, false);
    });
  };

  base64File = (fieldName, e) => {
    if (e && e.fileList[0]) {
      helper.getBase64(e.file).then((value) => {
        this.props.form.setFieldsValue({ [fieldName]: value });
      });
    }
  };

  renderUpload(field, props) {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { name, initialValue } = field;

    const fileOptions = {
      rules: fieldRules(field),
      initialValue,
      getValueFromEvent: this.base64File.bind(this, name)
    };

    const disabled =
      getFieldValue(name) !== undefined && getFieldValue(name) !== initialValue;

    const upload = (
      <Upload {...props} beforeUpload={() => false}>
        <Button disabled={disabled}>
          <Icon type="upload" /> Click to upload
        </Button>
      </Upload>
    );

    return getFieldDecorator(name, fileOptions)(upload);
  }

  renderSelect(field, props) {
    const { getFieldDecorator } = this.props.form;
    const { name, options, mode, initialValue, readOnly, loading } = field;
    const { Option } = Select;

    const decoratorOptions = {
      rules: fieldRules(field),
      initialValue
    };

    return getFieldDecorator(
      name,
      decoratorOptions
    )(
      <Select
        {...props}
        optionFilterProp="children"
        loading={loading || false}
        mode={mode}
        getPopupContainer={(trigger) => trigger.parentNode}
        disabled={readOnly}
      >
        {options &&
          options.map((option) => (
            <Option
              key={`${option.value}`}
              value={option.value}
              disabled={readOnly}
            >
              {option.name || option.value}
            </Option>
          ))}
      </Select>
    );
  }

  renderField(field, props) {
    const { getFieldDecorator } = this.props.form;
    const { name, type, initialValue } = field;
    const fieldLabel = field.title || toHuman(name);

    const options = {
      rules: fieldRules(field),
      valuePropName: type === "checkbox" ? "checked" : "value",
      initialValue
    };

    if (type === "checkbox") {
      return getFieldDecorator(
        name,
        options
      )(<Checkbox {...props}>{fieldLabel}</Checkbox>);
    }
    if (type === "file") {
      return this.renderUpload(field, props);
    }
    if (type === "select") {
      return this.renderSelect(field, props);
    }
    if (type === "content") {
      return field.content;
    }
    if (type === "number") {
      return getFieldDecorator(name, options)(<InputNumber {...props} />);
    }
    if (type === "textarea") {
      return getFieldDecorator(name, options)(<Input.TextArea {...props} />);
    }
    if (type === "ace") {
      return getFieldDecorator(name, options)(<AceEditorInput {...props} />);
    }
    if (name === "googleAccount") {
      return getFieldDecorator(name, options)(<Input disabled {...props} />);
    }
    return getFieldDecorator(name, options)(<Input {...props} />);
  }

  renderFields(fields) {
    return fields.map((field) => {
      if (
        (field.name === "jsonKeyFile" &&
          this.props.type.type === "fabriq_google_spreadsheets") ||
        (this.props.dataSource === undefined &&
          field.name === "googleAccount" &&
          this.props.type.type === "fabriq_google_spreadsheets")
      ) {
        return null;
      }
      const FormItem = Form.Item;
      const { name, title, type, readOnly, autoFocus, contentAfter } = field;
      const fieldLabel = title || toHuman(name);
      const { feedbackIcons, form } = this.props;

      const formItemProps = {
        className:
          field.name === "spreadSheetId" ? "m-b-10 google-sheet" : "m-b-10",
        hasFeedback: type !== "checkbox" && type !== "file" && feedbackIcons,
        label: type === "checkbox" ? "" : fieldLabel
      };

      const fieldProps = {
        ...field.props,
        className: "w-100",
        name,
        type,
        readOnly,
        autoFocus,
        placeholder: field.placeholder,
        "data-test": fieldLabel
      };

      return (
        <React.Fragment key={name}>
          <FormItem {...formItemProps}>
            {this.renderField(field, fieldProps)}
          </FormItem>
          {isFunction(contentAfter)
            ? contentAfter(form.getFieldValue(name))
            : contentAfter}
        </React.Fragment>
      );
    });
  }

  renderActions() {
    return this.props.actions.map((action) => {
      if (
        (action.name === "Test Connection" &&
          this.props.type.type === "fabriq_google_spreadsheets") ||
        (action.name === "Re Authorize" &&
          this.props.type.type !== "fabriq_google_spreadsheets")
      ) {
        return null;
      }
      const inProgress = this.state.inProgressActions[action.name];
      const { isFieldsTouched } = this.props.form;

      const actionProps = {
        key: action.name,
        htmlType: "button",
        className: action.pullRight ? "pull-right m-t-10" : "m-t-10",
        type: action.type,
        disabled: isFieldsTouched() && action.disableWhenDirty,
        loading: inProgress,
        onClick: this.handleAction
      };

      return (
        <Button {...actionProps} data-action={action.name}>
          {action.name}
        </Button>
      );
    });
  }

  render() {
    const submitProps = {
      type: "primary",
      htmlType: "submit",
      className: "w-100 m-t-20",
      disabled: this.state.isSubmitting,
      loading: this.state.isSubmitting
    };
    const { id, hideSubmitButton, saveText, fields } = this.props;
    const { showExtraFields } = this.state;
    const saveButton = !hideSubmitButton;
    const extraFields = filter(fields, { extra: true });
    const regularFields = difference(fields, extraFields);
    return (
      <FromWrapper
        id={id}
        className="dynamic-form"
        layout="vertical"
        onSubmit={this.handleSubmit}
      >
        {this.renderFields(regularFields)}
        {!isEmpty(extraFields) && (
          <Wrapper>
            <Button
              type="dashed"
              block
              className="extra-options-button"
              onClick={() =>
                this.setState({ showExtraFields: !showExtraFields })
              }
            >
              Additional Settings
              <i
                className={cx("fa m-l-5", {
                  "fa-caret-up": showExtraFields,
                  "fa-caret-down": !showExtraFields
                })}
              />
            </Button>
            <Collapse
              collapsed={!showExtraFields}
              className="extra-options-content"
            >
              {this.renderFields(extraFields)}
            </Collapse>
          </Wrapper>
        )}
        {saveButton && (
          <ButtonRow>
            <Button {...submitProps}>{saveText}</Button>
          </ButtonRow>
        )}
        <ActionBtn>{this.renderActions()}</ActionBtn>
      </FromWrapper>
    );
  }
}

export default Form.create()(DynamicForm);
