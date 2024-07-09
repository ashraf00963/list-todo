import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListItem from "./ListItem";
import { Handle } from "../utils/Handle";

const SortableItem = ({ id, list, userId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ListItem list={list} userId={userId} handle={<Handle {...listeners} />} />
    </div>
  );
};

export default SortableItem;
