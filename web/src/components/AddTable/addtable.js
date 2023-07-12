// Add table Component
import React from "react";
import { Form, AutoComplete, Icon, Button, Input } from "antd";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const Wrapper = styled(Form)`
  .anticon {
    vertical-align: unset !important;
  }

  .icn-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icn-add {
    padding: 5px 6px 0 0;
  }

  .refresh-button {
    margin-left: 10px;
  }
`;

class AddTable extends React.Component {
  handleInputConfirm = (value, idx) => {
    const { handleConfirm } = this.props;
    if (handleConfirm) {
      handleConfirm(value, idx);
    }
  };

  render() {
    const {
      tags,
      remove,
      onAdd,
      columns,
      handleChange,
      placeholder,
      isDisabled,
      handlerefresh,
      isRefresh
    } = this.props;

    const formItems = tags?.map((tag, index) => (
      <Form.Item required={false} key={`${tag}-${index}`}>
        {tags.length !== 0 &&
          (tag?.config?.selected === true ? (
            <Input
              value={tag?.config?.aliasName || tag?.title}
              disabled={tag?.config?.selected || tag?.isChecked}
              style={{ width: "60%", marginRight: 8 }}
            />
          ) : (
            <AutoComplete
              style={{ width: "60%", marginRight: 8 }}
              dataSource={columns}
              value={tag.config?.aliasName || tag?.title}
              filterOption={(inputValue, option) =>
                option.props.children
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={(value) => this.handleInputConfirm(value, index)}
              onChange={(value) => handleChange(value, index)}
            />
          ))}
        {tags.length > 0 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(tag?.config?.aliasName || tag?.title, index)}
          />
        ) : null}
        {tags.length - 1 === index &&
          !(tag?.config?.selected || tag?.isChecked) && (
            <Icon
              className="refresh-button"
              type="sync"
              spin={isRefresh}
              onClick={() => handlerefresh()}
              disabled={isRefresh}
            />
          )}
      </Form.Item>
    ));
    return (
      <Wrapper>
        {formItems}
        <Form.Item>
          <Button
            type="dashed"
            onClick={onAdd}
            style={{ width: "60%" }}
            disabled={isDisabled}
          >
            <div className="icn-btn">
              <span className="icn-add">
                <Icon type={isDisabled ? "loading" : "plus"} />
              </span>
              <span>{placeholder}</span>
            </div>
          </Button>
        </Form.Item>
      </Wrapper>
    );
  }
}

const WrappedAddTable = Wrapper.create({ name: "dynamic_form_item" })(AddTable);

export default React.memo(WrappedAddTable, isEqual);
