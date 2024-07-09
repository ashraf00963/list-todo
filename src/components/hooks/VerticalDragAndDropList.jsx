import React from "react";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../Dashboard/SortableItem";

const VerticalDragAndDropList = ({ items, lists, setItems, onDragEnd, userId }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Ensure lists is always an array
  lists = Array.isArray(lists) ? lists : [];

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over) {
      console.error('Active or over is undefined');
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        if (oldIndex === -1 || newIndex === -1) {
          console.error('Index not found for active or over item');
          return items;
        }

        const newOrder = arrayMove(items, oldIndex, newIndex);
        onDragEnd(newOrder);
        return newOrder;
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => {
          const list = lists.find(list => list.id === id);
          if (!list) {
            console.error(`List with id ${id} not found in lists`, lists);
            return null;
          }
          return <SortableItem key={id} id={id} list={list} userId={userId} />;
        })}
      </SortableContext>
    </DndContext>
  );
};

export default VerticalDragAndDropList;
