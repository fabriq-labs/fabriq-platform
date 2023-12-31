import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableItem from "./draggable_item";

export default function OrderGroup({ orderMembers, onOrderChange, onReorder }) {
  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        onReorder(source && source.index, destination && destination.index);
      }}
    >
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            data-testid="order-popover"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {orderMembers.map(({ id, title, order }, index) => (
              <DraggableItem
                key={id}
                id={id}
                index={index}
                order={order}
                onOrderChange={onOrderChange}
              >
                {title}
              </DraggableItem>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
