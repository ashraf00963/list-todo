import React from 'react';
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from './SortItem';
import '../../styles/Container&Item.css';
import idToNameMapping from '../utils/idToNameMapping';

const Container = ({ id, items, onTaskClick }) => {
    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
            <div ref={setNodeRef} className="container-page">
                <h2 className="container-h2">{idToNameMapping[id] || id}</h2>
                {items.map((item) => (
                    <SortableItem key={item.id} id={item} onClick={() => onTaskClick(item)} />
                ))}
            </div>
        </SortableContext>
    );
};

export default Container;
