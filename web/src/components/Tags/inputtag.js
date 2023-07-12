// Input Tag Compoennt
import React, { Component } from "react";
import { Tag, Input, Tooltip, Icon } from "antd";
import isEqual from "react-fast-compare";

class InputTagComponent extends Component {
  state = {
    inputVisible: false
  };

  showInput = () => {
    this.setState(
      { inputVisible: true },
      () => this.input && this.input.focus()
    );
  };

  saveInputRef = (input) => (this.input = input);

  handleInputConfirm = () => {
    const { handleConfirm } = this.props;
    if (handleConfirm) {
      handleConfirm();
      this.setState({ inputVisible: false });
    }
  };

  render() {
    const {
      tags,
      inputValue,
      title,
      handleInputChange,
      handleClose,
      isEntities
    } = this.props;
    const { inputVisible } = this.state;

    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={`${tag}-${index}`}
              closable={true}
              onClose={() => handleClose(tag)}
            >
              {isEntities
                ? isLongTag
                  ? `${tag.title.slice(0, 20)}...`
                  : tag.title
                : isLongTag
                ? `${tag.slice(0, 20)}...`
                : tag}
            </Tag>
          );
          return isLongTag ? (
            isEntities ? (
              <Tooltip title={tag.title} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            )
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{
              background: "#fff",
              borderStyle: "dashed",
              cursor: "pointer"
            }}
          >
            <Icon type="plus" /> {title}
          </Tag>
        )}
      </div>
    );
  }
}

export default React.memo(InputTagComponent, isEqual);
