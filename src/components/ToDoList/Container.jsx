import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortItem from "./SortItem";
import '../../styles/Container&Item.css'

const Container = ({ id, items, onTaskClick }) => {
    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <SortableContext  id={id} items={items} strategy={rectSortingStrategy}>
            <div ref={setNodeRef} className="container-page">
                <h2 className="container-h2">{id}</h2>
                {items.map((item) => (
                    <SortItem key={item.id} id={item} onClick={() => onTaskClick(item)} />
                ))}
            </div>
        </SortableContext>
    );
};

export default Container;
