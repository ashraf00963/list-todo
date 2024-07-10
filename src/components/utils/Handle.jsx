import React from "react";
import { FiMove } from "react-icons/fi"; // Using an icon for the handle

export const Handle = ({ ...listeners }) => {
  return (
    <div className="drag-handle" data-cy='drag-handle' {...listeners}>
      <FiMove  />
    </div>
  );
};
