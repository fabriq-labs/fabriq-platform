import React from "react";
import { Typography, Radio, Icon } from "antd";
import { Draggable } from "react-beautiful-dnd";

export default function DraggableItem({
  id,
  index,
  order = "none",
  children,
  onOrderChange
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <div
          data-testid="order-item"
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            ...draggableProps.style
          }}
        >
          <Icon type="drag" />

          <Typography.Text
            ellipsis
            style={{
              margin: "0 auto 0 8px",
              padding: "5px 0"
            }}
          >
            {children}
          </Typography.Text>

          <Radio.Group
            onChange={(e) => onOrderChange(id, e.target.value)}
            defaultValue={order}
            size="small"
            style={{ marginLeft: "8px" }}
          >
            <Radio.Button value="asc">ASC</Radio.Button>
            <Radio.Button value="desc">DESC</Radio.Button>
            <Radio.Button value="none">NONE</Radio.Button>
          </Radio.Group>
        </div>
      )}
    </Draggable>
  );
}
