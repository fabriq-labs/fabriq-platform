import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Typography } from "antd";

export default function Item({ id, index }) {
  return (
    <Draggable draggableId={id} index={index}>
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          style={{
            ...draggableProps.style,
            border: `1px dashed rgb(201, 201, 217)`,
            borderRadius: 4,
            padding: "5px 12px",
            lineHeight: "22px"
          }}
        >
          <Typography.Text ellipsis style={{ maxWidth: "100%" }}>
            <i
              class="fa fa-arrows"
              aria-hidden="true"
              style={{ marginRight: "6px" }}
            />
            {id}
          </Typography.Text>
        </div>
      )}
    </Draggable>
  );
}
