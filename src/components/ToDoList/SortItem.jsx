import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Item({ id, name, status, onClick }) {
    return (
        <div className='si-item' onClick={onClick}>
            <span className="task-name">{name}</span>
            {status === 'completed' && (
                <div className="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
            )}
            {status === 'inProgress' && (
                <div className="dot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
        </div>
    );
}

const SortableItem = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Item 
                id={props.id.id} 
                name={props.id.name} 
                status={props.id.status} // Pass status prop to Item
                onClick={props.onClick} 
            />
        </div>
    );
};

export default SortableItem;
